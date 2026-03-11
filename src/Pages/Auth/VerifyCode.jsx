import React from 'react';

const VerifyCode = () => {

    const handleInputs = (e) => {
        e.preventDefault()
        e.target.nextElementSibling?.focus()


    }

    return (
        <div className=' '> {/** i wanna make this div vertically center */}
            <h1 className='text-5xl font-extrabold'>Enter Code</h1>
            <p className='mb-5'>Enter 6 digit code that we sent in your email <br /> address</p>

            <form on className='space-y-2'>
                {/* email  */}
                <fieldset className='flex gap-5'>
                    <input required onChange={handleInputs} className='border border-[#CBD5E1] w-8 h-10 rounded text-center' type="text" inputMode='numeric' maxLength={1} />
                    <input required onChange={handleInputs} className='border border-[#CBD5E1] w-8 h-10 rounded text-center' type="text" inputMode='numeric' maxLength={1} />
                    <input required onChange={handleInputs} className='border border-[#CBD5E1] w-8 h-10 rounded text-center' type="text" inputMode='numeric' maxLength={1} />
                    <input required onChange={handleInputs} className='border border-[#CBD5E1] w-8 h-10 rounded text-center' type="text" inputMode='numeric' maxLength={1} />
                    <input required onChange={handleInputs} className='border border-[#CBD5E1] w-8 h-10 rounded text-center' type="text" inputMode='numeric' maxLength={1} />
                    <input required onChange={handleInputs} className='border border-[#CBD5E1] w-8 h-10 rounded text-center' type="text" inputMode='numeric' maxLength={1} />
                </fieldset>

                <button className='btn btn-block bg-[#CAEB66] mt-5'>Verify Code</button>
                {/* <p className='text-sm'>Remember Your Password?  <a href='/login' className='text-[#CAEB66]'>LogIn</a> </p> */}
            </form>

        </div>
    );
};

export default VerifyCode;