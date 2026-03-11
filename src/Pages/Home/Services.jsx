import React from 'react';
import serviceData from "../../data/services.json"
import serviceImage from "../../assets/service.png"

const Services = () => {

    return (
        <div>
            <section>
                <div className='bg-[#03373D] rounded-4xl p-[100px] box-content shadow-sm'>
                    <h1 className='text-white text-center text-4xl  font-bold mb-5'>Our Services</h1>
                    <p className='mx-auto text-center text-white w-1/2 mb-10'>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
                    <div className='grid grid-cols-3 gap-10'>
                        {
                            serviceData.map((s,index)=>
                                <div className='bg-white text-center rounded-3xl py-6 px-10  space-y-4 hover:bg-green-400 duration-300 hover:scale-[.99]' key={index}>
                                    <img className='mx-auto' src={serviceImage} alt="" />
                                    <h1 className='text-2xl font-bold'>{s.title}</h1>
                                    <p className='text-justify ' style={{textAlignLast:"center"}}>{s.description}</p>

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