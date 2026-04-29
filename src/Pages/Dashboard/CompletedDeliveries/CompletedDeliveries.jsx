import { useQuery } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../Context/AuthContext';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router';
import { BadgeDollarSign, CheckCheck, PackageCheck, Wallet } from 'lucide-react';

const CompletedDeliveries = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    // const modal = useRef(null)
    const { data: completedDeliveries, isLoading } = useQuery({
        queryKey: ["completed-deliveries"],
        queryFn: async () => {
            const result = await axiosSecure.get(`/parcels?riderEmail=${user.email}&status=delivered`)
            return result.data
        },
        placeholderData: [...Array(10)]
    })
    console.log(completedDeliveries)


    const totalWeightCount = () => {
        let weight = 0
        completedDeliveries.forEach(value => {
            weight += Number(value?.parcelWeight)
        });
        return `${weight} kg`
    }

    const totalEarning = () => {
        let earning = 0
        completedDeliveries.forEach(value => {
            earning += Number(value?.cost) / 100 * 80
        });
        return `${earning} tk`
    }
    console.log(totalEarning())
    const monthlyEarning = () => {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const parcelsDeliveredThisMonth = completedDeliveries.filter((parcel) => {
            let deliveredTime = new Date(parcel?.statusHistory.find(history => history.status === "delivered")?.time)
            if (!deliveredTime) return false
            return deliveredTime >= firstDayOfMonth
        })
        console.log(parcelsDeliveredThisMonth)
        let thisMonthEarning = 0
        parcelsDeliveredThisMonth.forEach(parcel => {
            thisMonthEarning += Number(parcel?.cost) / 100 * 80
        })
        return `${thisMonthEarning} tk`

    }
    return (
        <div>
            <div className='grid grid-cols-4 gap-5 mb-8'>
                {[
                    {
                        title: "complete parcels",
                        icon: <CheckCheck />,
                        data: completedDeliveries.length,
                        description: "successfully delivered"
                    },
                    {
                        title: "total weight",
                        icon: <PackageCheck />,
                        data: totalWeightCount(),
                        description: "handled by you delivered"
                    },
                    {
                        title: "monthly earning",
                        icon: <BadgeDollarSign />,
                        data: monthlyEarning(),
                        description: `total earned in ${format(new Date(), "MMMM")}`
                    },
                    {
                        title: "total earning",
                        icon: <Wallet />,
                        data: totalEarning(),
                        description: "from all completed deliveries "
                    },

                ].map((data, index) =>
                    <div className='p5 shadow-sm p-5 rounded-2xl' key={index}>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-xl font-semibold capitalize'>{data.title}</h1>
                            <span className='bg-[#caeb66]/40 text-[#526d01] h-10 w-10 rounded-xl flex items-center justify-center'>{data.icon}</span>
                        </div>
                        <h1 className='text-2xl font-bold'>{data.data}</h1>
                        <p className='first-letter:uppercase text-sm mt-5'>{data.description}.</p>
                    </div>
                )}
            </div>
            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 overflow-hidden'>
                <div className='p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <h1 className='text-2xl font-bold '>Completed Deliveries</h1>
                    <p className='text-sm text-gray-500 mt-1'>Review every parcel you have already delivered and inspect its route details anytime.</p>
                </div>
                <table className={`table table-lg table-zebra bg-white font-medium`}>
                    <thead className='bg-[#caeb66]'>
                        <tr className='text-black'>
                            <th className='text-center'>No.</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Receiver</th>
                            <th>Destination</th>
                            <th>Delivered On</th>
                            <th>Cost</th>
                            <th>Earning</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            completedDeliveries?.map((data, index) =>
                                <tr key={index} onClick={() => navigate(`/dashboard/parcel-details/${data._id}`)} className='cursor-pointer'>
                                    <th className='text-center'>{data && index + 1}</th>
                                    <td>{data?.parcelName || <Skeleton></Skeleton>}</td>
                                    <td className='uppercase'>{data?.type || <Skeleton></Skeleton>}</td>
                                    <td>{data?.receiverName || <Skeleton></Skeleton>}</td>
                                    <td>{data?.receiverDistrict || <Skeleton></Skeleton>}</td>
                                    <td>{data?.statusHistory ? format(new Date(data.statusHistory.find(item => item.status === "delivered")?.time), "dd/MM/yyyy") : <Skeleton></Skeleton>}</td>
                                    <td>{data?.cost ? `${data.cost}৳` : <Skeleton></Skeleton>}</td>
                                    <td className='text-green-600 '>{data?.cost ? `${(Number(data.cost) / 100 * 80).toFixed(2)}৳` : <Skeleton></Skeleton>}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompletedDeliveries