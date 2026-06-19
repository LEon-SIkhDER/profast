import React, { useRef } from 'react';
import { NavLink, Outlet } from 'react-router';
import Logo from '../../Components/Logo';
import { FiDollarSign, FiMap, FiPackage, FiUser } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import "./../../index.css"

import { PackageCheck, PackageSearch, UserCheck, UserPen, UserRoundCog, UserX } from 'lucide-react';
import useRole from '../../hooks/useRole';
import { RiEBike2Line } from 'react-icons/ri';
import "./Dashboard.css"


const Dashboard = () => {
    const { role, roleLoading } = useRole()
    // console.log(role)
    const toggleDrawer = useRef()

    const handleToggleDrawer = () => {
        toggleDrawer.current.checked = false
    }


    return (
        <div className="drawer xl:drawer-open ">
            <input ref={toggleDrawer} id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col ">


                <div className="drawer">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col xl:hidden">
                        {/* Navbar */}
                        <div className="navbar bg-base-300 w-full shadow ">
                            <div className="flex-none xl:hidden mr-2">
                                <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block h-7 w-7 stroke-current"
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

                            <Logo className={"-translate-x-[19px] mx-auto"} />
                        </div>
                    </div>

                </div>


                <div className='sm:p-5 p-2.5 bg-gray-50 min-h-[calc(100vh-68px)] xl:min-h-dvh'>
                    <Outlet></Outlet>
                </div>

            </div>
            <div className="drawer-side xl:bg-base-200 bg-transparent shadow">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay "></label>
                <div className='p-5'>
                    <Logo className={'z-50'}></Logo>
                </div>

                <ul className="menu bg-base-200  text-xl w-72 p-0 border-t border-t-gray-300 xl:min-h-fit min-h-full space-y-0.5 ">
                    <Logo className={'px-2 py-5 border-b border-b-gray-300 xl:hidden'}></Logo>

                    {/* Sidebar  */}
                    {role !== "rider" &&
                        <>
                            <li onClick={handleToggleDrawer}><NavLink to={"."} end className={"border-l-4 border-transparent rounded-none"}><FiPackage />My-Parcels</NavLink></li>
                            <li onClick={handleToggleDrawer}><NavLink to={"payment-history"} className={"border-l-4 border-transparent rounded-none"}><FiDollarSign />Payment History</NavLink></li>
                        </>
                    }
                    <li onClick={handleToggleDrawer}><NavLink to={"track-your-parcel"} className={"border-l-4 border-transparent rounded-none"}><PackageSearch />{`Track ${role === "user" ? "Your" : ''} Parcel`}</NavLink></li>
                    {/* <li><NavLink to={"track-your-parcel2"} className={"border-l-4 border-transparent rounded-none"}><FiMap />Track Your Parcel2</NavLink></li> */}
                    <li onClick={handleToggleDrawer}><NavLink to={"update-profile"} className={"border-l-4 border-transparent rounded-none"}><UserPen />Update Profile</NavLink></li>
                    {/* rider  */}
                    {
                        role === 'rider' && !roleLoading && <>
                            <div className=' border-t border-[#bfff00] my-1'></div>
                            <li onClick={handleToggleDrawer}><NavLink to={"pending-deliveries"} className={"border-l-4 border-transparent rounded-none"}><RiEBike2Line />Pending Deliveries</NavLink></li>
                            <li onClick={handleToggleDrawer}><NavLink to={"completed-deliveries"} className={"border-l-4 border-transparent rounded-none"}><PackageCheck size={20} />Completed Deliveries</NavLink></li>
                        </>
                    }
                    {/* admin  */}
                    {
                        role === 'admin' && !roleLoading &&
                        <>
                            <div className=' border-t border-[#bfff00] my-1'></div>
                            <li onClick={handleToggleDrawer}><NavLink to={"assign-rider"} className={"border-l-4 border-transparent rounded-none"}><RiEBike2Line />Assign Rider</NavLink></li>
                            <li onClick={handleToggleDrawer}><NavLink to={"active-riders"} className={"border-l-4 border-transparent rounded-none"}><UserCheck />Active Riders</NavLink></li>
                            <li onClick={handleToggleDrawer}><NavLink to={"inactive-riders"} className={"border-l-4 border-transparent rounded-none"}><UserX />Inactive Riders</NavLink></li>
                            <li onClick={handleToggleDrawer}><NavLink to={"pending-riders"} className={"border-l-4 border-transparent rounded-none"}><FaRegClock />Pending Riders</NavLink></li>
                            <li onClick={handleToggleDrawer}><NavLink to={"make-admin"} className={"border-l-4 border-transparent rounded-none"}><UserRoundCog />Make Admin</NavLink></li>
                        </>
                    }
                </ul>
            </div>
        </div>
    );
};

export default Dashboard; 
