import React from 'react';
import Marquee from 'react-fast-marquee';
import logo1 from "../../assets/brands/amazon.png"
import logo2 from "../../assets/brands/amazon_vector.png"
import logo3 from "../../assets/brands/casio.png"
import logo4 from "../../assets/brands/moonstar.png"
import logo5 from "../../assets/brands/randstad.png"
import logo6 from "../../assets/brands/start-people 1.png"
import logo7 from "../../assets/brands/start.png"

const Companies = () => {
    const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7]
    return (
        <div className='my-20'>
            <h1 className='text-3xl font-extrabold text-center text-[#03373D] mb-10'>We've helped thousands of sales teams</h1>
                <Marquee gradient gradientColor='#EAECED' gradientWidth={400} autoFill>
                    {
                        logos.map((logo, index) =>
                            <img className='mr-20 ' key={index} src={logo} alt="" />
                        )
                    }
                </Marquee>
        </div>

    );
};

export default Companies;