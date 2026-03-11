import React from 'react';

const SectionWrapper = ({ children }) => {
    return (
        <section>
            <div className='bg-white rounded-2xl shadow-sm py-20 px-28'>
                {children}
            </div>
        </section>

    );
};

export default SectionWrapper;