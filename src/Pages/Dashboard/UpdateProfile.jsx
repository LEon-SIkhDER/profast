import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { CalendarDays, Camera, CircleAlert, CreditCard, KeyRound, Save, ShieldCheck, User, UserCircle2Icon, UserCog, UserRound } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ToastContainer, toast as toastify } from "react-toastify";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../../../firebase.init';
import { useLocation } from 'react-router';

const providerMap = {
    'google.com': 'Google',
    'password': 'Email',
    'github.com': 'GitHub'
}

const UpdateProfile = () => {
    const axiosSecure = useAxiosSecure()
    const { user, updateUser } = useContext(AuthContext)
    const defaultUserImage = "/dpp.png"

    const securityElement = useRef()
    const location = useLocation()
    const scroll = location.state ? true : false
    useEffect(() => {

        if (scroll) {
            securityElement?.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [])

    const { data: userData } = useQuery({
        queryKey: ["user", user.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/user?email=${user.email}`)
            return data
        },
        enabled: !!user
    })

    // const userImagePreview = user?.photoURL || userData?.photoUrl || userData?.thumbnailPhotoUrl || defaultUserImage

    const [userImagePreview, setUserImagePreview] = useState(defaultUserImage)

    useEffect(() => {
        setUserImagePreview(user?.photoURL || userData?.photoUrl || userData?.thumbnailPhotoUrl || defaultUserImage)
    }, [user, userData])

    const accountType = providerMap[user.providerData[0].providerId]
    const canUpdatePassword = accountType === "Email" ? true : false

    // update profile
    const fileInput = useRef()

    const [profileUploading, setProfileUploading] = useState(false)

    const [imgSource, setImgSource] = useState(null)
    console.log(imgSource)
    const [profileChangeability, setProfileChangeAbility] = useState(false)
    // const [profileLoadingState, setProfileLoadingState] = useState("")
    // const [photoUrl, setPhotoUrl] = useState()
    // const [thumbnailPhotoUrl, setThumbnailPhotoUrl] = useState()

    const handleName = (e) => {
        const name = e.target.value
        if (name.trim() !== user.displayName || name.trim() !== userData.name) {
            setProfileChangeAbility(true)

        }
        else {
            setProfileChangeAbility(false)
        }
    }
    const handleImage = (e) => {
        const imgFile = e.target.files[0]
        // console.log(imgFile)
        setUserImagePreview(URL.createObjectURL(imgFile))
        setImgSource('file')
        if (imgFile) {
            setProfileChangeAbility(true)
        } else {
            setProfileChangeAbility(false)
        }
    }
    const handleUrl = (e) => {
        const url = e.target.value.trim()
        if (url != "") {
            setImgSource("url")
        }
        if (
            url !== user.photoURL
            || url !== userData.photoUrl
        ) {
            setProfileChangeAbility(true)
        } else {
            setProfileChangeAbility(false)
        }

    }

    const handleProfile = async (e) => {
        e.preventDefault()
        if (!profileChangeability) {
            return toast.error("Please change any field first")
        }
        setProfileUploading(true)
        const toastId = toast.loading("Starting...")
        // setProfileLoadingState("")
        const name = e.target.name.value
        const imageFile = e.target.imageFile.files[0]
        const photoUrl = e.target.photoUrl.value
        console.log({ name, imageFile, photoUrl })
        const formData = new FormData()
        formData.append("image", imageFile)



        try {
            const updateObj = {
                name,
                // photoUrl: data.data.url,
                // thumbnailPhotoUrl: data.data.thumb.url
            }
            if (imgSource === 'file') {
                // setProfileLoadingState("Creating Url...")
                toast.loading('Creating Url...', { id: toastId })
                const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, formData)
                updateObj.photoUrl = data.data.url
                updateObj.thumbnailPhotoUrl = data.data.thumb.url
            }
            else if (imgSource === 'url') {
                updateObj.photoURL = photoUrl
                updateObj.thumbnailPhotoUrl = photoUrl
            }


            // setProfileLoadingState("Updating firebase...")
            toast.loading("Updating Firebase...", { id: toastId })
            const updateUserResult = await updateUser(name, updateObj.photoUrl)
            console.log(updateUserResult)
            // setProfileLoadingState("Updating Database")
            toast.loading("Updating Database...", { id: toastId })
            await axiosSecure.patch(`/user/${userData._id}`, updateObj)
            toast.success("Updated Successfully", { id: toastId })
            setProfileUploading(false)
        }
        catch (err) {
            toast.error("Something Went Wrong", { id: toastId })
            console.log(err)
        }

    }

    // const [passwordMatch, setPasswordMatch] = useState(false)

    const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false)

    const handlePassword = (e) => {
        e.preventDefault()
        // const old = e.target.old.value
        // const new = e.target.new.value

        const currentPassword = e.target.current.value
        const newPassword = e.target.new.value
        const confirmPassword = e.target.confirm.value
        if (newPassword !== confirmPassword) {
            console.log("error")
            return toastify.error('New password and confirm password do not match.')

        }
        if (currentPassword === newPassword) {
            console.log("error")
            toastify.error('New password must be different from your current password.')
            return
        }
        setUpdatePasswordLoading(true)


        const credential = EmailAuthProvider.credential(user.email, currentPassword)

        reauthenticateWithCredential(auth.currentUser, credential)
            .then((result) => {
                updatePassword(auth.currentUser, newPassword)
                    .then((result) => {
                        console.log(result)
                        setUpdatePasswordLoading(false)
                        e.target.reset()
                        toast.success("Password Updated")

                    })
                    .catch((error) => {
                        console.log(error)
                        setUpdatePasswordLoading(false)
                    })
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
                setUpdatePasswordLoading(false)
            })






    }

    return (
        <div className='max-w-5xl mx-auto'>
            <ToastContainer />
            <Toaster />
            <div
                className='p-5 bg-linear-to-r from-[#03373D] via-[#0F766E] to-[#CAEB66] dark:from-[#071A1D] dark:via-[#03373D] dark:to-cyan-400 rounded-lg'>
                <h1 className='text-sm font-bold uppercase tracking-wider text-[#CAEB66] dark:text-cyan-400'>Account Setting</h1>
                <h2 className='text-3xl font-extrabold mt-1 text-white'>Update Profile</h2>
                <p className='text-white/80 mt-1'>Manage your account name, photo, and password.</p>
            </div>
            <div className='mt-5 grid lg:grid-cols-[320px_1fr] items-start gap-5'>
                {/* left side */}
                <div className='shadow p-5 bg-[#03373D] dark:bg-[#071A1D] dark:border dark:border-cyan-400/20 rounded-xl text-center lg:sticky lg:top-5 max-w-xl w-full mx-auto'>
                    <div
                        className='relative border inline-block rounded-full bg-linear-to-br from-[#CAEB66] dark:from-cyan-400  via-[#38BDF8] to-[#F97316] dark:to-cyan-400 p-1'>
                        <img
                            src={userImagePreview}
                            className='rounded-full border-4 border-white h-32 w-32 object-cover'
                            alt="" />
                        <button
                            onClick={() => fileInput.current.click()}
                            className='flex items-center justify-center cursor-pointer rounded-full border-2 border-white absolute right-0 bottom-0 bg-[#CAEB66] dark:bg-cyan-400 text-[#03373D] h-10 w-10 active:scale-95'>
                            <Camera />
                        </button>
                    </div>

                    <h1 className='text-white text-2xl font-bold'>{user.displayName}</h1>
                    <p className='text-[#b5dde0] text-sm'>{user.email}</p>

                    <div className='mt-5 grid grid-cols-2 gap-5'>
                        <div className='bg-white/10 p-3 rounded-lg border border-white/10'>
                            <h1 className='text-sm font-bold text-[#CAEB66] dark:text-cyan-400'>Role</h1>
                            <p className='text-white font-semibold capitalize'>{userData ? userData.role : 'Loading...'}</p>
                        </div>
                        <div className='bg-white/10 p-3 rounded-lg border border-white/10'>
                            <h1 className='text-sm font-bold text-[#CAEB66] dark:text-cyan-400'>Joined</h1>
                            <p className='text-white font-semibold'>{userData ? format(userData.created_At, "dd LLL, yyyy") : "Loading..."}</p>
                        </div>
                    </div>
                    <div className='bg-white/10 p-3 rounded-lg border border-white/10 text-left mt-5'>
                        <h1 className='text-sm font-bold text-[#CAEB66] dark:text-cyan-400'>User ID</h1>
                        <p className='text-white font-semibold xs:text-base text-sm '>{user.uid}</p>
                    </div>
                </div>
                {/* // right side */}
                <div className=''>
                    <div className='grid sm:grid-cols-3 gap-5'>
                        <div className='flex gap-5 p-4 bg-white dark:bg-[#071A1D] rounded-lg border border-green-200 dark:border-cyan-400/20 shadow-green-200 dark:shadow-cyan-400/20 shadow-[0px_0px_3px_0px] dark:text-[#F5F7F2]'>
                            <div className='bg-green-100 dark:bg-cyan-400/10 rounded-lg flex items-center justify-center  text-green-700 dark:text-cyan-400 h-11 w-11 '><ShieldCheck /></div>
                            <div>
                                <h1 className='text-gray-500 dark:text-[#AAB8B4] text-xs font-bold'>Role</h1>
                                <h2 className='text-lg font-bold capitalize'>{userData?.role || "Loading..."}</h2>
                            </div>
                        </div>
                        <div className='flex gap-5 p-4 bg-white dark:bg-[#071A1D] rounded-lg border border-sky-200 dark:border-cyan-400/20 shadow-sky-200 dark:shadow-cyan-400/20 shadow-[0px_0px_3px_0px] dark:text-[#F5F7F2]'>
                            <div className='bg-sky-100 dark:bg-cyan-400/10 rounded-lg flex items-center justify-center  text-sky-700 dark:text-cyan-400 h-11 w-11 '><CalendarDays /></div>
                            <div>
                                <h1 className='text-gray-500 dark:text-[#AAB8B4] text-xs font-bold'>Member Since</h1>
                                <h2 className='text-lg font-bold sm:hidden'>{userData ? format(userData.created_At, "dd LLL, yyyy") : "Loading..."}</h2>
                                <h2 className='text-lg font-bold sm:block hidden'>{userData ? format(userData.created_At, "LLL yyyy") : "Loading..."}</h2>
                            </div>
                        </div>
                        <div className='flex gap-5 p-4 bg-white dark:bg-[#071A1D] rounded-lg border border-orange-200 dark:border-cyan-400/20 shadow-orange-200 dark:shadow-cyan-400/20 shadow-[0px_0px_3px_0px] dark:text-[#F5F7F2]'>
                            <div className='bg-orange-100 dark:bg-cyan-400/10 rounded-lg flex items-center justify-center  text-orange-700 dark:text-cyan-400 h-11 w-11 '><UserCog /></div>
                            <div>
                                <h1 className='text-gray-500 dark:text-[#AAB8B4] text-xs font-bold'>Account Type</h1>
                                <h2 className='text-lg font-bold'>{accountType}</h2>
                            </div>
                        </div>

                    </div>

                    {/* Profile  */}
                    <div className='p-5 mt-5 rounded-xl shadow-[0px_0px_3px_0px] shadow-green-200 dark:shadow-cyan-400/20 border-l-4 border-l-green-700 dark:border-l-cyan-400 dark:bg-[#071A1D]  dark:text-[#F5F7F2] '>
                        <div className='flex gap-2 items-center'>
                            <span className='h-11 w-11 rounded-lg flex items-center justify-center bg-green-100 dark:bg-cyan-400/10 text-green-700 dark:text-cyan-400'>
                                <UserRound />
                            </span>
                            <div>
                                <p className='text-green-800 dark:text-cyan-400 font-bold text-sm'>Personal</p>
                                <h2 className='text-2xl font-bold'>Profile Information</h2>
                            </div>
                        </div>
                        <form onSubmit={handleProfile} className='space-y-4 mt-4'>

                            <label className='text-sm text-green-950 dark:text-cyan-400 font-bold' >Username</label>
                            <input
                                onChange={handleName}
                                className='input input-focus w-full border-green-100 dark:border-cyan-400/20 dark:bg-[#031518] dark:text-[#F5F7F2]'
                                placeholder='Your name'
                                type="text"
                                name='name'
                                defaultValue={user.displayName || userData.name} />

                            <label className='text-sm text-green-950 dark:text-cyan-400 font-bold' >Profile Picture</label>
                            <input
                                onChange={handleImage}
                                className='file-input input-focus w-full border-green-100 dark:border-cyan-400/20 dark:bg-[#031518] dark:text-[#F5F7F2]'
                                ref={fileInput}
                                type="file"
                                name='imageFile'
                                accept='image/**' />

                            <label className='text-sm text-green-950 dark:text-cyan-400 font-bold' >Profile Picture Url</label>
                            <input
                                onChange={handleUrl}
                                className='input input-focus w-full border-green-100 dark:border-cyan-400/20 dark:bg-[#031518] dark:text-[#F5F7F2]'
                                placeholder='https://example.com/profile.jpg'
                                type="url"
                                name='photoUrl'
                                defaultValue={user?.photoURL || userData?.photoUrl || userData?.thumbnailPhotoUrl}
                            />

                            <label className='text-sm text-green-950 dark:text-cyan-400 font-bold' >Email</label>
                            <input className='input input-focus w-full border-orange-100 dark:border-cyan-400/20 dark:bg-[#031518] dark:text-[#F5F7F2] opacity-50' value={user?.email} readOnly placeholder='Your name' type="text" />

                            <button
                                // disabled={!profileChangeability}
                                className='btn bg-linear-to-r from-[#CAEB66] dark:from-cyan-400 to-green-500 dark:to-cyan-500 font-semibold dark:text-[#031518]'>
                                {profileUploading ? <span className="loading loading-spinner loading-sm"></span> : <Save size={20} />}
                                Save Profile
                            </button>
                        </form>
                    </div>
                    {/* Security */}
                    <div className='h-[calc(100vh-40px)]'>
                        <div ref={securityElement} className='p-5 mt-5 rounded-xl shadow-[0px_0px_3px_0px] shadow-sky-200 dark:shadow-cyan-400/20 border-l-4 border-l-sky-700 dark:border-l-cyan-400 dark:bg-[#071A1D]  dark:text-[#F5F7F2] ' >
                            <div className='flex gap-2 items-center'>
                                <span className='h-11 w-11 rounded-lg flex items-center justify-center bg-sky-100 dark:bg-cyan-400/10 text-sky-700 dark:text-cyan-400'>
                                    <KeyRound />
                                </span>
                                <div>
                                    <p className='text-sky-800 dark:text-cyan-400 font-bold text-sm'>Security</p>
                                    <h2 className='text-2xl font-bold'>Update Password</h2>
                                </div>
                            </div>
                            {!canUpdatePassword &&
                                <h1
                                    className='flex items-center gap-2 px-4 py-3 border border-yellow-300 dark:border-cyan-400/30 bg-yellow-50 dark:bg-cyan-400/10 text-yellow-800 dark:text-cyan-400 rounded-lg text-sm shadow mt-5'>
                                    <CircleAlert size={18}></CircleAlert>
                                    {`This account uses ${accountType} sign-in, so password changes are managed by Google.`}</h1>
                            }
                            <form
                                onSubmit={handlePassword}
                                className='space-y-4 mt-4'>

                                <label className='text-sm text-sky-950 dark:text-cyan-400 font-bold' >Current Password</label>
                                <input className='input input-focus w-full border-sky-100 dark:border-cyan-400/20 dark:bg-[#031518] dark:text-[#F5F7F2]' placeholder='Current Password' type="text" required name='current' />

                                <fieldset className='grid sm:grid-cols-2 gap-5'>
                                    <div>

                                        <label className='text-sm text-sky-950 dark:text-cyan-400 font-bold' >New Password</label>
                                        <input className='input input-focus w-full border-sky-100 dark:border-cyan-400/20 dark:bg-[#031518] dark:text-[#F5F7F2]' placeholder='New Password' type="text" required name='new' />
                                    </div>
                                    <div>
                                        <label className='text-sm text-sky-950 dark:text-cyan-400 font-bold' >Confirm Password</label>
                                        <input className='input input-focus w-full border-sky-100 dark:border-cyan-400/20 dark:bg-[#031518] dark:text-[#F5F7F2]' placeholder='New Password' type="text" required name='confirm' />
                                    </div>
                                </fieldset>

                                <button className='btn bg-linear-to-r  from-sky-500 dark:from-cyan-400 to-blue-500 dark:to-cyan-500 text-white dark:text-[#031518]'>{updatePasswordLoading ? <span className="loading loading-spinner loading-sm"></span> : <KeyRound size={18} />}Update Password</button>
                            </form>
                        </div>
                    </div>














                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;
