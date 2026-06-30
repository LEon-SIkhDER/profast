import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { BsSignDoNotEnterFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import { Tooltip } from 'react-tooltip'
import './MyParcel.css'
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarDays, CheckCheck, Clock, CreditCard, Eye, MapPin, Package, PackageSearch, Search, Trash2, UserRound } from 'lucide-react';
import NoDataFound from '../../Components/NoDataFound';



const MyParcels = () => {
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    const { user, theme } = useContext(AuthContext)
    const isDark = theme === "dark" ? true : false
    const [districts, setDistricts] = useState([]);
    useEffect(() => {
        fetch("/warehouses.json")
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => console.error("Failed to load districts:", err));
    }, []);



    const [myParcelLS, setMyParcelLS] = useState(() => {
        const result = localStorage.getItem("myParcelLS")
        if (result) return JSON.parse(result)
        return { dataCount: 0, dueCount: 0 }
    })
    // const [ ]

    const handleMyParcelLS = (dataCount, dueCount) => {
        localStorage.setItem('myParcelLS', JSON.stringify({ dataCount, dueCount }))
        setMyParcelLS({ dataCount, dueCount })
    }

    useEffect(() => {
        return () => localStorage.removeItem('myParcelLS')
    }, [])





    const [search, setSearch] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const { data: parcels, isLoading, refetch } = useQuery({
        queryKey: ["my-parcels", user.email, search],
        queryFn: async () => {
            const result = await axiosSecure.get(`/parcels?email=${user?.email}&search=${search}`)
            if (!search) {
                const paymentDue = result.data?.filter((parcel) => parcel.paymentStatus === false).length
                handleMyParcelLS(result.data.length, paymentDue)
            }
            setNonFilterData(result.data)
            setSearchLoading(false)
            console.log(result)
            return result.data
        },
        placeholderData: [...Array(10)]
    })
    const [nonFilterData, setNonFilterData] = useState(parcels || [...Array(10)])
    const handleDelete = (id) => {
        // axios.delete()
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            color: isDark ? "#F8FAFC" : "#111827",
            background: isDark ? "#0F172A" : "#FFFFFF",
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(
                    axiosSecure.delete(`https://profast-server-henna.vercel.app/parcel?id=${id}`)
                        .then(async (result) => {
                            if (result.data.deletedCount !== 1) {
                                throw new Error('Delete Failed')
                            }
                            await refetch()
                            return result
                        })
                    ,
                    {
                        loading: "Deleting",
                        success: "Deleted",
                        error: (err) => err.message || "Something went wrong"
                    }
                )
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
        // console.log(formData)
        console.log(nonFilterData)
        // setNonFilterData(parcels)
        // const dataForFilter = nonFilterData.length === 0 ? parcels : nonFilterData
        const filteredParcels = parcels.filter(data => {
            const typeMatch = !formData.type || data.type === formData.type
            const paymentStatusMatch = !formData.paymentStatus || data.paymentStatus === (formData.paymentStatus === "true")
            const receiverDistrictMatch = !formData.receiverDistrict || data.receiverDistrict.toLowerCase() === formData.receiverDistrict.toLowerCase()
            const costMatch = !formData.minCost && !formData.maxCost || data.cost >= Number(formData.minCost) && data.cost <= Number(formData.maxCost)
            const dateMatch = !formData.from && !formData.to || new Date(data.createdAt) >= new Date(formData.from) && new Date(data.createdAt) <= new Date(formData.to)
            return typeMatch && paymentStatusMatch && receiverDistrictMatch && costMatch && dateMatch
        })
        setNonFilterData(filteredParcels)
        document.activeElement.blur()
    }

    const disabledSearch = !parcels?.[0] && !searchLoading && myParcelLS.dataCount == 0

    const timeOutID = useRef()

    const handleSearch = (e) => {
        e.preventDefault()
        if (disabledSearch) return

        clearTimeout(timeOutID.current)
        if (parcels.length === 0) {
            return
        }
        if (e.target.search?.value) {
            setSearchLoading(true)
        }
        const name = e.target.search?.value || e.target.value
        timeOutID.current = setTimeout(() => {
            setSearch(name)
            console.log(name)
        }, 500)


    }



    return (
        <div className="">
            <Toaster></Toaster>
            <div className='flex  gap-2  sm:gap-5 '>

                {[
                    {
                        title: "total parcels",
                        icon: <CheckCheck />,
                        data: myParcelLS.dataCount === 0 ? "..." : myParcelLS.dataCount,
                        description: "total parcel count"
                    },
                    {
                        title: "payment due",
                        icon: <Clock />,
                        data: myParcelLS.dueCount === 0 ? "..." : myParcelLS.dueCount,
                        description: "total payment due"
                    },



                ].map((data, index) =>
                    <div className='bg-white dark:bg-[#071A1D] shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 dark:border-white/10 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 dark:hover:border-cyan-400/50' key={index}>
                        <div className='flex  justify-between gap-2 xs:gap-5 items-center'>
                            <h1 className='text-base xxs:text-xl font-semibold capitalize '>{data.title}</h1>
                            <span className='bg-[#caeb66]/40 dark:bg-cyan-400/15 text-[#526d01] dark:text-cyan-400 h-10 w-10 rounded-xl flex items-center justify-center'>{data.icon}</span>
                        </div>
                        <h1 className='text-2xl font-bold dark:text-cyan-400 '>{data.data}</h1>
                        <p className='first-letter:uppercase text-sm   mt-5 dark:text-slate-400 '>{data.description}.</p>
                    </div>
                )}
            </div>
            <div className=' my-5  flex gap-2  justify-between '>
                {/* <form onSubmit={handleSearch} className='flex sm:mr-5'>
                    <label className='input focus-within:outline-none border-[#CAEB66] border mr-2 sm:min-w-2xs  flex-1 sm:flex-none'>
                        <Search />
                        <input onChange={handleSearch} type="text" name='search' className='' />
                    </label>
                    <button className='btn btn-custom '>Search</button>
                </form> */}


                <div ref={dropdownContainer} className="dropdown dropdown-end ml-auto" >
                    <button
                        tabIndex={0}
                        className="btn  text-[#03373D] border-none bg-linear-to-r from-[#caeb66] to-[#a8d94a]  border-2 border-[#b7db4f] 
                           hover:from-[#bfe85a] hover:to-[#97c83f] 
                            dark:from-green-800 dark:to-green-700 dark:hover:from-green-900 dark:hover:to-green-800  dark:text-white
                            duration-300 transition-all
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
                                        <ul className='p-2 mt-2 shadow overflow-y-auto max-h-20 absolute top-full right-0 bg-white dark:bg-[#071A1D] w-full'>
                                            {
                                                couldBeDistricts?.map((d, index) =>
                                                    <li onClick={() => handleCouldBeDistricts(d.district)}
                                                        className={`
                                                            ${index + 1 !== couldBeDistricts.length && "border-b border-b-gray-200"}
                                                            text-base py-1 px-2 font-medium  hover:bg-gray-100 dark:bg-white/10 cursor-pointer`} key={index}>{d.district}</li>
                                                )
                                            }
                                        </ul>
                                    }
                                </div>
                            </div>





                            <div className='flex justify-between border-t border-t-gray-200 pt-5 mt-5'>
                                <button type='reset' className='cursor-pointer underline hover:text-gray-600 dark:text-[#AAB8B4]'>Clear All</button>
                                <button className="btn  border-2 border-[#b7db4f] bg-linear-to-r from-[#caeb66] to-[#a8d94a] dark:border-0 dark:from-green-800 dark:to-green-700 dark:hover:from-green-900 dark:hover:to-green-800  dark:text-white
                            duration-300 transition-all shadow-md px-4 py-2 ease-in-out" disabled={myParcelLS.dataCount?.length === 0}>Apply Filters</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >

            <Toaster />
            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 dark:from-[#08262B] dark:to-[#0D1F22] dark:border dark:border-white/10 overflow-hidden'>
                {/* <div className='p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <h1 className='text-2xl font-bold '>My Parcels</h1>
                    <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>All created parcels appear in this section.</p>
                </div> */}
                <div className='flex flex-wrap sm:flex-nowrap justify-between gap-0 sm:gap-5  items-center p-5 border border-[#caeb66]/40 dark:border-cyan-400/10  border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <div className=''>
                        <h1 className='text-2xl font-bold '>My Parcels</h1>
                        <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>All created parcels appear in this section.</p>
                    </div>

                    <form onSubmit={handleSearch} className='flex gap-3 w-full min-[750px]:w-auto mt-3 min-[750px]:mt-0 ' >
                        <label className='input shadow border-none rounded-xl h-12 w-full min-[750px]:w-80  focus-within:outline-green-800 '>
                            <PackageSearch className='text-gray-500 dark:text-[#AAB8B4]' />
                            <input onChange={handleSearch} type="text" placeholder='Search parcel' name='search' required disabled={disabledSearch} />
                        </label>
                        <button className='btn bg-green-800 hover:bg-green-900 text-white rounded-xl h-12  shadow' disabled={disabledSearch}>{(searchLoading && !parcels.result?.[0]) ? <span className="loading loading-spinner loading-sm"></span> : <Search size={18} />}Search</button>
                    </form>
                </div>



                <table className={` table-md md:table-lg table-zebra bg-white dark:bg-[#071A1D] font-medium hidden md:table `} >
                    <thead className='bg-[#caeb66] '>
                        <tr className=' dark:text-[#03373D]'>
                            <th className='text-center  sm:pr-4'>No.</th>
                            <th>Name</th>
                            <th className='hidden lg:table-cell'>Type</th>
                            <th>Created At</th>
                            <th>Payment</th>
                            <th className='hidden lg:block'>Cost</th>
                            <th>Send To</th>
                            <th>Actions</th>
                            {/* <th>Favorite Color</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            nonFilterData?.map((parcel, index) =>
                                <tr key={index} >
                                    <th className='text-center  pr-0 sm:pr-4'>{parcel ? index + 1 : <Skeleton></Skeleton>}</th>
                                    <td onClick={() => navigate(`/dashboard/parcel-details/${parcel?._id}`)} className='cursor-pointer  max-w-[150px] truncate'>{parcel ? <><h1>{parcel.parcelName}</h1>  <small className='block lg:hidden capitalize'>{parcel.type}</small> </> : <Skeleton></Skeleton>}</td>
                                    <td className='hidden lg:table-cell'>{parcel?.type.toUpperCase() || <Skeleton></Skeleton>}</td>
                                    <td>{parcel ? <><h1 className='hidden lg:block'>{format(parcel.createdAt, "PP")}</h1><h1 className='block lg:hidden'>{format(parcel.createdAt, "Mo MMM")}</h1></> : <Skeleton></Skeleton>}</td>
                                    <td className={parcel?.paymentStatus ? "text-green-500" : "text-red-500"}>{parcel ? <><h1>{parcel.paymentStatus ? "Paid" : "Due"}</h1> <h2 className='block lg:hidden'>{parcel.cost}৳</h2> </> : <Skeleton></Skeleton>}</td>
                                    <td className='hidden lg:block'>{parcel ? `${parcel.cost}৳` : <Skeleton></Skeleton>}</td>
                                    <td>{parcel?.receiverDistrict || <Skeleton></Skeleton>}</td>
                                    <td className=''>
                                        {nonFilterData[0] ?
                                            <div className='dropdown cursor-pointer ' onClick={(e) => e.stopPropagation()}>
                                                <button tabIndex={0} disabled={isLoading} className=' cursor-pointer  relative p-1' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                    <BsThreeDotsVertical />
                                                </button>
                                                <ul tabIndex={0} className={`menu absolute ${index >= parcels?.length - 2 ? "bottom-0" : "top-0"} right-full max-w-dvw max-h-dvh dropdown-content bg-base-100 rounded-box z-1 w-44 p-2 shadow-sm font-medium  `}>
                                                    <li ><Link to={`/dashboard/parcel-details/${parcel?._id}`}>View</Link></li>
                                                    <li className='border-y border-gray-200 dark:border-white/10 text-gray-300'><a>Edit</a></li>
                                                    <li onClick={() => { handleDelete(parcel?._id) }} className='text-red-500'><a>Delete</a></li>
                                                    {!parcel?.paymentStatus && <li className='border-t border-gray-200 dark:border-white/10'><Link to={`/dashboard/payment/${parcel?._id}`}>Pay</Link></li>}
                                                </ul>
                                            </div> :
                                            <Skeleton></Skeleton>
                                        }
                                    </td>
                                    {/* <td>Blue</td> */}
                                </tr>
                            )

                        }



                        {/* <div className='w-full h-[63px] bg-black'></div>  */}
                    </tbody>
                </table>
                {nonFilterData?.length === 0 && <NoDataFound data={"parcel"}></NoDataFound>}

            </div>
            {/* Mobile parcel cards */}

            <div className='mt-5 grid grid-cols-1 gap-5 md:hidden'>
                {nonFilterData?.map((parcel, index) =>
                    <div className='p-4 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm' key={index}>
                        <div className='flex justify-between items-start gap-1'>
                            <div>
                                <h1 className='font-bold'>{parcel?.parcelName || <Skeleton width={100} />}</h1>
                                <small className='text-gray-500 dark:text-[#AAB8B4]'>{parcel?.parcelId || <Skeleton />}</small>
                            </div>

                            {nonFilterData[0] ?
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${parcel?.paymentStatus ? "bg-green-100 text-green-600" : 'bg-red-100 text-red-600'}`}>{parcel?.paymentStatus ? "Paid" : "Due"}</span>
                                :
                                <Skeleton width={38} height={22} />}
                        </div>
                        <div className='grid grid-cols-2 gap-3 my-4'>
                            {
                                [
                                    { label: "type", data: parcel?.type },
                                    { label: "cost", data: `${parcel?.cost}৳` },
                                    { label: "created", data: nonFilterData[0] && format(parcel?.createdAt, "dd MMM yyyy") },
                                    { label: "send to", data: parcel?.receiverDistrict }

                                ].map((data, index) =>
                                    <div className='' key={index}>
                                        <p className='text-gray-400 dark:text-[#7F918D] text-sm'>{nonFilterData[0] ? data.label : <Skeleton width={50} />}</p>
                                        <h1 className='font-semibold capitalize'>{nonFilterData[0] ? data.data : < Skeleton width={130} />}</h1>
                                    </div>
                                )
                            }
                        </div>

                        < div className='flex gap-1.5  '>
                            {nonFilterData[0] ?

                                <Link to={`/dashboard/parcel-details/${parcel?._id}`} className='btn flex-1  text-base py-5  rounded-lg bg-gray-100 dark:bg-white/10 font-semibold border border-gray-300 dark:border-white/10'>View</Link>
                                :
                                <div className='flex-1'><Skeleton height={40} /></div>
                            }


                            {!parcel?.paymentStatus && nonFilterData[0] &&
                                <Link to={`/dashboard/payment/${parcel?._id}`} className='btn flex-1  text-base py-5 text-white rounded-lg font-semibold  bg-linear-to-r from-emerald-500 to-teal-500'>Pay</Link>
                            }
                            {!nonFilterData[0] && <div className='flex-1'><Skeleton height={40} /></div>}


                        </div>


                    </div>
                )}
            </div>



            {/* { !parcels?.length > 0 && <div className='text-center text-2xl font-semibold'>No Data Found!</div>} */}
            {/* <Tooltip id="my-tooltip" delayShow={500}  ></Tooltip> */}


        </div >
    );
};

export default MyParcels;

