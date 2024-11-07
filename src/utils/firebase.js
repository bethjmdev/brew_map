// firebase.js
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc  } from "firebase/firestore";

// const apiKey = process.env.REACT_APP_FIREBASE_API;

const firebaseConfig = {
    apiKey: "AIzaSyDLnwoYRTRKCcPp88lNH2MWyZCPURCzQ8U",
    authDomain: "brewmap-81a41.firebaseapp.com",
    projectId: "brewmap-81a41",
    storageBucket: "brewmap-81a41.firebasestorage.app",
    messagingSenderId: "253669566802",
    appId: "1:253669566802:web:eadcdc280860081930f28b",
    measurementId: "G-C4DB740VQ8"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
// const analytics = getAnalytics(app);
const db = getFirestore(app);


export { auth, db, app };
