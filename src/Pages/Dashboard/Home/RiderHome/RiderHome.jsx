import React, { useContext } from 'react';
import { Link } from 'react-router';
import { Bike, CheckCircle2, Clock, Clock3, Inbox, MapPin, Navigation, PackageCheck, Route, ShieldCheck, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../../Context/AuthContext';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';

const RiderHome = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()


    const { data: deliveries } = useQuery({
        queryKey: ["pendingDeliveries"],
        queryFn: async () => {
            const result = await axiosSecure.get(`/parcels?riderEmail=${user.email}`)
            console.log(result.data)
            return result.data
        },
    })
    if (!deliveries) {
        return <div className='flex items-center justify-center min-h-[calc(100vh-104px)]'><span className="loading loading-bars loading-xl"></span></div>
    }
    const pendingDeliveries = deliveries.filter(delivery => delivery.parcel_status === 'in-transit' || delivery.parcel_status === 'rider-assigned')
    const completeDeliveries = deliveries.filter(delivery => delivery.parcel_status === 'delivered')
    console.log(pendingDeliveries)
    console.log(completeDeliveries)
    const totalEarning = () => {
        if (!completeDeliveries[0]) return 0
        let earning = 0
        completeDeliveries.forEach(value => {
            earning += Number(value?.cost) / 100 * 80
        });


        return `${earning}Tk `
    }
    const getDestinations = () => {

        const inTransit = pendingDeliveries.filter(delivery => delivery.parcel_status === 'in-transit')
        console.log(inTransit)
        let riderAssigned = []
        if (inTransit.length < 3) {
            for (let delivery of pendingDeliveries) {
                if (delivery.parcel_status === 'rider-assigned') {
                    if (3 - inTransit.length === riderAssigned.length) break
                    console.log(riderAssigned.length)
                    riderAssigned.push(delivery)
                }
            }
        }
        return [...inTransit, ...riderAssigned]

    }
    const assignedToday = (pendingDeliveries.filter((delivery) => {
        const assignTime = delivery.statusHistory.find(status => status.status === "rider-assigned").time
        console.log(assignTime)
        console.log(new Date().toLocaleDateString())
        console.log(new Date(assignTime).toLocaleDateString())
        return new Date().toLocaleDateString() === new Date(assignTime).toLocaleDateString()
    })).length




    // console.log(getDestinations())
    const cards = [
        { title: "Assigned today", value: assignedToday, note: "Waiting for acceptance", icon: <Bike />, color: 'text-cyan-600' },
        { title: "Pending Deliveries", value: pendingDeliveries?.length, note: "Have to deliver today", icon: <Clock />, color: 'text-yellow-500' },
        { title: "Completed", value: completeDeliveries.length, note: "Successfully delivered", icon: <PackageCheck />, color: 'text-blue-900' },
        { title: "Total earning", value: totalEarning(), note: "Estimated Earning", icon: <Wallet />, color: 'text-green-700' },
    ]

    const destination = getDestinations().map((data) => {
        // time
        const timeString = data.statusHistory.find(status => status.status === data.parcel_status).time
        const splitArray = format(timeString, "p").split(":")
        let hour
        if (splitArray[0].length === 2) {
            hour = splitArray[0]
        }
        else {
            hour = `0${splitArray[0]}`
        }
        const time = `${hour}:${splitArray[1]}`
        // place action
        let place
        let action
        if (data.parcel_status === "rider-assigned") {
            place = data.senderWarehouse
            action = "Pickup"
        }
        else if (data.parcel_status === "in-transit") {
            place = data.receiverWarehouse
            action = "Drop-off"
        }



        return {
            time,
            parcel: data.parcelName,
            place,
            action
        }
    })

    // const requests = [
    //     { parcel: "Office documents", from: "Tejgaon Hub", to: "Motijheel", weight: "1.2 kg" },
    //     { parcel: "Medicine pack", from: "Dhanmondi", to: "Bashundhara", weight: "0.6 kg" },
    // ]
    console.log(pendingDeliveries)
    return (
        <div className='space-y-6'>
            <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5'>
                <div>
                    <p className='text-sm font-semibold uppercase tracking-wide text-[#526d01]'>{deliveries ? "Rider dashboard" : <Skeleton></Skeleton>}</p>
                    <h1 className='text-3xl sm:text-4xl font-bold text-[#03373D] mt-1'>{deliveries ? "Delivery command center" : <Skeleton></Skeleton>}</h1>
                    <p className='text-gray-500 dark:text-[#AAB8B4] mt-2 max-w-2xl'>See assigned deliveries, upcoming stops, and earning progress before you hit the road.</p>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <Link to='/dashboard/pending-deliveries' className='btn bg-white dark:bg-[#071A1D] border-gray-200 dark:border-white/10 rounded-lg font-semibold'><Clock3 size={18} />Pending</Link>
                    <Link to='/dashboard/completed-deliveries' className='btn bg-white dark:bg-[#071A1D] border-gray-200 dark:border-white/10 rounded-lg font-semibold'><CheckCircle2 size={18} />Completed</Link>
                </div>
            </div>

            <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5'>
                {cards.map((card, index) =>
                    <div className='bg-white dark:bg-[#071A1D] shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 dark:border-white/10 ' key={index}>
                        <div className='flex items-start justify-between gap-3'>
                            <h2 className='font-semibold text-sm sm:text-lg capitalize'>{card.title}</h2>
                            <span className='bg-[#caeb66]/40 text-[#526d01] h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 [&>svg]:size-5'>{card.icon}</span>
                        </div>
                        <h3 className={`text-2xl sm:text-3xl font-bold mt-4 text-[#03373D] ${card.color}`}>{card.value}</h3>
                        <p className='text-xs sm:text-sm text-gray-500 dark:text-[#AAB8B4] mt-2'>{card.note}</p>
                    </div>
                )}
            </div>

            <div className='grid xl:grid-cols-[1fr_1fr] gap-5'>
                <div className='bg-white dark:bg-[#071A1D] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden min-h-[376px]'>
                    <div className='p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-4'>
                        <div>
                            <h2 className='text-2xl font-bold text-[#03373D]'>Today Route</h2>
                            <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>Planned stops and scan checkpoints.</p>
                        </div>
                        <Navigation className='text-[#526d01]' />
                    </div>
                    <div className='p-5 space-y-4'>
                        {
                            pendingDeliveries.length === 0 ?
                                <div className="flex flex-col items-center justify-center text-center py-12 px-6">
                                    <Navigation size={40} className="text-gray-300" />
                                    <h3 className="mt-3 text-lg font-semibold text-[#03373D]">
                                        No Route Assigned
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-[#AAB8B4] max-w-xs">
                                        Your delivery route for today has not been assigned yet.
                                    </p>
                                </div>
                                :
                                destination.map((stop, index) =>
                                    <div className='flex gap-4' key={stop.parcel}>
                                        <div className='flex flex-col items-center'>
                                            <span className='h-9 w-9 rounded-full bg-[#CAEB66]/40 text-[#526d01] flex items-center justify-center font-bold'>#</span>
                                            {index !== destination.length - 1 && <span className='w-px flex-1 bg-gray-200 mt-2'></span>}
                                        </div>
                                        <div className='pb-3 flex-1'>
                                            <div className='flex flex-wrap justify-between gap-2'>
                                                <h3 className='font-bold text-lg'>{stop.place}</h3>
                                                <span className='text-sm font-semibold text-[#03373D]'>{stop.time}</span>
                                            </div>
                                            <p className='text-sm text-gray-500 dark:text-[#AAB8B4]'>{stop.action} for {stop.parcel}</p>
                                        </div>
                                    </div>
                                )
                        }
                    </div>
                </div>

                <div className='flex flex-col bg-[#03373D] text-white rounded-2xl p-5 sm:p-6 shadow-sm min-h-[376px]'>
                    <div className='flex  items-center justify-between gap-4'>
                        <div>
                            <h2 className='text-2xl font-bold'>New Requests</h2>
                            <p className='text-white/70 text-sm mt-1'>Delivery queue preview.</p>
                        </div>
                        <Route className='text-[#CAEB66]' />
                    </div>
                    <div className='mt-5 space-y-3'>

                        {
                            pendingDeliveries.length === 0 ?
                                < div className="bg-white dark:bg-[#071A1D]/8 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[180px]">
                                    <Inbox size={40} className="text-[#CAEB66]" />
                                    <h3 className="mt-3 text-lg font-semibold">
                                        No New Requests Yet
                                    </h3>
                                    <p className="mt-1 text-sm text-white/70 max-w-xs">
                                        New delivery requests will appear here when they are assigned.
                                    </p>
                                </div>
                                :

                                pendingDeliveries.slice(0, 2).map((request, index) =>
                                    <div className='bg-white dark:bg-[#071A1D]/8 rounded-xl p-4' key={index}>
                                        <div className='flex justify-between gap-3'>
                                            <h3 className='font-bold'>{request.parcelName}</h3>
                                            <span className='text-[#CAEB66] font-semibold uppercase'>{request.type}</span>
                                        </div>
                                        <div className='flex items-start gap-2 text-sm text-white/70 mt-3'>
                                            <MapPin size={16} className='mt-0.5 shrink-0' />
                                            <span>{request.senderWarehouse} to {request.receiverWarehouse}</span>
                                        </div>
                                    </div>
                                )
                        }
                    </div>
                    <div className='flex-1'></div>
                    <Link to='/dashboard/pending-deliveries' className='btn mt-6 w-full rounded-lg bg-[#CAEB66] hover:bg-[#bfe85a] border-none text-[#03373D] font-bold'>Open Pending Deliveries</Link>
                </div>
            </div>
        </div >
    );
};

export default RiderHome;

