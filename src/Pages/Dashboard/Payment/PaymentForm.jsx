import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Currency } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure()

    const navigate = useNavigate()

    const { id } = useParams()
    const [data, setData] = useState()
    // console.log(data?.parcelId)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axiosSecure.get(`http://localhost:5000/parcel?id=${id}`)
            .then(res => setData(res.data))
    }, [])

    // ERROR STATE 
    const [error, setError] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!stripe || !elements) {
            return
        }
        const card = elements.getElement(CardElement)
        if (!card) {
            return
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: "card", card })
        if (error) {
            setLoading(false)
            setError(error.message)
            console.log(error)

        }
        else {
            console.log(paymentMethod)
        }

        const res = await axios.post("http://localhost:5000/create-payment-intent", {
            amount: data.cost * 100
        })

        const clientSecret = res.data.clientSecret

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                // billing_details: {
                //     name: "nameOnCard",
                //     email: "emailAddress"
                // }
            }
        });
        console.log(result)

        if (result.error) {
            // Show error message
            setLoading(false)
            setError(result.error.message);
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            // Show success message

            setLoading(false)

            card.clear()


            navigate("/dashboard")
            toast.success('Payment Successful')

            const paymentData = {
                parcelId: data.parcelId,
                paymentId: result.paymentIntent.id,
                email: data.userEmail,
                amount: result.paymentIntent.amount,
                method: result.paymentIntent.payment_method_types[0],
                currency:result.paymentIntent.currency

            }
            console.log(result)
            const paymentRes = await axios.post("http://localhost:5000/payments", paymentData)
            console.log(paymentRes)

        }

    }




    return (
        <div>
            <Toaster></Toaster>
            <form onSubmit={handleSubmit} className='w-sm shadow rounded p-5 '>
                <CardElement>
                </CardElement>
                <button className='btn btn-success text-white mt-5 w-full' disabled={!stripe} >
                    {loading ? <span className="loading loading-spinner loading-md"></span> : `Pay $${data?.cost}`}
                </button>
                {error && <p className='text-red-500'>{error}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;