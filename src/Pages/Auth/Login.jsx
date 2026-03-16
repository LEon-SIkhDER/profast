import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import useGetFirebaseErrorMessage from '../../hooks/useGetFirebaseErrorMessage';


const Login = () => {
    const { handleSignInWithEmailAndPassword, logInWithGooglePopUp, logOut } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const getMessage = useGetFirebaseErrorMessage()

    const [errorMessage, setErrorMessage] = useState()


    //email password logIn

    const handleLogIn = (e) => {
        e.preventDefault()
        setErrorMessage('')
        const email = e.target.email.value
        const password = e.target.password.value
        // console.log(email, password)

        handleSignInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result)
                navigate(location.state ? location.state : "/")


            })
            .catch((error) => {
                console.log(error.code)
                setErrorMessage(getMessage(error.code))



            })

    }


    // google login
    const handleGoogleLogIn = () => {

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

    const handleStateNavigate = () => {
        navigate("/register", { state: location.state })

    }






    return (
        <div className='  '> {/** i wanna make this div vertically center */}
            <h1 className='text-5xl font-extrabold'>Welcome Back</h1>
            <p className='mb-5'>Login with Profast</p>

            <form onSubmit={handleLogIn} className='space-y-2'>
                {/* email  */}
                <fieldset>
                    <label className='label text-black text-sm'>Email</label>
                    <input required className='input w-full input-focus ' type="email" placeholder='Email' name='email' />
                </fieldset>
                {/* password  */}
                <fieldset className=''>
                    <label className='label text-black text-sm'>Password</label>
                    <input required className='input w-full input-focus' type="password" placeholder='Password' name='password' />
                </fieldset>
                <a href='/forget-pass' className='underline text-gray-700 text-sm mb-2 block '>Forget Password</a>
                {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
                <button className='btn btn-block bg-[#CAEB66]'>LogIn</button>
                <p onClick={handleStateNavigate} className='text-sm cursor-pointer '>Don’t have any account? <span className='text-[#CAEB66]'>Register</span> </p>

            </form>
            <div className="divider text-sm">OR</div>
            <button onClick={handleGoogleLogIn} className="btn btn-block text-base bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
            </button>
        </div>
    );
};

export default Login;