import React from 'react';

const SectionWrapper = ({ children }) => {
    return (
        <section>
            <div className='bg-white rounded-2xl shadow-sm p-5 md:p-10 lg:py-20  lg:px-28'>
                {children} 
            </div>
        </section>

    );
};

export default SectionWrapper;