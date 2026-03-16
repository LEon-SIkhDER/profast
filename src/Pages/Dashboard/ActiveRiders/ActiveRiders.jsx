import axios from 'axios';
import { format } from 'date-fns';
import { Check, UserStar, X } from 'lucide-react';
import React, {  useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BsThreeDotsVertical } from 'react-icons/bs';
// import { data } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ActiveRiders = () => {

    const axiosSecure = useAxiosSecure()

    const [riders, setRiders] = useState()


    useEffect(() => {
        axiosSecure.get("http://localhost:5000/riders")
            .then(result => {
                console.log(result)
                setRiders(result.data)
            })
            .catch(error => console.log(error.response.data.message))
    }, [])

    const [modalData, setModalData] = useState()

    const handleSearch = (e) => {
        e.preventDefault()

        const search = e.target.search?.value || e.target.value

        axiosSecure.get(`http://localhost:5000/riders?search=${search}`)
            .then(result => {
                console.log(result)
                setRiders(result.data)
            })
            .catch(error => console.log(error))

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
                    axios.patch(`http://localhost:5000/pending-riders?id=${id}`, { status: "deactivated" }),
                    {
                        loading: "Updating",
                        success: (result) => {
                            console.log(result)
                            if (result.data.modifiedCount === 1) {
                                const filteredRiders = riders.filter(data => data._id !== id)
                                setRiders(filteredRiders)
                                return "Deactivated"

                            }
                            else {
                                toast.error('Update Failed!')
                            }
                        },
                        error: "Something went wrong!"
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
                            className="flex-1 px-4 py-2 border-2 border-[#b7db4f] rounded-l-lg outline-none focus:ring-2 focus:ring-[#caeb66]"
                        />

                        <button className="px-4 flex items-center gap-2 font-semibold text-black bg-gradient-to-r from-[#caeb66] to-[#a8d94a] border-2 border-l-0 border-[#b7db4f] rounded-r-lg shadow-md hover:from-[#bfe85a] hover:to-[#97c83f]">
                            Search
                        </button>
                    </form>
                </div>
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
                                                {/* <li className='text-green-500'><a>Accept<Check size={16} /></a></li> */}
                                                <li onClick={() => handleDeactivate(data._id)} className='text-red-500'><a>Deactivate<X size={16} /></a></li>
                                                {/* {data.paymentStatus && <li className='border-t border-gray-200'><Link to={`/dashboard/payment/${data._id}`}>Pay</Link></li>} */}
                                            </ul>
                                        </div>
                                    </td>

                                </tr>
                            )
                        }


                    </tbody>
                </table>
                {!riders?.length > 0 && <div className='text-center text-xl font-bold'>No Data Found</div>}
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