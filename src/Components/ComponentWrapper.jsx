import React from 'react';

const ComponentWrapper = ({ children }) => {
    return (
        <div className='bg-white rounded-2xl shadow-sm py-20 px-28'>
            {children}
        </div>
    );
};

export default ComponentWrapper;