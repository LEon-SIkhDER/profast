import React from 'react';
import banner from "../../assets/banner/banner1.png"
import banner2 from "../../assets/banner/banner2.png"
import banner3 from "../../assets/banner/banner3.png"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


const Banner = () => {
    return (
        <div className='select-none'>
            <section>
                <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
                    <img src={banner} />
                    <img src={banner2} />
                    <img src={banner3} />
                </Carousel>
            </section>
        </div>

    );
};

export default Banner;  