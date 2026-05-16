import axios from 'axios';
import { format } from 'date-fns';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';


const MakeAdmin = () => {

    const axiosSecure = useAxiosSecure()




    const [allUsers, setAllUsers] = useState([...Array(5)])
    useEffect(() => {
        axiosSecure.get("https://profast-server-henna.vercel.app/users&admin")
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
            customClass: {
                confirmButton: "btn btn-custom",
                cancelButton: "btn ml-2"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(
                    axiosSecure.patch(`https://profast-server-henna.vercel.app/user/${id}`, { role: role })
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
    return (
        <div>
            <Toaster />
            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 overflow-hidden'>
                <div className='p-5 border border-[#caeb66]/40 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <h1 className='text-2xl font-bold '>Make Admin</h1>
                    <p className='text-sm text-gray-500 mt-1'>A sensitive section for managing user roles and granting admin access.</p>
                </div>
                <table className={`table table-lg table-zebra bg-white font-medium `}>
                    <thead className='bg-[#caeb66]'>
                        <tr className='text-black'>
                            <th className='text-center'>No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Role</th>
                            <th>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            allUsers?.map((data, index) =>
                                <tr key={index}>
                                    <th className='text-center'>{data && index + 1}</th>
                                    <td>{data?.name || <Skeleton></Skeleton>}</td>
                                    <td>{data?.email || <Skeleton></Skeleton>}</td>
                                    <td>{data ? format(new Date(data.created_At), "dd/MM/yyyy") : <Skeleton></Skeleton>}</td>
                                    <td>
                                        {
                                            data ?
                                                <div
                                                    className={`w-max rounded-full px-2 capitalize  ${data?.role === "user" ? "bg-info" : data?.role === "admin" ? "bg-success" : "bg-warning"}`}>

                                                    {data?.role}
                                                </div> :
                                                <Skeleton></Skeleton>

                                        }

                                    </td>
                                    <td className=''>
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
                                                    <button onClick={() => handleRole(data._id, "admin")} className='btn block my-1 bg-success'>Promote to Admin</button>
                                                    :
                                                    <button onClick={() => handleRole(data._id, "user")} className='btn block my-1 bg-info'>Demote to User</button> :

                                                <Skeleton></Skeleton>

                                        }
                                    </td>

                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default MakeAdmin;