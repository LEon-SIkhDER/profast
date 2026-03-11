import React from 'react';
import Banner from './Banner';
import HowItsWork from './HowItsWork';
import Services from './Services';
import Companies from './Companies';
import AboutUs from './AboutUs';
import Priority from './Priority';
import FeedBack from './FeedBack';
import FAQ from './FAQ';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HowItsWork></HowItsWork>
            <Services></Services>
            <Companies></Companies>
            <AboutUs></AboutUs>
            <Priority></Priority>
            <FeedBack></FeedBack>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;