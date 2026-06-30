import Logo from '../Components/Logo';
import authImg from "../assets/authImage.png"
import Login from '../Pages/Auth/Login';
import { Outlet } from 'react-router';


const AuthLayout = () => {
    return (
        <div className=' h-dvh '>
            <div className='flex h-full '>
                <div className='flex-1 relative'>
                    <div className='p-3 xs:px-8 sm:px-14 py-10 xs:py-12'>
                        <Logo></Logo>
                    </div>
                    <div className=' p-3 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full lg:w-2/3 max-w-md'>
                        <Outlet></Outlet>
                    </div>

                </div>
                <div className='flex-1 bg-[#FAFDF0] h-full hidden lg:flex items-center justify-center '>
                    <img className='' src={authImg} alt="" />
                </div>
            </div>
            {/* img modal  */}
            
        </div>
    );
};

export default AuthLayout;
