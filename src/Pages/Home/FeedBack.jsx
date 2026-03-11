import React from 'react';
import FeedBackLogo from '../../assets/customer-top.png'

const FeedBack = () => {
    return (
        <div>
            <section>
                <div>

                    <img className='mx-auto mb-10' src={FeedBackLogo} alt="" />
                    <h1 className='text-center text-4xl font-extrabold mb-6'>What our customers are sayings</h1>
                    <p className='mx-auto text-center w-[832px] mb-10'>Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!</p>

                </div>
            </section>

        </div>
    );
};

export default FeedBack;