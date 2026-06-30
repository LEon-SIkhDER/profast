
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { format } from "date-fns";
import { VscCopy } from "react-icons/vsc";
import { Tooltip } from 'react-tooltip';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { SearchX } from 'lucide-react';
import visaImage from "/visa2.png"

const PaymentHIstory = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()

    const [tooltipMessage, setTooltipMessage] = useState("copy")


    const { data: payments } = useQuery({
        queryKey: ["payments"],
        queryFn: async () => {
            const result = await axiosSecure.get(`https://profast-server-henna.vercel.app/payments?email=${user.email}`)
            return result.data
        },
        placeholderData: [...Array(8)]
    })
    console.log(payments)


    const completeDate = (isoString) => {
        const time = format(isoString, "p")
        const date = format(isoString, "P")


        return (
            <div>
                <h1 className=''>{time}</h1>
                <h2>{date}</h2>
            </div>
        )
    }
    const handleCopy = async (id) => {
        await navigator.clipboard.writeText(id)

        new Audio('/copy.mp3').play()
        setTooltipMessage("Copied!")
        setTimeout(() => {
            setTooltipMessage("Copy")
        }, 2000);

    }
    const currencySymbols = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        CNY: "¥",
        INR: "₹",
        AUD: "A$",
        CAD: "C$",
        CHF: "CHF",
        NZD: "NZ$",
        KRW: "₩",
        MXN: "MX$",
        PHP: "₱",
        RUB: "₽",
        ZAR: "R",
        // add more as needed
    }
    const currencyAmount = (currency, amount) => {
        const currencySymbol = currencySymbols[currency.toUpperCase()] || currency
        const amountFullForm = amount / 1000

        return `${currencySymbol}${amountFullForm}`


    }
    console.log(currencyAmount("usd", 12000))
    console.log(payments)

    return (
        <div>
            <div className='shadow-sm rounded-2xl bg-linear-to-r from-[#caeb66]/50 to-[#caeb66]/25 dark:from-[#08262B] dark:to-[#0D1F22] dark:border dark:border-white/10 overflow-hidden'>
                <div className='p-5 border border-[#caeb66]/40 dark:border-cyan-400/10 border-b-0 rounded-tl-2xl rounded-tr-2xl '>
                    <h1 className='text-2xl font-bold '>Payment Histories</h1>
                    <p className='text-sm text-gray-500 dark:text-[#AAB8B4] mt-1'>A complete record of all successfully completed payments and transactions.</p>
                </div>
                <table className="min-[850px]:table hidden table-lg table-zebra bg-white dark:bg-[#071A1D] font-medium   ">
                    <thead className='bg-[#caeb66]'>
                        <tr className='text-black dark:text-[#F5F7F2]'>
                            <th className='text-center '>No.</th>
                            <th>Parcel ID</th>
                            <th>Amount</th>
                            <th className='w-fit'>Transaction ID</th>
                            <th>Paid At</th>
                            <th>Method</th>
                            {/* <th>Favorite Color</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        <Tooltip id="my-tooltip" className='absolute' />

                        {

                            payments?.map((data, index) =>
                                <tr key={index}>
                                    <th className='text-center '>{data ? index + 1 : <Skeleton></Skeleton>}</th>
                                    <td>{data?.parcelId || <Skeleton></Skeleton>}</td>
                                    <td>{data ? `${Number(data.amount) / 100}৳` : <Skeleton></Skeleton>}</td>

                                    <td>
                                        {data ? <div className='flex items-center gap-2'>

                                            <h6
                                                className='cursor-default'
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content={data?.paymentId}

                                            >{data && `${data.paymentId.slice(0, 10)}...`}</h6>
                                            {data && <VscCopy
                                                onClick={() => handleCopy(data?.paymentId)}
                                                className='cursor-pointer active:scale-95 focus:outline-none'
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content={tooltipMessage} />}

                                        </div> : <Skeleton></Skeleton>}

                                    </td>
                                    <td>{data ? completeDate(data.time) : <Skeleton></Skeleton>}</td>
                                    <td className='capitalize'>{data?.method || <Skeleton></Skeleton>}</td>
                                    {/* <td>Blue</td> */}
                                </tr>
                            )
                        }
                    </tbody>

                </table>
                {payments?.length === 0 && <div className='  px-5 py-12 text-center bg-white dark:bg-[#071A1D]'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#CAEB66]/30 text-[#03373D] mx-auto'>
                        <SearchX size={34} />
                    </div>
                    <h2 className='mt-5 text-2xl font-bold text-[#03373D]'>No payments yet</h2>
                    <p className='mt-2  text-sm font-medium text-gray-500 dark:text-[#AAB8B4]'>There is nothing to show here right now.</p>

                </div>}
            </div>

            {/* mobile table */}
            <div className='min-[850px]:hidden' >
                {
                    payments?.map((data, index) =>
                        <div className='flex gap-2        border-b border-b-gray-200 py-5 ' key={index}>
                            <div className={`h-10 w-10  rounded-full ${data && "border"} border-gray-200 dark:border-white/10 p-1 flex items-center justify-center`}>
                                {data ? <img src={visaImage} alt="" /> : <Skeleton width={40} height={40} circle={true}></Skeleton>}
                            </div>
                            <div className='space-y-1 flex-1'>
                                <div className='flex justify-between' >
                                    <h1 className='font-semibold text-gray-500 dark:text-[#AAB8B4] text-sm'>{data?.parcelName || <Skeleton width={60} />}</h1>
                                    <h2 className='font-semibold text-sm'>{data?.parcelId || <Skeleton width={150}></Skeleton>}</h2>

                                </div>
                                {/* <h2 className='text-xs'>Pcl Id:{data?.parcelId}</h2> */}
                                <div className='flex justify-between'>
                                    <h2 className='text-sm uppercase'>{data?.method || <Skeleton width={50}></Skeleton>}</h2>
                                    <h3 className='text-sm'>{data ? data && format(new Date(data.time), "p P") : <Skeleton width={100}></Skeleton>}</h3>
                                </div>
                                <div className='flex justify-between'>
                                    <h3 className='text-sm'> {data ? `TrxId: ${data.paymentId}` : < Skeleton width={200} />}</h3>
                                    <h2 className='font-semibold'>{data ? `${Number(data.amount) / 100}৳` : <Skeleton width={80}></Skeleton>}</h2>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default PaymentHIstory;

