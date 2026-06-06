import React from 'react';
import Border from '../../Components/Border';

const AboutUsPage = () => {
    return (
        <div>
            <div className='mx-auto max-w-7xl px-5'>
                <div className='bg-white rounded-2xl shadow-sm p-5 sm:p-10 lg:py-20 lg:px-28'>
                    <h1 className='text-3xl sm:text-5xl font-extrabold mb-2 sm:mb-4'>About Us</h1>
                    <p className='text-gray-600  lg:w-1/2 '>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>

                    <Border className={"my-5 sm:my-12"}></Border>

                    {/* <div className='*:text-xl space-x-12 mb-6'>
                        <button>Story</button>
                        <button>Mission</button>
                        <button>Success</button>
                        <button>Team & Others</button>
                    </div> */}

                    <p className=' sm:leading-8 text-justify'><span className='text-4xl font-bold primary-text-color '>We</span>  started with a simple yet powerful promise — to make parcel delivery fast, reliable, and completely stress-free for everyone.
                        From the very beginning, our focus has been on understanding what truly matters to customers: speed, transparency, and trust.

                        Over the years, we have continuously refined our operations, invested in smarter logistics, and embraced real-time tracking technology to ensure every parcel is handled with care and precision.<br />
                        Our customer-first approach has helped us build long-lasting relationships and earn the trust of thousands of individuals and businesses who rely on us every day.

                        Whether it’s a thoughtful personal gift, an important document, or a time-sensitive business shipment, we treat every delivery with the same level of urgency and responsibility.<br />
                        With efficient routing, dedicated support, and a commitment to excellence at every step, we make sure your parcel reaches its destination safely, smoothly, and exactly when it should — on time, every time.</p>

                </div>
            </div>

        </div>
    );
};

export default AboutUsPage;