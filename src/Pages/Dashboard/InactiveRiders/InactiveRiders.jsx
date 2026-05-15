import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import { Check, X } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import NoDataFound from '../../../Components/NoDataFound';

const InactiveRiders = () => {
    const axiosSecure = useAxiosSecure()
    const [defaultLength, setDefaultLength] = useState(8)
    const [search, setSearch] = useState("")
    const { data: inactiveRiders, isLoading, refetch } = useQuery({
        queryKey: ['inactiveRiders', search],
        queryFn: async () => {
            const result = await axiosSecure.get(`/riders?status=inactive&search=${search}`)
            setDefaultLength(result.data.length)
            return result.data
        },
        placeholderData: [...Array(defaultLength)]
    })
    console.log(inactiveRiders)
    // modal data related code 
    const [modalData, setModalData] = useState()

    // search function.....................
    const handleSearch = (e) => {
        e.preventDefault()
        setTimeout(() => {
            setSearch(e.target.search?.value || e.target.value)
        }, 500);
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
            confirmButtonText: "Yes, Activate!"
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(
                    axiosSecure.patch(`/pending-riders?id=${id}`, { status: "active" }),
                    {
                        loading: "Activating",
                        success: async (result) => {
                            if (result.data.modifiedCount === 1) {
                                const res = await refetch()
                                if (res) {
                                    return "Activated"
                                }
                            }
                            else {
                                return "Update Failed"
                            }
                        },
                        error: "Something went wrong"
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

                        <button className="px-4 flex items-center gap-2 font-semibold text-black bg-linear-to-r from-[#caeb66] to-[#a8d94a] border-2 border-l-0 border-[#b7db4f] rounded-r-lg shadow-md hover:from-[#bfe85a] hover:to-[#97c83f]">
                            Search
                        </button>
                    </form>
                </div>
                <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 overflow-hidden'>
                    <div className='p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                        <h1 className='text-2xl font-bold '>Inactive Riders {inactiveRiders[0] && (inactiveRiders.length < 9 ? `(0${inactiveRiders.length})` : `(${inactiveRiders.length})`)}</h1>
                        <p className='text-sm text-gray-500 mt-1'>Review every parcel you have already delivered and inspect its route details anytime.</p>
                    </div>
                    <table className={`table table-lg table-zebra bg-white font-medium `}>
                        <thead className='bg-[#caeb66]'>
                            <tr className='text-black'>
                                <th className='text-center'>No.</th>
                                <th>Name</th>
                                <th>District</th>
                                <th>Warehouse</th>
                                <th>Age</th>
                                <th>Requested At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                inactiveRiders?.map((data, index) =>
                                    <tr key={index}>
                                        <th className='text-center'>{data && index + 1}</th>
                                        <td
                                            onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}
                                            className='max-w-[150px] truncate cursor-pointer'
                                        >{data?.name || <Skeleton></Skeleton>}</td>
                                        <td>{data?.district || <Skeleton></Skeleton>}</td>
                                        <td>{data?.chosen_warehouse || <Skeleton></Skeleton>}</td>
                                        <td>{data?.age || <Skeleton></Skeleton>}</td>
                                        <td>{data ? format(new Date(data.created_At), "dd/MM/yyyy") : <Skeleton></Skeleton>}</td>
                                        <td className=''>
                                            <div className='dropdown cursor-pointer'>
                                                <button disabled={isLoading} tabIndex={0} className=' cursor-pointer  relative ' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                    <BsThreeDotsVertical />
                                                </button>
                                                <ul tabIndex={0} className={`menu absolute ${index >= inactiveRiders.length - 2 ? "bottom-0" : "top-0"} right-full max-w-screen max-h-screen dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
                                                    <li onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}><a>View</a></li>
                                                    {/* <li className='text-green-500'><a>Accept<Check size={16} /></a></li> */}
                                                    <li onClick={() => handleActive(data?._id)} className='text-green-500'><a>Active<Check size={16} /></a></li>
                                                    {/* {data.paymentStatus && <li className='border-t border-gray-200'><Link to={`/dashboard/payment/${data._id}`}>Pay</Link></li>} */}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                    {!isLoading && !inactiveRiders?.length > 0 && <NoDataFound data={'Inactive Riders'}></NoDataFound>}
                </div>
                {/* {loading && <span className='block text-2xl font-bold text-center mt-5'>Loading...</span>} */}
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
                                        {/* if there is a button in form, it will close the modal */}
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

export default InactiveRiders;