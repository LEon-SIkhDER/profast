import React, { useState } from 'react';

const ResetPassword = () => {
    const [error, setError] = useState()
    const handleSubmit = (e) => {
        e.preventDefault()
        const newPassword = e.target.new_password.value
        const confirmPassword = e.target.confirm_password.value
        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match")
        }
        


    }
    return (
        <div className=' '> {/** i wanna make this div vertically center */}
            <h1 className='text-5xl font-extrabold'>Reset Password </h1>
            <p className='mb-5'>Reset your password</p>

            <form onSubmit={handleSubmit} className='space-y-2'>
                {/* new password  */}
                <fieldset>
                    <label className='label text-black dark:text-[#F5F7F2] text-sm'>New Password</label>
                    <input onChange={() => setError()} required className='input w-full input-focus ' type="password" placeholder='Password' name='new_password' minLength={8} />
                </fieldset>

                {/* confirm password  */}
                <fieldset>
                    <label className='label text-black dark:text-[#F5F7F2] text-sm'>Confirm Password</label>
                    <input onChange={() => setError()} required className='input w-full input-focus ' type="password" placeholder='Password' name='confirm_password' minLength={8} />
                </fieldset>
                {error && <p className='text-sm text-red-500'>{error}</p>}

                <button className='btn btn-block bg-[#CAEB66] mt-5'>Reset your password</button>
            </form>

        </div>
    );
};

export default ResetPassword;
