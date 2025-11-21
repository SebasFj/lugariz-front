// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYj23bqDqvvgOqRcymWl83wtBwOIJz7ac",
  authDomain: "lugariz.firebaseapp.com",
  projectId: "lugariz",
  storageBucket: "lugariz.firebasestorage.app",
  messagingSenderId: "644311785377",
  appId: "1:644311785377:web:8ec507cdd16df4e67535e0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
