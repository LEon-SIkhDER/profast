import React, { useState } from 'react';
import SectionWrapper from '../../Components/SectionWrapper';
import Border from '../../Components/Border';
import agent from "../../assets/agent-pending.png"
import { useLoaderData } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const BeARiderForm = () => {
    const { divisions, warehouses } = useLoaderData()

    const [formLoading, setFormLoading] = useState(false)
    console.log(formLoading)

    const [selectedDistrict, setSelectedDistrict] = useState()



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
        console.log(formData)
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to submit?",
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
                axios.post("http://localhost:5000/riders-request", formData)
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



    return (
        <div>
            <SectionWrapper>
                <div>
                    <div className='max-w-1/2'>
                        <h1 className='text-[#03373D] text-5xl font-bold mb-4'>Be a Rider</h1>
                        <p className='text-[#606060] '>Become a rider and start delivering parcels with us. Fill out the form below to apply and join our delivery team.</p>
                    </div>
                    <Border className="my-12"></Border>
                </div>
                <div className='flex items-center gap-10'>
                    <div className='w-1/2'>
                        <h1 className='text-3xl font-bold mb-8 '>Tell us about yourself</h1>
                        <form onSubmit={handleRegister}>
                            <div className=' grid grid-cols-2 gap-5'>
                                <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <input type="text" className="input" placeholder="Enter your full name" name='name' required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Age</label>
                                    <input type="number" className="input" placeholder="Enter your age" name='age' required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Number</label>
                                    <input type="number" className="input" placeholder="Enter your phone number" name='number' required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" className="input" placeholder="Enter your email address" name='email' required />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Division</label>
                                    <select onChange={handleDivisionChange} defaultValue="Select your division" className="select" name='division' required>
                                        <option disabled={true}>Select your division</option>
                                        {
                                            divisions.map((division, index) =>
                                                <option value={division} key={index}>{division}</option>
                                            )
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">District</label>
                                    <select onClick={handleDistrictChange} defaultValue="Select your district" className="select" name='district' required>
                                        <option disabled={true}>Select your district</option>
                                        {
                                            selectedDistrict?.map((data, index) =>
                                                <option value={data.district} key={index}>{data.district}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <label className="text-sm font-medium block ">Which wire-house you want to work?</label>
                                <select onClick={handleDistrictChange} defaultValue="Select wire-house" className="select w-full" name='chosen_warehouse' required>
                                    <option disabled={true}>Select wire-house</option>
                                    {
                                        selectedDistrict?.map((data, index) =>
                                            <option value={data.district} key={index}>{data.district}</option>
                                        )
                                    }
                                </select>
                            </div>

                            <button className="btn btn-custom mt-4 w-full ">{formLoading ? <span className="loading loading-spinner loading-md"></span> : "Submit"}</button>
                        </form>
                    </div>

                    <img className='w-1/2 max-w-[450px] ml-auto' src={agent} alt="" />
                </div>
            </SectionWrapper>
        </div>
    );
};

export default BeARiderForm;