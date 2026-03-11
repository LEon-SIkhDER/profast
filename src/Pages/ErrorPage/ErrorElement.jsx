import React from 'react';
import Header from '../../SharedComponents/Header';
import Footer from '../../SharedComponents/Footer';
import errorImg from "../../assets/error.png"
import { Link } from 'react-router';

const ErrorElement = () => {
    return (
        <div className='bg-'>
            <Header></Header>
            <section>
                <div className='bg-white rounded-2xl shadow-sm p-20 text-center'>
                    <img className='max-w-lg mx-auto' src={errorImg} alt="" />
                    <Link to={"/"}>
                        <button className='btn primary-bg  rounded-lg'>Go Home</button>
                    </Link>



                </div>
            </section>
            <Footer></Footer>

        </div>
    );
};

export default ErrorElement;