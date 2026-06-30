import { format } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, Search, UserRound, UserStar, X } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import NoDataFound from '../../../Components/NoDataFound';
import { AuthContext } from '../../../Context/AuthContext';


const ActiveRiders = () => {

    const axiosSecure = useAxiosSecure()
    const { theme } = useContext(AuthContext)
    const isDark = theme === "dark" ? true : false

    // pagination
    const [totalDataCountLS, setTotalDataCountLS] = useState(() => {
        const result = localStorage.getItem("totalDataCount")
        if (result) return result
        return 0
    })
    const handleTotalDataCountLS = (num) => {
        localStorage.setItem('totalDataCount', num)
        setTotalDataCountLS(num)
    }
    useEffect(() => {
        return () => localStorage.removeItem("totalDataCount")
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
    const { data: riders, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["active-riders", search, pageState],
        queryFn: async () => {
            console.log(search)
            const result = await axiosSecure.get(`/riders?status=active&search=${search}&limit=${limit}&skip=${(pageState - 1) * limit}`)
            if (!search) {
                handleTotalDataCountLS(result.data.totalDataCount)
            }
            setSearchLoading(false)
            console.log("search result ")
            return result.data
        },
        placeholderData: { result: [...Array(10)] },
    })
    // console.log(isFetching, isLoading, riders)

    const [modalData, setModalData] = useState()

    const disabledSearch = !riders.result?.[0] && !searchLoading && totalDataCountLS == 0

    console.log(!riders.result?.[0])
    console.log(!searchLoading)
    console.log(totalDataCountLS)
    console.log(totalDataCountLS === 0)
    console.log(disabledSearch)

    const timeoutID = useRef()
    const handleSearch = (e) => {
        e.preventDefault()
        if (disabledSearch) return
        clearTimeout(timeoutID.current)
        timeoutID.current = setTimeout(() => {
            setSearch(e.target.search?.value || e.target.value)
        }, 500);
        if (e.target.search?.value) {
            setSearchLoading(true)
        }
    }

    const handleDeactivate = (id) => {
        Swal.fire({
            title: "Deactivate Rider?",
            text: "Are you sure you want to deactivate this rider?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Deactivate",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            color: isDark ? "#F8FAFC" : "#111827",
            background: isDark ? "#0F172A" : "#FFFFFF",
        }).then((result) => {
            if (result.isConfirmed) {
                // rejection logic here
                toast.promise(
                    axiosSecure.patch(`https://profast-server-henna.vercel.app/pending-riders?id=${id}`, { status: "inactive" })
                        .then(async (result) => {
                            if (result.data.modifiedCount !== 1) {
                                throw new Error("Update Failed")
                            }
                            await refetch()
                            return result
                        }),
                    {
                        loading: "Updating",
                        success: "Deactivated",
                        error: (err) => err.message || "Something went wrong!"
                    }
                )
            }
        });

    }

    // console.log(activeRidersCount, riders.totalDataCount)

    return (
        <div>
            <Toaster />
            <div className="">
                {/* <div className="flex justify-end mb-5">
                    <form onSubmit={handleSearch} className="flex max-w-md w-full">
                        <input
                            onChange={handleSearch}
                            type="text"
                            name="search"
                            placeholder="Search riders"
                            className="flex-1 max-w-[360px] w-full px-4 py-2 border-2 border-[#b7db4f] rounded-l-lg outline-none focus:ring-2 focus:ring-[#caeb66]"
                        />

                        <button className="px-4 flex items-center gap-2 font-semibold text-black dark:text-[#F5F7F2] bg-linear-to-r from-[#caeb66] to-[#a8d94a] border-2 border-l-0 border-[#b7db4f] rounded-r-lg shadow-md hover:from-[#bfe85a] hover:to-[#97c83f]">
                            Search
                        </button>
                    </form>
                </div> */}
                <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 dark:from-[#08262B] dark:to-[#0D1F22] dark:border dark:border-white/10 overflow-hidden'>
                    <div className='flex flex-wrap sm:flex-nowrap justify-between gap-0 sm:gap-5  items-center p-4 sm:p-5 border border-[#caeb66]/40 dark:border-cyan-400/10 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                        <div className=''>
                            <h1 className='text-2xl font-bold '>Active Riders {totalDataCountLS != 0 && totalDataCountLS ? `(${totalDataCountLS})` : ""}</h1>
                            <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>List of riders currently active and available for delivery tasks.</p>
                        </div>

                        <form onSubmit={handleSearch} className='flex gap-2 w-full min-[750px]:w-auto mt-3 min-[750px]:mt-0 ' >
                            <label className='input shadow border-none rounded-xl h-12 w-full min-[750px]:w-80  focus-within:outline-green-800 '>
                                <UserRound className='text-gray-500 dark:text-[#AAB8B4]' />
                                <input onChange={handleSearch} type="text" placeholder='Search rider' name='search' required disabled={disabledSearch} />
                            </label>
                            <button className='btn bg-green-800 hover:bg-green-900 text-white rounded-xl h-12  shadow' disabled={disabledSearch}>{(searchLoading && !riders.result[0]) ? <span className="loading loading-spinner loading-sm"></span> : <Search size={18} />}<span className='hidden xxs:block'>Search</span></button>
                        </form>
                    </div>

                    <table className={`hidden min-[850px]:table table-lg table-zebra bg-white dark:bg-[#071A1D] font-medium `}>
                        <thead className='bg-[#caeb66]'>
                            <tr className='text-black dark:text-[#F5F7F2] *:px-3  lg:*:px-5 '>
                                <th className='text-center'>No.</th>
                                <th>Name</th>
                                <th>District</th>
                                <th>Warehouse</th>
                                <th>Age</th>
                                <th>Joined At</th>
                                <th className='text-center'>Assigned</th>
                                <th className='text-center'>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                riders?.result?.map((data, index) => {
                                    console.log(data?.currentAssignedDeliveries)
                                    return (<tr key={index} className='*:px-3  lg:*:px-5 ' >
                                        <th className='text-center'>{data ? (index + 1) + (pageState - 1) * limit : <Skeleton></Skeleton>}</th>
                                        <td onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))} className='cursor-pointer max-w-[150px] truncate'>{data?.name || <Skeleton></Skeleton>}</td>
                                        <td>{data?.district || <Skeleton></Skeleton>}</td>
                                        <td>{data?.chosen_warehouse || <Skeleton></Skeleton>}</td>
                                        <td>{data?.age || <Skeleton></Skeleton>}</td>
                                        <td>{data ? format(new Date(data.joinedAt), "dd MMM, yyyy") : <Skeleton></Skeleton>}</td>
                                        <td className='text-center'>{data?.currentAssignedDeliveries ?? <Skeleton></Skeleton>}</td>

                                        <td className='text-center'>
                                            {data ?
                                                <div className='dropdown cursor-pointer'>
                                                    <button disabled={isLoading || isFetching} tabIndex={0} className=' cursor-pointer  relative ' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                        <BsThreeDotsVertical />
                                                    </button>
                                                    <ul tabIndex={0} className={`menu absolute ${index >= riders.result.length - 2 ? "bottom-0" : "top-0"} right-full max-w-dvw max-h-dvh dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
                                                        <li onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}><a>View</a></li>
                                                        <li onClick={() => handleDeactivate(data?._id)} className='text-red-500'><a>Deactivate<X size={16} /></a></li>
                                                    </ul>
                                                </div> :
                                                <Skeleton></Skeleton>
                                            }
                                            {/* <button className='btn btn-warning text-white'>Deactivate</button> */}

                                        </td>
                                    </tr>)
                                }
                                )
                            }
                        </tbody>
                    </table>
                    {!isLoading && !riders.result?.length > 0 && <NoDataFound data={" Riders"}></NoDataFound>}
                </div>
                {/* {loading && <span className='block text-2xl font-bold text-center mt-5'>Loading...</span>} */}
            </div>
            {/* cards for mobile */}

            <div className='grid min-[850px]:hidden gap-5 sm:grid-cols-2 mt-5'>
                {riders.result.map((rider, index) =>
                    <div className='p-4 shadow rounded-xl' key={index}>
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
                                <Skeleton width={53} height={20}></Skeleton>
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
                                        <button onClick={() => handleDeactivate(rider?._id)} className='btn bg-red-100 text-red-600 w-full'>Deactivate</button>
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
                                    <p className={`font-semibold text-xs mt-1 px-3 py-1 rounded-full inline-block ${modalData.status === "pending" ? "text-yellow-600 bg-yellow-100" : "text-green-600 bg-green-100"
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
            {/* {console.log(riders?.totalDataCount)} */}
            {
                (riders?.totalDataCount > 20) &&
                < div className='my-6 flex flex-wrap items-center justify-center gap-2'>
                    <button onClick={() => handlePageState(pageState - 1)}
                        className='btn btn-sm sm:btn-md min-h-10 rounded-full border border-[#caeb66]/60 bg-white  px-3 text-[#03373D] shadow-sm transition-all hover:border-[#b7db4f] hover:bg-[#caeb66]/20 disabled:border-gray-200 dark:disabled:border-white/10 disabled:bg-gray-100 dark:disabled:bg-white/10 disabled:text-gray-400 
                        dark:text-cyan-400 dark:bg-cyan-400/10 dark:border-cyan-400/90 
                        ' disabled={pageState === 1}><ChevronLeft /></button>
                    {/* <div className='flex flex-wrap justify-center gap-2 rounded-full border border-[#caeb66]/40 bg-white dark:bg-[#071A1D]/80 p-1 shadow-sm'> */}
                    {
                        [...Array(Math.ceil(Number(riders.totalDataCount) / limit))].map((_, index) =>
                            <button onClick={() => handlePageState(index + 1)} className={`btn btn-sm sm:btn-md h-10 min-h-10 w-10 rounded-full border text-sm font-bold shadow-none transition-all ${pageState === index + 1 ? 'bg-[#CAEB66] dark:bg-cyan-400 dark:text-emerald-800   ' : ""}items-center justify-center`}>{index + 1}</button>
                        )
                    }
                    {/* </div> */}
                    <button onClick={() => handlePageState(pageState + 1)}
                        className='btn btn-sm sm:btn-md min-h-10 rounded-full border border-[#caeb66]/60 bg-white  px-3 text-[#03373D] shadow-sm transition-all hover:border-[#b7db4f] hover:bg-[#caeb66]/20 disabled:border-gray-200 dark:disabled:border-white/10 disabled:bg-gray-100 dark:disabled:bg-white/10 disabled:text-gray-400
                        dark:text-cyan-400 dark:bg-cyan-400/10 dark:border-cyan-400/90 
                        'disabled={pageState === Math.ceil(Number(riders.totalDataCount) / limit)}><ChevronRight /></button>
                </div>
            }
        </div >
    );
};

export default ActiveRiders;

