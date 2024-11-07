// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from 'firebase/storage';

const apiKey = process.env.REACT_APP_FIREBASE_API;

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "brewmap-81a41.firebaseapp.com",
    projectId: "brewmap-81a41",
    storageBucket: "brewmap-81a41.firebasestorage.app",
    messagingSenderId: "253669566802",
    appId: "1:253669566802:web:eadcdc280860081930f28b",
    measurementId: "G-C4DB740VQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const functions = getFunctions(app);
const storage = getStorage(app);


export { auth, db, app, functions, storage };

