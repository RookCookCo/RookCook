// Import necessary functions from the Firebase SDKs
import { initializeApp } from 'firebase/app'; // Function to initialize the Firebase app
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Firebase authentication functions

// Firebase configuration object containing all necessary Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyAPWAgi2j0ptRS57UUPhaS54a0I9LA4ywg",           // Your Firebase API key
    authDomain: "rookcook-be127.firebaseapp.com",              // Your Firebase Auth domain
    projectId: "rookcook-be127",                               // Your Firebase project ID
    storageBucket: "rookcook-be127.appspot.com",               // Your Firebase storage bucket
    messagingSenderId: "118853939633",                         // Your Firebase messaging sender ID
    appId: "1:118853939633:web:07e4ab36a1d6fcbe540d90",        // Your Firebase app ID
    measurementId: "G-QVFBBZRPS7"                              // Your Firebase measurement ID
};

// Initialize Firebase app with the configuration object
const app = initializeApp(firebaseConfig);

// Get the Firebase authentication instance associated with the initialized app
const auth = getAuth(app);

// Create a new GoogleAuthProvider instance for Google sign-in
const provider = new GoogleAuthProvider();

// Export the auth object, GoogleAuthProvider instance, and Firebase authentication functions
export { auth, provider, signInWithPopup, signOut };
