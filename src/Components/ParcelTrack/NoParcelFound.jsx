import { PackageSearch } from 'lucide-react';
import React from 'react';

const NoParcelFound = ({ submittedParcelId }) => {
    return (
        <div className="rounded-[28px] bg-white p-10 text-center shadow-sm">
            <PackageSearch className="mx-auto text-[#91aa2e]" size={36} />
            <h2 className="mt-4 text-2xl font-bold text-[#17310f]">No parcel found</h2>
            <p className="mt-2 text-gray-500">
                We could not find a parcel for <span className="font-semibold text-gray-700">{submittedParcelId}</span>. Please check the ID and try again.
            </p>
        </div>
    );
};

export default NoParcelFound;