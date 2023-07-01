import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCrIFgibqt8eknlWWvEVxrnrTCMlsIE2nY",
    authDomain: "cem-4bbf9.firebaseapp.com",
    databaseURL: "https://cem-4bbf9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cem-4bbf9",
    storageBucket: "cem-4bbf9.appspot.com",
    messagingSenderId: "389408483659",
    appId: "1:389408483659:web:a56479081940e3ad3ee0ce",
    measurementId: "G-XQSNK4B3BE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;