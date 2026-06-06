import React, { useContext, useEffect, useRef, useState } from 'react';
import Border from '../../Components/Border';
import SectionWrapper from '../../Components/SectionWrapper';
import { useLoaderData, useNavigate } from 'react-router';
import "./SendParcel.css"
import Swal from 'sweetalert2';
import { ArrowLeftToLine, ArrowRightToLine, Weight } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import Payment from '../Dashboard/Payment/Payment';
import toast, { Toaster } from 'react-hot-toast';

const SendParcel = () => {
    const { user } = useContext(AuthContext)

    const { wareHouses, division } = useLoaderData()
    const navigate = useNavigate()

    const senderRegion = useRef()
    const receiverRegion = useRef()
    // form page
    const formNames = {
        page1: [
            "type",
            "parcelName",
            "parcelWeight",
        ],
        page2: [
            "senderAddress",
            "senderDistrict",
            "senderName",
            "senderNumber",
            "senderRegion",
            "senderWarehouse",
        ],
        page3: [
            "receiverName",
            "receiverRegion",
            "receiverDistrict",
            "receiverWarehouse",
            "receiverNumber",
            "receiverAddress",
        ]
    }
    const formElement = useRef()
    const [formPageAbility, setFormPageAbility] = useState()
    const [currentFormPage, setCurrentFormPage] = useState(1)
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            console.log(width)
            if (width < 768) {
                setFormPageAbility(true)
            } else {
                setFormPageAbility(false)
            }


        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    console.log(formPageAbility)














    const handlePrevButton = () => {
        setCurrentFormPage(currentFormPage - 1)
    }
    const handleNextButton = () => {
        const formData = Object.fromEntries(new FormData(formElement.current))
        console.log(formData)
        // for 2nd page
        if (currentFormPage === 1) {
            let ableFor2ndPage = true
            let page1 = formNames.page1
            if (formData.type === "document") {
                page1 = formNames.page1.filter((value) => value !== "parcelWeight")
            }
            console.log(formData)
            for (let key of page1) {
                console.log(formData[key])
                if (!formData[key] || formData[key].toString().trim() === "") {
                    ableFor2ndPage = false
                    console.log("fill the form first")
                    toast.error('Fill the form first')
                    break
                }
            }
            if (ableFor2ndPage) {
                // going to 2nd page
                setCurrentFormPage(2)
            }
        }
        // for 3rd page
        else if (currentFormPage === 2) {
            console.log(formData)
            let ableFor3rdPage = true
            for (let key of formNames.page2) {
                if (!formData[key] || formData[key].toString().trim === "") {
                    ableFor3rdPage = false
                    console.log("fill the form first")
                    toast.error('Fill the form first')
                    break
                }
            }
            if (ableFor3rdPage) {
                // going to 3rd page
                setCurrentFormPage(3)
            }
        }

    }



    // const [regionSelected, setRegionSelected] = useState(false)

    const [isDocument, setIsDocument] = useState(true)
    // const [loadingButton, setLoadingButton] = useState(false)

    const [senderSelectedDistricts, setSenderSelectedDistricts] = useState(null)
    const [senderSelectedWarehouses, setSenderSelectedWarehouses] = useState(null)
    // const paymentModal = useRef()
    // console.log(paymentModal)










    //sender...................
    const handleSenderRegionChange = (e) => {

        // setRegionSelected(true)

        const selectedDistricts = wareHouses.filter((wareHouse) => wareHouse.region === e.target.value)
        setSenderSelectedDistricts(selectedDistricts)

        //set as sender
        // handleReceiverDistrict(e)
        setReceiverSelectedDistrict(selectedDistricts)
        receiverRegion.current.value = e.target.value

    }

    const [senderSelectedDistrict, setSenderSelectedDistrict] = useState(null)

    const handleSenderDistrictChange = (e) => {
        e.preventDefault()

        if (!senderSelectedDistricts) {
            return alert("Please Select The Region First")
        }
        setSenderSelectedDistrict(e.target.value)
        setSenderSelectedWarehouses(senderSelectedDistricts.find((data) => data.district === e.target.value))



    }

    const handleSenderWarehouseChange = (e) => {
        e.preventDefault()
        if (!senderSelectedDistrict) {
            return alert("Please Select The District First")

        }


    }
    // ................  receiver 
    const [receiverSelectedDistrict, setReceiverSelectedDistrict] = useState(null)
    const handleReceiverDistrict = (e) => {
        const region = e.target.value
        const selectedDistrict = wareHouses.filter(data => data.region === region)
        setReceiverSelectedDistrict(selectedDistrict)

        // set as receiver 
        // handleSenderRegionChange(e)
        setSenderSelectedDistrict(selectedDistrict)
        senderRegion.current.value = e.target.value
    }
    const [receiverSelectedWarehouses, setReceiverSelectedWarehouses] = useState(null)
    const handleReceiverWarehouses = (e) => {
        if (!receiverSelectedDistrict) {
            return alert("please select the region first")
        }
        const district = e.target.value
        const selectedWarehouses = receiverSelectedDistrict.find((data) => data.district === district)
        setReceiverSelectedWarehouses(selectedWarehouses)
    }
    const handleIsReceiverWarehouse = () => {
        if (!receiverSelectedWarehouses) {
            return alert("Please select the district first")
        }
    }



    const handleDocument = (e) => {

        const result = e.target.value
        result === "document" ? setIsDocument(true) : setIsDocument(false)

    }

    const handleForm = (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target));


        let cost = 0
        const weight = Number(data.parcelWeight) || 0
        if (data.type === "non-document") {

            if (data.senderDistrict === data.receiverDistrict) {
                cost = 110
                if (weight <= 3) {
                    cost = 110
                }
                else {
                    cost = cost + (weight - 3) * 40
                }

            }
            else {
                cost = 150
                if (weight <= 3) {
                    cost = 150
                }
                else {
                    cost = cost + (weight - 3) * 40 + 40
                }
            }
        }
        else {
            if (data.senderDistrict === data.receiverDistrict) {
                cost = 60
            }
            else {
                cost = 80
            }
        }



        data.cost = cost
        data.userEmail = user.email
        data.paymentStatus = false
        data.parcel_status = "not-collected"

        console.log(data)



        let insertedId


        Swal.fire({
            title: "Confirm parcel submission",
            html: `<span>Delivery Cost: <span class='text-black font-medium'>${Math.ceil(cost)}tk</span> </span>`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2aa353",
            cancelButtonColor: "#d33",
            confirmButtonText: `Proceed to Confirm payment`,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axios.post("https://profast-server-henna.vercel.app/parcels", data)
                    .then(res => {
                        insertedId = res.data.insertedId
                        console.log(insertedId)
                        console.log(res.data)
                        return res.data
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
                if (insertedId) {
                    navigate(`/dashboard/payment/${insertedId}`)

                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",

                    });
                }

            }

        });
    }
    // const handlePrice = (e) => {
    //     if (!document) {
    //     }
    // }






    return (
        <SectionWrapper>
            <Toaster></Toaster>
            <h1 className='text-4xl lg:text-5xl font-bold primary-text-color '>Send Parcel </h1>
            <p>--PickUp Time 10am - 7pm Approx.</p>
            <Border className={"my-5 md:my-12"}>    </Border>

            <form ref={formElement} onSubmit={handleForm} className='' >
                <div className={`${formPageAbility ? (currentFormPage === 1 ? 'block' : 'hidden') : ""}  `}>
                    <h2 className='text-2xl font-bold primary-text-color md:-mt-5 mb-3  md:mb-7'>Enter your parcel details</h2>
                    <fieldset className='mb-3 md:mb-7  space-x-12 font-semibold primary-text-color *:inline-flex *:items-center *:gap-2 '>
                        <label>
                            <input required onChange={handleDocument} className='scale-150 cursor-pointer accent-green-600' type="radio" name='type' value={"document"} />
                            <span className='mt-0.5'>Document</span>
                        </label>
                        <label>
                            <input required onChange={handleDocument} className='scale-150 cursor-pointer accent-green-600' type="radio" name='type' value={"non-document"} />
                            <span className='mt-0.5'>Non-Document</span>
                        </label>
                    </fieldset>
                    <fieldset className='grid grid-cols-1 md:grid-cols-2 gap-7'>
                        <div>
                            <label className=' font-medium text-sm block'>Parcel Name</label>
                            <input required className='input w-full ' type="text" placeholder='Parcel Name' name='parcelName' />
                        </div>

                        <div>
                            <label className=' font-medium text-sm block'>Parcel Weight(kg)</label>
                            <input className='input w-full' step="any" disabled={isDocument} type="number" placeholder='Parcel Weight' name='parcelWeight' required />
                        </div>
                    </fieldset>
                </div>
                <Border className={`my-7 border-b-gray-100 ${formPageAbility ? 'hidden' : 'block'}`}></Border>
                <div className='grid grid-cols-2 gap-5 lg:gap-12'>
                    {/* mother of left and right side  */}
                    {/* sender details */}
                    <fieldset className={`${formPageAbility ? (currentFormPage === 2 ? 'block' : 'hidden') : ""} col-span-2 md:col-span-1 `}>
                        <h1 className='primary-text-color font-bold text-lg mb-3 lg:mb-7'>Sender Details</h1>
                        <div className='grid grid-cols-2 gap-3 lg:gap-7'>
                            <div>
                                <label className=' block font-medium '>Name</label>
                                <input required className='input w-full' type="text" placeholder='Sender Name' name='senderName' />
                            </div>
                            <div >
                                <label className=' block font-medium '>Region</label>
                                <select ref={senderRegion} required onChange={handleSenderRegionChange} name="senderRegion" className={`select w-full`} defaultValue="">
                                    <option value={""} disabled >Select Your Region</option>
                                    {division.map((data, index) =>
                                        <option className='text-black font-semibold' value={data} key={index} >{data}</option>
                                    )}
                                </select>
                            </div>
                            <div >
                                <label className=' block font-medium '>District</label>
                                <select required onClick={handleSenderDistrictChange} name="senderDistrict" className={`select w-full`} defaultValue={""} >
                                    <option disabled value={""} >Select Your District</option>
                                    {senderSelectedDistricts?.map((data, index) =>
                                        <option className='text-black font-semibold' value={data.district} key={index} >{data.district}</option>
                                    )}
                                </select>
                            </div>
                            <div >
                                <label className=' block font-medium '>Warehouse</label>
                                <select required onClick={handleSenderWarehouseChange} name="senderWarehouse" className={`select w-full`} defaultValue={""}>
                                    <option disabled value={""} >Select Your Warehouse</option>
                                    {senderSelectedWarehouses?.covered_area?.map((data, index) =>
                                        <option className='text-black font-semibold' value={data} key={index} >{data}</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className='block font-medium'>Contact Number</label>
                                <input required className='input w-full' type="number" placeholder='Sender Number' name='senderNumber' />
                            </div>

                            <div>
                                <label className='block font-medium'>Address</label>
                                <input required className='input w-full' type="text" placeholder='Sender Address' name='senderAddress' />
                            </div>
                        </div>
                        {/* address  */}
                        <div>
                            <label className='block font-medium mt-5'>Pickup Instruction(Optional)</label>
                            <textarea className=' w-full textarea' placeholder='Pickup Instruction' name='pickupInstruction' />
                        </div>
                    </fieldset>
                    {/* receiver  */}
                    <fieldset className={`${formPageAbility ? (currentFormPage === 3 ? 'block' : 'hidden') : ""} col-span-2 md:col-span-1 `}>
                        <h1 className='primary-text-color font-bold text-lg mb-3 lg:mb-7'>Receiver Details</h1>
                        <div className='grid grid-cols-2 gap-3 lg:gap-7'>
                            <div>
                                <label className=' block font-medium '>Name</label>
                                <input required className='input w-full' type="text" placeholder='Sender Name' name='receiverName' />
                            </div>
                            <div >
                                <label className=' block font-medium '>Region</label>
                                <select ref={receiverRegion} required onChange={handleReceiverDistrict} name="receiverRegion" className={`select w-full`} defaultValue="Select Your Region">
                                    <option disabled >Select Your Region</option>
                                    {division.map((data, index) =>
                                        <option className='text-black font-semibold' value={data} key={index} >{data}</option>
                                    )}
                                </select>
                            </div>

                            <div >
                                <label className=' block font-medium '>District</label>
                                <select required onClick={handleReceiverWarehouses} name="receiverDistrict" className={`select w-full`} defaultValue={""}>
                                    <option disabled value={""}>Select Your District</option>
                                    {receiverSelectedDistrict?.map((data, index) =>
                                        <option className='text-black font-semibold' value={data.district} key={index + 1} >{data.district}</option>
                                    )}
                                </select>
                            </div>

                            <div >
                                <label className=' block font-medium '>Warehouse</label>
                                <select required onClick={handleIsReceiverWarehouse} name="receiverWarehouse" className={`select w-full`} defaultValue={""}>
                                    <option disabled value={""}>Select Your Warehouse</option>
                                    {receiverSelectedWarehouses?.covered_area?.map((data, index) =>
                                        <option className='text-black font-semibold' value={data} key={index + 2} >{data}</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className='block font-medium'>Contact Number</label>
                                <input required className='input w-full' type="number" placeholder='Sender Number' name='receiverNumber' />
                            </div>
                            <div>
                                <label className='block font-medium'>Address</label>
                                <input required className='input w-full' type="text" placeholder='Sender Address' name='receiverAddress' />
                            </div>
                        </div>
                        {/* address  */}
                        <div>
                            <label className='block font-medium mt-5'>Delivery Instruction(Optional)</label>
                            <textarea className='w-full textarea' placeholder='Pickup Instruction' name='deliveryInstruction' />
                        </div>
                    </fieldset>

                </div>
                <Border className={`mt-7  md:my-7  border-b-gray-100 ${formPageAbility ? 'block' : 'hidden'}`}></Border>

                <button type='button' onClick={() => window.document.getElementById('my_modal_4').showModal()} className='underline block cursor-pointer hover:text-gray-600 duration-200 text-sm sm:text-base'>Delivery cost breakdown!</button>
                <div className='flex justify-end '>
                    <div className={`space-x-3 mt-2 ${formPageAbility ? "block" : "hidden"}`}>
                        <button onClick={handlePrevButton} disabled={currentFormPage < 2} className='btn' type='button'><ArrowLeftToLine size={16} />Prev</button>
                        {currentFormPage === 3 ?
                            <button className='primary-bg btn  btn-custom  '>Proceed to Confirm Booking</button>
                            :
                            <button onClick={handleNextButton} disabled={currentFormPage > 2} className='btn' type='button'>Next <ArrowRightToLine size={16} /></button>
                        }
                    </div>
                </div>
                <button className='primary-bg btn mt-5 lg:mt-10 btn-custom hidden md:block '>Proceed to Confirm Booking</button>

            </form>





            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box p-0">
                    <div className="flex items-start justify-between gap-4 bg-linear-to-r from-[#caeb66] to-[#a8d94a] p-5">
                        <div>
                            <h3 className="text-xl font-bold primary-text-color">Pricing Breakdown</h3>
                            <p className="mt-1 text-sm text-gray-500">Estimated delivery charge by parcel type, weight, and destination.</p>
                        </div>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost" aria-label="Close pricing breakdown">X</button>
                        </form>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <table className="table table-zebra w-max">
                            <thead>
                                <tr>
                                    <th>Parcel Type</th>
                                    <th>Weight</th>
                                    <th>Within District</th>
                                    <th>Outside District</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Document</td>
                                    <td>Any</td>
                                    <td>60৳ </td>
                                    <td>80৳ </td>
                                </tr>
                                <tr>
                                    <td>Non-Document</td>
                                    <td>0-3kg</td>
                                    <td>110৳ </td>
                                    <td>150৳ </td>
                                </tr>
                                <tr>
                                    <td>Non-Document</td>
                                    <td>3kg+</td>
                                    <td>110৳ + 40৳/kg</td>
                                    <td>150৳ + 40/kg + 40৳</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-sm text-gray-500 p-5">
                        For non-document parcels over 3kg, start with the base rate, then add only the extra weight charge above 3kg.
                    </p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </SectionWrapper>
    );
};

export default SendParcel;
