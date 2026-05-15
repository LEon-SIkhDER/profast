import React from 'react';
import useRole from '../hooks/useRole';
import { useNavigate } from 'react-router';

const AdminRoute = ({ children }) => {
    const { role, roleLoading } = useRole()
    const navigate = useNavigate()
    if (roleLoading) {
        return <div className='flex items-center justify-center min-h-screen'><span className="loading loading-bars loading-xl"></span></div>
    }
    console.log(role)
    if (role !== "admin") {
        console.log("error from admin route")
        return navigate("/forbidden")
    }




    return children
};

export default AdminRoute;