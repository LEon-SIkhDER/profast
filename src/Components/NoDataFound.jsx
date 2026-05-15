import React from 'react';
import { SearchX } from 'lucide-react';

const NoDataFound = ({ data }) => {
    return (
        <div className='  px-5 py-12 text-center bg-white'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#CAEB66]/30 text-[#03373D] mx-auto'>
                <SearchX size={34} />
            </div>
            <h2 className='mt-5 text-2xl font-bold text-[#03373D]'>No {data} Found</h2>
            <p className='mt-2  text-sm font-medium text-gray-500'>There is nothing to show here right now.</p>

        </div>
    );
};

export default NoDataFound;
