import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Navigate, useLocation } from 'react-router';
import SectionWrapper from '../Components/SectionWrapper';

import loadingAnimation from '../Lottie/loadingSandClock.json';
import loadingAnimationDark from '../Lottie/loadingSandClockDark.json';
import Lottie from 'lottie-react';

const PrivateRoute = ({ children }) => {
    const { user, loading, theme } = useContext(AuthContext)
    console.log(theme)
    const location = useLocation()

    if (loading) {
        return (
            <div className='flex items-center justify-center h-dvh' data-theme={theme}>
                <div className='max-w-40'>
                    <Lottie animationData={theme === "dark" ? loadingAnimationDark : loadingAnimation}></Lottie>
                </div>
            </div >
        )
    }
    if (!user) {
        return <Navigate to="/login" state={location.pathname}></Navigate>
    }
    else {
        return children
    }


};

export default PrivateRoute;
