
import React, { useRef, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { RiEBike2Line } from "react-icons/ri";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import NoDataFound from '../../../Components/NoDataFound';
import { Clock } from 'lucide-react';
// import { useLoaderData } from 'react-router';


const AssignRider = () => {
    const axiosSecure = useAxiosSecure()
    // const warehouses = useLoaderData();
    // const [loading, setLoading] = useState(true)


    // const [parcels, setParcels] = useState([...Array(10)])

    // useEffect(() => {
    //     axiosSecure.get(`/admin/parcels?parcel_status=not-collected&payment_status=true`)
    //         .then(result => {
    //             // setParcels(result.data)
    //             // setLoading(false)
    //         })
    //         .catch(error => {
    //             // setLoading(false)
    //         })

    // }, [])
    const { data: parcels, refetch } = useQuery({
        queryKey: ["paid-parcels"],
        queryFn: async () => {
            const result = await axiosSecure.get(`/admin/parcels?parcel_status=not-collected&payment_status=true`)
            // return [...Array(10)]
            return result.data

        },
        placeholderData: [...Array(10)]
    })

    const [modalData, setModalData] = useState()

    const handleModalData = async (id, name, district, warehouse) => {
        const obj = { name, parcelId: id }
        setModalData(obj)


        console.log(district, warehouse)

        const { data } = await axiosSecure.get(`/riders?district=${district}`)
        console.log(data)
        const recommend = data.find((data) => data.chosen_warehouse === warehouse) || {}
        console.log(recommend)

        setModalData({ ...obj, recommend, data })
        console.log(modalData)
    }

    const handleAssignRider = (parcelId, riderId, riderEmail) => {
        document.getElementById("my_modal_1").close()

        toast.promise(
            axiosSecure.patch("/assign-rider", { parcelId, riderId, riderEmail })
                .then(async (result) => {
                    if (result.data.modifiedCount !== 1) {
                        throw new Error("Update failed")
                    }
                    await refetch()
                    return result
                })
            ,
            {
                loading: 'Assigning',
                success: "Assigned",
                error: (err) => err.message || "Something Went Wrong"
            }
        )

    }
    console.log(parcels)
    const riderModal = useRef()
    const [riderModalData, setRiderModalData] = useState()
    const riderDetailsModal = (id) => {
        document.getElementById("my_modal_1").close()
        console.log(modalData)
        const riderData = modalData.data.find(data => data._id == id)
        setRiderModalData(riderData)
        riderModal.current.showModal()


    }
    const assignModal = useRef()
    console.log({ riderModalData, modalData })

    return (
        <div>
            <Toaster />

            {/* <div className='grid grid-cols-4 gap-5 mb-8'>
                {[
                    {
                        title: "pending",
                        icon: <Clock />,
                        data: parcels.length,
                        description: "Waiting for rider"
                    },

                ].map((data, index) =>
                    <div className='p5 shadow-sm p-5 rounded-2xl' key={index}>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-xl font-semibold capitalize'>{data.title}</h1>
                            <span className='bg-[#caeb66]/40 text-[#526d01] h-10 w-10 rounded-xl flex items-center justify-center'>{data.icon}</span>
                        </div>
                        <h1 className={`text-2xl font-bold ${parcels[0] && "text-red-500"}`}>{parcels[0] ? data.data : "..."}</h1>
                        <p className='first-letter:uppercase text-sm mt-5'>{data.description}.</p>
                    </div>
                )}
            </div> */}



            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 overflow-hidden'>
                <div className='p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <h1 className='text-2xl font-bold '>Assign Riders  {parcels[0] && (parcels.length < 9 ? `(0${parcels.length})` : `(${parcels.length})`)}</h1>
                    <p className='text-sm text-gray-500 mt-1'>Rider assignment for parcel delivery.</p>
                </div>
                <table className={` table-lg table-zebra bg-white font-medium hidden min-[850px]:table`} >
                    <thead className='bg-[#caeb66] '>
                        <tr className='*:px-3 sm:px-5  sm:*:py-4'>
                            <th className='text-center'>No.</th>
                            <th>Name</th>
                            <th className='hidden min-[1500px]:block'>Type</th>
                            <th>CreatedAt</th>
                            <th>Payment</th>
                            <th className='hidden lg:block'>Cost</th>
                            <th>Sender District</th>
                            <th>Sender Warehouse</th>
                            <th>Actions</th>
                            {/* <th>Favorite Color</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            parcels.map((parcel, index) =>
                                <tr key={index} className='*:px-3 sm:px-5  sm:*:py-4'>
                                    <th className='text-center'>{parcel ? index + 1 : <Skeleton></Skeleton>}</th>
                                    <td className='max-w-[150px] truncate'>{parcel ? <><h1>{parcel.parcelName}</h1> <small className='block min-[1500px]:hidden capitalize'>{parcel.type}</small> </> : <Skeleton></Skeleton>}</td>
                                    <td className='hidden min-[1500px]:block'>{parcel?.type.toUpperCase() || <Skeleton></Skeleton>}</td>
                                    <td className='min-w-full'>{parcel ? format(parcel.createdAt, "PP") : <Skeleton></Skeleton>}</td>
                                    <td className={parcel?.paymentStatus ? "text-green-500" : "text-red-500"}>{parcel ? <><h1>{parcel.paymentStatus ? "Paid" : "Due"}</h1> <h2 className='block lg:hidden'>{parcel.cost}৳</h2> </> : <Skeleton></Skeleton>}</td>
                                    <td className='hidden lg:table-cell'>{parcel ? `${parcel.cost}৳` : <Skeleton></Skeleton>}</td>
                                    <td>{parcel?.senderDistrict || <Skeleton></Skeleton>}</td>
                                    <td>{parcel?.senderWarehouse || <Skeleton></Skeleton>}</td>
                                    <td className=''>
                                        {/* <div className='dropdown cursor-pointer '> */}
                                        {parcel ?
                                            <button
                                                onClick={() => {
                                                    handleModalData(parcel.parcelId, parcel.parcelName, parcel.senderDistrict, parcel.senderWarehouse)
                                                    document.getElementById("my_modal_1").showModal()
                                                    // console.log(parcel)
                                                }}
                                                tabIndex={0}
                                                className=' cursor-pointer  btn bg-[#10B981] text-white  p-1 min-w-[100px]'
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content="Details" >
                                                <RiEBike2Line size={18} />Assign Rider
                                            </button> :
                                            <Skeleton ></Skeleton>
                                        }

                                        {/* </div> */}
                                    </td>
                                    {/* <td>Blue</td> */}
                                </tr>
                            )

                        }

                        {/* <div className='w-full h-[63px] bg-black'></div>  */}
                    </tbody>
                </table>
                {parcels.length === 0 && <NoDataFound data={"parcel"}></NoDataFound>}
            </div>
            {/* {loading && <span className='text-center block mt-5 text-2xl font-bold'>Loading...</span>} */}
            {/* Mobile Cards */}


            {/* mobile cards */}
            <div className='grid sm:grid-cols-2 gap-5 mt-5 min-[850px]:hidden'>
                {
                    parcels.map(parcel =>
                        <div className='p-4 shadow rounded-2xl bg-white'>
                            <div className='flex justify-between items-start gap-1'>
                                <div>
                                    <h1 className='font-bold'>{parcel?.parcelName || <Skeleton width={100} />}</h1>
                                    <p className='text-xs text-gray-500 mt-1'>{parcel?.parcelId || <Skeleton width={150} />}</p>
                                </div>
                                {parcel ?
                                    <h2 className='capitalize text-xs text-emerald-950 bg-[#CAEB66]/30 rounded-full px-2 py-1'>{parcel.type}</h2>
                                    :
                                    <Skeleton width={120} />
                                }
                            </div>

                            <div className='*:text-sm my-5 space-y-2'>

                                <div className='flex justify-between gap-1'>
                                    <h2 className='text-gray-500'>{parcel ? "District" : <Skeleton width={100} />}</h2>
                                    <h1 className='font-medium text-black'>{parcel?.senderDistrict || <Skeleton width={100}></Skeleton>}</h1>
                                </div>
                                <div className='flex justify-between gap-1'>
                                    <h2 className='text-gray-500'>{parcel ? "Warehouse" : <Skeleton width={100} />}</h2>
                                    <h1 className='font-medium text-black'>{parcel?.senderWarehouse || <Skeleton width={100}></Skeleton>}</h1>
                                </div>
                                <div className='flex justify-between gap-1'>
                                    <h2 className='text-gray-500'>{parcel ? "Created" : <Skeleton width={100} />}</h2>
                                    <h1 className='font-medium text-black'>{parcel ? format(parcel.createdAt, "dd MMM yyyy") : <Skeleton width={100}></Skeleton>}</h1>
                                </div>
                                <div className='flex justify-between gap-1'>
                                    <h2 className='text-gray-500'>{parcel ? "Payment" : <Skeleton width={100} />}</h2>
                                    <h1 className={`${parcel?.paymentStatus ? "text-success" : "text-error"} font-semibold text-black `}>{parcel ? (parcel.paymentStatus ? "Paid" : "Due") : <Skeleton width={100}></Skeleton>}</h1>
                                </div>

                            </div>
                            <div>

                                {parcel ?
                                    <button
                                        onClick={() => {
                                            handleModalData(parcel.parcelId, parcel.parcelName, parcel.senderDistrict, parcel.senderWarehouse)
                                            document.getElementById("my_modal_1").showModal()
                                            // console.log(parcel)
                                        }}
                                        tabIndex={0}
                                        className=' cursor-pointer  btn w-full bg-[#10B981] text-white  p-1 min-w-[100px]'
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content="Details" >
                                        <RiEBike2Line size={18} />Assign Rider
                                    </button> :
                                    <Skeleton height={40}></Skeleton>
                                }
                            </div>





                        </div>
                    )
                }
            </div>




            <dialog id="my_modal_1" ref={assignModal} className="modal">
                <div className="modal-box p-0 bg-transparent">
                    <div className=" bg-white rounded-xl shadow-lg overflow-hidden">

                        {/* Header */}
                        <div className="bg-linear-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between gap-1">
                            <div>
                                <h2 className="text-2xl font-bold text-black">
                                    Select Rider for:{modalData?.name}
                                </h2>
                                <p className="text-sm text-black/70">
                                    Recommend: <span className='font-semibold'>{modalData?.recommend?.name || "No Recommendation"}</span>
                                </p>
                            </div>

                            <div className="modal-action mt-0">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                            </div>

                        </div>
                        <div className='py-4 px-2  duration-300 transition-all'>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr className='*:px-2 *:py-1'>
                                            <th className='text-center'>NO.</th>
                                            <th>Name</th>
                                            <th>Warehouse</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            modalData?.data ?
                                                modalData.data.map((data, index) =>
                                                    <tr className='*:px-2 *:py-1'>
                                                        <th className='text-center'>{index + 1}</th>
                                                        <td
                                                            className='cursor-pointer'
                                                            onClick={() => riderDetailsModal(data._id)}>
                                                            <span className='font-semibold capitalize'>{data.name} </span>
                                                            <br />
                                                            <h6 className='text-xs font-semibold text-gray-600'>Assigned:{data.currentAssignedDeliveries}</h6>
                                                            {/* <br /> */}
                                                            {modalData?.recommend?.name === data.name && <span className='text-yellow-500'>Recommend</span>}
                                                        </td>
                                                        <td>{data.chosen_warehouse}</td>
                                                        <td><button onClick={() => handleAssignRider(modalData.parcelId, data._id, data.email)} className='btn btn-primary my-2'>Assign</button></td>
                                                    </tr>
                                                ) :
                                                <tr className='*:px-2 *:py-1'>
                                                    <th><Skeleton height={20} /></th>
                                                    <td><Skeleton height={20} /></td>
                                                    <td><Skeleton height={20} /></td>
                                                    <td><Skeleton height={20} /></td>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                                {modalData?.data?.length === 0 && <span className='font-bold text-center text-xl block mt-2'>No Riders Found</span>}
                            </div>
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
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>






            </dialog >

            <dialog id="my_modal_9" ref={riderModal} className="modal">
                <div className="modal-box p-0 bg-transparent">

                    {
                        riderModalData &&
                        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden">

                            {/* Header */}
                            <div className="bg-linear-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-black">
                                        Rider Details
                                    </h2>
                                    <p className="text-sm text-black/70">
                                        Name:{riderModalData.name}
                                    </p>
                                </div>

                                <div className="modal-action mt-0">
                                    <form method="dialog">

                                        <button onClick={() => assignModal.current.showModal()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                </div>

                            </div>

                            {/* Body */}
                            <div className="p-6 grid grid-cols-2 gap-5">

                                <div>
                                    <p className="text-gray-500 text-sm">Name</p>
                                    <p className="font-semibold text-base">{riderModalData.name}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Age</p>
                                    <p className="font-semibold text-base">{riderModalData.age}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p className="font-semibold text-base">{riderModalData.email}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Phone</p>
                                    <p className="font-semibold text-base">{riderModalData.number}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Division</p>
                                    <p className="font-semibold text-base">{riderModalData.division}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">District</p>
                                    <p className="font-semibold text-base">{riderModalData.district}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Warehouse</p>
                                    <p className="font-semibold text-base">{riderModalData.chosen_warehouse}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Status</p>
                                    <p className={`font-semibold text-xs mt-1 px-3 py-1 rounded-full inline-block ${riderModalData.status === "pending" ? "text-yellow-600 bg-yellow-100" : "text-green-600 bg-green-100"
                                        }`}>
                                        {riderModalData.status}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-gray-500 text-sm">Completed Deliveries</p>
                                    <p className="font-semibold text-base">{riderModalData.completedDeliveries}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Currently Assigned</p>
                                    <p className="font-semibold text-base">{riderModalData.currentAssignedDeliveries}</p>
                                </div>




                                <div >
                                    <p className="text-gray-500 text-sm">Applied At</p>
                                    <p className="font-semibold text-base">
                                        {format(new Date(riderModalData.created_At), "dd/MM/yyyy")}
                                    </p>
                                </div>

                                <div >
                                    <p className="text-gray-500 text-sm">Joined Since</p>
                                    <p className="font-semibold text-base">
                                        {format(new Date(riderModalData.joinedAt), "dd/MM/yyyy")}
                                    </p>
                                </div>

                            </div>




                        </div>
                    }




                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>




            {/* { !parcels?.length > 0 && <div className='text-center text-2xl font-semibold'>No Data Found!</div>} */}
            {/* <Tooltip id="my-tooltip" delayShow={500}  ></Tooltip> */}
            {/* {parcels?.length === 0 && <h1 className='text-center text-2xl font-bold'>No Data Found</h1>} */}
        </div >
    );
};

export default AssignRider;
