import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { BsSignDoNotEnterFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import { Tooltip } from 'react-tooltip'
import './MyParcel.css'
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import { useQueries, useQuery } from '@tanstack/react-query';



const MyParcels = () => {
    const axiosSecure = useAxiosSecure()
    const [loading, setLoading] = useState(true)
    const [nonFilterData, setNonFilterData] = useState()


    const { user } = useContext(AuthContext)

    // const [parcels, setParcels] = useState([...Array(10)])

    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        fetch("/warehouses.json")
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => console.error("Failed to load districts:", err));
    }, []);



    // useEffect(() => {
    //     axiosSecure.get(`/parcels?email=${user?.email}`)
    //         .then((result) => {
    //             console.log(result)
    //             setParcels(result.data)
    //             setNonFilterData(result.data)
    //             setLoading(false)

    //         })
    //         .catch((error) => {
    //             console.log(error.response)
    //             setLoading(false)
    //         })
    // }, [])

    const { data: parcels } = useQuery({
        queryKey: ["my-parcels"],
        queryFn: async () => {
            const result = await axiosSecure.get(`/parcels?email=${user?.email}`)
            setNonFilterData(result.data)
            return result.data
        },
        placeholderData: [...Array(10)]

    })
    // console.log(parcels)

    const handleDelete = (id) => {
        // axios.delete()
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire({
                //     title: "Deleted!",
                //     text: "Your file has been deleted.",
                //     icon: "success",
                //     confirmButtonColor: "green",

                // });
                const promise = toast.loading("Deleting")
                axios.delete(`http://localhost:5000/parcel?id=${id}`)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.deletedCount === 0) {
                            toast.error("Error", { id: promise })


                        }
                        else {
                            setTimeout(() => {
                                toast.success("Deleted", { id: promise })
                                setParcels(parcels.filter((parcel) => parcel._id !== id))

                            }, 1000);
                            // filter delete 


                        }
                    })
                    .catch(error => {
                        console.log(error)
                        toast.error("Error", { id: promise })


                    })
            }
        });
    }

    // filter

    const increaseHeight = useRef()
    const sentToInputElement = useRef()
    const dropdownContainer = useRef()

    const [couldBeDistricts, setCouldBeDistricts] = useState(null)

    const handleHeight = () => {
        increaseHeight.current.classList.add("mb-24")


    }
    const handleCouldBeDistricts = (data) => {
        sentToInputElement.current.value = data
        // const temp = couldBeDistricts.find(d=>d.district.toLowerCase() === data.toLowerCase())
        setCouldBeDistricts(null)
    }
    const handleFilterDistricts = (e) => {
        console.log(districts)
        console.log(e.target.value)
        if (e.target.value.trim() === "") {
            return setCouldBeDistricts(null)
        }
        const temp = districts.filter((d) => d.district.toLowerCase().startsWith(e.target.value.trim().toLowerCase()))
        setCouldBeDistricts(temp)
        console.log(temp)

    }
    const handleFilter = (e) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.target))
        console.log(formData)
        const filteredParcels = nonFilterData.filter(data => {
            const typeMatch = !formData.type || data.type === formData.type
            const paymentStatusMatch = !formData.paymentStatus || data.paymentStatus === (formData.paymentStatus === "true")
            const receiverDistrictMatch = !formData.receiverDistrict || data.receiverDistrict.toLowerCase() === formData.receiverDistrict
            const costMatch = !formData.minCost && !formData.maxCost || data.cost >= Number(formData.minCost) && data.cost <= Number(formData.maxCost)
            const dateMatch = !formData.form && !formData.to || new Date(data.createdAt) >= new Date(formData.from) && new Date(data.createdAt) <= new Date(formData.to)
            return typeMatch && paymentStatusMatch && receiverDistrictMatch && costMatch && dateMatch
        })
        setParcels(filteredParcels)
        document.activeElement.blur()
    }







    return (
        <div className="">
            <div className=' mb-5  flex justify-end'>

                <div ref={dropdownContainer} className="dropdown dropdown-end ">
                    <button

                        tabIndex={0}
                        className="btn  text-black border-none bg-linear-to-r from-[#caeb66] to-[#a8d94a]  border-2 border-[#b7db4f] 
                           hover:from-[#bfe85a] hover:to-[#97c83f] 
                           shadow-md rounded-lg font-semibold text-base"
                    >
                        Filters <IoIosArrowDown />
                    </button>
                    <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-max p-5 shadow-sm mt-2">
                        <form onSubmit={handleFilter} className='space-y-5'>
                            {/* data type  */}
                            <div className='flex justify-between gap-10 '>
                                <h1 className='text-lg font-bold'>Type</h1>
                                <div className='font-medium w-44 flex flex-col items-start gap-2'>
                                    <div>
                                        <input type="radio" name="type" className="radio radio-success" value={"document"} />
                                        <label className='mr-5 ml-1'>Document</label>

                                    </div>
                                    <div>

                                        <input type="radio" name="type" className="radio radio-success" value={"non-document"} />
                                        <label className='ml-1'>Non Document</label>
                                    </div>
                                </div>
                            </div>
                            {/* creation date  */}
                            <div className='flex justify-between gap-10 items-start '>
                                <h1 className='text-lg font-bold'>Creation Date</h1>

                                <div className=' max-w-44'>
                                    <label className='font-medium'>From<input type="date" className="input " name='from' /></label>
                                    <label className='font-medium '>To<input type="date" className="input " name='to' /></label>

                                </div>
                            </div>
                            {/* payment status  */}
                            <div className='flex justify-between'>
                                <h1 className='text-lg font-bold'>Payments Status</h1>
                                <div className=' w-44 flex items-start'>
                                    <input type="radio" name="paymentStatus" className="radio radio-success" value={"true"} />
                                    <label className='mr-5 ml-1'>Paid</label>
                                    <input type="radio" name="paymentStatus" className="radio radio-success" value={"false"} />
                                    <label className='ml-1'>Due</label>
                                </div>

                            </div>
                            {/* cost  */}
                            <div className='flex justify-between'>
                                <h1 className='text-lg font-bold'>Cost </h1>
                                <div className='flex items-center gap-0.5 max-w-44 '>
                                    <input type="number" className='input ' placeholder='Min' name='minCost' />
                                    <span className='font-bold '>-</span>
                                    <input type="number" className='input ' placeholder='Max' name='maxCost' />
                                </div>
                            </div>
                            {/* sent to */}
                            <div className='flex justify-between duration-300 ease-[cubic-bezier(0.15, 0.22, 0.36, 0.98)]' ref={increaseHeight}>
                                <h1 className='text-lg font-bold'>Sent To(district)</h1>
                                <div className=' max-w-44 relative'>
                                    <input
                                        ref={sentToInputElement}
                                        onClick={handleHeight}
                                        onChange={handleFilterDistricts} type="text" className='input' placeholder='Search as you type' name='receiverDistrict' />
                                    {couldBeDistricts &&
                                        <ul className='p-2 mt-2 shadow overflow-y-auto max-h-20 absolute top-full right-0 bg-white w-full'>
                                            {
                                                couldBeDistricts?.map((d, index) =>
                                                    <li onClick={() => handleCouldBeDistricts(d.district)}
                                                        className={`
                                                            ${index + 1 !== couldBeDistricts.length && "border-b border-b-gray-200"}
                                                            text-base py-1 px-2 font-medium  hover:bg-gray-100 cursor-pointer`} key={index}>{d.district}</li>
                                                )
                                            }
                                        </ul>
                                    }
                                </div>
                            </div>





                            <div className='flex justify-between border-t border-t-gray-200 pt-5 mt-5'>
                                <button type='reset' className='cursor-pointer underline hover:text-gray-600'>Clear All</button>
                                <button className='btn btn-custom ' disabled={parcels?.length === 0}>Apply Filters</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Toaster />
            <table className={`table table-lg table-zebra bg-white font-medium shadow-sm ${parcels?.length > 2 ? "rounded-2xl overflow-hidden" : "rounded-none"}`} >
                <thead className='bg-[#caeb66] '>
                    <tr>
                        <th className='text-center'>No.</th>
                        <th>Type</th>
                        <th>CreatedAt(Y_M_D)</th>
                        <th>Payment Status</th>
                        <th>Cost</th>
                        <th>Send To</th>
                        <th>Actions</th>
                        {/* <th>Favorite Color</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        parcels?.map((parcel, index) =>
                            <tr key={index}>
                                <th className='text-center'>{parcel && index + 1}</th>
                                <td>{parcel?.type.toUpperCase() || <Skeleton></Skeleton>}</td>
                                <td>{parcel?.createdAt || <Skeleton></Skeleton>}</td>
                                <td className={parcel?.paymentStatus ? "text-green-500" : "text-red-500"}>{parcel ? parcel.paymentStatus ? "Paid" : "Due" : <Skeleton></Skeleton>}</td>
                                <td>{parcel ? `$${parcel.cost}` : <Skeleton></Skeleton>}</td>
                                <td>{parcel?.receiverDistrict || <Skeleton></Skeleton>}</td>
                                <td className=''>
                                    <div className='dropdown cursor-pointer '>
                                        <button tabIndex={0} disabled={loading} className=' cursor-pointer  relative p-1' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                            <BsThreeDotsVertical />
                                        </button>
                                        <ul tabIndex={0} className={`menu absolute ${parcels.length > 2 && index >= parcels.length - 2 ? "bottom-0" : "top-0"} right-full max-w-screen max-h-screen dropdown-content bg-base-100 rounded-box z-1 w-44 p-2 shadow-sm font-medium  `}>
                                            <li ><Link to={`my-parcel/${parcel?._id}`}>View</Link></li>
                                            <li className='border-y border-gray-200 text-gray-300'><a>Edit</a></li>
                                            <li onClick={() => { handleDelete(parcel?._id) }} className='text-red-500'><a>Delete</a></li>
                                            {!parcel?.paymentStatus && <li className='border-t border-gray-200'><Link to={`/dashboard/payment/${parcel?._id}`}>Pay</Link></li>}
                                        </ul>
                                    </div>
                                </td>
                                {/* <td>Blue</td> */}
                            </tr>
                        )

                    }



                    {/* <div className='w-full h-[63px] bg-black'></div>  */}
                </tbody>
            </table>
            {/* { !parcels?.length > 0 && <div className='text-center text-2xl font-semibold'>No Data Found!</div>} */}
            <Tooltip id="my-tooltip" delayShow={500}  ></Tooltip>
            {parcels?.length === 0 && <h1 className='text-center text-2xl font-bold mt-5'>No Data Found!</h1>}

        </div>
    );
};

export default MyParcels;