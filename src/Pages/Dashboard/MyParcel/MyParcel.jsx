import axios from 'axios';
import React, {  useContext, useEffect,  useState } from 'react';
import {  useNavigate, useParams } from 'react-router';
import { AuthContext } from '../../../Context/AuthContext';
import { FiMapPin } from 'react-icons/fi';
import { ArrowLeft, LucidePackageSearch, MapPin } from 'lucide-react';
import Logo from '../../../Components/Logo';

const MyParcel = () => {
    const navigate = useNavigate()

    const { user } = useContext(AuthContext)

    const { id } = useParams()
    const [data, setData] = useState()
    useEffect(() => {
        axios.get(`http://localhost:5000/parcel?id=${id}`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        })
            .then(data => {
                console.log(data.data)
                setData(data.data)
            })
    }, [])


    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">No parcel data available</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 ">
            <button className='btn btn-custom2 mb-2' onClick={() => navigate(-1)}><ArrowLeft />Back</button>
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

                {/* Header (UNCHANGED) */}
                <div className="bg-gradient-to-r from-[#caeb66] to-[#a8d94a] p-6">
                    <h1 className="text-3xl font-bold text-black">Parcel Details</h1>
                    <p className="text-base text-black/80 font-medium">
                        ID: {data.parcelId}
                    </p>
                </div>

                <div className="p-6 space-y-6">

                    {/* Parcel Overview */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow-sm grid grid-cols-2 md:grid-cols-3 gap-6">

                        <div>
                            <p className="text-gray-500 text-sm font-medium">Parcel Name</p>
                            <p className="text-lg font-semibold">{data["parcel-name"]}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm font-medium">Type</p>
                            <p className="text-lg font-semibold">{data.type}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm font-medium">Weight</p>
                            <p className="text-lg font-semibold">{data.parcelWeight} kg</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm font-medium">Cost</p>
                            <p className="text-lg font-semibold">$ {data.cost}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm font-medium">Payment</p>
                            <p className="text-lg font-semibold">
                                {data.paymentStatus ? "Paid" : "Due"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm font-medium">Created</p>
                            <p className="text-lg font-semibold">{data.createdAt}</p>
                        </div>

                    </div>

                    {/* Instructions */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow-sm grid md:grid-cols-2 gap-6 relative">

                        {/* Divider */}
                        <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-gray-300"></div>

                        <div>
                            <h3 className="text-base font-bold tracking-wide mb-2">
                                PICKUP INSTRUCTION
                            </h3>
                            <p className="text-base font-medium text-gray-700">
                                {data.pickupInstruction}
                            </p>
                        </div>

                        <div className="md:pl-6">
                            <h3 className="text-base font-bold tracking-wide mb-2">
                                DELIVERY INSTRUCTION
                            </h3>
                            <p className="text-base font-medium text-gray-700">
                                {data.deliveryInstruction}
                            </p>
                        </div>

                    </div>

                    {/* Parties Involved */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow-sm grid md:grid-cols-2 gap-6 relative">

                        {/* Divider */}
                        <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-gray-300"></div>

                        {/* Sender */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">SENDER DETAILS</h3>

                            <div className="space-y-2 text-base">
                                <p><span className="font-medium text-gray-600">Name:</span> {data.senderName}</p>
                                <p><span className="font-medium text-gray-600">Phone:</span> {data.senderNumber}</p>
                                <p><span className="font-medium text-gray-600">Address:</span> {data.senderAddress}</p>
                                <p><span className="font-medium text-gray-600">Region:</span> {data.senderRegion}</p>
                                <p><span className="font-medium text-gray-600">District:</span> {data.senderDistrict}</p>
                                <p><span className="font-medium text-gray-600">Warehouse:</span> {data.senderWarehouse}</p>
                            </div>
                        </div>

                        {/* Receiver */}
                        <div className="md:pl-6">
                            <h3 className="text-lg font-bold mb-4">RECEIVER DETAILS</h3>
                            <div className="space-y-2 text-base">
                                <p><span className="font-medium text-gray-600">Name:</span> {data.receiverName}</p>
                                <p><span className="font-medium text-gray-600">Phone:</span> {data.receiverNumber}</p>
                                <p><span className="font-medium text-gray-600">Address:</span> {data.receiverAddress}</p>
                                <p><span className="font-medium text-gray-600">Region:</span> {data.receiverRegion}</p>
                                <p><span className="font-medium text-gray-600">District:</span> {data.receiverDistrict}</p>
                                <p><span className="font-medium text-gray-600">Warehouse:</span> {data.receiverWarehouse}</p>
                            </div>
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="flex justify-end pt-4">
                        <button
                            className="btn btn-custom2">
                            <LucidePackageSearch size={18} />
                            Track Parcel
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyParcel;