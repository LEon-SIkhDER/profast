import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import { Check, Link, Warehouse, X } from 'lucide-react';
import { format } from 'date-fns';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import NoDataFound from '../../../Components/NoDataFound';

const PendingRiders = () => {

    const axiosSecure = useAxiosSecure()
    // const [riderLoading, setRidersLoading] = useState(true)
    // const [riders, setRiders] = useState([...Array(10)])
    // console.log(riders)
    // useEffect(() => {
    //     axiosSecure.get(`https://profast-server-henna.vercel.app/pending-riders`)
    //         .then(result => {
    //             console.log(result)
    //             setRiders(result.data)
    //             setRidersLoading(false)
    //         })
    // }, [])
    const [search, setSearch] = useState("")
    const { data: riders, refetch } = useQuery({
        queryKey: ["pending-riders", search],
        queryFn: async () => {
            const result = await axiosSecure.get(`/riders?status=pending&search=${search}`)
            return result.data
        },
        placeholderData: [...Array(10)]
    })
    console.log(riders)
    // modal 
    const [modalData, setModalData] = useState()
    // Accept Rider
    const handleAcceptRider = (id, status) => {
        if (status === "approved") {
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to accept this request?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Accept",
                cancelButtonText: "Cancel",
                customClass: {
                    confirmButton: "btn btn-custom",
                    cancelButton: "btn ml-2"
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // your accept logic here
                    console.log("Accepted");

                    riderStatusUpdate(id, "active")
                }
            });
        }
        else if (status === "rejected") {
            Swal.fire({
                title: "Reject Request?",
                text: "Are you sure you want to reject this request?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Reject",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#ef4444",
            }).then((result) => {
                if (result.isConfirmed) {
                    // rejection logic here
                    console.log("rejected");

                    riderStatusUpdate(id, "rejected")
                }
            });

        }


    }
    const riderStatusUpdate = (id, status) => {
        const data = {
            status,
            new: true
        }
        toast.promise(
            axiosSecure.patch(`/pending-riders?id=${id}`, data)
                .then(async (result) => {
                    if (result.data.modifiedCount !== 1) {
                        throw new Error("Update Failed")
                    }
                    await refetch()
                    return result
                })
            ,
            {
                loading: "Updating",
                success: status === "active" ? "Accepted" : "Rejected",
                error: (err) => err.message || "Something went wrong!"
            }
        )
    }
    // Reject Rider 

    const handleSearch = (e) => {
        e.preventDefault()
        const value = e.target.search?.value || e.target.value
        setTimeout(() => {
            setSearch(value)
        }, 500);
    }


    return (
        <div>
            <Toaster />
            <div className="flex justify-end mb-5">
                <form onSubmit={handleSearch} className="flex max-w-md w-full">
                    <input
                        onChange={handleSearch}
                        type="text"
                        name="search"
                        placeholder="Search riders"
                        className="flex-1 px-4 py-2 border-2 border-[#b7db4f] rounded-l-lg outline-none focus:ring-2 focus:ring-[#caeb66]"
                    />

                    <button className="px-4 flex items-center gap-2 font-semibold text-black bg-linear-to-r from-[#caeb66] to-[#a8d94a] border-2 border-l-0 border-[#b7db4f] rounded-r-lg shadow-md hover:from-[#bfe85a] hover:to-[#97c83f]">
                        Search
                    </button>
                </form>
            </div>
            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 overflow-hidden'>
                <div className='p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <h1 className='text-2xl font-bold '>Pending Riders {riders[0] && (riders.length < 9 ? `(0${riders.length})` : `(${riders.length})`)}</h1>
                    <p className='text-sm text-gray-500 mt-1'>List of riders who have applied to become delivery riders and are awaiting approval.</p>
                </div>
                <table className={`hidden min-[675px]:table table-lg table-zebra bg-white font-medium `}>
                    <thead className='bg-[#caeb66]'>
                        <tr className='text-black'>
                            <th className='text-center'>No.</th>
                            <th>Name</th>
                            <th>District</th>
                            <th>Warehouse</th>
                            <th>Age</th>
                            <th>Requested At</th>
                            <th className='text-center'>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            riders?.map((data, index) =>
                                <tr key={index}>
                                    <th className='text-center'>{data ? index + 1 : <Skeleton></Skeleton>}</th>
                                    <td
                                        className='max-w-[150px] truncate cursor-pointer'
                                        onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}
                                    >{data?.name || <Skeleton></Skeleton>}</td>
                                    <td>{data?.district || <Skeleton></Skeleton>}</td>
                                    <td>{data?.chosen_warehouse || <Skeleton></Skeleton>}</td>
                                    <td>{data?.age || <Skeleton></Skeleton>}</td>
                                    <td>{data?.created_At ? format(new Date(data.created_At), "dd/MM/yyyy") : <Skeleton></Skeleton>}</td>
                                    <td className='text-center'>
                                        {data ?
                                            <div className='dropdown cursor-pointer'>
                                                <button tabIndex={0} className=' cursor-pointer  relative ' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                    <BsThreeDotsVertical />
                                                </button>
                                                <ul tabIndex={0} className={`menu absolute ${index >= riders.length - 2 ? "bottom-0" : "top-0"} right-full max-w-screen max-h-screen dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
                                                    <li onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}><a>View</a></li>
                                                    <li onClick={() => handleAcceptRider(data?._id, "approved")} className='text-green-500'><a>Accept<Check size={16} /></a></li>
                                                    <li onClick={() => handleAcceptRider(data?._id, "rejected")} className='text-red-500'><a>Reject <X size={16} /></a></li>
                                                    {/* {data.paymentStatus && <li className='border-t border-gray-200'><Link to={`/dashboard/payment/${data._id}`}>Pay</Link></li>} */}
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
                {riders.length === 0 && <NoDataFound data={"Rider"}></NoDataFound>}
            </div>


            {/* cards for mobile */}

            <div className='grid min-[675px]:hidden gap-5 sm:grid-cols-2 mt-5  '>
                {riders.map((rider) =>
                    <div className='p-4 shadow rounded-xl bg-white'>
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
                                    { label: "Requested At", value: rider && format(rider?.created_At, "dd MMM yyyy") },
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
                                        <button onClick={() => handleAcceptRider(rider?._id, "approved")}
                                            className='btn bg-green-100 text-green-600 w-full border border-green-200'
                                        >Accept</button>
                                        <button onClick={() => handleAcceptRider(rider?._id, "rejected")}
                                            className='btn bg-red-100 text-red-600 w-full border border-red-200'
                                        >Reject</button>
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
                                        Rider Application
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
                                    <p className={`font-semibold text-base ${modalData.status === "pending" ? "text-yellow-600" : "text-green-600"
                                        }`}>
                                        {modalData.status}
                                    </p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-gray-500 text-sm">Applied At</p>
                                    <p className="font-semibold text-base">
                                        {format(new Date(modalData.created_At), "dd/MM/yyyy")}
                                    </p>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 p-5 border-t items-center">

                                <button onClick={() => { handleAcceptRider(modalData._id, "rejected"), document.getElementById("my_modal_1").close(); }} className="btn btn-outline btn-error ">
                                    Reject
                                </button>

                                <button onClick={() => { handleAcceptRider(modalData._id, "approved"), document.getElementById("my_modal_1").close(); }} className="btn btn-custom font-medium rounded">
                                    Approve Rider
                                </button>

                            </div>

                        </div>
                    }




                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default PendingRiders;