import React from 'react';
import { Link } from 'react-router';
import { AlertTriangle, ArrowRight, BadgeCheck, Boxes, CircleDollarSign, ClipboardList, PackageCheck, Route, UserCheck, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const AdminHome = () => {
    const axiosSecure = useAxiosSecure()
    const { data, isLoading } = useQuery({
        queryKey: ['admin-home-data'],
        queryFn: async () => {
            const result = await axiosSecure.get("/admin/dashboard")
            console.log(result)
            return result.data
        }
    })
    console.log(data)
    if (!data) {
        return <div className='flex items-center justify-center min-h-[calc(100vh-104px)]'><span className="loading loading-bars loading-xl"></span></div>
    }
    console.log(data)
    const revenueConverter = (num) => {
        let temp
        if (num < 1000) return num
        else if (num > 1000) {
            temp = num / 1000
        }
        return `${temp.toFixed(2)}k`
    }
    const stats = [
        { title: "Paid parcels", value: data.paidParcelCount, note: "Total payments", icon: <Boxes />, color: "text-[#03373D] dark:text-cyan-400" },
        { title: "Active riders", value: data.activeRiderCount, note: "Across all warehouses", icon: <UserCheck />, color: "text-[#03373D] dark:text-cyan-400" },
        { title: "Pending riders", value: data.pendingRiderCount, note: "Need review", icon: <UserPlus />, color: "text-amber-600" },
        { title: "Revenue", value: revenueConverter(data.totalRevenue), note: "This month", icon: <CircleDollarSign />, color: "text-green-700" },
    ]

    const operations = [
        { label: "Unassigned parcels", value: data.unassignedParcelsCount, tone: "text-red-600 bg-red-50", link: "/dashboard/assign-rider" },
        { label: "Inactive riders", value: data.inactiveRiderCount, tone: "text-amber-600 bg-amber-50", link: "/dashboard/inactive-riders" },
        { label: "Pending riders", value: data.pendingRiderCount, tone: "text-gray-600 dark:text-[#AAB8B4] bg-gray-100 dark:bg-white/10", link: "/dashboard/pending-riders" },
    ]
    const rearrangeLoad = data.deliveryLoad.sort((a, b) => (b.parcel / b.rider) - (a.parcel / a.rider))
    const standerRiderCapacity = 10
    const loadStatus = (rider, parcel) => {
        if (parcel / rider >= (standerRiderCapacity / 3) * 2) {
            return 'High'
        }
        else if (parcel / rider >= (standerRiderCapacity / 3)) {
            return 'Stable'
        }
        else {
            return 'Low'
        }
    }

    // const hubStatus = [
    //     { hub: "Dhaka Central", load: "High", parcels: 58, riders: 14 },
    //     { hub: "Chattogram Port", load: "Stable", parcels: 34, riders: 9 },
    //     { hub: "Sylhet North", load: "Stable", parcels: 21, riders: 6 },
    //     { hub: "Khulna South", load: "Low", parcels: 12, riders: 4 },
    // ]
    // text-[#03373D]  
    return (
        <div className='space-y-6'>
            <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 '>
                <div>
                    <p className='text-sm font-semibold uppercase tracking-wide text-[#526d01] dark:text-cyan-400'>Admin dashboard</p>
                    <h1 className='text-3xl sm:text-4xl font-bold text-[#03373D] dark:text-white/90 mt-1'>Operations overview</h1>
                    <p className='text-gray-500 dark:text-[#AAB8B4] mt-2 max-w-2xl'>Monitor rider capacity, parcel assignment, and warehouse flow with fake operational data.</p>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <Link to='/dashboard/assign-rider' className='btn bg-white dark:bg-[#071A1D] border-gray-200 dark:border-white/10 rounded-lg font-semibold text-[#03373D] dark:text-[#F5F7F2] hover:border-cyan-400 hover:bg-cyan-400/10 dark:hover:text-cyan-400'><Route size={18} />Assign Rider</Link>
                    <Link to='/dashboard/pending-riders' className='btn bg-white dark:bg-[#071A1D] border-gray-200 dark:border-white/10 rounded-lg font-semibold text-[#03373D] dark:text-[#F5F7F2] hover:border-cyan-400 hover:bg-cyan-400/10 dark:hover:text-cyan-400'><ClipboardList size={18} />Review Riders</Link>
                </div>
            </div>

            <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5'>
                {stats.map((item, index) =>
                    <div className='bg-white dark:bg-[#071A1D] shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 dark:border-white/10 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 dark:hover:border-cyan-400/50' key={index}>
                        <div className='flex items-start justify-between gap-3'>
                            <h2 className='font-semibold text-sm sm:text-lg capitalize text-[#03373D] dark:text-white/90'>{item.title}</h2>
                            <span className='bg-[#caeb66]/40 dark:bg-cyan-400/15 text-[#526d01] dark:text-cyan-400 h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 [&>svg]:size-5'>{item.icon}</span>
                        </div>
                        <h3 className={`text-2xl sm:text-3xl font-bold mt-4 ${item.color} `}>{item.value}</h3>
                        <p className='text-xs sm:text-sm text-gray-500 dark:text-[#AAB8B4] mt-2'>{item.note}</p>
                    </div>
                )}
            </div>

            <div className='grid xl:grid-cols-[0.85fr_1.15fr] gap-5'>
                <div className='bg-[#03373D] text-white rounded-2xl p-5 sm:p-6 shadow-sm'>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <h2 className='text-2xl font-bold'>Needs Attention</h2>
                            <p className='text-white/70 text-sm mt-1'>Highest priority queues.</p>
                        </div>
                        <AlertTriangle className='text-[#CAEB66]' />
                    </div>
                    <div className='mt-5 space-y-3'>
                        {operations.map((item) =>
                            <Link to={item.link} className='flex items-center justify-between gap-3 bg-white/10 dark:bg-[#071A1D]/40 hover:bg-cyan-400/15 dark:hover:bg-cyan-400/10 rounded-xl p-4 transition-colors' key={item.label}>
                                <span className='font-semibold'>{item.label}</span>
                                <span className={`font-bold rounded-full h-8 w-[42px] flex items-center justify-center ${item.tone}`}>{item.value}</span>
                            </Link>
                        )}
                    </div>
                    <Link to='/dashboard/assign-rider' className='btn mt-6 w-full rounded-lg bg-[#CAEB66] hover:bg-[#bfe85a] border-none text-[#03373D] font-bold'>Resolve Queue <ArrowRight size={18} /></Link>
                </div>

                <div className='bg-white dark:bg-[#071A1D] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden'>
                    <div className='p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-4'>
                        <div>
                            <h2 className='text-2xl font-bold text-[#03373D] dark:text-white/90'>Delivery Load</h2>
                            <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>Standard rider capacity: {standerRiderCapacity} deliveries.</p>
                        </div>
                        <PackageCheck className='text-[#526d01] dark:text-cyan-400' />
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='table bg-white dark:bg-[#071A1D]'>
                            <thead className='bg-[#CAEB66] text-black '>
                                <tr>
                                    <th>District</th>
                                    <th>Load</th>
                                    <th className='text-center'>Parcels</th>
                                    <th className='text-center'>Riders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rearrangeLoad.map((load, index) =>
                                    <tr key={index}>
                                        <td className='font-semibold'>{load.district}</td>
                                        <td><span className={`text-xs font-bold rounded-full px-2 py-1 ${loadStatus(load.rider, load.parcel) === "High" ? "bg-red-50 text-red-600" : loadStatus(load.rider, load.parcel) === "Low" ? "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-[#AAB8B4]" : "bg-green-50 text-green-600"}`}>{loadStatus(load.rider, load.parcel)}</span></td>
                                        <td className='text-center font-semibold'>{load.parcel}</td>
                                        <td className='text-center font-semibold'>{load.rider}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className='grid md:grid-cols-3 gap-5'>
                {[
                    { title: "Rider approval", text: "12 applications are waiting for admin review.", icon: <BadgeCheck />, link: "/dashboard/pending-riders" },
                    { title: "Make admin", text: "Promote trusted team members when needed.", icon: <UserPlus />, link: "/dashboard/make-admin" },
                    { title: "Parcel tracking", text: "Inspect live shipment status by tracking ID.", icon: <Route />, link: "/dashboard/track-your-parcel" },
                ].map((item) =>
                    <Link to={item.link} className='bg-white dark:bg-[#071A1D] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/10 hover:border-cyan-400 hover:bg-cyan-400/10 transition-colors' key={item.title}>
                        <span className='bg-[#CAEB66]/35 dark:bg-cyan-400/15 text-[#526d01] dark:text-cyan-400 h-10 w-10 rounded-xl flex items-center justify-center [&>svg]:size-5'>{item.icon}</span>
                        <h3 className='font-bold text-xl mt-4 text-[#03373D] dark:text-white/90'>{item.title}</h3>
                        <p className='text-gray-500 dark:text-[#AAB8B4] text-sm mt-2'>{item.text}</p>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default AdminHome;

