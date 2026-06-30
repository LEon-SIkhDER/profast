import React from 'react';

const ComponentWrapper = ({ children }) => {
    return (
        <div className='bg-white dark:bg-[#071A1D] dark:border dark:border-white/10 rounded-2xl shadow-sm dark:shadow-black/30 py-20 px-28'>
            {children}
        </div>
    );
};

export default ComponentWrapper;

