import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCTJBTAR9BASnTNjXkIoKCUEHRAm6v2gsQ",
    authDomain: "musicapp-cf171.firebaseapp.com",
    projectId: "musicapp-cf171",
    storageBucket: "musicapp-cf171.firebasestorage.app",
    messagingSenderId: "231548346579",
    appId: "1:231548346579:web:ec9ba6270359b3ad443426",
    measurementId: "G-V028L2H78Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
export { auth, signInWithEmailAndPassword };