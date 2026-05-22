import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../../firebase.init';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    // console.log(user)
    // console.log(user ? user.email : "user nai")

    const updateLastActive = (currentUser) => {
        axios.patch("https://profast-server-henna.vercel.app/users/last-active", { uid: currentUser.uid })
    }

    useEffect(() => {
        let intervalId
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
            if (currentUser) {
                updateLastActive(currentUser)

                intervalId = setInterval(() => {
                    updateLastActive(currentUser)
                }, 5 * 60 * 1000);
            }

        })
        return () => {
            unsubscribe()
            clearInterval(intervalId)

        }
    }, [user])


    // create user 
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    // Update user 
    const updateUser = (name, photoUrl) => {
        return updateProfile(auth.currentUser, { displayName: name, photoURL: photoUrl })
    }
    //Log In User
    const handleSignInWithEmailAndPassword = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }
    // google popup logIn
    const googleProvider = new GoogleAuthProvider()
    const logInWithGooglePopUp = () => {
        return signInWithPopup(auth, googleProvider)
    }

    // forget-pass   



    // log out 
    const queryClient = useQueryClient()
    const logOut = () => {
        queryClient.clear()
        return signOut(auth)
    }
    // context 
    const context = {
        loading,
        user,
        createUser,
        updateUser,
        handleSignInWithEmailAndPassword,
        logInWithGooglePopUp,
        logOut,

    }
    return (
        <AuthContext value={context}>{children}</AuthContext>
    );
};

export default AuthProvider;