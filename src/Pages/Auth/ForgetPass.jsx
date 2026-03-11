import { prodErrorMap, sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../../../firebase.init';

const ForgetPass = () => {
    // const navigate = useNavigate()

    const handleForgetPass = (e) => {
        // navigate("/verify-code")
        e.preventDefault()
        sendPasswordResetEmail(auth, e.target.email.value)
            .then(result => {
                console.log(result)
                alert("Please check your email")

            })
            .catch(error => {
                console.log(error)
            })


    }
    return (
        <div className=' '> {/** i wanna make this div vertically center */}
            <h1 className='text-5xl font-extrabold'>Forget Password </h1>
            <p className='mb-5'>Enter your email address and we’ll send you a reset link.</p>

            <form onSubmit={handleForgetPass} className='space-y-2'>
                {/* email  */}
                <fieldset>
                    <label className='label text-black text-sm'>Email</label>
                    <input required className='input w-full input-focus ' type="email " placeholder='Email' name='email' />
                </fieldset>

                <button className='btn btn-block bg-[#CAEB66] mt-5'>Send</button>
            </form>
            <p className='text-sm'>Remember Your Password? <a href='/login' className='text-[#CAEB66]'>LogIn</a> </p>

        </div>
    );
};

export default ForgetPass;