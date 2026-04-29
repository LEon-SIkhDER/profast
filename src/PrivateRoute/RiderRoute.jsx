import React, { Children } from 'react';
import useRole from '../hooks/useRole';
import { useNavigate } from 'react-router';

const RiderRoute = ({ children }) => {
    const { role, roleLoading } = useRole()
    const navigate = useNavigate()
    if (roleLoading) {
        return <span className="loading loading-spinner text-success"></span>

    }
    if (role !== "rider") {
        return navigate("forbidden")
    }

    return children
};

export default RiderRoute;
