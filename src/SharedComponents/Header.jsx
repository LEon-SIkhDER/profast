import Logo from '../Components/Logo';
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogOut, ShieldCheck, SquarePen, UserRound } from 'lucide-react';
import { Link, Navigate, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import { useContext, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import useRole from '../hooks/useRole';
import { motion } from "framer-motion"


const Header = () => {
    const { user, logOut } = useContext(AuthContext)
    const { role } = useRole()
    const navigate = useNavigate()
    console.log(role)
    const [imgDropDown, setImgDropDown] = useState(false)
    const defaultUserImage = "./dpp.png"
    const links = <>
        <NavLink to={"/"}>
            <li className='font-semibold  '>Home</li>
        </NavLink>
        <NavLink to={'/coverage'}>
            <li className='font-semibold  '>Coverage</li>
        </NavLink>
        <NavLink to={"/send-parcel"}>
            <li className='font-semibold  '>Send Parcel</li>
        </NavLink>
        {user &&
            <>
                {role !== "rider" &&
                    <NavLink to={"/be-a-rider"}>
                        <li className='font-semibold  '>Be A Rider</li>
                    </NavLink>
                }

                <Link to={"/dashboard"}>
                    <li className='font-semibold  '>Dashboard</li>
                </Link>
            </>
        }
        <NavLink to={"/about-us"} className={"block lg:hidden xl:block"}>
            <li className='font-semibold  '>About Us</li>
        </NavLink>
    </>

    const handleLogOut = () => {

        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to LogOut?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, LogOut!"
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
                    .then(result => {
                        console.log(result)
                        setImgDropDown(false)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        });



    }
    //dropdown
    const dropdown = useRef()
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdown.current && !dropdown.current.contains(e.target)) {
                console.log("outside")
                setImgDropDown(false)
            }
        }
        document.addEventListener("mousedown", handleOutsideClick)
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }

    }, [])

    const closeDropdown = () => {
        document.activeElement?.blur()
    }

    return (
        <div className=' py-4 sm:py-8'>
            <section>
                <motion.div
                    initial={{
                        y: -20,
                        scale: 0.95,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        scale: 1,
                        opacity: 1
                    }}
                    transition={{
                        scale: { duration: .4 },
                        y: { duration: .3 }
                        // ease: "easeOut"
                    }}
                    className="navbar bg-base-100 shadow-sm rounded-2xl p-3 pl-0 lg:pl-3">
                    <div className="navbar-start">
                        <div className="dropdown mr-2">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden px-2 ">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                            </div>
                            <ul onClick={closeDropdown}
                                tabIndex="0"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-36 p-2 shadow *:text-base *:rounded  *:pl-2 *:py-0.5 *:hover:bg-gray-200 space-y-1 ">
                                {links}
                            </ul>
                        </div>
                        <Logo className={"-translate-x-[19px]"}></Logo>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 space-x-5 *:hover:bg-[#CAEB66]/70 *:duration-200 *:px-4 *:py-2 *:rounded-xl *:text-base   *:border-2 *:border-transparent">
                            {links}
                        </ul>
                    </div>
                    <div className="navbar-end ">
                        {
                            user ?
                                <div className=' relative' ref={dropdown}>

                                    <div onClick={() => setImgDropDown(!imgDropDown)} className='flex items-center gap-2 cursor-pointer border border-gray-100 shadow-[0px_0px_2px_0px] xxs:shadow-[0px_0px_3px_0px] shadow-gray-300 hover:shadow-[#caeb6683] hover:border-[#caeb6686] transition-all duration-300 p-[5px] rounded-full select-none'>
                                        <img className='h-10 xxs:h-12 w-10 xxs:w-12 object-cover border xxs:border-2 border-white  outline-1 outline-[#CAEB66] rounded-full ' src={user.photoURL ? user.photoURL : defaultUserImage} alt="Img" />
                                        <ChevronDown className={`text-gray-600 ${imgDropDown && "rotate-180"} transition-all duration-200`} />
                                    </div>
                                    {/* {imgDropDown && */}
                                    {/* header  */}
                                    <div
                                        className={`overflow-hidden absolute right-0 z-50  shadow  bg-white rounded-xl duration-300 origin-top-right mt-1 w-max max-w-[calc(100dvw-32px)]
                                        ${imgDropDown ?
                                                "opacity-100 pointer-events-auto scale-100" :
                                                "opacity-0 pointer-events-none scale-95"}`}
                                    >
                                        <div className='bg-teal-900 flex items-center gap-2  xxs:gap-5 p-3 xxs:p-5 '>
                                            <div className='relative shrink-0 inline-block rounded-full bg-linear-to-br from-[#CAEB66]  via-[#38BDF8] to-[#F97316] p-1'>
                                                <img className='rounded-full h-20 xxs:h-24 object-cover w-20 xxs:w-24 mx-auto border-2 border-white' src={user.photoURL ? user.photoURL : defaultUserImage} alt="" />
                                            </div>
                                            <div>
                                                <h1 className='text-white font-bold text-base xxs:text-xl '>{user.displayName}</h1>
                                                <h2 className='text-teal-200 xxs:mt-1 break-all text-xs xxs:text-base'>{user.email}</h2>
                                                <h3 className='inline-flex xxs:gap-1 mt-2.5 xxs:mt-1 items-center bg-[#CAEB66] px-3 py-0.5 rounded-full text-green-800 font-semibold capitalize text-sm xxs:text-base'><ShieldCheck className='size-4 xxs:size-[18px]' />{role || "role..."}</h3>
                                            </div>
                                        </div>
                                        <div className='p-3 xxs:p-5'>

                                            {/* <h1 className='font-bold text-center text-2xl text-nowrap'>{user.displayName}</h1>
                                            <h2 className='text-center'>{user.email}</h2> */}


                                            <Link to={"/dashboard"} className='flex gap-3 items-center cursor-pointer hover:bg-green-50 p-1 rounded-lg '>
                                                <div className='bg-green-100 text-green-800 w-10 xxs:w-12 h-10 xxs:h-12 flex items-center justify-center rounded xxs:rounded-lg'><LayoutDashboard className='size-5 xxs:size-6' /></div>
                                                <div>
                                                    <h1 className='font-bold text-green-900 text-sm xxs:text-base'>DashBoard</h1>
                                                    <small className='text-gray-500 font-semibold text-xs xxs:text-[12.8px]'>Go to your parcels and activity</small>
                                                </div>
                                            </Link>


                                            <Link to={"/dashboard/update-profile"} className='flex gap-3 items-center cursor-pointer hover:bg-sky-50 p-1 rounded-lg '>
                                                <div className='bg-sky-100 text-sky-800 w-10 xxs:w-12 h-10 xxs:h-12 flex items-center justify-center rounded xxs:rounded-lg'><SquarePen className='size-5 xxs:size-6' /></div>
                                                <div>
                                                    <h1 className='font-bold text-sky-900 text-sm xxs:text-base'>Edit Profile</h1>
                                                    <small className='text-gray-500 font-semibold text-xs xxs:text-[12.8px]'>Update photo name and others</small>
                                                </div>
                                            </Link>


                                            <div onClick={() => navigate("dashboard/update-profile", { state: "security" })} className='flex gap-3 items-center w-full cursor-pointer hover:bg-orange-50 p-1 rounded-lg '>
                                                <div className='bg-orange-100 text-orange-800 w-10 xxs:w-12 h-10 xxs:h-12 flex items-center justify-center rounded xxs:rounded-lg'><UserRound className='size-5 xxs:size-6' /></div>
                                                <div>
                                                    <h1 className='font-bold text-orange-900 text-sm xxs:text-base'>Account Setting</h1>
                                                    <small className='text-gray-500 font-semibold text-xs xxs:text-[12.8px]'>Manage your password</small>
                                                </div>
                                            </div>





                                            <div className='border-t  border-t-gray-200 rounded-full   my-1  '></div>
                                            <button onClick={handleLogOut} className='btn btn-sm xxs:btn-md w-full text-red-500 bg-red-50 border border-red-100 text-sm xxs:text-lg'><LogOut size={18} />LogOut</button>
                                        </div>
                                    </div>
                                    {/* } */}
                                </div> :
                                <div>
                                    <Link
                                        to={"/login"}
                                        className='group btn min-h-0 h-12 px-5 rounded-full border-2 border-[#CAEB66] bg-[#03373D] text-base sm:text-lg font-bold text-white shadow-sm shadow-[#03373D]/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#03373D] hover:bg-[#CAEB66] hover:text-[#03373D] hover:shadow-lg hover:shadow-[#CAEB66]/40'
                                    >
                                        Sign In
                                        <span className='flex h-7 w-7 items-center justify-center rounded-full bg-[#CAEB66] text-[#03373D] transition-all duration-300 group-hover:bg-[#03373D] group-hover:text-[#CAEB66] group-hover:rotate-45'>
                                            <ArrowUpRight size={18} strokeWidth={2.6} />
                                        </span>
                                    </Link>

                                    {/* <Link to={"/register"}>
                                        <button className='btn btn-xl rounded-xl text-xl font-bold text-[#606060] bg-white hidden lg:inline-flex'>Register</button>
                                    </Link> */}
                                </div>
                        }



                        {/* {
                            user &&
                            <button className='btn btn-xl rounded-xl text-xl font-bold bg-[#CAEB66] mr-4'>Be a rider</button>

                        } */}
                        {/* <button className='bg-black p-4 rounded-full'><ArrowUpRight color='#CAEB66' /></button> */}
                    </div>
                </motion.div>
            </section >
        </div >
        // 
    );
};

export default Header;
