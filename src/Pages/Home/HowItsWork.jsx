import React, { useRef } from 'react';
import { ArrowRight, Check, ClipboardCheck, MapPinned, PackageCheck, ReceiptText, Truck } from 'lucide-react';
import bookKingIcon from "../../assets/bookingIcon.png"

import animatedPackage from "../../animations/animated-package.json"
import animatedTruck from "../../animations/animated-truck.json"
import animatedPin from "../../animations/animated-pin.json"
import animatedBox from "../../animations/animated-box.json"
import Lottie from 'lottie-react';
import { motion } from "framer-motion"

// import Lottie from 'react-lottie';

const HowItsWork = () => {

    const packageElement = useRef()
    const truckElement = useRef()
    const boxElement = useRef()
    const pinElement = useRef()
    const steps = [
        {
            // number: "01",
            title: "Create your parcel request",
            description:
                "Add pickup, receiver, parcel type, weight, and delivery address from the send parcel form.",
            icon: animatedPackage,
            icon2: Check,
            ref: packageElement
        },
        {
            // number: "03",
            title: "Rider accepts pickup",
            description:
                "An assigned rider collects the parcel from your location and starts the delivery journey.",
            icon: animatedTruck,
            icon2: Check,
            ref: truckElement
        },
        {
            // number: "04",
            title: "Track every update",
            description:
                "Follow pickup, transit, warehouse, and delivery status updates directly from your dashboard.",
            icon: animatedPin,
            icon2: Check,
            ref: pinElement
        },
        {
            // number: "05",
            title: "Delivered and confirmed",
            description:
                "Your parcel reaches the receiver safely, then the delivery is marked complete in the system.",
            icon: animatedBox,
            icon2: Check,
            ref: boxElement
        },
    ];
    return (
        <div className='my-5 sm:my-14 md:my-20'>
            <section>
                <div className='max-w-7xl mx-auto'>
                    {/* <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                        <div>
                            <p className='mb-3 inline-flex rounded-full bg-[#CAEB66]/35 px-4 py-1.5 text-sm font-bold text-[#03373D]'>Simple parcel flow</p>
                            <h1 className='text-3xl font-extrabold text-[#03373D] xxs:text-4xl'>How it Works</h1>
                        </div>
                        <p className='max-w-xl font-medium text-gray-600 dark:text-[#AAB8B4] lg:text-right'>
                            From booking to final confirmation, Profast keeps each parcel step clear, trackable, and easy to manage.
                        </p>
                    </div>

                    <div className='grid gap-6 lg:grid-cols-3'>
                        <div className='relative overflow-hidden rounded-4xl bg-[#03373D] p-7 text-white shadow-sm sm:p-8 lg:col-span-1'>
                            <div className='absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#CAEB66]/20'></div>
                            <img className='relative mb-8 h-16 w-16 rounded-2xl bg-white dark:bg-[#071A1D] p-3 shadow-sm' src={bookKingIcon} alt="Parcel booking" />
                            <h2 className='relative mb-4 text-2xl font-extrabold'>Book, track, and receive with confidence.</h2>
                            <p className='relative mb-8 text-sm font-medium leading-6 text-gray-200 sm:text-base'>
                                The workflow follows the same pattern users already see in the app: submit parcel information, confirm cost, wait for rider activity, and track delivery from the dashboard.
                            </p>
                            <div className='relative grid grid-cols-2 gap-3 border-t border-dashed border-[#CAEB66]/40 pt-6'>
                                <div>
                                    <h3 className='text-3xl font-extrabold text-[#CAEB66]'>{steps.length}</h3>
                                    <p className='text-sm font-semibold text-gray-200'>Clear steps</p>
                                </div>
                                <div>
                                    <h3 className='text-3xl font-extrabold text-[#CAEB66]'>24/7</h3>
                                    <p className='text-sm font-semibold text-gray-200'>Status access</p>
                                </div>
                            </div>
                        </div>

                        <div className='grid gap-4 lg:col-span-2'>
                            {
                                steps.map((step, index) => {
                                    const Icon = step.icon2;

                                    return (
                                        <div key={index} className='group flex flex-col gap-5 rounded-3xl bg-white dark:bg-[#071A1D] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center sm:p-6'>
                                            <div className='flex shrink-0 items-center gap-4'>
                                                <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#CAEB66] text-[#03373D] shadow-sm shadow-[#CAEB66]/40'>
                                                    <Icon size={26} strokeWidth={2.4} />
                                                </span>
                                                <span className='text-2xl font-black text-[#03373D]/20'>{index + 1}</span>
                                            </div>

                                            <div className='flex-1 sm:border-l sm:border-dashed sm:border-[#03464D]/25 sm:pl-6'>
                                                <h2 className='mb-2 text-xl font-extrabold text-[#03373D]'>{step.title}</h2>
                                                <p className='font-medium leading-6 text-gray-600 dark:text-[#AAB8B4]'>{step.description}</p>
                                            </div>

                                            {index !== steps.length - 1 &&
                                                <ArrowRight className='hidden shrink-0 text-[#03373D]/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#03373D] sm:block' size={24} />
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>



                    </div> */}




                    <div className='flex justify-between items-end mb-4 sm:mb-8 flex-wrap md:flex-nowrap gap-4 md:gap-5'>
                        <div className='shrink-0'>
                            <motion.h2
                                initial={{
                                    y: 60,
                                    opacity: 0,
                                    scale: .95

                                }}
                                whileInView={{
                                    y: 0,
                                    opacity: 1,
                                    scale: 1

                                }}
                                transition={{
                                    duration: .4,
                                    ease: "easeOut"
                                }}
                                viewport={{ once: true, amount: .50 }}

                                className='px-4 py-2 bg-[#CAEB66]/40 dark:bg-[#CAEB66]/90 rounded-full text-sm font-bold text-teal-800 dark:text-[#031518] mb-3 inline-block'>Simple parcel flow</motion.h2>
                            <motion.h1
                                initial={{
                                    y: 60,
                                    opacity: 0,
                                    scale: .95

                                }}
                                whileInView={{
                                    y: 0,
                                    opacity: 1,
                                    scale: 1

                                }}
                                transition={{
                                    duration: .4,
                                    ease: "easeOut"
                                }}
                                viewport={{ once: true, amount: .50 }}
                                className='text-4xl font-extrabold text-teal-950 dark:text-[#DFF7A3]'>How It Works</motion.h1>
                        </div>
                        <motion.p
                            initial={{
                                y: 60,
                                opacity: 0,
                                scale: .95

                            }}
                            whileInView={{
                                y: 0,
                                opacity: 1,
                                scale: 1

                            }}
                            transition={{
                                duration: .4,
                                ease: "easeOut"


                            }}
                            viewport={{ once: true, amount: .50 }}
                            className=' md:text-right max-w-xl text-gray-600 dark:text-gray-300 font-medium'>From booking to final confirmation, Profast keeps each parcel step clear, trackable, and easy to manage.</motion.p>
                    </div>

                    <div className='grid lg:grid-cols-3 gap-5'>
                        <motion.div

                            initial={{
                                x: -60,
                                opacity: 0,
                                scale: .95

                            }}
                            whileInView={{
                                x: 0,
                                opacity: 1,
                                scale: 1

                            }}
                            transition={{
                                duration: .6,
                                ease: 'easeOut'
                            }}
                            viewport={{ once: true, amount: .25 }}


                            className=' p-7 secondary-bg  dark:border dark:border-white/10 rounded-4xl space-y-4 text-white relative overflow-hidden shadow-sm dark:shadow-black/30'>
                            <div className='absolute top-0 right-0 w-1/3 max-w-40   aspect-square bg-[#CAEB66]/20 dark:bg-[#CAEB66]/15 rounded-bl-full z-0'></div>
                            <img className=' relative z-1     bg-white dark:bg-[#F5F7F2] rounded-2xl w-16 p-3 mb-8' src={bookKingIcon} alt="" />
                            <h1 className=' relative z-1   text-xl min-[350px]:text-2xl font-extrabold'>Book, track, and receive with confidence.</h1>
                            <p className=' relative z-1 text-gray-200 dark:text-[#AAB8B4] font-medium text-sm min-[350px]:text-base '>The workflow follows the same pattern users already see in the app: submit parcel information, confirm cost, wait for rider activity, and track delivery from the dashboard.</p>
                            <div className=' relative z-1 flex justify-between border-t border-dashed border-[#CAEB66]/50 pt-6'>
                                <div>
                                    <h1 className='text-3xl font-bold text-[#CAEB66] text-center'>{steps.length}</h1>
                                    <h2 className='text-sm font-semibold text-gray-200 dark:text-[#AAB8B4]'>Clear Steps</h2>
                                </div>
                                <div>
                                    <h1 className='text-3xl font-bold text-[#CAEB66] text-center'>24/7</h1>
                                    <h2 className='text-sm font-semibold text-gray-200 dark:text-[#AAB8B4]'>Status Access</h2>
                                </div>
                            </div>
                        </motion.div>
                        <div className=' lg:col-span-2 space-y-5'>
                            {
                                steps.map((step, index) => {
                                    // const Icon = step.icon
                                    return (
                                        <motion.div
                                            initial={{ y: 40, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            viewport={{ once: true, amount: 0.2 }}
                                        >
                                            <div
                                                onMouseEnter={() => step.ref.current?.play()}
                                                onMouseLeave={() => step.ref.current?.stop()}
                                                className='p-5 rounded-2xl bg-white dark:bg-[#071A1D] dark:border dark:border-white/10 flex flex-col xs:flex-row gap-5 shadow dark:shadow-black/30 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[#CAEB66]/10 duration-300 select-none' key={index}>
                                                <div className='flex items-center gap-5'>
                                                    <span className='w-14 aspect-square rounded-xl primary-bg dark:bg-[#CAEB66] flex items-center justify-center'>
                                                        {/* <Icon className='size-6 stroke-[2.4]' /> */}
                                                        <Lottie lottieRef={step.ref} animationData={step.icon} autoplay={false} loop={false} className='w-8' />
                                                    </span>
                                                    <h1 className='font-extrabold text-gray-300 dark:text-[#CAEB66]/35 text-2xl '>{index + 1}</h1>
                                                </div>
                                                <div className='xs:border-l border-dashed border-gray-300 dark:border-white/10 xs:pl-5'>
                                                    <h1 className='mb-2 text-xl font-extrabold text-teal-950 dark:text-[#F5F7F2]'>{step.title}</h1>
                                                    <h2 className=' font-medium text-gray-600 dark:text-[#AAB8B4]'>{step.description}</h2>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            }
                        </div>
                    </div>








                </div>
            </section>
        </div>
    );
};

export default HowItsWork;

