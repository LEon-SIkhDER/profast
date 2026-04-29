import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const TrackYourParcel = () => {
    // const axiosSecure = useAxiosSecure()
    // const handleTrack = (e) => {
    //     e.preventDefault()
    //     const { data } = useQuery({
    //         queryKey: e.target.value,
    //         queryFn: async () => {
    //             const result = await axiosSecure.get(`/parcel?parcelId=${e.target.value}`)
    //             return result.data
    //         }
    //     })

    // }
    return (
        <div>
            track
        </div>
    );
};

export default TrackYourParcel;