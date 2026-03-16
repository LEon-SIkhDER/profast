
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()
    const [roleLoading, setRoleLoading] = useState(true)
    const [role, setRole] = useState()

    useEffect(() => {
        if (!user) return
        axiosSecure.get(`http://localhost:5000/role/${user.email}`)
            .then(result => {
                // console.log(result)
                setRoleLoading(false)
                setRole(result.data.role)



            })
            .catch(error => {
                console.log(error.response)
                setRoleLoading(false)
            })
    }, [user])



    return {
        role,
        roleLoading
    }
};

export default useRole;