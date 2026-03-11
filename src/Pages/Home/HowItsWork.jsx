import React from 'react';
import bookKingIcon from "../../assets/bookingIcon.png"

const HowItsWork = () => {
    return (
        <div className='my-14 '>
            <div className='max-w-7xl mx-auto px-2.5 sm:px-5 box-content'>
                <div>
                    <h1 className='mb-8 text-4xl font-bold'>How it Works</h1>
                    <div className='grid grid-cols-4 gap-6 *:shadow-sm'>
                        <div className='bg-white rounded-2xl p-8'>
                            <img src={bookKingIcon} alt="" />
                            <h1 className='text-xl font-bold mt-6 mb-4'>Booking Pick & Drop</h1>
                            <p className='font-medium'>From personal packages to business shipments — we deliver on time, every time.</p>
                        </div>
                        <div className='bg-white rounded-2xl p-8'>
                            <img src={bookKingIcon} alt="" />
                            <h1 className='text-xl font-bold mt-6 mb-4'>Cash On Delivery</h1>
                            <p className='font-medium'>From personal packages to business shipments — we deliver on time, every time.</p>
                        </div>
                        <div className='bg-white rounded-2xl p-8'>
                            <img src={bookKingIcon} alt="" />
                            <h1 className='text-xl font-bold mt-6 mb-4'>Delivery Hub</h1>
                            <p className='font-medium'>From personal packages to business shipments — we deliver on time, every time.</p>
                        </div>
                        <div className='bg-white rounded-2xl p-8'>
                            <img src={bookKingIcon} alt="" />
                            <h1 className='text-xl font-bold mt-6 mb-4'>Booking SME & Corporate</h1>
                            <p className='font-medium'>From personal packages to business shipments — we deliver on time, every time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItsWork;
