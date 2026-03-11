import Logo from '../Components/Logo';
import authImg from "../assets/authImage.png"
import Login from '../Pages/Auth/Login';
import { Outlet } from 'react-router';


const AuthLayout = () => {
    return (
        <div className=' h-screen '>
            <div className='flex h-full '>
                <div className='w-1/2 relative'>
                    <div className='px-14 py-12'>
                        <Logo></Logo>
                    </div>
                    <div className=' absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2/3 max-w-md'>
                        <Outlet></Outlet>
                    </div>

                </div>
                <div className='w-1/2 bg-[#FAFDF0] h-full flex items-center justify-center '>
                    <img className='' src={authImg} alt="" />
                </div>
            </div>
            {/* img modal  */}
            
        </div>
    );
};

export default AuthLayout;