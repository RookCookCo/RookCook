// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAPWAgi2j0ptRS57UUPhaS54a0I9LA4ywg",
    authDomain: "rookcook-be127.firebaseapp.com",
    projectId: "rookcook-be127",
    storageBucket: "rookcook-be127.appspot.com",
    messagingSenderId: "118853939633",
    appId: "1:118853939633:web:07e4ab36a1d6fcbe540d90",
    measurementId: "G-QVFBBZRPS7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
