import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
import React, { useContext, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../Context/AuthContext';
import { RiEBike2Line } from 'react-icons/ri';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Check } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { format } from 'date-fns';

const PendingDeliveries = () => {
    const axiosSecure = useAxiosSecure()
    const { user } = useContext(AuthContext)

    const { data: pendingDeliveries, refetch } = useQuery({
        queryKey: ["pendingDeliveries"],
        queryFn: async () => {
            const result = await axiosSecure.get(`/parcels?riderEmail=${user.email}&status=in-transit&status=rider-assigned`)
            return result.data
        },
        placeholderData: [...Array(10)]
    })
    console.log(pendingDeliveries)
    const [modalData, setModalData] = useState()

    //....................
    const handleAcceptDelivery = (id) => {
        document.getElementById('my_modal_1').close()
        const status = "in-transit"
        Swal.fire({
            title: "Accept this delivery request?",
            text: "You won't be able to revert this!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Accept it",
            cancelButtonText: 'Cancel Request!'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    toast.promise(
                        axiosSecure.patch(`/parcel/${id}`, { status }),
                        {
                            loading: "Accepting",
                            success: async (result) => {
                                console.log(result)
                                if (result.data.modifiedCount === 1) {
                                    const res = await refetch()
                                    if (res) {
                                        return "Accepted"
                                    }

                                } else {
                                    return "Accepting failed"
                                }

                            },
                            error: "Something Went Wrong"
                        }
                    )
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    handleCancelRequest()
                }
            })
    };

    const handleCancelRequest = () => {
        document.getElementById('my_modal_1').close()
        Swal.fire({
            title: "Cancel This Delivery?",
            text: "Enter a valid reason for canceling this delivery.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Submit Request",
            confirmButtonColor: "#008000",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            inputPlaceholder: "Type your reason here...",
            input: 'textarea',
            inputValidator: (value) => {
                if (!value) {
                    return "A reason is required!";
                }
                if (value.length < 10) {
                    return "Reason must be at least 10 characters!";
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Request Submitted",
                    icon: "success",
                    confirmButtonText: "Okay",
                    confirmButtonColor: "#008000"

                });
            }
        });
    }
    const handleCompleteDelivery = (id) => {
        document.getElementById('my_modal_1').close()
        const status = "delivered"
        Swal.fire({
            title: "Complete Delivery?",
            text: "You won't be able to revert this!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Complete",
            cancelButtonText: 'No!'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    toast.promise(
                        axiosSecure.patch(`parcel/${id}`, { status }),
                        {
                            loading: " Updating Status",
                            success: async (result) => {
                                console.log(result)
                                if (result.data.modifiedCount === 1) {
                                    const res = await refetch()
                                    if (res) {
                                        return "Status Updated"
                                    }

                                } else {
                                    return "Updating failed"
                                }

                            },
                            error: "Something Went Wrong"
                        }
                    )
                }
            })

    }
    return (
        <div>
            <Toaster />
            <table className={`table table-lg table-zebra bg-white font-medium shadow-sm ${pendingDeliveries?.length > 2 ? "rounded-2xl overflow-hidden" : "rounded-none"}`}>
                <thead className='bg-[#caeb66] '>
                    <tr>
                        <th className='text-center'>No.</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Weight(kg)</th>
                        <th>Sender District</th>
                        <th>Sender Warehouse</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pendingDeliveries.map((parcel, index) =>
                            <tr key={index} onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(parcel))} className='cursor-pointer'>
                                <th className='text-center'>{parcel && index + 1}</th>
                                <td>{parcel?.parcelName || <Skeleton></Skeleton>}</td>
                                <td>{parcel?.type.toUpperCase() || <Skeleton></Skeleton>}</td>
                                <td>{parcel ? `${parcel.parcelWeight}` : <Skeleton></Skeleton>}</td>
                                <td>{parcel?.senderDistrict || <Skeleton></Skeleton>}</td>
                                <td>{parcel?.senderWarehouse || <Skeleton></Skeleton>}</td>
                                <td>
                                    <h1 className={`${parcel && (parcel.parcel_status === "rider-assigned" ? "text-error" : parcel.parcel_status === "in-transit" && "text-success")}`}>
                                        {
                                            parcel ?
                                                (parcel.parcel_status === "rider-assigned" ? "Pending" : parcel.parcel_status === 'in-transit' && "Accepted")
                                                : <Skeleton></Skeleton>
                                        }
                                    </h1>
                                </td>
                                <td className=''>
                                    {/* {parcel ?
                                        <div className='dropdown cursor-pointer'>
                                            <button tabIndex={0} className=' cursor-pointer  relative ' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                <BsThreeDotsVertical />
                                            </button>
                                            <ul tabIndex={0} className={`menu bg-gray-50 absolute ${pendingDeliveries.length > 2 && index >= pendingDeliveries.length - 2 ? "bottom-0" : "top-0"} right-full max-w-screen max-h-screen dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
                                                <li onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(parcel))}><a>View Parcel</a></li>
                                                <li onClick={() => handleAcceptDelivery(parcel._id)} className='text-green-500 border-t border-t-gray-200'><a>Accept Delivery</a></li>
                                                
                                                <li onClick={handleCancelRequest} className='text-red-500 border-t border-t-gray-200'><a>Request For Cancel</a></li>
                                            </ul>
                                        </div>
                                        :
                                        <Skeleton></Skeleton>
                                    } */}
                                    {parcel ?
                                        (
                                            parcel.parcel_status === "rider-assigned" && <button onClick={(e) => { e.stopPropagation(), handleAcceptDelivery(parcel._id) }} className='btn btn-primary'><a>Accept Delivery</a></button> ||
                                            parcel.parcel_status === "in-transit" && <button onClick={(e) => { e.stopPropagation(), handleCompleteDelivery(parcel._id) }} className='btn btn-success'><a>Complete Delivery</a></button>
                                        ) :
                                        <Skeleton></Skeleton>
                                    }
                                </td>
                            </tr>
                        )

                    }

                    {/* <RiEBike2Line size={16} />{parcel.parcel_status === "rider-assigned" ? "Accept Delivery" : parcel.parcel_status === "in-transit" && "Delivery Complete"} */}
                    {/* <div className='w-full h-[63px] bg-black'></div>  */}
                </tbody>

            </table>
            {pendingDeliveries.length === 0 && <h1 className='font-bold text-center text-2xl'>No Pending Deliveries...</h1>}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box p-0 bg-transparent">

                    {
                        modalData &&
                        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">

                            {/* Header */}
                            <div className="bg-linear-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold  tracking-tight">
                                        Parcel Details
                                    </h2>
                                    <p className="text-sm  mt-1">
                                        {modalData.parcelId}
                                    </p>
                                </div>

                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                            </div>

                            {/* Body */}
                            <div className="p-6 grid grid-cols-2 gap-6">

                                {[
                                    { label: "Parcel Name", value: modalData.parcelName },
                                    { label: "Type", value: modalData.type },
                                    { label: "Weight (kg)", value: modalData.parcelWeight },
                                    { label: "Pickup District", value: modalData.senderDistrict },
                                    { label: "Pickup Warehouse", value: modalData.senderWarehouse },
                                    { label: "Sender Name", value: modalData.senderName },
                                    { label: "Sender Phone", value: modalData.senderNumber },
                                    { label: 'Created At', value: format(modalData.createdAt, "PP") }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <p className="text-gray-400 text-xs uppercase tracking-wide">
                                            {item.label}
                                        </p>
                                        <p className="font-semibold text-base text-gray-800 mt-1">
                                            {item.value || "—"}
                                        </p>
                                    </div>
                                ))}

                                <div className="col-span-1">
                                    <p className="text-gray-400 text-xs uppercase tracking-wide">
                                        Sender Address
                                    </p>
                                    <p className="font-semibold text-base text-gray-800 mt-1">
                                        {modalData.senderAddress || "—"}
                                    </p>
                                </div>
                                {/* Pickup Instruction */}
                                <div className="col-span-1">
                                    <p className="text-gray-400 text-xs uppercase tracking-wide">
                                        Pickup Instruction
                                    </p>
                                    <p className="font-semibold text-base text-gray-800 mt-1">
                                        {modalData.pickupInstruction || "—"}
                                    </p>
                                </div>
                            </div>
                            <div className='flex justify-end p-6 gap-5'>
                                {modalData.parcel_status === "rider-assigned" &&
                                    <>
                                        <button onClick={() => handleAcceptDelivery(modalData.parcel._id)} className='btn  bg-primary text-white'>Accept Delivery</button>
                                        <button onClick={handleCancelRequest} className='btn  bg-error'>Cancel Request</button>
                                    </>
                                }
                                {modalData.parcel_status === "in-transit" && <button onClick={() => handleCompleteDelivery(modalData.parcel._id)} className='btn  bg-success'>Complete Delivery</button>}

                            </div>






                        </div>
                    }




                </div>
            </dialog>
        </div >
    )
}


export default PendingDeliveries;