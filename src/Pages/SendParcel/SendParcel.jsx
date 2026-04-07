import React, { useContext, useRef, useState } from 'react';
import Border from '../../Components/Border';
import SectionWrapper from '../../Components/SectionWrapper';
import { useLoaderData, useNavigate } from 'react-router';
import "./SendParcel.css"
import Swal from 'sweetalert2';
import { Weight } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import Payment from '../Dashboard/Payment/Payment';

const SendParcel = () => {
    const { user } = useContext(AuthContext)

    const { wareHouses, division } = useLoaderData()
    const navigate = useNavigate()

    // const [regionSelected, setRegionSelected] = useState(false)

    const [document, setDocument] = useState(true)
    // const [loadingButton, setLoadingButton] = useState(false)

    const [selectedDistricts, setSelectedDistricts] = useState(null)
    const [selectedWarehouses, setSelectedWarehouses] = useState(null)
    const paymentModal = useRef()
    console.log(paymentModal)










    const handleRegionChange = (e) => {


        // console.log(e.target.value)
        // setRegionSelected(true)

        const selectedDistricts = wareHouses.filter((wareHouse) => wareHouse.region === e.target.value)
        setSelectedDistricts(selectedDistricts)



    }

    const [selectedDistrict, setSelectedDistrict] = useState(null)

    const handleDistrictChange = (e) => {
        e.preventDefault()

        if (!selectedDistricts) {
            return alert("Please Select The Region First")
        }
        setSelectedDistrict(e.target.value)
        setSelectedWarehouses(selectedDistricts.find((data) => data.district === e.target.value))



    }

    const handleWarehouseChange = (e) => {
        e.preventDefault()
        if (!selectedDistrict) {
            return alert("Please Select The District First")

        }


    }


    const handleDocument = (e) => {

        const result = e.target.value
        result === "document" ? setDocument(true) : setDocument(false)

    }

    const handleForm = (e) => {
        e.preventDefault()
        // console.log(parcelId)
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

        console.log(data)



        let insertedId


        Swal.fire({
            title: "Confirm parcel submission",
            html: `<span>Delivery Cost: <span class='text-black font-medium'>${Math.ceil(cost)}tk</span> </span>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2aa353",
            cancelButtonColor: "#d33",
            confirmButtonText: `Proceed to Confirm payment`,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axios.post("http://localhost:5000/parcels", data)
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
                    // Swal.fire({
                    //     title: "Submitted!",
                    //     html: `<p>Parcel Id:${parcelId}</p><h1 class="text-black font-semibold">Your parcel will be picked up soon.</h1>`,
                    //     icon: "success",
                    //     confirmButtonColor: "#2aa353",
                    //     confirmButtonText: "<span>Ok</span>",
                    // });
                    // e.target.reset()
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
    //         console.log(e.target.value)
    //     }
    // }







    return (
        <SectionWrapper>
            <h1 className='text-5xl font-bold primary-text-color '>Send Parcel </h1>
            <p>--PickUp Time 10am-7pm Approx.</p>
            <Border className={"my-12"}>    </Border>
            <h2 className='text-2xl font-bold primary-text-color -mt-5 mb-7'>Enter your parcel details</h2>

            <form onSubmit={handleForm}>

                <fieldset className='mb-7 space-x-12 font-semibold primary-text-color *:inline-flex *:items-center *:gap-2 '>
                    <label>
                        <input required onChange={handleDocument} className='scale-150 cursor-pointer accent-green-600' type="radio" name='type' value={"document"} />
                        <span className='mt-0.5'>Document</span>
                    </label>
                    <label>
                        <input required onChange={handleDocument} className='scale-150 cursor-pointer accent-green-600' type="radio" name='type' value={"non-document"} />
                        <span className='mt-0.5'>Non-Document</span>
                    </label>

                </fieldset>




                <fieldset className='grid grid-cols-2 gap-7'>
                    <div>
                        <label className=' font-medium text-sm block'>Parcel Name</label>
                        <input required className='input w-full ' type="text" placeholder='Parcel Name' name='parcel-name' />
                    </div>

                    <div>
                        <label className=' font-medium text-sm block'>Parcel Weight(kg)</label>
                        <input className='input w-full' step="any" disabled={document} type="number" placeholder='Parcel Weight' name='parcelWeight' required />
                    </div>
                </fieldset>

                <Border className={"my-7 border-b-gray-100"}></Border>

                <div className='grid grid-cols-2 gap-12'>
                    {/* mother of left and right side  */}
                    <fieldset>
                        <h1 className='primary-text-color font-bold text-lg mb-7'>Sender Details</h1>
                        <div className='grid grid-cols-2 gap-7'>
                            <div>
                                <label className=' block font-medium '>Name</label>
                                <input required className='input w-full' type="text" placeholder='Sender Name' name='senderName' />
                            </div>
                            <div >
                                <label className=' block font-medium '>Region</label>
                                <select required onChange={handleRegionChange} name="senderRegion" className={`select`} defaultValue="">
                                    <option value={""} disabled >Select Your Region</option>
                                    {division.map((data, index) =>
                                        <option className='text-black font-semibold' value={data} key={index} >{data}</option>
                                    )}
                                </select>
                            </div>

                            <div >
                                <label className=' block font-medium '>District</label>
                                <select required onClick={handleDistrictChange} name="senderDistrict" className={`select`} defaultValue={""} >
                                    <option disabled value={""} >Select Your District</option>
                                    {selectedDistricts?.map((data, index) =>
                                        <option className='text-black font-semibold' value={data.district} key={index} >{data.district}</option>
                                    )}
                                </select>
                            </div>




                            <div >
                                <label className=' block font-medium '>Warehouse</label>
                                <select required onClick={handleWarehouseChange} name="senderWarehouse" className={`select`} defaultValue={""}>
                                    <option disabled value={""} >Select Your Warehouse</option>
                                    {selectedWarehouses?.covered_area?.map((data, index) =>
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
                            <label className='block font-medium mt-5'>Pickup Instruction</label>
                            <textarea className=' w-full textarea' placeholder='Pickup Instruction' name='pickupInstruction' />
                        </div>



                    </fieldset>
                    {/* receiver  */}
                    <fieldset>
                        <h1 className='primary-text-color font-bold text-lg mb-7'>Receiver Details</h1>
                        <div className='grid grid-cols-2 gap-7'>
                            <div>
                                <label className=' block font-medium '>Name</label>
                                <input required className='input w-full' type="text" placeholder='Sender Name' name='receiverName' />
                            </div>
                            <div >
                                <label className=' block font-medium '>Region</label>
                                <select required onChange={handleRegionChange} name="receiverRegion" className={`select`} defaultValue="Select Your Region">
                                    <option disabled >Select Your Region</option>
                                    {division.map((data, index) =>
                                        <option className='text-black font-semibold' value={data} key={index} >{data}</option>
                                    )}
                                </select>
                            </div>

                            <div >
                                <label className=' block font-medium '>District</label>
                                <select required onClick={handleDistrictChange} name="receiverDistrict" className={`select`} defaultValue={""}>
                                    <option disabled value={""}>Select Your District</option>
                                    {selectedDistricts?.map((data, index) =>
                                        <option className='text-black font-semibold' value={data.district} key={index + 1} >{data.district}</option>
                                    )}
                                </select>
                            </div>




                            <div >
                                <label className=' block font-medium '>Warehouse</label>
                                <select required onClick={handleWarehouseChange} name="receiverWarehouse" className={`select`} defaultValue={""}>
                                    <option disabled value={""}>Select Your Warehouse</option>
                                    {selectedWarehouses?.covered_area?.map((data, index) =>
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
                            <label className='block font-medium mt-5'>Delivery Instruction</label>
                            <textarea className='w-full textarea' placeholder='Pickup Instruction' name='deliveryInstruction' />
                        </div>
                    </fieldset>
                </div>

                <h1 className='underline cursor-pointer hover:text-gray-600 duration-200'>Delivery cost breakdown!</h1>

                <button className='primary-bg btn mt-10 btn-custom'>Proceed to Confirm Booking</button>








            </form>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* <button className="btn" onClick={() => paymentModal?.current?.showModal()}>open modal</button> */}
            {/* <dialog ref={paymentModal} className="modal">
                <div className="modal-box">
                    <Payment></Payment>
                </div>
                <form method="dialog" className='modal-backdrop'>
          
                    <button>Close</button>
                </form>
    
            </dialog> */}
        </SectionWrapper>
    );
};

export default SendParcel;