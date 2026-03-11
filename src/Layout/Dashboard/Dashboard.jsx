import React from 'react';
import { NavLink, Outlet } from 'react-router';
import Logo from '../../Components/Logo';
import { FiDollarSign, FiMap, FiPackage, FiUser } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import "./../../index.css"
import { UserCheck, UserPen, UserRoundPen } from 'lucide-react';


const Dashboard = () => {


    return (
        <div className="drawer lg:drawer-open ">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col ">


                <div className="drawer">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col lg:hidden">
                        {/* Navbar */}
                        <div className="navbar bg-base-300 w-full">
                            <div className="flex-none lg:hidden">
                                <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block h-6 w-6 stroke-current"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        ></path>
                                    </svg>
                                </label>
                            </div>

                            <Logo />
                        </div>


                    </div>

                </div>


                <div className='p-5 bg-gray-50 min-h-screen'>
                    <Outlet></Outlet>
                </div>

            </div>
            <div className="drawer-side lg:bg-base-200 bg-transparent shadow">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay "></label>
                <div className='p-5'>
                    <Logo></Logo>
                </div>

                <ul className="menu bg-base-200  text-xl w-80 p-4 border-t border-t-gray-300 lg:min-h-fit min-h-full">
                    {/* Sidebar  */}
                    <li className='border-2 border-transparent'><NavLink to={"."} end><FiPackage />My-Parcels</NavLink></li>
                    <li className='border border-transparent'><NavLink to={"payment-history"}><FiDollarSign />Payment History</NavLink></li>
                    <li className='border border-transparent'><NavLink to={"track-your-parcel"}><FiMap />Track Your Parcel</NavLink></li>
                    <li className='border border-transparent'><NavLink to={"update-profile"}><UserPen />Update Profile</NavLink></li>
                    {/* admin  */}
                    <li className='border border-transparent'><NavLink to={"active-riders"}><UserCheck />Active Riders</NavLink></li>
                    <li className='border border-transparent'><NavLink to={"pending-riders"}><FaRegClock />Pending Riders</NavLink></li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard; 