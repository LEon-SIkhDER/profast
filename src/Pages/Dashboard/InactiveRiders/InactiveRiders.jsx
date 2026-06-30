import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useRef, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import { Check, ChevronLeft, ChevronRight, Search, UserRound, X } from 'lucide-react';
import Swal from 'sweetalert2';
// import axios from 'axios';
import NoDataFound from '../../../Components/NoDataFound';
import { AuthContext } from '../../../Context/AuthContext';
// import { isNumericalString } from 'framer-motion';

const InactiveRiders = () => {
    const axiosSecure = useAxiosSecure()
    const { theme } = useContext(AuthContext)
    const isDark = theme === "dark" ? true : false

    // pagination
    const [totalDataCountLS, setTotalDataCountLS] = useState(() => {
        const result = localStorage.getItem("totalInactiveRidersCount")
        if (result) return result
        return 0
    })
    const handleTotalDataCountLS = (num) => {
        localStorage.setItem('totalInactiveRidersCount', num)
        setTotalDataCountLS(num)
    }
    useEffect(() => {
        return () => localStorage.removeItem("totalInactiveRidersCount")
    }, [])


    const [pageState, setPageState] = useState(1)
    const handlePageState = (num) => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setPageState(num)
    }
    const limit = 20

    const [search, setSearch] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)

    const { data: inactiveRiders, isLoading, refetch } = useQuery({
        queryKey: ['inactiveRiders', search, pageState],
        queryFn: async () => {
            const result = await axiosSecure.get(`/riders?status=inactive&search=${search}&limit=${limit}&skip=${(pageState - 1) * limit}`)
            if (!search) {
                handleTotalDataCountLS(result.data.totalDataCount)
            }
            setSearchLoading(false)
            // setDefaultLength(result.data.length)
            return result.data
        },
        placeholderData: { result: [...Array(10)] }
    })
    console.log(inactiveRiders)
    // modal data related code 
    const [modalData, setModalData] = useState()

    // search function.....................
    const timeoutId = useRef()
    const disabledSearch = !inactiveRiders?.[0] && !searchLoading && totalDataCountLS == 0
    const handleSearch = (e) => {
        e.preventDefault()
        if (disabledSearch) return
        clearTimeout(timeoutId.current)

        timeoutId.current = setTimeout(() => {
            setSearch(e.target.search?.value || e.target.value)
        }, 500);
        if (e.target.search?.value) {
            setSearchLoading(true)
        }
    }
    // active function 
    const handleActive = (id) => {
        console.log(id)
        Swal.fire({
            title: "Active this rider?",
            text: "Are you sure you want to activate this rider?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Activate!",
            color: isDark ? "#F8FAFC" : "#111827",
            background: isDark ? "#0F172A" : "#FFFFFF",
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(
                    axiosSecure.patch(`/pending-riders?id=${id}`, { status: "active" })
                        .then(async (result) => {
                            if (result.data.modifiedCount !== 1) {
                                throw new Error('Update Failed')
                            }
                            await refetch()
                            return result
                        })

                    ,
                    {
                        loading: "Activating",
                        success: "Activated",
                        error: (err) => err.message || "Something went wrong"
                    }
                )
            }
        });
    }
    return (
        <div>
            <Toaster />
            <div className="">

                <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 dark:from-[#08262B] dark:to-[#0D1F22] dark:border dark:border-white/10 overflow-hidden'>
                    {/* <div className='p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                        <div>
                            <h1 className='text-2xl font-bold '>Inactive Riders {inactiveRiders[0] && (inactiveRiders.length < 9 ? `(0${inactiveRiders.length})` : `(${inactiveRiders.length})`)}</h1>
                            <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>Review every parcel you have already delivered and inspect its route details anytime.</p>
                        </div>
                    </div> */}
                    <div className='flex flex-wrap sm:flex-nowrap justify-between gap-0 sm:gap-5  items-center p-4 sm:p-5 border border-[#caeb66]/40 dark:border-cyan-400/10 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                        <div className=''>
                            <h1 className='text-2xl font-bold '>Inactive Riders {totalDataCountLS != 0 && totalDataCountLS ? `(${totalDataCountLS})` : ""}</h1>
                            <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>List of riders currently inactive and unavailable for delivery tasks.</p>
                        </div>
                        <form onSubmit={handleSearch} className='flex gap-2 w-full min-[750px]:w-auto mt-3 min-[750px]:mt-0 ' >
                            <label className='input shadow border-none rounded-xl h-12 w-full min-[750px]:w-80  focus-within:outline-green-800 '>
                                <UserRound className='text-gray-500 dark:text-[#AAB8B4]' />
                                <input onChange={handleSearch} type="text" placeholder='Search rider' name='search' required disabled={disabledSearch} />
                            </label>
                            <button className='btn bg-green-800 hover:bg-green-900 text-white rounded-xl h-12  shadow' disabled={disabledSearch}>{(searchLoading && !inactiveRiders.result[0]) ? <span className="loading loading-spinner loading-sm"></span> : <Search size={18} />}<span className='hidden xxs:block'>Search</span></button>
                        </form>
                    </div>
                    <table className={`hidden min-[850px]:table table-lg table-zebra bg-white dark:bg-[#071A1D] font-medium `}>
                        <thead className='bg-[#caeb66]'>
                            <tr className='text-black dark:text-[#F5F7F2] '>
                                <th className='text-center'>No.</th>
                                <th>Name</th>
                                <th>District</th>
                                <th>Warehouse</th>
                                <th>Age</th>
                                <th>Joined At</th>
                                <th className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                inactiveRiders.result?.map((data, index) =>
                                    <tr key={index}>
                                        <th className='text-center'>{data ? (index + 1) + (pageState - 1) * limit : <Skeleton></Skeleton>}</th>
                                        <td
                                            onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}
                                            className='max-w-[150px] truncate cursor-pointer'
                                        >{data?.name || <Skeleton></Skeleton>}</td>
                                        <td>{data?.district || <Skeleton></Skeleton>}</td>
                                        <td>{data?.chosen_warehouse || <Skeleton></Skeleton>}</td>
                                        <td>{data?.age || <Skeleton></Skeleton>}</td>
                                        <td>{data ? format(new Date(data.joinedAt), "dd/MM/yyyy") : <Skeleton></Skeleton>}</td>
                                        <td className='text-center'>
                                            {data ?
                                                <div className='dropdown cursor-pointer'>
                                                    <button disabled={isLoading} tabIndex={0} className=' cursor-pointer  relative ' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                        <BsThreeDotsVertical />
                                                    </button>
                                                    <ul tabIndex={0} className={`menu absolute ${index >= inactiveRiders.result.length - 2 ? "bottom-0" : "top-0"} right-full max-w-dvw max-h-dvh dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
                                                        <li onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}><a>View</a></li>
                                                        {/* <li className='text-green-500'><a>Accept<Check size={16} /></a></li> */}
                                                        <li onClick={() => handleActive(data?._id)} className='text-green-500'><a>Active<Check size={16} /></a></li>
                                                        {/* {data.paymentStatus && <li className='border-t border-gray-200 dark:border-white/10'><Link to={`/dashboard/payment/${data._id}`}>Pay</Link></li>} */}
                                                    </ul>
                                                </div> :
                                                <Skeleton></Skeleton>
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                    {!isLoading && !inactiveRiders.result?.length > 0 && <NoDataFound data={'Riders'}></NoDataFound>}
                </div>
                {/* {loading && <span className='block text-2xl font-bold text-center mt-5'>Loading...</span>} */}
            </div>
            {/* cards for mobile */}

            <div className='grid min-[850px]:hidden gap-5 sm:grid-cols-2 mt-5'>
                {inactiveRiders.result?.map((rider) =>
                    <div className='p-4 shadow rounded-xl'>
                        <div onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(rider))} className='flex justify-between items-start'>
                            <div>
                                <h1 className='text-base font-semibold'>{
                                    rider?.name ||
                                    <Skeleton width={100}></Skeleton>}</h1>
                                <h2 className='text-sm text-gray-500 dark:text-[#AAB8B4]'>{
                                    rider?.email ||
                                    <Skeleton width={150}></Skeleton>}</h2>
                            </div>
                            {rider ?
                                <h1 className={`${rider?.status === "active" ? "bg-green-200 text-green-600" : "bg-red-100 text-red-600"} capitalize inline-block rounded-full text-sm px-2`}>{rider?.status}</h1>
                                :
                                // <div className='rounded-full overflow-hidden h-6  '>
                                <Skeleton width={63} height={20}></Skeleton>
                                // </div>

                            }
                        </div>
                        <div className='my-5 grid grid-cols-2 gap-2'>

                            {
                                [
                                    { label: "Assigned", value: rider?.currentAssignedDeliveries },
                                    { label: "Phone", value: rider?.number },
                                    { label: "Rider", value: rider?.district },
                                    { label: "Warehouse", value: rider?.chosen_warehouse }

                                ].map((data, index) =>
                                    <div key={index}>
                                        <h4 className='text-sm text-gray-500 dark:text-[#AAB8B4]'>{rider ? data.label : <Skeleton width="50%"></Skeleton>}</h4>
                                        <h1 className='font-medium '>{
                                            data.value ??
                                            <Skeleton></Skeleton>}</h1>
                                    </div>
                                )
                            }
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            {
                                rider ?
                                    <>
                                        <button onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(rider))} className='btn bg-[#CAEB66]/20 w-full'>View</button>
                                        <button onClick={() => handleActive(rider?._id)} className='btn bg-green-100 text-green-600 w-full'>Active</button>
                                    </>
                                    :
                                    <>
                                        <Skeleton height={40}></Skeleton>
                                        <Skeleton height={40}></Skeleton>
                                    </>

                            }

                        </div>
                    </div>
                )}
            </div>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box p-0 bg-transparent">
                    {
                        modalData &&
                        <div className="max-w-xl w-full bg-white dark:bg-[#071A1D] rounded-xl shadow-lg overflow-hidden">

                            {/* Header */}
                            <div className="bg-linear-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between dark:from-[#08262B] dark:to-[#0D1F22]">
                                <div>
                                    <h2 className="text-2xl font-bold text-black dark:text-[#F5F7F2]">
                                        Rider Details
                                    </h2>
                                    <p className="text-sm text-black dark:text-[#F5F7F2]/70">
                                        {modalData.name}
                                    </p>
                                </div>

                                <div className="modal-action mt-0">
                                    <form method="dialog">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                </div>

                            </div>

                            {/* Body */}
                            <div className="p-6 grid grid-cols-2 gap-5">

                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Name</p>
                                    <p className="font-semibold text-base">{modalData.name}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Age</p>
                                    <p className="font-semibold text-base">{modalData.age}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Email</p>
                                    <p className="font-semibold text-base  break-all">{modalData.email}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Phone</p>
                                    <p className="font-semibold text-base">{modalData.number}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Division</p>
                                    <p className="font-semibold text-base">{modalData.division}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">District</p>
                                    <p className="font-semibold text-base">{modalData.district}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Warehouse</p>
                                    <p className="font-semibold text-base">{modalData.chosen_warehouse}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Status</p>
                                    <p className={`font-semibold text-base ${modalData.status === "pending" ? "text-yellow-600" : "text-green-600"
                                        }`}>
                                        {modalData.status}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Completed Deliveries</p>
                                    <p className="font-semibold text-base">{modalData.completedDeliveries}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Currently Assigned</p>
                                    <p className="font-semibold text-base">{modalData.currentAssignedDeliveries}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Applied At</p>
                                    <p className="font-semibold text-base">
                                        {format(new Date(modalData.created_At), "dd/MM/yyyy")}
                                    </p>
                                </div>

                                <div >
                                    <p className="text-gray-500 dark:text-[#AAB8B4] text-sm">Joined Since</p>
                                    <p className="font-semibold text-base">
                                        {format(new Date(modalData.joinedAt), "dd/MM/yyyy")}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            {/* <div className="flex justify-end gap-3 p-5 border-t items-center">

                                <button onClick={() => { handleAcceptRider(modalData._id, "Approved"), document.getElementById("my_modal_1").close(); }} className="btn btn-outline btn-error ">
                                    Reject
                                </button>

                                <button onClick={() => { handleAcceptRider(modalData._id, "Rejected"), document.getElementById("my_modal_1").close(); }} className="btn btn-custom font-medium rounded">
                                    Approve Rider
                                </button>

                            </div> */}

                        </div>
                    }




                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            {
                (inactiveRiders?.totalDataCount > 20) &&
                < div className='my-6 flex flex-wrap items-center justify-center gap-2'>
                    <button onClick={() => handlePageState(pageState - 1)} className='btn btn-sm sm:btn-md min-h-10 rounded-full border border-[#caeb66]/60 bg-white dark:bg-[#071A1D] px-3 text-[#03373D] shadow-sm transition-all hover:border-[#b7db4f] hover:bg-[#caeb66]/20 disabled:border-gray-200 dark:border-white/10 disabled:bg-gray-100 dark:bg-white/10 disabled:text-gray-400 dark:text-[#7F918D]' disabled={pageState === 1}><ChevronLeft /></button>
                    {/* <div className='flex flex-wrap justify-center gap-2 rounded-full border border-[#caeb66]/40 bg-white dark:bg-[#071A1D]/80 p-1 shadow-sm'> */}
                    {
                        [...Array(Math.ceil(Number(inactiveRiders.totalDataCount) / limit))].map((_, index) =>
                            <button onClick={() => handlePageState(index + 1)} className={`btn btn-sm sm:btn-md h-10 min-h-10 w-10 rounded-full border text-sm font-bold shadow-none transition-all ${pageState === index + 1 ? 'primary-bg' : ""}`}>{index + 1}</button>
                        )
                    }
                    {/* </div> */}
                    <button onClick={() => handlePageState(pageState + 1)} className='btn btn-sm sm:btn-md min-h-10 rounded-full border border-[#caeb66]/60 bg-white dark:bg-[#071A1D] px-3 text-[#03373D] shadow-sm transition-all hover:border-[#b7db4f] hover:bg-[#caeb66]/20 disabled:border-gray-200 dark:border-white/10 disabled:bg-gray-100 dark:bg-white/10 '><ChevronRight /></button>
                </div>
            }
        </div>
    );
};

export default InactiveRiders;
