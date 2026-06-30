import React from 'react';
import useRole from '../../../hooks/useRole';
import UserHome from './UserHome/UserHome';
import RiderHome from './RiderHome/RiderHome';
import AdminHome from './AdminHome/AdminHome';
import { Navigate } from 'react-router';

const DashboardHome = () => {
    const { role, roleLoading } = useRole()
    if (roleLoading) {
        return <div className='flex items-center justify-center min-h-[calc(100vh-104px)]'><span className="loading loading-bars loading-xl"></span></div>
    }
    if (role === 'user') {
        return <Navigate to={"my-parcels"}></Navigate>
    }
    else if (role === 'rider') {
        return <RiderHome></RiderHome>
    }
    else if (role === 'admin') {
        return <AdminHome></AdminHome>
    }
    // return <UserHome></UserHome>
    // return <UserHome></UserHome>
    // return <RiderHome></RiderHome>
    // return <AdminHome></AdminHome>



};

export default DashboardHome;

