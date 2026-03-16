import axios from 'axios';
import React, {  useEffect, useState } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import { Check, Link, Warehouse, X } from 'lucide-react';
import { format } from 'date-fns';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PendingRiders = () => {

    const axiosSecure = useAxiosSecure()


    const [riders, setRiders] = useState()

    useEffect(() => {
        axiosSecure.get(`http://localhost:5000/pending-riders`)
            .then(result => {
                console.log(result)
                setRiders(result.data)
            })
    }, [])
    // modal 
    const [modalData, setModalData] = useState()

    // Accept Rider
    const handleAcceptRider = (id, status) => {
        if (status === "Approved") {
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

                    riderStatusUpdate(id, "Approved")
                }
            });
        }
        else if (status === "Rejected") {
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
                    console.log("Rejected");

                    riderStatusUpdate(id, "Rejected")
                }
            });

        }


    }
    const riderStatusUpdate = (id, status) => {
        toast.promise(
            axios.patch(`http://localhost:5000/pending-riders?id=${id}`, { status }),
            {
                loading: "Updating",
                success: (result) => {
                    console.log(result)
                    if (result.data.modifiedCount === 1) {
                        const filteredRiders = riders.filter(data=>data._id !== id)
                        setRiders(filteredRiders)
                        return "Accepted"
                    }
                    else {
                        toast.error('Update Failed!')
                    }
                },
                error:"Something went wrong!"
            }
        )       
    }
    // Reject Rider 
    



    return (
        <div>
            <Toaster />
            <div className="">
                <table className={`table table-lg table-zebra bg-white font-medium shadow-sm ${riders?.length > 2 ? "rounded-2xl overflow-hidden" : "rounded-none"}`}>
                    <thead className='bg-[#caeb66]'>
                        <tr>
                            <th className='text-center'>No.</th>
                            <th>Name</th>
                            <th>Warehouse</th>
                            <th>Age</th>
                            <th>Requested At</th>
                            <th>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            riders?.map((data, index) =>
                                <tr key={index}>
                                    <th className='text-center'>{index + 1}</th>
                                    <td>{data.name}</td>
                                    <td>{data.chosen_warehouse}</td>
                                    <td>{data.age}</td>
                                    <td>{format(new Date(data.created_At), "dd/MM/yyyy")}</td>
                                    <td className=''>
                                        <div className='dropdown cursor-pointer'>
                                            <button tabIndex={0} className=' cursor-pointer  relative ' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                <BsThreeDotsVertical />
                                            </button>
                                            <ul tabIndex={0} className={`menu absolute ${riders.length > 2 && index >= riders.length - 2 ? "bottom-0" : "top-0"} right-full max-w-screen max-h-screen dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
                                                <li onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}><a>View</a></li>
                                                <li onClick={() => handleAcceptRider(data._id, "Approved")} className='text-green-500'><a>Accept<Check size={16} /></a></li>
                                                <li onClick={() => handleAcceptRider(data._id, "Rejected")} className='text-red-500'><a>Reject <X size={16} /></a></li>
                                                {/* {data.paymentStatus && <li className='border-t border-gray-200'><Link to={`/dashboard/payment/${data._id}`}>Pay</Link></li>} */}
                                            </ul>
                                        </div>
                                    </td>

                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box p-0 bg-transparent">

                    {
                        modalData &&
                        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden">

                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between">
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
                                        <button className="cursor-pointer p-2">X</button>
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

                                <button onClick={() => {handleAcceptRider(modalData._id, "Approved"), document.getElementById("my_modal_1").close();}} className="btn btn-outline btn-error ">
                                    Reject
                                </button>

                                <button onClick={() => {handleAcceptRider(modalData._id, "Rejected"), document.getElementById("my_modal_1").close();}} className="btn btn-custom font-medium rounded">
                                    Approve Rider
                                </button>

                            </div>

                        </div>
                    }




                </div>
            </dialog>
        </div>
    );
};

export default PendingRiders;