import Logo from '../Components/Logo';
import { ArrowUpRight, LogOut } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import { useContext, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

const Header = () => {
    const { user, logOut } = useContext(AuthContext)
    const [imgDropDown, setImgDropDown] = useState(false)
    // const defaultUserImage = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
    const defaultUserImage = "./dpp.png"
    // console.log(imgDropDown)
    const links = <>
        <Link>
            <li className='font-semibold text-base '>Services</li>
        </Link>
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

                <Link to={"/dashboard"}>
                    <li className='font-semibold text-base '>Dashboard</li>
                </Link>
                <NavLink to={"/be-a-rider"}>
                    <li className='font-semibold text-base '>Be A Rider</li>
                </NavLink>
            </>
        }
    </>

    const handleLogOut = () => {

        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to LOGOUT?",
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
                                    <img onClick={() => setImgDropDown(!imgDropDown)} className='h-14 w-14 object-cover border-2 outline outline-gray-100 border-transparent hover:border-gray-200 rounded-full transition-colors duration-300 active:scale-95 cursor-pointer' src={user.photoURL ? user.photoURL : defaultUserImage} alt="Img" />
                                    {/* {imgDropDown && */}
                                    <div
                                        className={`p-5  absolute right-0 z-50 min-w-52 shadow border border-[#e6f6b7] bg-white rounded-lg duration-300 origin-top-right mt-1
                                        ${imgDropDown ?
                                                "opacity-100 pointer-events-auto scale-100" :
                                                "opacity-0 pointer-events-none scale-95"}`}>
                                        <img className='rounded-full h-20 object-cover w-20 mx-auto' src={user.photoURL ? user.photoURL : defaultUserImage} alt="" />
                                        <h1 className='font-bold text-center text-2xl text-nowrap'>{user.displayName}</h1>
                                        <h2 className='text-center'>{user.email}</h2>
                                        <div className='divider my-0 rounded'></div>
                                        <button onClick={handleLogOut} className='btn btn-wide text-red-500 text-lg'>LogOut</button>
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
            </section>
        </div>
        // 
    );
};

export default Header;