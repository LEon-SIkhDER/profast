import React, { useContext } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Clock3, CreditCard, MapPin, PackageCheck, PackagePlus, PackageSearch, Truck } from 'lucide-react';
import { AuthContext } from '../../../../Context/AuthContext';

const UserHome = () => {
    const { user } = useContext(AuthContext)

    const stats = [
        { title: "Active parcels", value: "08", note: "3 moving today", icon: <Truck /> },
        { title: "Payment due", value: "2", note: "Tk 540 pending", icon: <CreditCard /> },
        { title: "Delivered", value: "26", note: "This year", icon: <PackageCheck /> },
        { title: "Saved routes", value: "05", note: "Mostly Dhaka bound", icon: <MapPin /> },
    ]

    const recentParcels = [
        { id: "ZS-45821", name: "Office documents", route: "Dhaka to Chattogram", status: "In transit", eta: "Today, 8:30 PM" },
        { id: "ZS-45809", name: "Gift package", route: "Sylhet to Dhaka", status: "At warehouse", eta: "Tomorrow, 11:00 AM" },
        { id: "ZS-45796", name: "Electronics box", route: "Khulna to Rajshahi", status: "Payment due", eta: "Waiting" },
    ]

    return (
        <div className='space-y-6'>
            <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5'>
                <div>
                    <p className='text-sm font-semibold uppercase tracking-wide text-[#526d01] dark:text-cyan-400'>Customer dashboard</p>
                    <h1 className='text-3xl sm:text-4xl font-bold text-[#03373D] dark:text-white/90 mt-1'>Welcome back, {user?.displayName || "User"}</h1>
                    <p className='text-gray-500 dark:text-[#AAB8B4] mt-2 max-w-2xl'>Track shipments, clear payments, and start a new delivery from one focused place.</p>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <Link to='/send-parcel' className='btn btn-custom rounded-lg font-semibold'><PackagePlus size={18} />Send Parcel</Link>
                    <Link to='/dashboard/track-your-parcel' className='btn bg-white dark:bg-[#071A1D] border-gray-200 dark:border-white/10 rounded-lg font-semibold text-[#03373D] dark:text-[#F5F7F2] hover:border-cyan-400 hover:bg-cyan-400/10 dark:hover:text-cyan-400'><PackageSearch size={18} />Track</Link>
                </div>
            </div>

            <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5'>
                {stats.map((item, index) =>
                    <div className='bg-white dark:bg-[#071A1D] shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 dark:border-white/10 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 dark:hover:border-cyan-400/50' key={index}>
                        <div className='flex items-start justify-between gap-3'>
                            <h2 className='font-semibold text-sm sm:text-lg capitalize text-[#03373D] dark:text-white/90'>{item.title}</h2>
                            <span className='bg-[#caeb66]/40 dark:bg-cyan-400/15 text-[#526d01] dark:text-cyan-400 h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 [&>svg]:size-5'>{item.icon}</span>
                        </div>
                        <h3 className='text-2xl sm:text-3xl font-bold mt-4 text-[#03373D] dark:text-cyan-400'>{item.value}</h3>
                        <p className='text-xs sm:text-sm text-gray-500 dark:text-[#AAB8B4] mt-2'>{item.note}</p>
                    </div>
                )}
            </div>

            <div className='grid xl:grid-cols-[1.4fr_0.8fr] gap-5'>
                <div className='bg-white dark:bg-[#071A1D] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden'>
                    <div className='p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-4'>
                        <div>
                            <h2 className='text-2xl font-bold text-[#03373D] dark:text-white/90'>Recent Parcels</h2>
                            <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>Fake data for now, ready to connect later.</p>
                        </div>
                        <Link to='/dashboard/my-parcels' className='btn btn-sm bg-[#03373D] hover:bg-cyan-700 dark:hover:bg-cyan-400 dark:hover:text-[#031518] text-white rounded-lg border-none'>View All</Link>
                    </div>
                    <div className='divide-y divide-gray-100'>
                        {recentParcels.map((parcel) =>
                            <div className='p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3' key={parcel.id}>
                                <div className='min-w-0'>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <h3 className='font-bold text-lg truncate'>{parcel.name}</h3>
                                        <span className='text-xs font-semibold bg-[#CAEB66]/35 text-[#526d01] rounded-full px-2 py-1'>{parcel.id}</span>
                                    </div>
                                    <p className='text-gray-500 dark:text-[#AAB8B4] text-sm mt-1'>{parcel.route}</p>
                                </div>
                                <div className='md:text-right'>
                                    <p className='font-semibold text-[#03373D] dark:text-cyan-400'>{parcel.status}</p>
                                    <p className='text-sm text-gray-500 dark:text-[#AAB8B4]'>{parcel.eta}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='bg-[#03373D] text-white rounded-2xl p-5 sm:p-6 shadow-sm'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#CAEB66] text-[#03373D]'>
                        <Clock3 />
                    </div>
                    <h2 className='text-2xl font-bold mt-5'>Next pickup window</h2>
                    <p className='text-white/70 mt-2'>A rider is scheduled for your Mirpur pickup between 4:00 PM and 6:00 PM.</p>
                    <div className='mt-6 space-y-3'>
                        <div className='flex justify-between gap-3 border-b border-white/10 pb-3'><span className='text-white/60'>Parcel</span><span className='font-semibold text-right'>Office documents</span></div>
                        <div className='flex justify-between gap-3 border-b border-white/10 pb-3'><span className='text-white/60'>Rider</span><span className='font-semibold text-right'>Tanvir Hasan</span></div>
                        <div className='flex justify-between gap-3'><span className='text-white/60'>Contact</span><span className='font-semibold text-right'>01700-000000</span></div>
                    </div>
                    <Link to='/dashboard/track-your-parcel' className='btn mt-6 w-full rounded-lg bg-[#CAEB66] hover:bg-[#bfe85a] border-none text-[#03373D] font-bold'>Open Tracking <ArrowRight size={18} /></Link>
                </div>
            </div>
        </div>
    );
};

export default UserHome;

