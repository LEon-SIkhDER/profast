import React from 'react';
import { SearchX } from 'lucide-react';

const NoDataFound = ({ data, className }) => {
    return (
        <div className={`  px-5 py-12 text-center bg-white dark:bg-[#071A1D] ${className}`}>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#CAEB66]/30 dark:bg-cyan-400/10 text-[#03373D] mx-auto dark:text-cyan-400'>
                <SearchX size={34} />
            </div>
            <h2 className='mt-5 text-2xl font-bold text-[#03373D] dark:text-cyan-400'  >No {data || "data"} Found</h2>
            <p className='mt-2  text-sm font-medium text-gray-500 dark:text-[#AAB8B4]'>There is nothing to show here right now.</p>

        </div>
    );
};

export default NoDataFound;

