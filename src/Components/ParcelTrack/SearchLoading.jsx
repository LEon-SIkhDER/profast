import React from 'react';

const SearchLoading = () => {
    return (
        <div className='text-center shadow-sm rounded-2xl p-8 bg-white'>
            <span className="loading loading-spinner text-[#CAEB66] mx-auto"></span>
            <h1 className='mt-2 text-2xl font-bold'>Tracking parcel</h1>
            <p className="mt-2 text-gray-500">Please wait while we fetch the latest shipment updates.</p>
        </div>
    );
};

export default SearchLoading;