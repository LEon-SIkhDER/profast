import React, { useContext, useState } from 'react';
import SectionWrapper from '../../Components/SectionWrapper';
import Border from '../../Components/Border';
import agent from "../../assets/agent-pending.png"
import { useLoaderData } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ApplicationAlreadyApplied from '../../Components/ApplicationAlreadyApplied';

const BeARiderForm = () => {
    const { divisions, warehouses } = useLoaderData()
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()
    // const [formPageLoading, setFormPageLoading] = useState(true)
    const [formLoading, setFormLoading] = useState(false)
    console.log(formLoading)

    const [selectedDistrict, setSelectedDistrict] = useState()
    const [reapplyRequest, setReapplyRequest] = useState(false)

    const { data: isApplied, isLoading, refetch } = useQuery({
        queryKey: ["isApplied"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider-application/check?email=${user.email}`)
            // setFormPageLoading(false)
            return res.data
        }
    })
    console.log(isApplied)




    const handleDivisionChange = (e) => {
        e.preventDefault()

        console.log(e.target.value)
        const districts = warehouses.filter(data => data.region === e.target.value)
        setSelectedDistrict(districts)
        console.log(selectedDistrict)
    }
    const handleDistrictChange = () => {
        if (!selectedDistrict) {
            alert("Please select division first.")
        }
    }

    const handleRegister = (e) => {
        e.preventDefault()


        const formData = Object.fromEntries(new FormData(e.target))
        formData.email = user.email
        console.log(formData)
        Swal.fire({
            title: "Are you sure?",
            text: "Submission cannot be revert!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Submit",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn btn-custom",
                cancelButton: "btn ml-2"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setFormLoading(true)
                axios.post("https://profast-server-henna.vercel.app/riders-request", formData)
                    .then(data => {
                        console.log(data)
                        if (data.data.insertedId) {
                            Swal.fire({
                                title: "Form Submitted.",
                                icon: "success",
                                draggable: false,
                                confirmButtonColor: "#caeb66"
                            });

                            e.target.reset()
                            refetch()
                        }
                        setFormLoading(false)
                    })
                    .catch(error => {
                        console.log(error)
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                            confirmButtonColor: "#caeb66"
                        });
                        setFormLoading(false)
                    })

            }
        });


    }
    const [selectedWarehouses, setSelectedWarehouses] = useState(null)

    const handleWarehouses = (e) => {
        const filteredWarehouses = warehouses.find((value) => value.district === e.target.value)
        console.log(filteredWarehouses)
        setSelectedWarehouses(filteredWarehouses)
    }
    if (isLoading) return <div className='min-h-96 flex justify-center items-center'><span className="loading loading-bars loading-md"></span></div>

    if (isApplied && !reapplyRequest) {
        return <ApplicationAlreadyApplied data={isApplied} isReapply={setReapplyRequest}></ApplicationAlreadyApplied>
    }


    return (
        <div>
            <div className='max-w-[700px] min-[950px]:max-w-[1520px] mx-auto px-2.5 '>
                <div className='bg-white rounded-2xl shadow-sm p-5 md:p-10  lg:py-14 lg:px-14 xl:py-20   xl:px-28  '>
                    <div>
                        <div className='w-full sm:w-3/4 min-[950px]:max-w-1/2'>
                            <h1 className='text-[#03373D] text-4xl sm:text-5xl font-bold mb-2.5 sm:mb-3'>Be a Rider</h1>
                            <p className='text-[#606060] text-sm sm:text-base'>Become a rider and start delivering parcels with us. Fill out the form below to apply and join our delivery team.</p>
                        </div>
                        <Border className="my-4 sm:my-12"></Border>
                    </div>
                    <div className='flex items-center gap-5 xl:gap-10'>
                        <div className='w-full min-[950px]:w-1/2'>
                            <h1 className='text-xl sm:text-3xl font-bold mb-4 sm:mb-8 '>Tell us about yourself</h1>
                            <form onSubmit={handleRegister}>
                                <div className=' grid grid-cols-2 gap-5'>
                                    <div>
                                        <label className="text-sm font-medium block">Name</label>
                                        <input type="text" className="input w-full" placeholder="Enter your full name" name='name' required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block">Age</label>
                                        <input type="number" className="input w-full" placeholder="Enter your age" name='age' min={18} max={50} required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block">Number</label>
                                        <input type="number" className="input w-full" placeholder="Enter your phone number" name='number' minLength={11} maxLength={11} required />
                                    </div>
                                    {/* <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" className="input" placeholder="Enter your email address" name='email' required />
                                </div> */}

                                    <div>
                                        <label className="text-sm font-medium block">Division</label>
                                        <select onChange={handleDivisionChange} defaultValue="" className="select w-full" name='division' required>
                                            <option disabled={true} value={''}>Select your division</option>
                                            {
                                                divisions.map((division, index) =>
                                                    <option value={division} key={index}>{division}</option>
                                                )
                                            }
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium block">District</label>
                                        <select onChange={handleWarehouses} onClick={handleDistrictChange} defaultValue="" className="select w-full" name='district' required>
                                            <option disabled={true} value={""}>Select your district</option>
                                            {
                                                selectedDistrict?.map((data, index) =>
                                                    <option value={data.district} key={index}>{data.district}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className=''>
                                        <label className="text-sm font-medium  block">Preferred Warehouse</label>
                                        <select onClick={handleDistrictChange} defaultValue="" className="select w-full" name='chosen_warehouse' required>
                                            <option disabled={true} value={""}>Select wire-house</option>
                                            {
                                                selectedWarehouses?.covered_area.map((data, index) =>
                                                    <option value={data.district} key={index}>{data}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>

                                <button className="btn btn-custom mt-4 w-full ">{formLoading ? <span className="loading loading-spinner loading-md"></span> : "Submit"}</button>
                            </form>
                        </div>
                        <img className='w-1/2 max-w-[450px] ml-auto hidden min-[950px]:block ' src={agent} alt="" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BeARiderForm;