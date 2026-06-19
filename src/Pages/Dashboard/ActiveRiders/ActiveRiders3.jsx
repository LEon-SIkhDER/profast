import axios from 'axios';
import { format } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, Filter, Search, UserRound, UserStar, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import NoDataFound from '../../../Components/NoDataFound';
import { data, useNavigate } from 'react-router';


const ActiveRiders = () => {

    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()

    // const [loading, setLoading] = useState(true)
    // const [riders, setRiders] = useState([...Array(10)])


    // useEffect(() => {
    //     axiosSecure.get("http://localhost:5000/riders")
    //         .then(result => {
    //             setRiders(result.data)
    //             setLoading(false)
    //         })
    //         .catch(error => {
    //             setLoading(false)
    //         })
    // }, [])

    // 1 = 0
    // 2 = 10
    // 3 = 20 
    // 4 = 30 
    // (value * 10) - 10
    // (value - 1) * 10
    // 70 
    // 71 = 8
    // (Math.ceil(value / limit))

    // pagination
    const [totalDataCountLS, setTotalDataCountLS] = useState(() => {
        const result = localStorage.getItem("totalDataCount")
        if (result) return result
        return undefined
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

    // ---- Filters ----
    const emptyFilters = { district: "", warehouse: "", minAge: "", maxAge: "", sort: "" }
    const [filters, setFilters] = useState(emptyFilters)
    const [tempFilters, setTempFilters] = useState(emptyFilters)
    const [filterOpen, setFilterOpen] = useState(false)
    const filterRef = useRef()

    const sortLabels = {
        joinedAt_desc: "Newest Joined",
        joinedAt_asc: "Oldest Joined",
        assigned_desc: "Most Assigned",
        assigned_asc: "Least Assigned",
    }

    const activeFilterCount = [
        filters.district,
        filters.warehouse,
        (filters.minAge || filters.maxAge),
        filters.sort
    ].filter(Boolean).length

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleToggleFilterPanel = () => {
        setTempFilters(filters)
        setFilterOpen(open => !open)
    }

    const handleApplyFilters = () => {
        setFilters(tempFilters)
        setPageState(1)
        setFilterOpen(false)
    }

    const handleResetFilters = () => {
        setFilters(emptyFilters)
        setTempFilters(emptyFilters)
        setPageState(1)
        setFilterOpen(false)
    }

    const handleRemoveFilter = (keys) => {
        const updated = { ...filters }
        keys.forEach(key => updated[key] = "")
        setFilters(updated)
        setTempFilters(updated)
        setPageState(1)
    }
    // ---- End Filters ----

    const { data: riders, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["active-riders", search, pageState, filters],
        queryFn: async () => {
            const params = new URLSearchParams({
                status: "active",
                search,
                limit,
                skip: (pageState - 1) * limit,
            })
            if (filters.district) params.append("district", filters.district)
            if (filters.warehouse) params.append("warehouse", filters.warehouse)
            if (filters.minAge) params.append("minAge", filters.minAge)
            if (filters.maxAge) params.append("maxAge", filters.maxAge)
            if (filters.sort) params.append("sort", filters.sort)

            const result = await axiosSecure.get(`/riders?${params.toString()}`)
            if (!search) {
                handleTotalDataCountLS(result.data.totalDataCount)
            }
            setSearchLoading(false)
            return result.data
        },
        placeholderData: { result: [...Array(10)] },
    })
    // console.log(isFetching, isLoading, riders)

    const [modalData, setModalData] = useState()

    const timeoutID = useRef()
    const handleSearch = (e) => {
        e.preventDefault()
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
        }).then((result) => {
            if (result.isConfirmed) {
                // rejection logic here
                toast.promise(
                    axiosSecure.patch(`http://localhost:5000/pending-riders?id=${id}`, { status: "inactive" })
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

                        <button className="px-4 flex items-center gap-2 font-semibold text-black bg-linear-to-r from-[#caeb66] to-[#a8d94a] border-2 border-l-0 border-[#b7db4f] rounded-r-lg shadow-md hover:from-[#bfe85a] hover:to-[#97c83f]">
                            Search
                        </button>
                    </form>
                </div> */}
                <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 overflow-hidden'>
                    <div className='flex flex-wrap sm:flex-nowrap justify-between gap-0 sm:gap-5  items-center p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                        <div className=''>
                            <h1 className='text-2xl font-bold '>Active Riders {totalDataCountLS ? `(${totalDataCountLS})` : ""}</h1>
                            <p className='text-sm text-gray-500 mt-1'>List of riders currently active and available for delivery tasks.</p>
                        </div>

                        <div className='flex gap-3 w-full min-[750px]:w-auto mt-3 min-[750px]:mt-0'>
                            <form onSubmit={handleSearch} className='flex gap-3 flex-1 min-[750px]:flex-none' >
                                <label className='input shadow border-none rounded-xl h-12 w-full min-[750px]:w-72  focus-within:outline-green-800 '>
                                    <UserRound className='text-gray-500' />
                                    <input onChange={handleSearch} type="text" placeholder='Search user' name='search' required />
                                </label>
                                <button className='btn bg-green-800 hover:bg-green-900 text-white rounded-xl h-12 shrink-0  shadow'>{(searchLoading && !riders.result[0]) ? <span className="loading loading-spinner loading-sm"></span> : <Search size={18} />}<span className='hidden sm:inline'>Search</span></button>
                            </form>

                            {/* Filter */}
                            <div className='relative shrink-0' ref={filterRef}>
                                <button
                                    type="button"
                                    onClick={handleToggleFilterPanel}
                                    className={`btn h-12 rounded-xl shadow border-2 relative ${activeFilterCount > 0 ? "border-green-800 bg-green-800 text-white hover:bg-green-900" : "border-[#caeb66] bg-white text-black hover:bg-[#caeb66]/20"}`}
                                >
                                    <Filter size={18} />
                                    <span className='hidden sm:inline'>Filter</span>
                                    {activeFilterCount > 0 &&
                                        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>{activeFilterCount}</span>
                                    }
                                </button>

                                {filterOpen &&
                                    <div className='absolute right-0 mt-2 w-[88vw] max-w-[300px] sm:w-80 bg-white rounded-2xl shadow-xl border border-[#caeb66]/50 z-20 p-5'>
                                        <div className='flex justify-between items-center mb-4'>
                                            <h3 className='font-bold text-lg'>Filter Riders</h3>
                                            <button onClick={() => setFilterOpen(false)} className='text-gray-400 hover:text-gray-700'><X size={18} /></button>
                                        </div>

                                        <div className='space-y-4'>
                                            <div>
                                                <label className='text-sm text-gray-500 mb-1 block'>District</label>
                                                <input
                                                    type="text"
                                                    value={tempFilters.district}
                                                    onChange={(e) => setTempFilters({ ...tempFilters, district: e.target.value })}
                                                    placeholder='e.g. Faridpur'
                                                    className='input input-bordered focus:outline-green-800 w-full rounded-lg h-10'
                                                />
                                            </div>

                                            <div>
                                                <label className='text-sm text-gray-500 mb-1 block'>Warehouse</label>
                                                <input
                                                    type="text"
                                                    value={tempFilters.warehouse}
                                                    onChange={(e) => setTempFilters({ ...tempFilters, warehouse: e.target.value })}
                                                    placeholder='e.g. Dhaka'
                                                    className='input input-bordered focus:outline-green-800 w-full rounded-lg h-10'
                                                />
                                            </div>

                                            <div>
                                                <label className='text-sm text-gray-500 mb-1 block'>Age range</label>
                                                <div className='grid grid-cols-2 gap-3'>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={tempFilters.minAge}
                                                        onChange={(e) => setTempFilters({ ...tempFilters, minAge: e.target.value })}
                                                        placeholder='Min'
                                                        className='input input-bordered focus:outline-green-800 w-full rounded-lg h-10'
                                                    />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={tempFilters.maxAge}
                                                        onChange={(e) => setTempFilters({ ...tempFilters, maxAge: e.target.value })}
                                                        placeholder='Max'
                                                        className='input input-bordered focus:outline-green-800 w-full rounded-lg h-10'
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className='text-sm text-gray-500 mb-1 block'>Sort by</label>
                                                <select
                                                    value={tempFilters.sort}
                                                    onChange={(e) => setTempFilters({ ...tempFilters, sort: e.target.value })}
                                                    className='select select-bordered focus:outline-green-800 w-full rounded-lg h-10'
                                                >
                                                    <option value="">Default</option>
                                                    <option value="joinedAt_desc">Newest Joined</option>
                                                    <option value="joinedAt_asc">Oldest Joined</option>
                                                    <option value="assigned_desc">Most Assigned</option>
                                                    <option value="assigned_asc">Least Assigned</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className='flex gap-3 mt-6'>
                                            <button onClick={handleResetFilters} className='btn flex-1 bg-gray-100 hover:bg-gray-200 border-none rounded-xl'>Reset</button>
                                            <button onClick={handleApplyFilters} className='btn flex-1 bg-green-800 hover:bg-green-900 text-white border-none rounded-xl'><Check size={16} />Apply</button>
                                        </div>
                                    </div>
                                }
                            </div>
                            {/* End Filter */}
                        </div>
                    </div>

                    {/* Active filter chips */}
                    {activeFilterCount > 0 &&
                        <div className='flex flex-wrap items-center gap-2 px-5 py-3 bg-white/50 border-x border-[#caeb66]/40'>
                            {filters.district &&
                                <span className='inline-flex items-center gap-1.5 bg-[#caeb66]/40 text-sm font-medium px-3 py-1 rounded-full'>
                                    District: {filters.district}
                                    <button onClick={() => handleRemoveFilter(["district"])} className='hover:text-red-600'><X size={14} /></button>
                                </span>
                            }
                            {filters.warehouse &&
                                <span className='inline-flex items-center gap-1.5 bg-[#caeb66]/40 text-sm font-medium px-3 py-1 rounded-full'>
                                    Warehouse: {filters.warehouse}
                                    <button onClick={() => handleRemoveFilter(["warehouse"])} className='hover:text-red-600'><X size={14} /></button>
                                </span>
                            }
                            {(filters.minAge || filters.maxAge) &&
                                <span className='inline-flex items-center gap-1.5 bg-[#caeb66]/40 text-sm font-medium px-3 py-1 rounded-full'>
                                    Age: {filters.minAge || "0"}–{filters.maxAge || "∞"}
                                    <button onClick={() => handleRemoveFilter(["minAge", "maxAge"])} className='hover:text-red-600'><X size={14} /></button>
                                </span>
                            }
                            {filters.sort &&
                                <span className='inline-flex items-center gap-1.5 bg-[#caeb66]/40 text-sm font-medium px-3 py-1 rounded-full'>
                                    Sort: {sortLabels[filters.sort]}
                                    <button onClick={() => handleRemoveFilter(["sort"])} className='hover:text-red-600'><X size={14} /></button>
                                </span>
                            }
                            <button onClick={handleResetFilters} className='text-sm text-red-500 hover:underline ml-1'>Clear all</button>
                        </div>
                    }

                    <table className={`hidden min-[850px]:table table-lg table-zebra bg-white font-medium `}>
                        <thead className='bg-[#caeb66]'>
                            <tr className='text-black *:px-3  lg:*:px-5 '>
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
                                <h2 className='text-sm text-gray-500'>{
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
                                        <h4 className='text-sm text-gray-500'>{rider ? data.label : <Skeleton width="50%"></Skeleton>}</h4>
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
                        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className="bg-linear-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-black">
                                        Rider Details
                                    </h2>
                                    <p className="text-sm text-black/70">
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
                                    <p className="text-gray-500 text-sm">Name</p>
                                    <p className="font-semibold text-base">{modalData.name}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Age</p>
                                    <p className="font-semibold text-base">{modalData.age}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p className="font-semibold text-base  break-all">{modalData.email}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Phone</p>
                                    <p className="font-semibold text-base">{modalData.number}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Division</p>
                                    <p className="font-semibold text-base">{modalData.division}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">District</p>
                                    <p className="font-semibold text-base">{modalData.district}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Warehouse</p>
                                    <p className="font-semibold text-base">{modalData.chosen_warehouse}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Status</p>
                                    <p className={`font-semibold text-xs mt-1 px-3 py-1 rounded-full inline-block ${modalData.status === "pending" ? "text-yellow-600 bg-yellow-100" : "text-green-600 bg-green-100"
                                        }`}>
                                        {modalData.status}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Completed Deliveries</p>
                                    <p className="font-semibold text-base">{modalData.completedDeliveries}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Currently Assigned</p>
                                    <p className="font-semibold text-base">{modalData.currentAssignedDeliveries}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Applied At</p>
                                    <p className="font-semibold text-base">
                                        {format(new Date(modalData.created_At), "dd/MM/yyyy")}
                                    </p>
                                </div>

                                <div >
                                    <p className="text-gray-500 text-sm">Joined Since</p>
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
                (riders?.totalDataCount > 20) &&
                < div className='my-6 flex flex-wrap items-center justify-center gap-2'>
                    <button onClick={() => handlePageState(pageState - 1)} className='btn btn-sm sm:btn-md min-h-10 rounded-full border border-[#caeb66]/60 bg-white px-3 text-[#03373D] shadow-sm transition-all hover:border-[#b7db4f] hover:bg-[#caeb66]/20 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400' disabled={pageState === 1}><ChevronLeft /></button>
                    {/* <div className='flex flex-wrap justify-center gap-2 rounded-full border border-[#caeb66]/40 bg-white/80 p-1 shadow-sm'> */}
                    {
                        [...Array(Math.ceil(Number(riders.totalDataCount) / limit))].map((_, index) =>
                            <button onClick={() => handlePageState(index + 1)} className={`btn btn-sm sm:btn-md h-10 min-h-10 w-10 rounded-full border text-sm font-bold shadow-none transition-all ${pageState === index + 1 ? 'primary-bg' : ""}`}>{index + 1}</button>
                        )
                    }
                    {/* </div> */}
                    <button onClick={() => handlePageState(pageState + 1)} className='btn btn-sm sm:btn-md min-h-10 rounded-full border border-[#caeb66]/60 bg-white px-3 text-[#03373D] shadow-sm transition-all hover:border-[#b7db4f] hover:bg-[#caeb66]/20 disabled:border-gray-200 disabled:bg-gray-100 '><ChevronRight /></button>
                </div>
            }
        </div >
    );
};

export default ActiveRiders;
