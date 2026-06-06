import React from 'react';
import Marquee from 'react-fast-marquee';
import logo1 from "../../assets/brands/amazon.png"
import logo2 from "../../assets/brands/amazon_vector.png"
import logo3 from "../../assets/brands/casio.png"
import logo4 from "../../assets/brands/moonstar.png"
import logo5 from "../../assets/brands/randstad.png"
import logo6 from "../../assets/brands/start-people 1.png"
import logo7 from "../../assets/brands/start.png"
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { motion } from "framer-motion"


const Companies = () => {
    const axiosSecure = useAxiosSecure()

    const { data: deliveryCount } = useQuery({
        queryKey: ['deliveryCount'],
        queryFn: async () => {
            const result = await axiosSecure.get('/total-delivery-count')

            console.log(result)
            return result.data

        }
    })
    console.log(deliveryCount)
    const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

    const showDeliveryCount = (number) => {
        const count = Number(number)
        const modifiedCount = count / 1000
        if (count < 1000) return count
        else {
            if (modifiedCount % 1 === 0) {
                return `${modifiedCount}k`
            }
            else if (modifiedCount.toFixed(1) == modifiedCount) {
                return `${modifiedCount.toFixed(1)}k`

            }
            else if (modifiedCount.toFixed(1) != modifiedCount) {
                return `${modifiedCount.toFixed(1)}k+`

            }
        }

    }

    return (
        <div className='my-5 sm:my-16 md:my-20'>
            <section>
                {/* <div className='max-w-7xl mx-auto overflow-hidden rounded-4xl bg-white py-10 shadow-sm sm:py-14 mb-10'>
                    <div className='mx-auto mb-10 max-w-2xl px-5 text-center'>
                        <p className='mb-3 inline-flex rounded-full bg-[#CAEB66]/40 px-4 py-2 text-sm font-bold text-teal-800'>
                            Trusted delivery network
                        </p>
                        <h1 className='mb-4 text-3xl font-extrabold text-[#03373D] sm:text-4xl'>
                            Businesses that move with Profast
                        </h1>
                        <p className='font-medium text-gray-600'>
                            From online stores to growing teams, our parcel service helps businesses keep deliveries clear, fast, and trackable.
                        </p>
                    </div>

                    <div className='border-y border-dashed border-[#03464D]/25 bg-[#03373D]/5 py-6'>
                        <Marquee gradient gradientColor='#F7FAF7' gradientWidth={120} autoFill pauseOnHover speed={35}>
                            {
                                logos.map((logo, index) =>
                                    <div className='mr-5 flex h-20 w-44 items-center justify-center rounded-2xl bg-white px-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:mr-8 sm:w-52' key={index}>
                                        <img className='max-h-10 object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0' src={logo} alt="Partner brand" />
                                    </div>
                                )
                            }
                        </Marquee>
                    </div>

                    <div className='grid gap-5 px-5 pt-8 text-center sm:grid-cols-3 sm:px-10'>
                        <div>
                            <h2 className='text-3xl font-extrabold text-[#03373D]'>1k+</h2>
                            <p className='font-semibold text-gray-500'>Parcel requests</p>
                        </div>
                        <div>
                            <h2 className='text-3xl font-extrabold text-[#03373D]'>64</h2>
                            <p className='font-semibold text-gray-500'>District coverage goal</p>
                        </div>
                        <div>
                            <h2 className='text-3xl font-extrabold text-[#03373D]'>24/7</h2>
                            <p className='font-semibold text-gray-500'>Tracking access</p>
                        </div>
                    </div>
                </div> */}

                <div className='max-w-7xl mx-auto rounded-4xl bg-white py-10 sm:py-14 shadow-sm '>
                    <div className='text-center max-w-2xl mx-auto px-5'>
                        <motion.h2
                            initial={{
                                opacity: 0,
                                scale: .95

                            }}
                            whileInView={{
                                opacity: 1,
                                scale: 1

                            }}
                            transition={{
                                duration: .4,
                                ease: "easeOut"
                            }}
                            viewport={{ once: true, amount: .50 }}
                            className='px-4 py-2 bg-[#CAEB66]/40 rounded-full  text-teal-800 font-bold text-sm inline-block'>Trusted delivery network</motion.h2>
                        <motion.h1
                            initial={{
                                opacity: 0,
                                scale: .95

                            }}
                            whileInView={{
                                opacity: 1,
                                scale: 1

                            }}
                            transition={{
                                duration: .4,
                                ease: "easeOut"
                            }}
                            viewport={{ once: true, amount: .50 }} className='text-2xl sm:text-4xl font-extrabold text-teal-900  my-2'>Businesses that move with Profast</motion.h1>
                        <motion.p
                            initial={{
                                opacity: 0,
                                scale: .95

                            }}
                            whileInView={{
                                opacity: 1,
                                scale: 1

                            }}
                            transition={{
                                duration: .4,
                                ease: "easeOut"
                            }}
                            viewport={{ once: true, amount: .50 }}
                            className='font-medium text-gray-600 text-justify text-sm sm:text-base' style={{ textAlignLast: "center" }}>From online stores to growing teams, our parcel service helps businesses keep deliveries clear, fast, and trackable.</motion.p>
                    </div>
                    <div className='py-4 sm:py-6 border-y border-dashed border-gray-400 bg-teal-950/5 my-10 '>
                        {/* <motion.div drag="x"> */}
                        <Marquee gradient gradientColor='#f2f4f4' gradientWidth={100} autoFill pauseOnHover >

                            {
                                logos.map((logo, index) =>
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            scale: .95

                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            scale: 1

                                        }}
                                        transition={{
                                            duration: .4,
                                            ease: "easeOut"
                                        }}
                                        viewport={{ once: true, amount: .50 }}
                                        className='flex items-center justify-center bg-white my-1 h-12 sm:h-20 w-32 sm:w-48 rounded-xl sm:rounded-2xl shadow mr-5 sm:mr-10 grayscale hover:grayscale-0 hover:-translate-y-1 hover:shadow-md duration-300 transition-all '>
                                        <img className='max-w-20 sm:max-w-36 ' key={index} src={logo} alt="company" />
                                    </motion.div>
                                )
                            }
                        </Marquee>
                        {/* </motion.div> */}

                    </div>
                    <div className='grid min-[360px]:flex  justify-around'>
                        <div className='text-center'>
                            <h1 className='font-bold text-teal-900 text-2xl sm:text-3xl'>{showDeliveryCount(deliveryCount)}</h1>
                            <h2 className='text-gray-500 font-semibold text-xs xxs:text-sm sm:text-base '>Complete Deliveries</h2>
                        </div>
                        <div className='text-center'>
                            <h1 className='font-bold text-teal-900 text-2xl sm:text-3xl'>64</h1>
                            <h2 className='text-gray-500 font-semibold text-xs xxs:text-sm sm:text-base '>District Coverage </h2>
                        </div>
                        <div className='text-center'>
                            <h1 className='font-bold text-teal-900 text-2xl sm:text-3xl'>24/7</h1>
                            <h2 className='text-gray-500 font-semibold text-xs xxs:text-sm sm:text-base '>Tracking Access</h2>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Companies;
