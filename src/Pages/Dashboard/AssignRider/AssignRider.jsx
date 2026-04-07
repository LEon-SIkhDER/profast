
import React, {  useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { RiEBike2Line } from "react-icons/ri";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
// import { useLoaderData } from 'react-router';


const AssignRider = () => {
    const axiosSecure = useAxiosSecure()
    // const warehouses = useLoaderData();
    // const [loading, setLoading] = useState(true)


    // const [parcels, setParcels] = useState([...Array(10)])

    // useEffect(() => {
    //     axiosSecure.get(`/admin/parcels?parcel_status=not-collected&payment_status=true`)
    //         .then(result => {
    //             console.log(result.data)
    //             // setParcels(result.data)
    //             // setLoading(false)
    //         })
    //         .catch(error => {
    //             // setLoading(false)
    //             console.log(error)
    //         })

    // }, [])
    const { data: parcels } = useQuery({
        queryKey: ["paid-parcels"],
        queryFn: async () => {
            const result = await axiosSecure.get(`/admin/parcels?parcel_status=not-collected&payment_status=true`)
            return result.data
        },
        placeholderData: [...Array(10)]
    })

    const [modalData, setModalData] = useState()

    const handleModalData = async (id, name, district, warehouse) => {
        const obj = { name, parcelId: id }
        // console.log(obj)
        setModalData(obj)


        console.log(district, warehouse)

        const { data } = await axiosSecure.get(`/riders?district=${district}`)
        console.log(data)
        const recommend = data.find((data) => data.chosen_warehouse === warehouse) || {}
        console.log(recommend)

        setModalData({ ...obj, recommend, data })
        console.log(modalData)
    }

    const handleAssignRider = (riderId, parcelId) => {
        document.getElementById("my_modal_1").close()

        toast.promise(
            axiosSecure.patch("http://localhost:5000/assign-rider", { riderId, parcelId })
            , {
                loading: 'Assigning',
                success: (result) => {
                    console.log(result)
                    if (result.data.modifiedCount === 1) {
                        const filteredNewParcels = parcels.filter(parcel => parcel.parcelId !== parcelId)
                        setParcels(filteredNewParcels)
                        return "Assigned"
                    }
                    else {
                        return "Assigned Failed"
                    }
                },
                error: "Something went wrong",
            })

    }

    return (
        <div>
            <Toaster />
            <table className={`table table-lg table-zebra bg-white font-medium shadow-sm rounded-2xl overflow-hidden`} >
                <thead className='bg-[#caeb66] '>
                    <tr>
                        <th className='text-center'>No.</th>
                        <th>Type</th>
                        <th>CreatedAt(Y_M_D)</th>
                        <th>Payment Status</th>
                        <th>Sender District</th>
                        <th>Sender Warehouse</th>
                        <th>Actions</th>
                        {/* <th>Favorite Color</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        parcels.map((parcel, index) =>
                            <tr key={index}>
                                <th className='text-center'>{parcel && index + 1}</th>
                                <td>{parcel?.type.toUpperCase() || <Skeleton></Skeleton>}</td>
                                <td>{parcel?.createdAt || <Skeleton></Skeleton>}</td>
                                <td className={parcel?.paymentStatus ? "text-green-500" : "text-red-500"}>{parcel ? parcel.paymentStatus ? "Paid" : "Due" : <Skeleton></Skeleton>}</td>
                                <td>{parcel?.senderDistrict || <Skeleton></Skeleton>}</td>
                                <td>{parcel?.senderWarehouse || <Skeleton></Skeleton>}</td>
                                <td className=''>
                                    {/* <div className='dropdown cursor-pointer '> */}
                                    {parcel ?
                                        <button
                                            onClick={() => {
                                                handleModalData(parcel.parcelId, parcel.parcel_name, parcel.senderDistrict, parcel.senderWarehouse)
                                                document.getElementById("my_modal_1").showModal()
                                            }}
                                            tabIndex={0}
                                            className=' cursor-pointer  btn bg-[#10B981] text-white  p-1'
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Details" >
                                            <RiEBike2Line />Assign Rider
                                        </button> :
                                        <Skeleton></Skeleton>
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
            {/* {loading && <span className='text-center block mt-5 text-2xl font-bold'>Loading...</span>} */}



            <dialog id="my_modal_1" className="modal">
                <div className="modal-box p-0 bg-transparent">
                    <div className=" bg-white rounded-xl shadow-lg overflow-hidden">

                        {/* Header */}
                        <div className="bg-linear-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-black">
                                    Select Rider for:{modalData?.name}
                                </h2>
                                <p className="text-sm text-black/70">
                                    Recommend: <span className='font-semibold'>{modalData?.recommend?.name || "no recommendation"}</span>
                                </p>
                            </div>

                            <div className="modal-action mt-0">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                            </div>

                        </div>
                        <div className='p-4  duration-300 transition-all'>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>NO.</th>
                                            <th>Name</th>
                                            <th>Warehouse</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            modalData?.data ?
                                                modalData.data.map((data, index) =>
                                                    <tr>
                                                        <th>{index + 1}</th>
                                                        <td><span className='font-semibold'>{data.name} </span><br />{modalData?.recommend?.name === data.name && <span className='text-yellow-500'>Recommend</span>}</td>
                                                        <td>{data.chosen_warehouse}</td>
                                                        <td><button onClick={() => handleAssignRider(data._id, modalData.parcelId)} className='btn btn-primary'>Assign</button></td>
                                                    </tr>
                                                ) :
                                                <tr>
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






            </dialog >




            {/* { !parcels?.length > 0 && <div className='text-center text-2xl font-semibold'>No Data Found!</div>} */}
            {/* <Tooltip id="my-tooltip" delayShow={500}  ></Tooltip> */}
            {/* {parcels?.length === 0 && <h1 className='text-center text-2xl font-bold'>No Data Found</h1>} */}
        </div >
    );
};

export default AssignRider;