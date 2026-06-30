
import { Clock, Headphones, MapPinned, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import React from 'react';
import Border from '../../Components/Border';

const AboutUsPage = () => {
    return (
        <div>
            <div className='mx-auto max-w-7xl sm:px-5'>
                <div className='bg-white dark:bg-[#071A1D] rounded-2xl shadow-sm px-2.5 py-5 xxs:p-5 sm:p-10 lg:py-20 lg:px-28'>
                    <div className='grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center'>

                        <div>
                            <p className='mb-3 text-sm font-bold uppercase tracking-wider text-[#03464D] dark:text-cyan-400 '>About Pro Fast</p>
                            <h1 className='mb-4 text-3xl font-extrabold leading-tight text-gray-950 dark:text-white/90 sm:text-5xl'>Parcel delivery built around speed, care, and trust.</h1>
                            <p className='max-w-2xl text-base leading-7 text-gray-600 dark:text-[#AAB8B4] sm:text-lg'>
                                Pro Fast helps people and businesses send parcels with less waiting, less confusion, and more confidence. From pickup to final delivery, we keep the process simple, visible, and dependable.
                            </p>
                        </div>
                        <div>
                            <div className='rounded-2xl border border-dashed border-[#03373d]/40 bg-[#03373d]/5 p-5 sm:p-8 dark:border-cyan-400/35 dark:bg-cyan-400/5'>
                                <div className='mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#CAEB3A] text-[#03464D]'>
                                    <PackageCheck size={30} strokeWidth={2.4} />
                                </div>
                                <h2 className='mb-3 text-2xl font-extrabold text-[#03464D] dark:text-cyan-400'>Our promise</h2>
                                <p className='leading-7 text-gray-600 dark:text-[#AAB8B4]'>
                                    Every parcel matters. Whether it is a personal gift, an urgent document, or a business shipment, we work to deliver it safely and on time.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Border className={"my-8 sm:my-12"}></Border>
                    <div className='grid gap-8 lg:grid-cols-[0.75fr_1.25fr]'>
                        <div className='sm:max-w-2/3'>
                            <h2 className='mb-3 text-2xl font-extrabold text-gray-950 dark:text-white/90 sm:text-3xl'>Why we started</h2>
                            <p className='sm:leading-7 text-gray-600 dark:text-[#AAB8B4]'>
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
                                    <div key={index} className='rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#031518] p-5 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 dark:hover:border-cyan-400/50 dark:hover:bg-cyan-400/10'>
                                        <div className='mb-4 flex size-11 items-center justify-center rounded-xl bg-white dark:bg-[#071A1D] text-[#03464D] dark:text-cyan-400 shadow-sm'>
                                            {data.icon}
                                        </div>
                                        <h3 className='mb-2 text-lg font-bold text-gray-950 dark:text-white/90'>{data.title}</h3>
                                        <p className='text-sm leading-6 text-gray-600 dark:text-[#AAB8B4]'>{data.description}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className='my-8 grid  sm:gap-4 rounded-2xl bg-[#03464D] dark:bg-[#031518] p-5 text-white sm:my-12 grid-cols-3 sm:p-8 dark:border dark:border-cyan-400/25'>

                        {[
                            { value: '64+', label: 'District coverage' },
                            { value: '24/7', label: 'Tracking support' },
                            { value: '3-step', label: 'Booking flow' }
                        ].map((data, index) =>

                            <div key={index} className='border-white/20 border-r pl-1  pr-1 last:border-r-0 last:pr-0'>
                                <p className=' text-2xl min-[350px]:text-3xl font-extrabold text-[#CAEB3A] dark:text-cyan-400'>{data.value}</p>
                                <p className='mt-1 text-[10px] min-[350px]:text-xs sm:text-sm font-medium text-gray-200'>{data.label}</p>
                            </div>

                        )


                        }
                    </div>
                    <div className='grid gap-5 md:grid-cols-2'>
                        <div className='rounded-xl border border-dashed border-[#03464D]/25 p-5 sm:p-6 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 dark:border-white/10 dark:hover:border-cyan-400/50 dark:hover:bg-cyan-400/10'>
                            <div className='mb-4 flex items-center gap-3'>
                                <Clock className='text-[#03464D] dark:text-cyan-400' size={24} />
                                <h2 className='text-xl font-extrabold text-gray-950 dark:text-white/90'>Our mission</h2>
                            </div>
                            <p className='leading-7 text-gray-600 dark:text-[#AAB8B4]'>
                                To create a delivery experience where customers always know what is happening, merchants can ship with confidence, and riders can complete work through a clear, reliable system.
                            </p>
                        </div>
                        <div className='rounded-xl border border-dashed border-[#03464D]/25 p-5 sm:p-6 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 dark:border-white/10 dark:hover:border-cyan-400/50 dark:hover:bg-cyan-400/10'>
                            <div className='mb-4 flex items-center gap-3'>
                                <PackageCheck className='text-[#03464D] dark:text-cyan-400' size={24} />
                                <h2 className='text-xl font-extrabold text-gray-950 dark:text-white/90'>What guides us</h2>
                            </div>
                            <p className='leading-7 text-gray-600 dark:text-[#AAB8B4]'>
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
