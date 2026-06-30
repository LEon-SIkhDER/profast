import { format } from 'date-fns';
import { BadgeCheck, Box, CircleDot, MapPin, Truck } from 'lucide-react';
import React from 'react';
const statusDetails = {
    'not-collected': {
        label: 'Order Placed',
        description: 'We have received your parcel booking and are waiting for pickup.',
        icon: <Box></Box>
    },
    'rider-assigned': {
        label: 'Rider Assigned',
        description: 'A rider has been assigned for pickup or delivery handling.',
        icon: <CircleDot></CircleDot>
    },
    'in-transit': {
        label: 'In Transit',
        description: 'Your parcel is currently on the way to its destination.',
        icon: <Truck></Truck>
    },
    'delivered': {
        label: 'Delivered',
        description: 'The parcel has been delivered successfully.',
        icon: <BadgeCheck></BadgeCheck>
    }
}


const TrackingResult = ({ parcel }) => {
    const statusOrder = ["not-collected", "rider-assigned", "in-transit", 'delivered']
    const currentIndex = statusOrder.indexOf(parcel.parcel_status)

    console.log(parcel.statusHistory)
    console.log(currentIndex)





    return (
        <div className='space-y-5'>
            <div className='grid gap-5 xl:grid-cols-[1.2fr_.8fr] '>


                <div className=' px-3 py-4 xs:p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#071A1D] dark:border dark:border-white/10 dark:text-[#F5F7F2]'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h1 className='text-sm font-semibold   text-[#90af34] dark:text-cyan-400 tracking-widest'>TRACKING RESULT</h1>
                            <h2 className='mt-2 text-2xl sm:text-3xl font-bold '>{parcel.parcelName || "Unnamed Parcel"}</h2>
                        </div>
                        <h1 className='bg-[#CAEB66]/50 dark:bg-cyan-400/10 text-xs sm:text-sm font-bold text-[#4e6801] dark:text-cyan-400 px-4 py-2 rounded-full uppercase'>{parcel.parcel_status === "not-collected" ? "Order Placed" : parcel.parcel_status}</h1>
                    </div>
                    <p className='text-gray-500 dark:text-[#AAB8B4] text-base xxs:text-xs    '>Parcel Id: {parcel.parcelId}</p>
                    <div className='grid 2xl:grid-cols-4 grid-cols-2 gap-3 sm:gap-5 mt-5'>
                        {
                            [
                                { label: "Type", value: parcel.type.toUpperCase() },
                                { label: "Payment", value: parcel.paymentStatus ? "Paid" : "Due" },
                                { label: "Cost", value: `${parcel.cost} tk` },
                                { label: 'Created At', value: <> <span>{format(new Date(parcel.statusHistory.find(data => data.status === "not-collected").time), "dd MMM, yyyy")}</span> <br /><span>{format(new Date(parcel.statusHistory.find(data => data.status === "not-collected").time), " hh:mm a")}</span></> }
                            ].map((data, index) =>
                                <div className='bg-[#eef3e4] dark:bg-cyan-400/5 dark:border dark:border-cyan-400/15 p-4 sm:p-5 rounded-xl sm:rounded-2xl' key={index}>
                                    <h1 className='uppercase text-xs font-semibold text-gray-500 dark:text-[#AAB8B4] tracking-wider '>{data.label}</h1>
                                    <h2 className='mt-2 text-sm xxs:text-base sm:text-lg font-bold'>{data.value}</h2>
                                </div>
                            )
                        }
                    </div>
                    <div className='mt-8 grid grid-cols-2 gap-3 sm:gap-5'>
                        <div className='p-3 sm:p-5 rounded-2xl border border-[#edf3dc] dark:border-white/10'>
                            <div className='flex items-center xs:gap-1 sm:gap-2 text-[#526d02] dark:text-cyan-400 '>
                                <MapPin size={18} />
                                <h3 className=' text-lg font-bold'>Pickup</h3>
                            </div>
                            <p className=' mt-3 text-base font-semibold'>
                                {parcel.senderDistrict}
                            </p>
                            <p className='mt-1 text-sm text-gray-500 dark:text-[#AAB8B4]'>
                                {parcel.senderWarehouse}
                            </p>
                        </div>
                        <div className='p-3 sm:p-5 rounded-2xl border border-[#edf3dc] dark:border-white/10'>
                            <div className='flex items-center xs:gap-1 sm:gap-2 text-[#526d02] dark:text-cyan-400 '>
                                <MapPin size={18} />
                                <h3 className=' text-lg font-bold'>Destination</h3>
                            </div>
                            <p className=' mt-3 text-base font-semibold'>
                                {parcel.receiverDistrict}
                            </p>
                            <p className='mt-1 text-sm text-gray-500 dark:text-[#AAB8B4]'>
                                {parcel.receiverWarehouse}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='hidden min-[390px]:block p-5 sm:p-8 rounded-2xl bg-[#17310f] dark:bg-[#071A1D] dark:border dark:border-cyan-400/20'>
                    <h1 className='text-sm font-semibold tracking-widest text-[#CAEB66] dark:text-cyan-400'>PROGRESS ROUTE</h1>
                    <h2 className='mt-2 text-2xl text-white font-bold'>Shipment progress</h2>
                    <div className='mt-8 flex justify-between items-center'>
                        {
                            statusOrder.map((data, index) =>
                                <React.Fragment key={index}>
                                    <div className='text-center'>
                                        <h1
                                            className={`
                                        ${currentIndex >= index ? "bg-[#CAEB66] dark:bg-cyan-400 dark:text-[#031518]" : "bg-white/5 border-white/20 text-white/60 dark:bg-cyan-400/5 dark:border-cyan-400/20 dark:text-[#AAB8B4]"}
                                        border rounded-full   h-10 w-10 inline-block leading-10 text-center font-bold`}>{index + 1}</h1>
                                        <p className={`${currentIndex >= index ? "text-white dark:text-cyan-400" : "text-white/60 dark:text-[#AAB8B4]"} text-xs mt-2 w-20 capitalize`}>{data === "not-collected" ? "order-placed" : data}</p>
                                    </div>
                                    {statusOrder.length - 1 !== index &&
                                        <div className={`${currentIndex - 1 >= index ? "bg-[#CAEB66] dark:bg-cyan-400 " : "bg-white/10 dark:bg-cyan-400/10"}  flex-1 h-1 rounded-full`}></div>
                                    }
                                </React.Fragment>
                            )
                        }
                    </div>
                    <div className='p-5 mt-10 bg-white/5 dark:bg-cyan-400/5 dark:border dark:border-cyan-400/15 rounded-2xl'>
                        <h1 className='text-white/60 uppercase text-sm font-semibold tracking-wider'>Current Status</h1>
                        <h2 className='mt-2 text-2xl text-white font-bold'>{statusDetails[parcel.parcel_status].label}</h2>
                        <p className='text-sm text-white/75 dark:text-[#AAB8B4]'>{statusDetails[parcel.parcel_status].description}</p>
                    </div>
                </div>
            </div>
            <div className='p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#071A1D] dark:border dark:border-white/10 dark:text-[#F5F7F2]'>
                <h1 className='text-sm font-semibold text-[#90af34] dark:text-cyan-400 tracking-widest'>STATUS TIMELINE</h1>
                <h2 className='text-2xl font-bold mt-2'>Delivery journey</h2>
                <div className='space-y-5 mt-5'>
                    {
                        parcel.statusHistory.map((data, index) =>
                            <div className='flex gap-5' key={index}>
                                <div className='flex flex-col items-center gap-1'>
                                    <span className='bg-[#CAEB66]/50 dark:bg-cyan-400/10 text-[#5e7500] dark:text-cyan-400 flex items-center justify-center h-12 w-12  rounded-full '>{statusDetails[data.status].icon}</span>
                                    {parcel.statusHistory.length !== index + 1 && <div className='bg-[#CAEB66] dark:bg-cyan-400 flex-1  w-px rounded-full '></div>}
                                </div>
                                <div className='flex-1 border border-[#edf0de] dark:border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5'>
                                    <div className='flex flex-col sm:flex-row justify-between'>
                                        <div>
                                            <h1 className='capitalize font-bold  text-[#445a00] dark:text-cyan-400'>{statusDetails[data.status].label}</h1>
                                            <p className='mt-1 text-sm text-gray-500 dark:text-[#AAB8B4] ml-1'>{statusDetails[data.status].description}</p>
                                        </div>
                                        <h2 className='font-semibold text-sm text-[#516b03] dark:text-cyan-400'>{format(data.time, "PPpp")}</h2>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>


            </div>
        </div>
    );
};

export default TrackingResult;
