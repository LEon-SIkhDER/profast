import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { format } from "date-fns";
import { VscCopy } from "react-icons/vsc";
import { Tooltip } from 'react-tooltip';

const PaymentHIstory = () => {
    const { user } = useContext(AuthContext)

    const [payments, setPayments] = useState()
    const [tooltipMessage, setTooltipMessage] = useState("copy")
    useEffect(() => {
        axios.get(`http://localhost:5000/payments?email=${user.email}`)
            .then(result => {
                console.log(result.data)
                setPayments(result.data)
            })

    }, [])

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
                                    <th className='text-center '>{index + 1}</th>
                                    <td>{data.parcelId}</td>
                                    <td>{currencyAmount(data.currency, data.amount)}</td>

                                    <td>
                                        <div className='flex items-center gap-2'>

                                            <h6
                                                className='cursor-default'
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content={data.paymentId}

                                            >{data.paymentId.slice(0, 10)}...</h6>
                                            <VscCopy
                                                onClick={() => handleCopy(data.paymentId)}
                                                className='cursor-pointer active:scale-95 focus:outline-none'
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content={tooltipMessage} />
                                        </div>
                                    </td>
                                    <td>{completeDate(data.time)}</td>
                                    <td>{data.method}</td>
                                    {/* <td>Blue</td> */}
                                </tr>
                            )
                        }
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default PaymentHIstory;