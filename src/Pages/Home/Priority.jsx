import React from 'react';
import bg from "../../assets/be-a-merchant-bg.png"
import merchant from "../../assets/location-merchant.png"
import { Link } from 'react-router';
// import { Link } from 'lucide-react';

const Priority = () => {
    return (
        <div className='my-12 md:my-20 '>
            <section>
                <div className='flex items-center justify-between max-w-7xl mx-auto bg-[#03373D] p-6 sm:p-10 lg:p-20 bg-no-repeat bg-top rounded-4xl shadow-sm gap-8 lg:gap-12 overflow-hidden' style={{ backgroundImage: `url(${bg})` }}>
                    <div className='w-full lg:w-7/12 text-center lg:text-left'>
                        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 w-full lg:w-[120%] '>Delivery Made Easier for Customers, Merchants, and Riders</h1>
                        <p className='text-gray-200 mb-8 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0'>Send parcels, grow your business, or earn as a delivery rider with Pro Fast, reliable delivery network across Bangladesh.</p>
                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4'>
                            <button className='w-full sm:w-auto px-5 sm:px-6 py-3 rounded-full bg-[#CAEB66] text-base sm:text-xl font-bold'>Become a Merchant</button>
                            <Link to={"/be-a-rider"} className='w-full sm:w-auto px-5 sm:px-6 py-3 rounded-full cursor-pointer text-[#CAEB66] hover:text-[#03373d] duration-300 text-base sm:text-xl font-bold border border-[#CAEB66] bg-transparent hover:bg-[#CAEB66] block'>Join as Rider</Link>
                        </div>
                    </div>
                    <img src={merchant} className='hidden lg:block lg:w-5/12 lg:max-w-md' alt="" />
                </div>
            </section>
        </div>
    );
};

export default Priority;
