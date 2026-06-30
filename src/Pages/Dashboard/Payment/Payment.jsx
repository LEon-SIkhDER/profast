import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useContext, useEffect, useState } from 'react';
import PaymentForm from './PaymentForm';

import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Payment = () => {
    const stripePromise = loadStripe(import.meta.env.VITE_paymentKey);
    const navigate = useNavigate()
    const { theme } = useContext(AuthContext)
    const isDark = theme === "dark" ? true : false

    const axiosSecure = useAxiosSecure()
    const [payment, setPayment] = useState(true)
    const { id } = useParams()

    useEffect(() => {
        axiosSecure.get(`https://profast-server-henna.vercel.app/parcel?id=${id}`)
            .then(result => {
                console.log(result.data)
                if (result.data.paymentStatus) {
                    Swal.fire({
                        icon: "info",
                        title: "Payment for this parcel has already been processed!",
                        text: "Back to your parcel page",
                        color: isDark ? "#F8FAFC" : "#111827",
                        background: isDark ? "#0F172A" : "#FFFFFF",
                        confirmButtonText: "Back"
                    }).then(result => {
                        if (result.isConfirmed) {
                            return navigate(-1)
                        }
                    })
                }
                else {
                    setPayment(false)
                }

            })
            .catch(error => {
                console.log(error)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    color: isDark ? "#F8FAFC" : "#111827",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    confirmButtonText: "Back"
                }).then(result => {
                    if (result.isConfirmed) {
                        return navigate(-1)
                    }
                })
            })
    }, [])



    if (payment) {
        return
    }

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm></PaymentForm>
        </Elements>
    );
};

export default Payment;
