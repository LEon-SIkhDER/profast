import axios from 'axios';
import { format } from 'date-fns';
import { Search, User, UserRound, UserStar } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import toast, { Toaster, useToaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import defaultImage from '/dpp.png'
import NoDataFound from '../../../Components/NoDataFound';


const MakeAdmin = () => {

    const axiosSecure = useAxiosSecure()
    const [dataLoading, setDataLoading] = useState(false)
    const { theme } = useContext(AuthContext)
    const isDark = theme === "dark" ? true : false




    const [allUsers, setAllUsers] = useState([...Array(5)])
    useEffect(() => {
        axiosSecure.get("/users&admin")
            .then(result => {
                console.log(result)
                setAllUsers(result.data)
            })
    }, [])

    const handleRole = (id, role) => {


        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to change admin role?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Accept",
            cancelButtonText: "Cancel",
            color: isDark ? "#F8FAFC" : "#111827",
            background: isDark ? "#0F172A" : "#FFFFFF",
            customClass: {
                confirmButton: "btn btn-custom",
                cancelButton: "btn ml-2"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(
                    axiosSecure.patch(`/user/${id}`, { role: role })
                        .then(async (result) => {
                            if (result.data.modifiedCount !== 1) {
                                throw new Error("Update Failed")
                            }


                            const newAllUser = allUsers.map(data => {
                                if (data._id === id) {
                                    data.role = role
                                }
                                return data
                            })
                            setAllUsers(newAllUser)
                            console.log(allUsers)
                            return result
                        })

                    ,
                    {
                        loading: "Updating...",
                        success: "Role Updated",
                        error: (err) => err.message || "Something went wrong",
                    }
                )
            }
        });







    }
    const imgModal = useRef()
    const [imageModalData, setImageModalData] = useState()

    const handleImgModal = (url) => {
        setImageModalData(url)
        imgModal.current.showModal()
    }
    const searchUser = (name) => {
        axiosSecure.get(`/users&admin?name=${name}`)
            .then(result => {
                console.log(result)
                setAllUsers(result.data)
                setDataLoading(false)
            })
            .catch(err => {
                console.log(err)
                setDataLoading(false)
            })

    }
    const timeoutId = useRef()
    const handleSearch = (e) => {
        e.preventDefault()
        clearTimeout(timeoutId.current)
        if (e.target?.search?.value) {
            setDataLoading(true)
            searchUser(e.target.search.value)

            return
        }
        timeoutId.current = setTimeout(() => {
            const value = e.target?.search?.value || e.target.value
            console.log(value)
            searchUser(value)
        }, 500);

    }
    console.log(dataLoading)
    return (
        <div>
            <Toaster />
            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 dark:from-[#08262B] dark:to-[#0D1F22] dark:border dark:border-white/10 overflow-hidden'>
                <div className='flex flex-col min-[750px]:flex-row justify-between items-start min-[750]:items-center gap-1 p-5 border border-[#caeb66]/40 dark:border-cyan-400/10 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <div>
                        <h1 className='text-2xl font-bold '>Make Admin</h1>
                        <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>A sensitive section for managing user roles and granting admin access.</p>
                    </div>
                    <form onSubmit={handleSearch} className='flex gap-3 w-full min-[750px]:w-auto mt-3 min-[750px]:mt-0' >
                        <label className='input shadow border-none rounded-xl h-12 w-full min-[750px]:w-80  focus-within:outline-green-800 '>
                            <UserRound className='text-gray-500 dark:text-[#AAB8B4]' />
                            <input onChange={handleSearch} type="text" placeholder='Search user' name='search' />
                        </label>
                        <button className='btn bg-green-800 hover:bg-green-900 text-white rounded-xl h-12  shadow'>{dataLoading ? <span className="loading loading-spinner loading-sm"></span> : <Search size={20} />}Search</button>
                    </form>
                </div>
                <table className={`min-[750px]:table hidden table-lg table-zebra bg-white dark:bg-[#071A1D] font-medium `}>
                    <thead className='bg-[#caeb66]'>
                        <tr className='text-black dark:text-[#F5F7F2] *:px-2 '>
                            <th className='text-center ' style={{ paddingLeft: "20px" }}>No.</th>
                            <th>Name</th>
                            <th className='hidden min-[900px]:block '>Email</th>
                            <th>Joined At</th>
                            <th>Role</th>
                            <th>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            allUsers?.map((data, index) =>
                                <tr key={index} className='*:px-2 '>
                                    <th className='text-center'>{data ? index + 1 : <Skeleton></Skeleton>}</th>
                                    <td> <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            {data ?
                                                <div className="mask mask-squircle h-12 w-12 ">
                                                    <img
                                                        style={{ imageRendering: "auto" }}
                                                        className='cursor-pointer'
                                                        onClick={() => handleImgModal(data?.photoUrl || defaultImage)}
                                                        src={data?.photoUrl}
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                                :
                                                <Skeleton height={42} width={42} ></Skeleton>
                                            }
                                        </div>
                                        <div>
                                            <div className="font-bold">{data?.name || <Skeleton width={120} height={22}></Skeleton>}</div>
                                            <div className="text-sm opacity-50 min-[900px]:hidden">{data?.email || <Skeleton></Skeleton>}</div>
                                        </div>
                                    </div></td>
                                    <td className='hidden min-[900px]:table-cell '>{data?.email || <Skeleton width={200}></Skeleton>}</td>
                                    <td>{data ? format(new Date(data?.created_At), "dd MMM, yyyy") : <Skeleton></Skeleton>}</td>
                                    <td>
                                        {
                                            data ?
                                                <h1
                                                    className={`w-[63px] text-center rounded-full px-2 capitalize text-base  ${data?.role === "user" ? "bg-info" : data?.role === "admin" ? "bg-success" : "bg-warning"}`}>

                                                    {data?.role}
                                                </h1> :
                                                <Skeleton></Skeleton>

                                        }

                                    </td>
                                    <td className='' style={{ paddingRight: "20px" }}>
                                        {/* <div className='dropdown cursor-pointer'>
                                            <button tabIndex={0} className=' cursor-pointer  relative ' data-tooltip-id="my-tooltip" data-tooltip-content="Details" >
                                                <BsThreeDotsVertical />
                                            </button>
                                            <ul tabIndex={0} className={`menu absolute ${allUsers.length > 2 && index >= allUsers.length - 2 ? "bottom-0" : "top-0"} right-full max-w-screen max-h-screen dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm font-medium  `}>
                                                <li onClick={() => (document.getElementById('my_modal_1').showModal(), setModalData(data))}><a>View</a></li>
                                                <li onClick={() => handleAcceptRider(data._id, "Approved")} className='text-green-500'><a>Accept<Check size={16} /></a></li>
                                                <li onClick={() => handleAcceptRider(data._id, "Rejected")} className='text-red-500'><a>Reject <X size={16} /></a></li>
                                            </ul>
                                        </div> */}
                                        {
                                            data ?
                                                data.role === "user" ?
                                                    <button onClick={() => handleRole(data._id, "admin")} className='btn block my-1 bg-success w-[147px]'>Promote to Admin</button>
                                                    :
                                                    <button onClick={() => handleRole(data._id, "user")} className='btn block my-1 bg-info w-[147px]'>Demote to User</button> :

                                                <Skeleton height={40} width={147}></Skeleton>

                                        }
                                    </td>

                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>


            {/* mobile card  */}
            <div className='min-[750px]:hidden'>
                {
                    allUsers.map((user, index) =>
                        <div className={`flex gap-3 py-5 ${index + 1 !== allUsers.length && 'border-b border-b-gray-200'}`} key={index}>
                            {user ?
                                <img
                                    className='object-cover h-12 w-12 rounded-full  border border-gray-200 dark:border-white/10  '
                                    onClick={() => handleImgModal(user?.photoUrl || user?.thumbnailPhotoUrl || defaultImage)}
                                    src={user?.photoUrl || user?.thumbnailPhotoUrl} alt="userImage" />
                                :
                                <Skeleton width={48} height={48} circle></Skeleton>
                            }

                            <div className='flex-1 '>
                                <div className='flex items-start justify-between mb-2'>
                                    <div>
                                        <h1 className='font-semibold text-base'>{user?.name || <Skeleton width={120} height={22}></Skeleton>}</h1>
                                        <h2 className='text-sm opacity-70'>{user?.email || <Skeleton width={180}></Skeleton>}</h2>
                                    </div>
                                    {user ?
                                        <h1
                                            className={`w-[63px] text-center rounded-full px-2  capitalize text-base  ${user?.role === "user" ? "bg-info" : user?.role === "admin" ? "bg-success" : "bg-warning"}`}>

                                            {user?.role}
                                        </h1>
                                        :
                                        <Skeleton width={63} height={24}></Skeleton>
                                    }
                                </div>

                                <h2 className='text-xs  text-gray-400 dark:text-[#7F918D]'>{user ? "Joined At" : <Skeleton width={100}></Skeleton>}</h2>
                                <h1 className='text-sm font-medium mb-2'>{user ? format(user.created_At, 'dd MMM, yyyy') : <Skeleton width={130}></Skeleton>}</h1>

                                {
                                    user ?
                                        user.role === "user" ?
                                            <button onClick={() => handleRole(user._id, "admin")} className='btn block my-1 bg-success w-full'>Promote to Admin</button>
                                            :
                                            <button onClick={() => handleRole(user._id, "user")} className='btn block my-1 bg-info w-full'>Demote to User</button> :

                                        <Skeleton height={40}></Skeleton>

                                }









                            </div>
                        </div>
                    )
                }
            </div>


            <dialog ref={imgModal} className="modal">
                <div className="modal-box bg-transparent p-0">
                    <img
                        className='w-full'
                        src={imageModalData} alt="userImage" />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            {
                allUsers.length === 0 &&
                <NoDataFound className='mt-5 rounded-2xl '></NoDataFound>
            }
        </div>
    );
};

export default MakeAdmin;

