import React from 'react';

const SectionWrapper = ({ children }) => {
    return (
        <section>
            <div className='bg-white dark:bg-[#071A1D] dark:border dark:border-white/10 rounded-2xl shadow-sm dark:shadow-black/30 p-5 md:p-10 lg:py-20  lg:px-28'>
                {children} 
            </div>
        </section>

    );
};

export default SectionWrapper;

