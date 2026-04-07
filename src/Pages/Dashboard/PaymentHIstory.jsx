
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { format } from "date-fns";
import { VscCopy } from "react-icons/vsc";
import { Tooltip } from 'react-tooltip';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';

const PaymentHIstory = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()

    // const [payments, setPayments] = useState([...Array(8)])
    const [tooltipMessage, setTooltipMessage] = useState("copy")

    // useEffect(() => {
    //     axiosSecure.get(`http://localhost:5000/payments?email=${user.email}`)
    //         .then(result => {
    //             console.log(result.data)
    //             setPayments(result.data)
    //         })

    // }, [])
    const { data: payments } = useQuery({
        queryKey: ["payments"],
        queryFn: async () => {
            const result = await axiosSecure.get(`http://localhost:5000/payments?email=${user.email}`)
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

    return (
        <div>
            <div className="">
                <table className="table table-lg table-zebra bg-white rounded-2xl shadow-sm font-medium overflow-hidden">
                    <thead className='bg-[#caeb66]'>
                        <tr>
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
                                    <th className='text-center '>{data && index + 1}</th>
                                    <td>{data?.parcelId || <Skeleton></Skeleton>}</td>
                                    <td>{data ? currencyAmount(data?.currency, data?.amount) : <Skeleton></Skeleton>}</td>

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
                                    <td>{data?.method || <Skeleton></Skeleton>}</td>
                                    {/* <td>Blue</td> */}
                                </tr>
                            )
                        }
                    </tbody>

                </table>
                {payments?.length === 0 && <h1 className='text-center font-bold text-xl'>No Payments Yet</h1>}
            </div>
        </div>
    );
};

export default PaymentHIstory;