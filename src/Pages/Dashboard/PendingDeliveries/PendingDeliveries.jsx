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
import { format } from 'date-fns';
import NoDataFound from '../../../Components/NoDataFound';
import { Link } from 'react-router';

const PendingDeliveries = () => {
    const axiosSecure = useAxiosSecure()
    const { user, theme } = useContext(AuthContext)
    const isDark = theme === "dark" ? true : false

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
    console.log(modalData)

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
            color: isDark ? "#F8FAFC" : "#111827",
            background: isDark ? "#0F172A" : "#FFFFFF",
            cancelButtonText: 'Cancel Request!'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    toast.promise(
                        axiosSecure.patch(`/parcel/${id}`, { status, riderEmail: user.email })
                            .then(async (result) => {
                                if (result.data.modifiedCount !== 1) {
                                    throw new Error("Accepting Failed")
                                }
                                await refetch()
                                return result
                            })
                        ,
                        {
                            loading: "Accepting",
                            success: "Accepted",
                            error: (err) => err.message || "Something Went Wrong"
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
            color: isDark ? "#F8FAFC" : "#111827",
            background: isDark ? "#0F172A" : "#FFFFFF",
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
                    color: isDark ? "#F8FAFC" : "#111827",
                    background: isDark ? "#0F172A" : "#FFFFFF",
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
            color: isDark ? "#F8FAFC" : "#111827",
            background: isDark ? "#0F172A" : "#FFFFFF",
            cancelButtonText: 'No!'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    toast.promise(
                        axiosSecure.patch(`parcel/${id}`, { status })
                            .then(async (result) => {
                                if (result.data.modifiedCount !== 1) {
                                    throw new Error("Update Failed")
                                }
                                await refetch()
                                return result
                            })
                        ,
                        {
                            loading: " Updating Status",
                            success: "Completed Delivery",
                            error: (err) => err.message || "Something Went Wrong"
                        }
                    )
                }
            })
    }

    return (
        <div>
            <Toaster />
            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 dark:from-[#08262B] dark:to-[#0D1F22] dark:border dark:border-white/10 overflow-hidden'>
                <div className='p-5 border border-[#caeb66]/40 dark:border-cyan-400/10 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <h1 className='text-2xl font-bold '>Pending Deliveries {pendingDeliveries?.[0] ? `(${pendingDeliveries.length})` : ""}</h1>
                    <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>Pending deliveries require your attention</p>
                </div>
                <table className={`hidden min-[850px]:table table-lg table-zebra bg-white dark:bg-[#071A1D] font-medium `}>
                    <thead className='bg-[#caeb66] '>
                        <tr className='*:px-2  2xl:*:px-5'>
                            <th className='text-center' style={{ paddingLeft: "20px" }}>No.</th>
                            <th>Name</th>
                            <th className='hidden lg:table-cell'>Type</th>
                            <th className='text-center'>Weight(kg)</th>
                            <th>Sender District</th>
                            <th>Sender Warehouse</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pendingDeliveries.map((parcel, index) =>
                                <tr key={index} className=' *:px-2 2xl:*:px-5'>
                                    <th className='text-center' style={{ paddingLeft: "20px" }}>{parcel ? index + 1 : <Skeleton></Skeleton>}</th>
                                    <td
                                        className='cursor-pointer'
                                        onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(parcel))}>
                                        {parcel ?
                                            <>
                                                <h1>{parcel.parcelName}</h1>
                                                <h6 className='block lg:hidden uppercase text-xs text-gray-500 dark:text-[#AAB8B4]  '>{parcel.type}</h6>
                                            </> :
                                            <Skeleton></Skeleton>
                                        }</td>
                                    <td className='hidden lg:table-cell'>{parcel?.type.toUpperCase() || <Skeleton></Skeleton>}</td>
                                    <td className='text-center'>{parcel ? `${parcel.parcelWeight || "..."}` : <Skeleton></Skeleton>}</td>
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
                                            <ul tabIndex={0} className={`menu bg-gray-50 dark:bg-[#031518] absolute ${pendingDeliveries.length > 2 && index >= pendingDeliveries.length - 2 ? "bottom-0" : "top-0"} right-full max-w-screen max-h-screen dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
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
                                                parcel.parcel_status === "rider-assigned" && <button onClick={(e) => { e.stopPropagation(), handleAcceptDelivery(parcel._id) }} className='btn btn-primary w-[150px]'><a>Accept Delivery</a></button> ||
                                                parcel.parcel_status === "in-transit" && <button onClick={(e) => { e.stopPropagation(), handleCompleteDelivery(parcel._id) }} className='btn btn-success w-[150px]'><a>Complete Delivery</a></button>
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
            </div>
            {pendingDeliveries.length === 0 && <NoDataFound data={"Deliveries"}></NoDataFound>}
            {/* mobile card  */}
            <div className='mt-5 grid min-[850px]:hidden grid-cols-1 min-[740px]:grid-cols-2  gap-5 min-[850px]::hidden'>
                {pendingDeliveries?.map((parcel, index) =>
                    <div className='p-4 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm flex flex-col' key={index}>
                        <div className='flex justify-between items-start gap-1'>
                            <div>
                                <h1 onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(parcel))} className='font-bold'>{parcel?.parcelName || <Skeleton width={100} />}</h1>
                                <small className='text-gray-500 dark:text-[#AAB8B4] uppercase'>{parcel?.senderNumber || <Skeleton />}</small>
                            </div>

                            {pendingDeliveries[0] ?
                                <span className='uppercase text-xs'>{parcel?.type}</span>
                                :
                                <Skeleton />}
                        </div>
                        <div className='grid grid-cols-2 gap-3 my-4'>
                            {
                                [
                                    {
                                        label: 'Assigned At',
                                        data: pendingDeliveries[0] && format(parcel?.statusHistory.find(status => status.status === "rider-assigned").time, "dd MMM p")
                                    },
                                    { label: "Weight", data: parcel?.parcelWeight || "..." },
                                    { label: "From", data: `${parcel?.senderWarehouse}, ${parcel?.senderDistrict}` },
                                    { label: "send to", data: `${parcel?.receiverWarehouse}, ${parcel?.receiverDistrict}` },

                                ].map((data, index) =>
                                    <div className={``} key={index}>
                                        <p className='text-gray-400 dark:text-[#7F918D] text-sm'>{pendingDeliveries[0] ? data.label : <Skeleton width={50} />}</p>
                                        <h1 className='font-semibold capitalize'>{pendingDeliveries[0] ? data.data : < Skeleton width={130} />}</h1>
                                    </div>
                                )
                            }
                        </div>
                        <div className='flex-1'></div>
                        < div className='flex gap-1.5  '>
                            {pendingDeliveries[0] ?

                                <button onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(parcel))} className='hidden min-[400px]:block btn flex-1 text-base rounded-lg bg-gray-100 dark:bg-white/10 font-semibold border border-gray-300 dark:border-white/10'>View</button>
                                :
                                <div className='flex-1'><Skeleton height={40} /></div>
                            }
                            {parcel ?
                                (
                                    parcel.parcel_status === "rider-assigned" && <button onClick={(e) => { e.stopPropagation(), handleAcceptDelivery(parcel._id) }} className='btn btn-primary flex-1 rounded-lg'><a>Accept Delivery</a></button> ||
                                    parcel.parcel_status === "in-transit" && <button onClick={(e) => { e.stopPropagation(), handleCompleteDelivery(parcel._id) }} className='btn btn-success flex-1 rounded-lg'><a>Complete Delivery</a></button>
                                ) :
                                <Skeleton></Skeleton>
                            }

                            {!pendingDeliveries[0] && <div className='flex-1'><Skeleton height={40} /></div>}


                        </div>


                    </div>
                )}
            </div>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box p-0 bg-transparent">

                    {
                        modalData &&
                        <div className="max-w-xl w-full bg-white dark:bg-[#071A1D] rounded-2xl shadow-2xl overflow-hidden">

                            {/* Header */}
                            <div className="bg-linear-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between dark:from-[#08262B] dark:to-[#0D1F22]">
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
                                        <p className="text-gray-400 dark:text-[#7F918D] text-xs uppercase tracking-wide">
                                            {item.label}
                                        </p>
                                        <p className="font-semibold text-base text-gray-800 mt-1">
                                            {item.value || "—"}
                                        </p>
                                    </div>
                                ))}

                                <div className="col-span-1">
                                    <p className="text-gray-400 dark:text-[#7F918D] text-xs uppercase tracking-wide">
                                        Sender Address
                                    </p>
                                    <p className="font-semibold text-base text-gray-800 mt-1">
                                        {modalData.senderAddress || "—"}
                                    </p>
                                </div>
                                {/* Pickup Instruction */}
                                <div className="col-span-1">
                                    <p className="text-gray-400 dark:text-[#7F918D] text-xs uppercase tracking-wide">
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
                                        <button onClick={() => handleAcceptDelivery(modalData._id)} className='btn  bg-primary text-white'>Accept Delivery</button>
                                        <button onClick={handleCancelRequest} className='btn  bg-error'>Cancel Request</button>
                                    </>
                                }
                                {modalData.parcel_status === "in-transit" && <button onClick={() => handleCompleteDelivery(modalData._id)} className='btn  bg-success'>Complete Delivery</button>}

                            </div>






                        </div>
                    }




                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div >
    )
}


export default PendingDeliveries;

