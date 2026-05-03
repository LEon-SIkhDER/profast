import React from 'react';
import SectionWrapper from '../SectionWrapper';

const ReadyToTrack = () => {
    return (
        <div className='shadow-sm rounded-2xl bg-white p-8 '>
            <h1 className='text-2xl font-bold'>Ready to track</h1>
            <p className='mt-2 text-gray-500 max-w-2xl'>Search by parcel ID to view shipment status, sender and receiver districts, payment state, and the full delivery timeline.
            </p>
        </div>
    );
};

export default ReadyToTrack;