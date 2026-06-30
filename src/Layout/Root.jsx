import React, { useContext } from 'react';
import Header from '../SharedComponents/Header';
import { Outlet } from 'react-router';
import Footer from '../SharedComponents/Footer';
import { AuthContext } from '../Context/AuthContext';

const Root = () => {
    const { theme } = useContext(AuthContext)
    return (
        <div className={`bg-[#EAECED] min-h-screen flex flex-col  ${theme === "dark" ? "dark" : ""} dark:bg-[#031518]`} data-theme={theme}>
            <Header></Header>
            <div className='flex-1'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    )
};

export default Root;
