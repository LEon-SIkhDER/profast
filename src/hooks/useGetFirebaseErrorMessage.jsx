import React from 'react';

const useGetFirebaseErrorMessage = () => {
    const errorMap = {
        "auth/user-not-found": "Invalid email or password",
        "auth/invalid-credential": "Invalid email or password",
        "auth/wrong-password": "Incorrect password",
        "auth/invalid-email": "Invalid email format",
        "auth/too-many-requests": "Too many attempts. Try again later."
    };

    const getMessage = (code) => errorMap[code]

    return getMessage
};

export default useGetFirebaseErrorMessage;