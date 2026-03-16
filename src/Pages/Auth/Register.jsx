import React, { useContext, useRef, useState, } from 'react';
import uploadImg from "../../assets/image-upload-icon.png"
import { AuthContext } from '../../Context/AuthContext';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import imageCompression from "browser-image-compression";
import { deleteUser } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';



const Register = () => {
    const { createUser, updateUser, logInWithGooglePopUp, logOut } = useContext(AuthContext)
    const navigate = useNavigate()


    const [registerLoading, setRegisterLoading] = useState(false)
    // const [errorModal, setErrorModal] = useState(false)
    const location = useLocation()




    //.....................
    const imageInput = useRef()

    const [image, setImage] = useState()
    const [imageUrl, setImageUrl] = useState(uploadImg)

    const handleImageClick = (e) => {
        e.preventDefault()
        imageInput.current.click()
    }

    const handleImage = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        // console.log(file)

        const formData = new FormData()
        formData.append("image", file)
        setImage(formData)

        const url = URL.createObjectURL((await handleResize(formData)).get("image"))
        setImageUrl(url)



    }
    const handleResize = async (imgFormData) => {
        const image = imgFormData.get("image")


        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 200,
            useWebWorker: true,
        }
        const compressedFile = await imageCompression(image, options)
        const formData = new FormData()
        formData.append("image", compressedFile)
        return formData
    }

    const linkConversion = async (image) => {

        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, image)
        console.log(res)
        return res.data.data.display_url

    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setRegisterLoading(true)
        // const photoUrl = e.target.photoUrl.value
        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value

        const photoUrl = await linkConversion(image) //1sec
        const thumbnailPhotoUrl = await linkConversion(await handleResize(image))




        createUser(email, password) // create user
            .then(result => {
                console.log(result)
                const newUserData = {
                    name,
                    email,
                    photoUrl,
                    thumbnailPhotoUrl,
                    uid: result.user.uid
                }

                updateUser(name, thumbnailPhotoUrl)
                    .then(result => {
                        console.log(result)
                        axios.post("http://localhost:5000/users", newUserData)
                            .then(result => {
                                console.log(result)
                                setRegisterLoading(false)
                                navigate(location.state || "/")
                            })
                            .catch(error => {
                                console.log(error)
                                logOut()
                                fireErrorSwal()
                                setRegisterLoading(false)
                            })
                    })
                    .catch(error => {
                        console.log("update error" + error)
                        setRegisterLoading(false)
                    })
            })
            .catch(error => {
                console.log(error)
                setRegisterLoading(false)
            })
    }
    const fireErrorSwal = () => {
        Swal.fire({
            icon: "error",
            title: "<h1 class='text-2xl font-bold text-red-600 -mt-2'>Server Error!</h1>",
            html: "<p class='text-gray-700 mt-2'>The server is down. Please try again later.</p>",
            showConfirmButton: true,
            confirmButtonText: "Okay",
            confirmButtonColor: "#E53935",   // green button
            background: "#fefefe",
            allowOutsideClick: true,
        });
    }







    const handleGoogleSignIn = () => {

        logInWithGooglePopUp()
            .then(result => {
                console.log(result)
                const newUserData = {
                    name: result.user.displayName,
                    email: result.user.email,
                    photoUrl: result.user.photoURL,
                    thumbnailPhotoUrl: result.user.photoURL,
                    uid: result.user.uid
                }
                axios.post("http://localhost:5000/users", newUserData)
                    .then(result => {
                        console.log(result)
                        navigate(location.state || "/")
                    })
                    .catch(error => {
                        console.log(error)
                        console.log('kam sarche')
                        logOut()
                        fireErrorSwal()



                    })

            })
            .catch(error => {
                console.log(error)
            })
    }



    return (
        <div className=' '> {/** i wanna make this div vertically center */}
            <h1 className='text-4xl font-extrabold'>Create an Account</h1>
            <p className='mb-5'>Register with Profast</p>
            <form onSubmit={handleRegister} className='space-y-2 mt-5'>
                <div className='flex items-center gap-5 '>
                    <img onClick={handleImageClick} className='h-[54px] w-[54px] object-cover border-2 border-transparent hover:border-gray-200 rounded-full duration-200  active:border-transparent' src={imageUrl} alt="" />
                    <input onChange={handleImage} className='hidden' ref={imageInput} required type='file' accept='image/*' />

                </div>

                {/* name  */}
                <fieldset>
                    <label className='label text-black text-sm'>Name</label>
                    <input required className='input w-full input-focus ' type="text " placeholder='Name' name='name' />
                </fieldset>
                {/* email  */}
                <fieldset>
                    <label className='label text-black text-sm'>Email</label>
                    <input required className='input w-full input-focus ' type="email " placeholder='Email' name='email' />
                </fieldset>
                {/* password  */}
                <fieldset className=''>
                    <label className='label text-black text-sm'>Password</label>
                    <input required className='input w-full input-focus' type="password " placeholder='Password' name='password' />
                </fieldset>
                <button className='btn btn-block bg-[#CAEB66]'> {registerLoading ? <span className="loading loading-spinner loading-md"></span> : "Register"}</button>
                <p className='text-sm'>Already have an account? <a href='/login' className='text-[#CAEB66]'>LogIn</a> </p>

            </form>
            <div className="divider text-sm">OR</div>
            <button onClick={handleGoogleSignIn} className="btn btn-block text-base bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Register with Google
            </button>
        </div>
    );
};

export default Register;