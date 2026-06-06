import React from 'react';
import liveTracking from "../../assets/live-tracking.png"
import safe24By7 from "../../assets/safe-delivery.png"
import deliveryVan from "../../assets/customer-top2.png"

const AboutUs = () => {
    return (
        <div>
            <section>
                <div className='border-dashed border-y py-20 border-[#03464D] max-w-7xl mx-auto'>

                    <div className='space-y-6'>

                        <div className='flex flex-col sm:flex-row  items-center bg-white rounded-4xl p-4 sm:p-8 gap-5 sm:gap-12 shadow-sm'>
                            <img src={liveTracking} className='w-[150px] sm:w-[200px]' alt="Live Tracking" />

                            <div className='sm:pl-10 lg:px-12 min-h-[200px] flex flex-col justify-center py-5 sm:py-0 md:py-8  border-dashed border-t sm:border-t-0 sm:border-l border-[#03464D]'>
                                <h1 className='text-2xl font-extrabold text-[#03464D] mb-4 text-center sm:text-left' >Live Parcel Tracking</h1>
                                <p className='font-medium text-gray-600'>Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.</p>

                            </div>
                        </div>


                        <div className='flex flex-col sm:flex-row items-center bg-white rounded-4xl p-4 psm:-8 gap-5 sm:gap-12 shadow-sm'>
                            <img src={deliveryVan} className='w-[150px] sm:w-[200px]' alt="Live Tracking" />

                            <div className='sm:pl-10 lg:px-12 min-h-[200px] flex flex-col justify-center py-5 sm:py-0 md:py-8  border-dashed border-t sm:border-t-0 sm:border-l border-[#03464D]'>
                                <h1 className='text-2xl font-extrabold text-[#03464D] mb-4 text-center sm:text-left' >100% Safe Delivery</h1>
                                <p className='font-medium text-gray-600'>We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.</p>

                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row items-center bg-white rounded-4xl p-4 psm:-8 gap-5 sm:gap-12 shadow-sm'>
                            <img src={safe24By7} className='w-[150px] sm:w-[200px]' alt="Call Center Support" />

                            <div className='sm:pl-10 lg:px-12 min-h-[200px] flex flex-col justify-center py-5 sm:py-0 md:py-8  border-dashed border-t sm:border-t-0 sm:border-l border-[#03464D]'>
                                <h1 className='text-2xl font-extrabold text-[#03464D] mb-4 text-center sm:text-left' >24/7 Call Center Support</h1>
                                <p className='font-medium text-gray-600'>Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.</p>

                            </div>
                        </div>

                    </div>


                </div>
            </section>
        </div>
    );
};

export default AboutUs;
