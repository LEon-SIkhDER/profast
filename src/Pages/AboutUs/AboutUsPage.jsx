// import React from 'react';
// import Border from '../../Components/Border';

// const AboutUsPage = () => {
//     return (
//         <div>
//             <div className='mx-auto max-w-7xl px-5'>
//                 <div className='bg-white rounded-2xl shadow-sm p-5 sm:p-10 lg:py-20 lg:px-28'>
//                     <h1 className='text-3xl sm:text-5xl font-extrabold mb-2 sm:mb-4'>About Us</h1>
//                     <p className='text-gray-600  lg:w-1/2 '>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>

//                     <Border className={"my-5 sm:my-12"}></Border>

//                     {/* <div className='*:text-xl space-x-12 mb-6'>
//                         <button>Story</button>
//                         <button>Mission</button>
//                         <button>Success</button>
//                         <button>Team & Others</button>
//                     </div> */}

//                     <p className=' sm:leading-8 text-justify'><span className='text-4xl font-bold primary-text-color '>We</span>  started with a simple yet powerful promise — to make parcel delivery fast, reliable, and completely stress-free for everyone.
//                         From the very beginning, our focus has been on understanding what truly matters to customers: speed, transparency, and trust.

//                         Over the years, we have continuously refined our operations, invested in smarter logistics, and embraced real-time tracking technology to ensure every parcel is handled with care and precision.<br />
//                         Our customer-first approach has helped us build long-lasting relationships and earn the trust of thousands of individuals and businesses who rely on us every day.

//                         Whether it’s a thoughtful personal gift, an important document, or a time-sensitive business shipment, we treat every delivery with the same level of urgency and responsibility.<br />
//                         With efficient routing, dedicated support, and a commitment to excellence at every step, we make sure your parcel reaches its destination safely, smoothly, and exactly when it should — on time, every time.</p>

//                 </div>
//             </div>

//         </div>
//     );
// };

// export default AboutUsPage;
import { Clock, Headphones, MapPinned, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import React from 'react';
import Border from '../../Components/Border';

const AboutUsPage = () => {
    return (
        <div>
            <div className='mx-auto max-w-7xl sm:px-5'>
                <div className='bg-white rounded-2xl shadow-sm px-2.5 py-5 xxs:p-5 sm:p-10 lg:py-20 lg:px-28'>
                    <div className='grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center'>

                        <div>
                            <p className='mb-3 text-sm font-bold uppercase tracking-wider text-[#03464D]'>About Pro Fast</p>
                            <h1 className='mb-4 text-3xl font-extrabold leading-tight text-gray-950 sm:text-5xl'>Parcel delivery built around speed, care, and trust.</h1>
                            <p className='max-w-2xl text-base leading-7 text-gray-600 sm:text-lg'>
                                Pro Fast helps people and businesses send parcels with less waiting, less confusion, and more confidence. From pickup to final delivery, we keep the process simple, visible, and dependable.
                            </p>
                        </div>
                        <div>
                            <div className='rounded-2xl border border-dashed border-[#03373d]/40 bg-[#03373d]/5 p-5 sm:p-8'>
                                <div className='mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#CAEB3A] text-[#03464D]'>
                                    <PackageCheck size={30} strokeWidth={2.4} />
                                </div>
                                <h2 className='mb-3 text-2xl font-extrabold text-[#03464D]'>Our promise</h2>
                                <p className='leading-7 text-gray-600'>
                                    Every parcel matters. Whether it is a personal gift, an urgent document, or a business shipment, we work to deliver it safely and on time.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Border className={"my-8 sm:my-12"}></Border>
                    <div className='grid gap-8 lg:grid-cols-[0.75fr_1.25fr]'>
                        <div className='sm:max-w-2/3'>
                            <h2 className='mb-3 text-2xl font-extrabold text-gray-950 sm:text-3xl'>Why we started</h2>
                            <p className='sm:leading-7 text-gray-600'>
                                Parcel delivery should not feel uncertain. We started Pro Fast to make sending packages easier for customers, more organized for merchants, and more efficient for riders.
                            </p>
                        </div>
                        <div className='grid sm:grid-cols-2 gap-5'>
                            {
                                [
                                    {
                                        title: 'Fast pickup',
                                        description: 'Book a parcel and get a smooth pickup experience from your nearest service area.',
                                        icon: <Truck></Truck>
                                    },
                                    {
                                        title: 'Live tracking',
                                        description: 'Follow every important delivery update from dispatch to doorstep with clear parcel status.',
                                        icon: <MapPinned></MapPinned>
                                    },
                                    {
                                        title: 'Safe handling',
                                        description: 'Every shipment is processed with care, secure handoff, and dependable delivery checks.',
                                        icon: <ShieldCheck></ShieldCheck>
                                    },
                                    {
                                        title: 'Helpful support',
                                        description: 'Our support team keeps customers, merchants, and riders connected when they need help.',
                                        icon: <Headphones></Headphones>
                                    }
                                ].map((data, index) =>
                                    <div key={index} className='rounded-xl border border-gray-100 bg-gray-50 p-5'>
                                        <div className='mb-4 flex size-11 items-center justify-center rounded-xl bg-white text-[#03464D] shadow-sm'>
                                            {data.icon}
                                        </div>
                                        <h3 className='mb-2 text-lg font-bold text-gray-950'>{data.title}</h3>
                                        <p className='text-sm leading-6 text-gray-600'>{data.description}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className='my-8 grid  sm:gap-4 rounded-2xl bg-[#03464D] p-5 text-white sm:my-12 grid-cols-3 sm:p-8'>

                        {[
                            { value: '64+', label: 'District coverage' },
                            { value: '24/7', label: 'Tracking support' },
                            { value: '3-step', label: 'Booking flow' }
                        ].map((data, index) =>

                            <div key={index} className='border-white/20 border-r pl-1  pr-1 last:border-r-0 last:pr-0'>
                                <p className=' text-2xl min-[350px]:text-3xl font-extrabold text-[#CAEB3A]'>{data.value}</p>
                                <p className='mt-1 text-[10px] min-[350px]:text-xs sm:text-sm font-medium text-gray-200'>{data.label}</p>
                            </div>

                        )


                        }
                    </div>
                    <div className='grid gap-5 md:grid-cols-2'>
                        <div className='rounded-xl border border-dashed border-[#03464D]/25 p-5 sm:p-6'>
                            <div className='mb-4 flex items-center gap-3'>
                                <Clock className='text-[#03464D]' size={24} />
                                <h2 className='text-xl font-extrabold text-gray-950'>Our mission</h2>
                            </div>
                            <p className='leading-7 text-gray-600'>
                                To create a delivery experience where customers always know what is happening, merchants can ship with confidence, and riders can complete work through a clear, reliable system.
                            </p>
                        </div>
                        <div className='rounded-xl border border-dashed border-[#03464D]/25 p-5 sm:p-6'>
                            <div className='mb-4 flex items-center gap-3'>
                                <PackageCheck className='text-[#03464D]' size={24} />
                                <h2 className='text-xl font-extrabold text-gray-950'>What guides us</h2>
                            </div>
                            <p className='leading-7 text-gray-600'>
                                We focus on practical service: clear communication, careful parcel handling, responsible delivery assignments, and a platform that keeps every user moving without extra hassle.
                            </p>
                        </div>
                    </div>


















                </div>
            </div>

        </div>
    );
};

export default AboutUsPage;