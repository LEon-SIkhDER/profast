
import React, { useContext, } from 'react';
import { AuthContext } from '../Context/AuthContext';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()
    const { data: role, isLoading: roleLoading } = useQuery({
        queryKey: ["user-role"],
        queryFn: async () => {
            const result = await axiosSecure.get(`/role/${user.email}`)
            return result.data.role
        }
    })
    return {
        role,
        roleLoading
    }
};

export default useRole;