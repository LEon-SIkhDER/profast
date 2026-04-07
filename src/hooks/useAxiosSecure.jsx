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
        const requestInterceptor = instance.interceptors.request.use(async (config) => {
            console.log("user from hook:", user?.email)
            const token = await user.getIdToken(true)
            config.headers.Authorization = `Bearer ${token}`
            return config
        }, (error) => {
            return Promise.reject(error)
        })
        // all response
        const responseInterceptor = instance.interceptors.response.use((res) => {
            return res
        }, (error) => {

            if (error.response.status === 403) {
                logOut()
                    .then(result => console.log(result))
                    .catch(error => console.log(error))
                navigate("/forbidden")

            } else if (error.response.status === 401) {
                console.log(error)
                navigate('/forbidden')
            }

            return Promise.reject(error)

        })
        return () => {
            instance.interceptors.request.eject(requestInterceptor)
            instance.interceptors.response.eject(responseInterceptor)
        }
    }, [user, logOut])

    return instance
};

export default useAxiosSecure;