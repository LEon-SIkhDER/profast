import Logo from '../Components/Logo';
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogOut, ShieldCheck, SquarePen, UserRound } from 'lucide-react';
import { Link, Navigate, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import { useContext, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import useRole from '../hooks/useRole';

const Header = () => {
    const { user, logOut } = useContext(AuthContext)
    const { role } = useRole()
    const navigate = useNavigate()
    console.log(role)
    const [imgDropDown, setImgDropDown] = useState(false)
    const defaultUserImage = "./dpp.png"
    const links = <>
        <NavLink to={"/"}>
            <li className='font-semibold text-base '>Home</li>
        </NavLink>
        <NavLink to={'/coverage'}>
            <li className='font-semibold text-base '>Coverage</li>
        </NavLink>
        <NavLink to={"/about-us"}>
            <li className='font-semibold text-base '>About Us</li>
        </NavLink>
        <NavLink to={"/send-parcel"}>
            <li className='font-semibold text-base '>Send Parcel</li>
        </NavLink>
        {user &&
            <>
                {/* {role !== "rider" && */}
                <NavLink to={"/be-a-rider"}>
                    <li className='font-semibold text-base '>Be A Rider</li>
                </NavLink>
                {/* } */}

                <Link to={"/dashboard"}>
                    <li className='font-semibold text-base '>Dashboard</li>
                </Link>
            </>
        }
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


    return (
        <div className='py-8'>
            <section>
                <div className="navbar bg-base-100 shadow-sm rounded-2xl p-5">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                            </div>
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow ">
                                {links}
                            </ul>
                        </div>
                        <Logo></Logo>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 space-x-5 *:hover:bg-[#CAEB66]/70 *:duration-200 *:px-4 *:py-2 *:rounded-full   *:border-2 *:border-transparent">
                            {links}
                        </ul>
                    </div>
                    <div className="navbar-end ">
                        {
                            user ?
                                <div className=' relative' ref={dropdown}>

                                    <div onClick={() => setImgDropDown(!imgDropDown)} className='flex items-center gap-2 cursor-pointer border border-gray-100 shadow-[0px_0px_3px_0px] shadow-gray-300 hover:shadow-[#caeb6683] hover:border-[#caeb6686] transition-all duration-300 p-[5px] rounded-full select-none'>
                                        <img className='h-12 w-12 object-cover border-2 border-white  outline-2 outline-[#CAEB66] rounded-full ' src={user.photoURL ? user.photoURL : defaultUserImage} alt="Img" />
                                        <ChevronDown className={`text-gray-600 ${imgDropDown && "rotate-180"} transition-all duration-200`} />
                                    </div>
                                    {/* {imgDropDown && */}
                                    {/* header  */}
                                    <div
                                        className={`overflow-hidden absolute right-0 z-50  shadow  bg-white rounded-xl duration-300 origin-top-right mt-1 w-max
                                        ${imgDropDown ?
                                                "opacity-100 pointer-events-auto scale-100" :
                                                "opacity-0 pointer-events-none scale-95"}`}
                                    >
                                        <div className='bg-teal-900 flex items-center gap-5 p-5 '>
                                            <div className='relative  inline-block rounded-full bg-linear-to-br from-[#CAEB66]  via-[#38BDF8] to-[#F97316] p-1 '>
                                                <img className='rounded-full h-24 object-cover w-24 mx-auto border-2 border-white' src={user.photoURL ? user.photoURL : defaultUserImage} alt="" />
                                            </div>
                                            <div>
                                                <h1 className='text-white font-bold text-xl'>{user.displayName}</h1>
                                                <h2 className='text-teal-200 mt-1'>{user.email}</h2>
                                                <h3 className=' inline-flex gap-1 mt-1 items-center bg-[#CAEB66] px-3 py-0.5 rounded-full text-green-800 font-semibold capitalize '><ShieldCheck size={18} />{role}</h3>
                                            </div>
                                        </div>
                                        <div className='p-5'>

                                            {/* <h1 className='font-bold text-center text-2xl text-nowrap'>{user.displayName}</h1>
                                            <h2 className='text-center'>{user.email}</h2> */}


                                            <Link to={"/dashboard"} className='flex gap-3 items-center cursor-pointer hover:bg-green-50 p-1 rounded-lg '>
                                                <div className='bg-green-100 text-green-800 w-12 h-12 flex items-center justify-center rounded-lg'><LayoutDashboard /></div>
                                                <div>
                                                    <h1 className='font-bold text-green-900 '>DashBoard</h1>
                                                    <small className='text-gray-500 font-semibold'>Go to your parcels and activity</small>
                                                </div>
                                            </Link>


                                            <Link to={"/dashboard/update-profile"} className='flex gap-3 items-center cursor-pointer hover:bg-sky-50 p-1 rounded-lg '>
                                                <div className='bg-sky-100 text-sky-800 w-12 h-12 flex items-center justify-center rounded-lg'><SquarePen /></div>
                                                <div>
                                                    <h1 className='font-bold text-sky-900 '>Edit Profile</h1>
                                                    <small className='text-gray-500 font-semibold'>Update photo name and others</small>
                                                </div>
                                            </Link>


                                            <div onClick={() => navigate("dashboard/update-profile", { state: "security" })} className='flex gap-3 items-center w-full cursor-pointer hover:bg-orange-50 p-1 rounded-lg '>
                                                <div className='bg-orange-100 text-orange-800 w-12 h-12 flex items-center justify-center rounded-lg'><UserRound /></div>
                                                <div>
                                                    <h1 className='font-bold text-orange-900 '>Account Setting</h1>
                                                    <small className='text-gray-500 font-semibold'>Manage your password</small>
                                                </div>
                                            </div>





                                            <div className='border-t  border-t-gray-200 rounded-full   my-1  '></div>
                                            <button onClick={handleLogOut} className='btn w-full text-red-500 bg-red-50 border border-red-100 text-lg'><LogOut size={18} />LogOut</button>
                                        </div>
                                    </div>
                                    {/* } */}
                                </div> :
                                <div>
                                    <Link to={"/login"}>
                                        <button className='btn btn-xl rounded-xl text-xl font-bold text-[#606060] bg-white mr-4'>Sign In</button>
                                    </Link>

                                    <Link to={"/register"}>
                                        <button className='btn btn-xl rounded-xl text-xl font-bold text-[#606060] bg-white mr-4'>Register</button>
                                    </Link>
                                </div>
                        }



                        {/* {
                            user &&
                            <button className='btn btn-xl rounded-xl text-xl font-bold bg-[#CAEB66] mr-4'>Be a rider</button>

                        } */}
                        {/* <button className='bg-black p-4 rounded-full'><ArrowUpRight color='#CAEB66' /></button> */}
                    </div>
                </div>
            </section >
        </div >
        // 
    );
};

export default Header;
