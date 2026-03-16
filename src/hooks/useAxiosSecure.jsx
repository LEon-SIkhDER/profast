import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router';

const instance = axios.create({
    baseURL: "http://localhost:5000"
})


const useAxiosSecure = () => {
    const { user, logOut } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        // all requests
        instance.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        }, (error) => {
            return Promise.reject(error)
        })
        // all response
        instance.interceptors.response.use((res) => {
            return res
        }, (error) => {

            if (error.response.status === 403) {
                logOut()
                    .then(result => console.log(result))
                    .catch(error => console.log(error))
                navigate("/forbidden")

            } else if (error.response.status === 401) {
                navigate('/forbidden')
            }

            return Promise.reject(error)

        })
    }, [])

    return instance
};

export default useAxiosSecure;