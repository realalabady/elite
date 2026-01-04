// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABZHJu-0YR9FjGJsMiKBz5b47Kt7XZPRQ",
  authDomain: "elite-dc120.firebaseapp.com",
  projectId: "elite-dc120",
  storageBucket: "elite-dc120.firebasestorage.app",
  messagingSenderId: "682822065704",
  appId: "1:682822065704:web:d637976a3f4db080d5df1d",
  measurementId: "G-JEFBS13S7W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth, RecaptchaVerifier };
