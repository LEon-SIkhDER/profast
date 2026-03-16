import React from 'react';
import useRole from '../hooks/useRole';
import { useNavigate } from 'react-router';

const AdminRoute = ({ children }) => {
    const { role, roleLoading } = useRole()
    const navigate = useNavigate()
    if (roleLoading) {
        return <span className="loading loading-spinner text-success"></span>
    }
    if (role !== "admin") {
        return navigate("/forbidden")
    }




    return children
};

export default AdminRoute;