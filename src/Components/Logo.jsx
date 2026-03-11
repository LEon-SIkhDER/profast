import React from 'react';
import logo from "../assets/logo.png"
import { Link } from 'react-router';

const Logo = ({ textColor = "black" }) => {
    return (
        <Link to={"/"}>
            <div className='flex items-end text-3xl font-extrabold cursor-pointer'>
                <img src={logo} alt="" />
                <h1 className='translate-y-2 -translate-x-4 ' style={{ color: textColor }}>Profast</h1>
            </div>
        </Link>
    );
};

export default Logo;