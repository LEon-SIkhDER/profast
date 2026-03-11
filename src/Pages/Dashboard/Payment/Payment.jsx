import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useContext, useEffect, useState } from 'react';
import PaymentForm from './PaymentForm';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const Payment = () => {
    const stripePromise = loadStripe(import.meta.env.VITE_paymentKey);
    const navigate = useNavigate()

    const {user} = useContext(AuthContext)

    const [payment, setPayment] = useState(true)

    const { id } = useParams()

    useEffect(() => {
        axios.get(`http://localhost:5000/parcel?id=${id}`, {
            headers:{
                Authorization:`Bearer ${user.accessToken}`
            }
        })
            .then(result => {
                console.log(result.data)
                if (result.data.paymentStatus) {
                    Swal.fire({
                        icon: "info",
                        title: "Payment for this parcel has already been processed!",
                        text: "Back to your parcel page",
                        confirmButtonText: "Back"
                    }).then(result => {
                        if (result.isConfirmed) {
                            return navigate(-1)
                        }
                    })
                }
                else{
                    setPayment(false)
                }

            })
            .catch(error => {
                console.log(error)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
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