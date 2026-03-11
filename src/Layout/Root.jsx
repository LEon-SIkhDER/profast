import React from 'react';
import Header from '../SharedComponents/Header';
import { Outlet } from 'react-router';
import Footer from '../SharedComponents/Footer';

const Root = () => {
    return (
        <div  className="bg-[#EAECED] min-h-screen">
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
                        
        </div>
    );
};

export default Root;