// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey:import.meta.env.VITE_apiKey,
    authDomain:import.meta.env.VITE_authDomain,
    projectId:import.meta.env.VITE_projectId,
    storageBucket:import.meta.env.VITE_storageBucket,
    messagingSenderId:import.meta.env.VITE_messagingSenderId,
    appId:import.meta.env.VITE_appId
    // apiKey: "AIzaSyAqUH6hKPlL5H3jOCehDzgJQW1aBmBJag8",
    // authDomain: "zap-shift-1f9b2.firebaseapp.com",
    // projectId: "zap-shift-1f9b2",
    // storageBucket: "zap-shift-1f9b2.firebasestorage.app",
    // messagingSenderId: "556061531948",
    // appId: "1:556061531948:web:80607615f773ae90bcd689"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app) 
