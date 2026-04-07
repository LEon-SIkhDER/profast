import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Navigate, useLocation } from 'react-router';
import SectionWrapper from '../Components/SectionWrapper';

import loadingAnimation from '../Lottie/loadingSandClock.json';
import Lottie from 'lottie-react';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext)
    const location = useLocation()

    if (loading) {
        return (
            <div className='flex items-center justify-center h-dvh'>
                <div className='max-w-40 '>
                    <Lottie animationData={loadingAnimation}></Lottie>
                </div>
            </div>
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