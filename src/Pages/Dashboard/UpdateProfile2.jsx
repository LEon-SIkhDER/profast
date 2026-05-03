import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { CalendarDays, Camera, Clock3, KeyRound, Mail, Save, ShieldCheck, UserRound } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { AuthContext } from '../../Context/AuthContext';
import { auth } from '../../../firebase.init';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const UpdateProfile2 = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()
    const fileInputRef = useRef(null)
    const [name, setName] = useState(user?.displayName || '')
    const [photoUrl, setPhotoUrl] = useState(user?.photoURL || '')
    const [photoPreview, setPhotoPreview] = useState(user?.photoURL || '')
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [databaseUser, setDatabaseUser] = useState(null)
    const [databaseUserLoading, setDatabaseUserLoading] = useState(true)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const canUpdatePassword = useMemo(() => {
        return user?.providerData?.some(provider => provider.providerId === 'password')
    }, [user])

    useEffect(() => {
        if (!user?.email) {
            return
        }

        setDatabaseUserLoading(true)

        axiosSecure.get(`/user?email=${user.email}`)
            .then(res => {
                const userData = Array.isArray(res.data) ? res.data[0] : res.data
                setDatabaseUser(userData || null)

                const nextName = userData?.name || user.displayName || ''
                const nextPhoto = userData?.thumbnailPhotoUrl || userData?.photoUrl || user.photoURL || ''

                setName(nextName)
                setPhotoUrl(nextPhoto)
                setPhotoPreview(nextPhoto)
            })
            .catch(error => {
                console.log(error)
                setName(user.displayName || '')
                setPhotoUrl(user.photoURL || '')
                setPhotoPreview(user.photoURL || '')
            })
            .finally(() => {
                setDatabaseUserLoading(false)
            })
    }, [user?.email, user?.displayName, user?.photoURL, axiosSecure])

    const profilePreview = photoPreview || photoUrl || databaseUser?.thumbnailPhotoUrl || databaseUser?.photoUrl || user?.photoURL || 'https://i.ibb.co/s9Qys2j/user.png'
    // console.log(databaseUser)
    const memberSince = databaseUser?.created_At ? format(new Date(databaseUser.created_At), 'dd MMM yyyy') : 'Not available'
    const profileUpdatedAt = databaseUser?.updatedAt || databaseUser?.updated_at || databaseUser?.updated_At
    const lastUpdated = profileUpdatedAt ? format(new Date(profileUpdatedAt), 'dd MMM yyyy, p') : 'Not available'
    const accountRole = databaseUser?.role || 'user'

    const getFirebaseErrorMessage = (code) => {
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
            return 'Your current password is incorrect.'
        }
        if (code === 'auth/weak-password') {
            return 'Password should be at least 6 characters.'
        }
        if (code === 'auth/requires-recent-login') {
            return 'Please log in again before changing your password.'
        }
        if (code === 'auth/network-request-failed') {
            return 'Network error. Please check your connection.'
        }
        return 'Something went wrong. Please try again.'
    }

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file.')
            return
        }

        setSelectedPhoto(file)
        setPhotoPreview(URL.createObjectURL(file))
    }

    const uploadProfilePhoto = async () => {
        if (!selectedPhoto || !auth.currentUser) {
            return photoUrl.trim()
        }

        const storage = getStorage()
        const cleanFileName = selectedPhoto.name.replace(/[^a-zA-Z0-9.-]/g, '-')
        const photoRef = ref(storage, `profile-pictures/${auth.currentUser.uid}/${Date.now()}-${cleanFileName}`)

        await uploadBytes(photoRef, selectedPhoto)
        return getDownloadURL(photoRef)
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault()

        if (!auth.currentUser) {
            toast.error('Please log in again to update your profile.')
            return
        }

        const trimmedName = name.trim()

        if (!trimmedName) {
            toast.error('Name is required.')
            return
        }

        setProfileLoading(true)

        try {
            const updatedPhotoUrl = await uploadProfilePhoto()

            await updateProfile(auth.currentUser, {
                displayName: trimmedName,
                photoURL: updatedPhotoUrl
            })
            setPhotoUrl(updatedPhotoUrl)
            setPhotoPreview(updatedPhotoUrl)
            setSelectedPhoto(null)
            toast.success('Profile updated successfully.')
        } catch (error) {
            toast.error(getFirebaseErrorMessage(error.code))
        } finally {
            setProfileLoading(false)
        }
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()

        if (!auth.currentUser || !user?.email) {
            toast.error('Please log in again to update your password.')
            return
        }

        if (!canUpdatePassword) {
            toast.error('Password update is only available for email/password accounts.')
            return
        }

        if (newPassword.length < 6) {
            toast.error('Password should be at least 6 characters.')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match.')
            return
        }

        if (currentPassword === newPassword) {
            toast.error('New password must be different from your current password.')
            return
        }

        setPasswordLoading(true)

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(auth.currentUser, credential)
            await updatePassword(auth.currentUser, newPassword)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            toast.success('Password updated successfully.')
        } catch (error) {
            toast.error(getFirebaseErrorMessage(error.code))
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className='max-w-5xl mx-auto'>
            <Toaster />

            <div className='mb-6 rounded-lg overflow-hidden bg-gradient-to-r from-[#03373D] via-[#0F766E] to-[#CAEB66] p-6 text-white shadow-md'>
                <p className='text-sm font-bold uppercase tracking-wider text-[#D9F99D]'>Account Settings</p>
                <h1 className='text-3xl sm:text-4xl font-extrabold mt-1'>Update Profile</h1>
                <p className='text-white/80 mt-1'>Manage your account name, photo, role details, and password.</p>
            </div>

            <div className='grid lg:grid-cols-[320px_1fr] gap-5'>
                <div className='bg-[#03373D] border border-[#0F766E] rounded-lg p-5 h-fit text-white shadow-md'>
                    <div className='flex flex-col items-center text-center'>
                        <div className='relative rounded-full bg-gradient-to-br from-[#CAEB66] via-[#38BDF8] to-[#F97316] p-1'>
                            <img
                                className='h-32 w-32 rounded-full object-cover border-4 border-white'
                                src={profilePreview}
                                alt={user?.displayName || 'User profile'}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://i.ibb.co/s9Qys2j/user.png'
                                }}
                            />
                            <button
                                type='button'
                                onClick={() => fileInputRef.current.click()}
                                className='absolute bottom-1 right-1 h-10 w-10 rounded-full bg-[#CAEB66] text-[#03373D] flex items-center justify-center border-2 border-white cursor-pointer shadow'
                                aria-label='Choose profile picture'
                            >
                                <Camera size={20} />
                            </button>
                        </div>
                        <h2 className='text-2xl font-bold mt-4'>{name || 'No name added'}</h2>
                        <p className='text-[#BEE7E8] text-sm break-all'>{user?.email}</p>
                        <div className='mt-5 grid grid-cols-2 gap-3 w-full'>
                            <div className='rounded-lg bg-white/10 p-3 border border-white/10'>
                                <p className='text-xs text-[#D9F99D] font-bold'>Role</p>
                                <p className='text-sm font-semibold mt-1 capitalize'>{databaseUserLoading ? 'Loading' : accountRole}</p>
                            </div>
                            <div className='rounded-lg bg-white/10 p-3 border border-white/10'>
                                <p className='text-xs text-[#D9F99D] font-bold'>Joined</p>
                                <p className='text-sm font-semibold mt-1'>{databaseUserLoading ? 'Loading' : memberSince}</p>
                            </div>
                        </div>
                        <div className='mt-3 w-full rounded-lg bg-white/10 p-3 border border-white/10 text-left'>
                            <p className='text-xs text-[#D9F99D] font-bold'>User ID</p>
                            <p className='text-sm font-semibold mt-1 break-all'>{databaseUser?.uid || user?.uid || 'Not available'}</p>
                        </div>
                    </div>
                </div>

                <div className='space-y-5'>
                    <div className='grid sm:grid-cols-3 gap-4'>
                        <div className='bg-white rounded-lg p-4 border border-emerald-100 shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <span className='h-11 w-11 rounded-lg bg-emerald-100 text-[#0F766E] flex items-center justify-center'>
                                    <ShieldCheck size={21} />
                                </span>
                                <div>
                                    <p className='text-xs font-bold text-gray-500'>Role</p>
                                    <p className='text-lg font-extrabold text-[#03373D] capitalize'>{databaseUserLoading ? 'Loading' : accountRole}</p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-lg p-4 border border-sky-100 shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <span className='h-11 w-11 rounded-lg bg-sky-100 text-[#2563EB] flex items-center justify-center'>
                                    <CalendarDays size={21} />
                                </span>
                                <div>
                                    <p className='text-xs font-bold text-gray-500'>Member Since</p>
                                    <p className='text-lg font-extrabold text-[#03373D]'>{databaseUserLoading ? 'Loading' : memberSince}</p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-lg p-4 border border-orange-100 shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <span className='h-11 w-11 rounded-lg bg-orange-100 text-[#F97316] flex items-center justify-center'>
                                    <Clock3 size={21} />
                                </span>
                                <div>
                                    <p className='text-xs font-bold text-gray-500'>Last Updated</p>
                                    <p className='text-lg font-extrabold text-[#03373D]'>{databaseUserLoading ? 'Loading' : lastUpdated}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className='bg-white border border-emerald-100 rounded-lg p-5 space-y-4 shadow-sm border-l-4 border-l-[#0F766E]'>
                        <div className='flex items-center gap-2'>
                            <span className='h-11 w-11 rounded-lg bg-emerald-100 text-[#0F766E] flex items-center justify-center'>
                                <UserRound size={22} />
                            </span>
                            <div>
                                <p className='text-sm font-bold text-[#0F766E]'>Personal</p>
                                <h2 className='text-2xl font-bold text-[#03373D]'>Profile Information</h2>
                            </div>
                        </div>

                        <fieldset>
                            <label className='label text-[#03373D] text-sm font-semibold'>Username</label>
                            <div className='rounded-lg bg-emerald-50/60 p-1'>
                                <input
                                    required
                                    className='input w-full input-focus bg-white border-emerald-100'
                                    type='text'
                                    placeholder='Your name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </fieldset>

                        <fieldset>
                            <label className='label text-[#03373D] text-sm font-semibold'>Profile Picture</label>
                            <div className='rounded-lg bg-sky-50/70 p-1'>
                                <input
                                    ref={fileInputRef}
                                    className='file-input w-full input-focus bg-white border-sky-100'
                                    type='file'
                                    accept='image/*'
                                    onChange={handlePhotoSelect}
                                />
                            </div>
                        </fieldset>

                        <fieldset>
                            <label className='label text-[#03373D] text-sm font-semibold'>Profile Picture URL</label>
                            <div className='rounded-lg bg-orange-50/70 p-1'>
                                <input
                                    className='input w-full input-focus bg-white border-orange-100'
                                    type='url'
                                    placeholder='https://example.com/profile.jpg'
                                    value={photoUrl}
                                    onChange={(e) => {
                                        setPhotoUrl(e.target.value)
                                        setPhotoPreview(e.target.value)
                                        setSelectedPhoto(null)
                                    }}
                                />
                            </div>
                        </fieldset>

                        <fieldset>
                            <label className='label text-[#03373D] text-sm font-semibold'>Email</label>
                            <div className='rounded-lg bg-slate-50 p-1 relative'>
                                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                                <input
                                    readOnly
                                    className='input w-full bg-white border-slate-100 pl-10'
                                    type='email'
                                    value={databaseUser?.email || user?.email || ''}
                                />
                            </div>
                        </fieldset>

                        <button disabled={profileLoading} className='btn border-none bg-gradient-to-r from-[#CAEB66] to-[#22C55E] text-[#03373D] hover:from-[#BFE85A] hover:to-[#16A34A] shadow-md w-full sm:w-auto'>
                            {profileLoading ? <span className='loading loading-spinner loading-sm'></span> : <Save size={18} />}
                            Save Profile
                        </button>
                    </form>

                    <form onSubmit={handlePasswordUpdate} className='bg-white border border-sky-100 rounded-lg p-5 space-y-4 shadow-sm border-l-4 border-l-[#2563EB]'>
                        <div className='flex items-center gap-2'>
                            <span className='h-11 w-11 rounded-lg bg-sky-100 text-[#2563EB] flex items-center justify-center'>
                                <KeyRound size={22} />
                            </span>
                            <div>
                                <p className='text-sm font-bold text-[#2563EB]'>Security</p>
                                <h2 className='text-2xl font-bold text-[#03373D]'>Update Password</h2>
                            </div>
                        </div>

                        {!canUpdatePassword && (
                            <div className='alert bg-yellow-50 border border-yellow-200 text-yellow-800'>
                                <span>This account uses Google sign-in, so password changes are managed by Google.</span>
                            </div>
                        )}

                        <fieldset>
                            <label className='label text-[#03373D] text-sm font-semibold'>Current Password</label>
                            <div className='rounded-lg bg-sky-50/70 p-1'>
                                <input
                                    required
                                    disabled={!canUpdatePassword}
                                    className='input w-full input-focus bg-white border-sky-100'
                                    type='password'
                                    placeholder='Current password'
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        </fieldset>

                        <div className='grid sm:grid-cols-2 gap-4'>
                            <fieldset>
                                <label className='label text-[#03373D] text-sm font-semibold'>New Password</label>
                                <div className='rounded-lg bg-indigo-50/70 p-1'>
                                    <input
                                        required
                                        disabled={!canUpdatePassword}
                                        className='input w-full input-focus bg-white border-indigo-100'
                                        type='password'
                                        placeholder='New password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </fieldset>

                            <fieldset>
                                <label className='label text-[#03373D] text-sm font-semibold'>Confirm Password</label>
                                <div className='rounded-lg bg-violet-50/70 p-1'>
                                    <input
                                        required
                                        disabled={!canUpdatePassword}
                                        className='input w-full input-focus bg-white border-violet-100'
                                        type='password'
                                        placeholder='Confirm password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </fieldset>
                        </div>

                        <button disabled={!canUpdatePassword || passwordLoading} className='btn border-none bg-linear-to-r from-[#38BDF8] to-[#2563EB] text-white hover:from-[#0EA5E9] hover:to-[#1D4ED8] shadow-md w-full sm:w-auto'>
                            {passwordLoading ? <span className='loading loading-spinner loading-sm'></span> : <KeyRound size={18} />}
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile2;
