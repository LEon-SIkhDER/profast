import React from 'react';
import serviceData from "../../data/services.json"
import serviceImage from "../../assets/service.png"

const Services = () => {

    return (
        <div>
            <section>
                <div className='bg-[#03373D] dark:bg-[#071A1D] dark:border dark:border-white/10 rounded-4xl p-[100px] box-content shadow-sm dark:shadow-black/30'>
                    <h1 className='text-white text-center text-4xl  font-bold mb-5'>Our Services</h1>
                    <p className='mx-auto text-center text-white w-1/2 mb-10'>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
                    <div className='grid grid-cols-3 gap-10'>
                        {
                            serviceData.map((s, index) =>
                                <div className='bg-white dark:bg-[#031518] dark:border dark:border-white/10 dark:text-[#F5F7F2] text-center rounded-3xl py-6 px-10  space-y-4 hover:bg-green-400 dark:hover:bg-[#CAEB66]/10 duration-300 hover:scale-[.99]' key={index}>
                                    <img className='mx-auto' src={serviceImage} alt="" />
                                    <h1 className='text-2xl font-bold'>{s.title}</h1>
                                    <p className='text-justify dark:text-[#AAB8B4]' style={{ textAlignLast: "center" }}>{s.description}</p>

                                </div>
                            )
                        }
                    </div>

                </div>

            </section>
        </div>
    );
};

export default Services;

