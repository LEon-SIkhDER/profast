import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../Context/AuthContext';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router';
import { BadgeDollarSign, CheckCheck, PackageCheck, Wallet } from 'lucide-react';
import NoDataFound from '../../../Components/NoDataFound';

const CompletedDeliveries = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    // const modal = useRef(null)
    const { data: completedDeliveries } = useQuery({
        queryKey: ["completed-deliveries"],
        queryFn: async () => {
            const result = await axiosSecure.get(`/parcels?riderEmail=${user.email}&status=delivered`)
            return result.data
        },
        placeholderData: [...Array(10)]
    })
    console.log(completedDeliveries)


    const totalWeightCount = () => {
        if (!completedDeliveries[0]) return 0
        let weight = 0
        completedDeliveries.forEach(value => {
            weight += Number(value?.parcelWeight)
        });

        return `${weight.toFixed(2)} kg`
    }

    const totalEarning = () => {
        if (!completedDeliveries[0]) return 0
        let earning = 0
        completedDeliveries.forEach(value => {
            earning += Number(value?.cost) / 100 * 80
        });
        return `${earning} tk`
    }
    console.log(totalEarning())
    const monthlyEarning = () => {
        if (!completedDeliveries[0]) return 0
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
            <div className='grid grid-cols-2 min-[990px]:grid-cols-4 gap-2 min-[360px]:gap-3 sm:gap-5 mb-8'>
                {[
                    {
                        title: "complete parcels",
                        icon: <CheckCheck />,
                        data: completedDeliveries[0] ? completedDeliveries.length : 0,
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
                    <div className='shadow-sm p-2 min-[360px]:p-3 sm:p-5 rounded-xl sm:rounded-2xl min-w-0 bg-white dark:bg-[#071A1D]' key={index}>
                        <div className='flex justify-between items-start gap-1.5 min-[360px]:gap-3'>
                            <h1 className='text-xs min-[360px]:text-sm min-[570px]:text-xl min-[990px]:text-lg min-[1050px]:text-xl xl:text-lg min-[1340px]:text-xl font-semibold capitalize '>{data.title}</h1>
                            <span className='bg-[#caeb66]/40 text-[#526d01] h-7 min-[360px]:h-8 sm:h-10 w-7 min-[360px]:w-8 sm:w-10 rounded sm:rounded-xl flex items-center justify-center shrink-0 [&>svg]:size-4 min-[360px]:[&>svg]:size-5 sm:[&>svg]:size-6'>{data.icon}</span>
                        </div>
                        <h1 className='text-lg min-[360px]:text-xl sm:text-2xl font-bold mt-2 min-[360px]:mt-3 '>{data.data}</h1>
                        <p className='first-letter:uppercase text-[11px] min-[360px]:text-xs sm:text-sm mt-2 min-[360px]:mt-3 sm:mt-5 '>{data.description}</p>
                    </div>
                )}
            </div>
            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 dark:from-[#08262B] dark:to-[#0D1F22] dark:border dark:border-white/10 overflow-hidden'>
                <div className='p-5 border border-[#caeb66]/40 dark:border-cyan-400/10 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <h1 className='text-2xl font-bold '>Completed Deliveries</h1>
                    <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>Review every parcel you have already delivered and inspect its route details anytime.</p>
                </div>
                <table className={`hidden min-[720px]:table table-lg table-zebra bg-white dark:bg-[#071A1D] font-medium`}>
                    <thead className='bg-[#caeb66]'>
                        <tr className='text-black dark:text-[#F5F7F2] *:px-2'>
                            <th className='text-center' style={{ paddingLeft: "20px" }}>No.</th>
                            <th>Name</th>
                            <th className='hidden min-[860px]:table-cell'>Type</th>
                            <th>Receiver</th>
                            <th>Destination</th>
                            <th>Delivered On</th>
                            <th>Cost</th>
                            <th style={{ paddingRight: "20px" }}>Earning</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            completedDeliveries?.map((data, index) =>
                                <tr key={index} onClick={() => navigate(`/dashboard/parcel-details/${data._id}`)} className='cursor-pointer *:px-2'>
                                    <th className='text-center' style={{ paddingLeft: "20px" }}>{data ? index + 1 : <Skeleton></Skeleton>}</th>
                                    <td className=' truncate max-w-[150px]'>{data?.parcelName || <Skeleton></Skeleton>}</td>
                                    <td className='uppercase hidden min-[860px]:table-cell'>{data?.type || <Skeleton></Skeleton>}</td>
                                    <td className=' truncate max-w-[150px]'>{data?.receiverName || <Skeleton></Skeleton>}</td>
                                    <td>{data?.receiverDistrict || <Skeleton></Skeleton>}</td>
                                    <td>{data?.statusHistory ? format(new Date(data.statusHistory.find(item => item.status === "delivered")?.time), "dd MMM, yyyy") : <Skeleton></Skeleton>}</td>
                                    <td>{data?.cost ? `${data.cost}৳` : <Skeleton></Skeleton>}</td>
                                    <td style={{ paddingRight: "20px" }} className='text-green-600 '>{data?.cost ? `${(Number(data.cost) / 100 * 80).toFixed(2)}৳` : <Skeleton></Skeleton>}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>

            </div>
            {/* mobile table */}
            <div className='min-[850px]:hidden'>
                {
                    completedDeliveries?.map((data, index) =>
                        <div
                            className='flex gap-3 border-b border-b-gray-200 py-5 cursor-pointer'
                            key={index}
                            onClick={() => data && navigate(`/dashboard/parcel-details/${data._id}`)}
                        >
                            <div className={`h-10 w-10 rounded-full ${data && "border"} border-gray-200 dark:border-white/10 bg-[#CAEB66]/25 text-[#526d01] flex items-center justify-center shrink-0`}>
                                {data ? <PackageCheck size={20} /> : <Skeleton width={40} height={40} circle={true} />}
                            </div>

                            <div className='space-y-1 flex-1 min-w-0'>
                                <div className='flex justify-between gap-3'>
                                    <h1 className='font-semibold  truncate'>
                                        {data?.parcelName || <Skeleton width={90} />}
                                    </h1>
                                    <h2 className='font-semibold text-sm text-right shrink-0'>
                                        {data ? `#${index + 1}` : <Skeleton width={32} />}
                                    </h2>
                                </div>

                                <div className='flex justify-between gap-3'>
                                    <h2 className='text-xs uppercase'>
                                        {data?.type || <Skeleton width={50} />}
                                    </h2>
                                    <h3 className='text-sm text-right'>
                                        {data ? format(new Date(data.statusHistory.find(item => item.status === "delivered")?.time), "dd MMM, yyyy") : <Skeleton width={90} />}
                                    </h3>
                                </div>

                                <div className='flex justify-between gap-3'>
                                    <h3 className='text-sm truncate'>
                                        {data ? `${data.receiverName || "..."} - ${data.receiverDistrict || "..."}` : <Skeleton width={180} />}
                                    </h3>
                                    <h2 className='font-semibold text-green-600 text-right shrink-0'>
                                        {data?.cost ? `${(Number(data.cost) / 100 * 80).toFixed(2)}৳` : <Skeleton width={80} />}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            {completedDeliveries.length === 0 && <NoDataFound data={"Deliveries"}></NoDataFound>}

        </div>
    );
};

export default CompletedDeliveries

