import React from 'react';
import bg from "../../assets/be-a-merchant-bg.png"
import merchant from "../../assets/location-merchant.png"

const Priority = () => {
    return (
        <div className='my-20 '>
            <section>
                <div className='flex max-w-7xl mx-auto bg-[#03373D] p-20 bg-no-repeat bg-top rounded-4xl shadow-sm' style={{ backgroundImage: `url(${bg})` }}>
                    <div>
                        <h1 className='text-4xl font-extrabold text-white mb-4 w-[110%]'>Merchant and Customer Satisfaction is Our First Priority</h1>
                        <p className='text-gray-200 mb-8'>We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.</p>
                        <div className='space-x-4'>
                            <button className='px-6 py-3 rounded-full bg-[#CAEB66] text-xl font-bold'>Become a Merchant</button>
                            <button className='px-6 py-3 rounded-full text-[#CAEB66] text-xl font-bold border border-[#CAEB66] bg-transparent '>Earn with Profast Courier</button>
                        </div>
                    </div>
                    <img src={merchant} alt="" />
                </div>
            </section>
        </div>
    );
};

export default Priority;