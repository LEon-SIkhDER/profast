import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../../firebase.init';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)

        })
        return () => unsubscribe
    }, [])


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
    const logOut = () => {
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