import React from 'react';
import ComponentWrapper from './ComponentWrapper';
import { format } from 'date-fns';
import SectionWrapper from './SectionWrapper';
import Border from './Border';

const ApplicationAlreadyApplied = ({ data, isReapply }) => {
    console.log(isReapply)
    console.log(data)
    return (
        <div className='mx-auto max-w-[1520px] px-2.5'>

            {/* <ComponentWrapper> */}
            <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden mx-auto">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#caeb66] to-[#a8d94a] p-5 flex justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-black">
                            Rider Application
                        </h2>
                        <p className="text-sm text-black/70">
                            Name: {data.name}
                        </p>
                    </div>



                </div>

                {/* Body */}
                <div className='p-6'>

                    <div className="grid grid-cols-2 gap-5">

                        <div>
                            <p className="text-gray-500 text-sm">Name</p>
                            <p className="font-semibold text-base">{data.name}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Age</p>
                            <p className="font-semibold text-base">{data.age}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Applied At</p>
                            <p className="font-semibold text-base">
                                {format(new Date(data.created_At), "dd/MM/yyyy")}
                            </p>

                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Phone</p>
                            <p className="font-semibold text-base">{data.number}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Division</p>
                            <p className="font-semibold text-base">{data.division}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">District</p>
                            <p className="font-semibold text-base">{data.district}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Warehouse</p>
                            <p className="font-semibold text-base">{data.chosen_warehouse}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Status</p>
                            <p className={`font-semibold text-base capitalize ${data.status === "pending" ? "text-yellow-600" : data.status === "rejected" ? "text-red-600" : "text-green-600"
                                }`}>
                                {data.status}
                            </p>
                        </div>

                        <div className="col-span-2">
                            <p className="text-gray-500 text-sm">Email</p>
                            <p className="font-semibold text-base">{data.email}</p>
                        </div>
                    </div>
                    {/* {data.status === 'rejected' &&
                        <div>
                            <Border className={'my-4 block'} />
                            <div className='flex justify-end'>
                                <div className='flex justify-end'>
                                    <button
                                        onClick={() => isReapply(true)}
                                        className=' btn bg-[#CAEB66]'
                                    >
                                        Apply Again?
                                    </button>
                                </div>
                            </div>
                        </div>
                    } */}
                </div>
                {/* Footer */}
                {/* <div className="flex justify-end gap-3 p-5 border-t items-center">
            
                                            <button onClick={() => { handleAcceptRider(data._id, "Approved"), document.getElementById("my_modal_1").close(); }} className="btn btn-outline btn-error ">
                                                Reject
                                            </button>
            
                                            <button onClick={() => { handleAcceptRider(data._id, "Rejected"), document.getElementById("my_modal_1").close(); }} className="btn btn-custom font-medium rounded">
                                                Approve Rider
                                            </button>
            
                                        </div> */}

            </div>
            {/* </ComponentWrapper>  */}
        </div >

    );
};

export default ApplicationAlreadyApplied;