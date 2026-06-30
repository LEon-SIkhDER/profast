import React, { useContext } from 'react';
import Logo from '../Components/Logo';
import { FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router';
import { AuthContext } from '../Context/AuthContext';

const Footer = () => {
    const { user } = useContext(AuthContext)
    return (
        <div className=' pt-5 sm:pt-10 md:pt-20 pb-2.5 md:pb-5 '>
            <section>
                <div className='bg-black rounded-2xl sm:rounded-4xl p-5 xxs:p-8 sm:p-10 min-[800px]:p-20  shadow-sm mx-auto '>
                    <div className='mx-auto w-max mb-4 '>
                        <Logo textColor='white'></Logo>
                    </div>
                    <p className=' text-gray-200 text-justify  xl:text-center text-xs xxs:text-sm sm:text-base' style={{ textAlignLast: "center" }}>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
                    <ul className='flex flex-wrap justify-center gap-5 sm:gap-10 text-white py-4 sm:py-8 my-4 sm:my-8 border-y border-dashed border-[#03464D] *:border-b *:hover:border-b-white *:border-b-transparent *:duration-100 text-xs *:xxs:text-sm *:sm:text-base'>
                        <Link to={"/"}>
                            <li>Home</li>
                        </Link>
                        <Link to={"/coverage"}>
                            <li>Coverage</li>
                        </Link>
                        <Link to={"/about-us"}>
                            <li>About Us</li>
                        </Link>
                        {user &&
                            <>
                                <Link to={"/dashboard"}>
                                    <li>Dashboard</li>
                                </Link>
                                <Link to={"/send-parcel"}>
                                    <li>Send Parcel</li>
                                </Link>
                                <Link to={"/be-a-rider"}>
                                    <li>Be A Rider</li>
                                </Link>
                            </>
                        }
                    </ul>
                    <ul className='flex gap-5 justify-center '>
                        <li><FaLinkedin className='size-6 xxs:size-9' color='#0575B3' /></li>
                        <li><FaSquareXTwitter className='size-6 xxs:size-9' color='white' fill='white ' /></li>
                        <li><a href="https://www.facebook.com/leon.sikdar" target='_blank'><FaFacebook className='size-6 xxs:size-9' color='#006AFF' /></a></li>
                        <li><FaYoutube className='size-6 xxs:size-9' color='#FF0000' /></li>
                    </ul>
                </div>
            </section>
        </div>

    );
};

export default Footer;
