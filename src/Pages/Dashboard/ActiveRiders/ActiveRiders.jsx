import axios from 'axios';
import { format } from 'date-fns';
import { Check, UserStar, X } from 'lucide-react';
import React, { useState } from 'react';
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
    //     axiosSecure.get("https://profast-server-henna.vercel.app/riders")
    //         .then(result => {
    //             setRiders(result.data)
    //             setLoading(false)
    //         })
    //         .catch(error => {
    //             setLoading(false)
    //         })
    // }, [])
    const [search, setSearch] = useState("")
    const { data: riders, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["active-riders", search],
        queryFn: async () => {
            const result = await axiosSecure.get(`/riders?status=active&search=${search}`)
            return result.data
        },
        placeholderData: [...Array(10)],


    })
    console.log(isFetching, isLoading, riders)

    const [modalData, setModalData] = useState()

    const handleSearch = (e) => {
        e.preventDefault()
        setTimeout(() => {
            setSearch(e.target.search?.value || e.target.value)
        }, 500);



        // axiosSecure.get(`https://profast-server-henna.vercel.app/riders?search=${search}`)
        //     .then(result => {
        //         setRiders(result.data)
        //     })

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

    return (
        <div>
            <Toaster />
            <div className="">
                <div className="flex justify-end mb-5">
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
                </div>
                <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 overflow-hidden'>

                    <div className='p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                        <h1 className='text-2xl font-bold '>Active Riders  {riders[0] && (riders.length < 9 ? `(0${riders.length})` : `(${riders.length})`)}</h1>
                        <p className='text-sm text-gray-500 mt-1'>List of riders currently active and available for delivery tasks.</p>
                    </div>

                    <table className={`hidden min-[850px]:table table-lg table-zebra bg-white font-medium `}>
                        <thead className='bg-[#caeb66]'>
                            <tr className='text-black *:px-3  lg:*:px-5 '>
                                <th className='text-center'>No.</th>
                                <th>Name</th>
                                <th>District</th>
                                <th>Warehouse</th>
                                <th>Age</th>
                                <th>Requested At</th>
                                <th>Assigned</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                riders?.map((data, index) =>
                                    <tr key={index} className='*:px-3  lg:*:px-5 ' >
                                        <th className='text-center'>{data ? index + 1 : <Skeleton></Skeleton>}</th>
                                        <td onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))} className='cursor-pointer max-w-[150px] truncate'>{data?.name || <Skeleton></Skeleton>}</td>
                                        <td>{data?.district || <Skeleton></Skeleton>}</td>
                                        <td>{data?.chosen_warehouse || <Skeleton></Skeleton>}</td>
                                        <td>{data?.age || <Skeleton></Skeleton>}</td>
                                        <td>{data ? format(new Date(data.created_At), "dd MMM, yyyy") : <Skeleton></Skeleton>}</td>
                                        <td className='text-center'>{data?.currentAssignedDeliveries ?? <Skeleton></Skeleton>}</td>

                                        <td className='text-center'>
                                            {data ?
                                                <div className='dropdown cursor-pointer'>
                                                    <button disabled={isLoading || isFetching} tabIndex={0} className=' cursor-pointer  relative ' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                        <BsThreeDotsVertical />
                                                    </button>
                                                    <ul tabIndex={0} className={`menu absolute ${index >= riders.length - 2 ? "bottom-0" : "top-0"} right-full max-w-screen max-h-screen dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
                                                        <li onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}><a>View</a></li>
                                                        <li onClick={() => handleDeactivate(data?._id)} className='text-red-500'><a>Deactivate<X size={16} /></a></li>
                                                    </ul>
                                                </div> :
                                                <Skeleton></Skeleton>
                                            }
                                            {/* <button className='btn btn-warning text-white'>Deactivate</button> */}

                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {!isLoading && !riders?.length > 0 && <NoDataFound data={"riders"}></NoDataFound>}
                </div>
                {/* {loading && <span className='block text-2xl font-bold text-center mt-5'>Loading...</span>} */}
            </div>
            {/* cards for mobile */}

            <div className='grid gap-5 sm:grid-cols-2 mt-5'>
                {riders.map((rider) =>
                    <div className='p-4 shadow rounded-xl'>
                        <div className='flex justify-between items-start'>
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
                                    <p className="font-semibold text-base">{modalData.email}</p>
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
            </dialog>
        </div>
    );
};

export default ActiveRiders;
