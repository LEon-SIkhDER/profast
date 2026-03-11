import React from 'react';
import Logo from '../Components/Logo';
import { FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <div className=' py-20 '>
            <section>
                <div className='bg-black rounded-4xl p-20 shadow-sm mx-auto '>
                    <div className='mx-auto w-max mb-4 '>
                        <Logo textColor='white'></Logo>
                    </div>
                    <p className='text-center text-gray-200'>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
                    <ul className='flex justify-center gap-10 text-white py-8 my-8 border-y border-dashed border-[#03464D] *:border-b *:hover:border-b-white *:border-b-transparent *:duration-100'>
                        <Link>
                            <li>Services</li>
                        </Link>
                        <Link>
                            <li>Coverage</li>
                        </Link>
                        <Link>
                            <li>About Us</li>
                        </Link>
                        <Link>
                            <li>Pricing</li>
                        </Link>
                        <Link>
                            <li>Blog</li>
                        </Link>
                        <Link>
                            <li>Contact</li>
                        </Link>
                    </ul>
                    <ul className='flex gap-5 justify-center'>
                        <li><FaLinkedin size={36} color='#0575B3' /></li>
                        <li><FaSquareXTwitter size={36} color='white' fill='white ' /></li>
                        <li><FaFacebook size={36} color='#006AFF' /></li>
                        <li><FaYoutube size={36} color='#FF0000' /></li>
                    </ul>
                </div>
            </section>
        </div>

    );
};

export default Footer;