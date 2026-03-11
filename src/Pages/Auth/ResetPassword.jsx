import React from 'react';

const ResetPassword = () => {
    const handleSubmit = () => {
        console.log("hello")
    }
    return (
        <div className=' '> {/** i wanna make this div vertically center */}
            <h1 className='text-5xl font-extrabold'>Reset Password </h1>
            <p className='mb-5'>Reset your password</p>

            <form onSubmit={handleSubmit} className='space-y-2'>
                {/* new password  */}
                <fieldset>
                    <label className='label text-black text-sm'>New Password</label>
                    <input required className='input w-full input-focus ' type="password " placeholder='Password' />
                </fieldset>

                {/* confirm password  */}
                <fieldset>
                    <label className='label text-black text-sm'>Confirm Password</label>
                    <input required className='input w-full input-focus ' type="password " placeholder='Password' />
                </fieldset>

                <button className='btn btn-block bg-[#CAEB66] mt-5'>Reset your password</button>
            </form>

        </div>
    );
};

export default ResetPassword;