// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9EmouGiQ80OAj2aPwEMFnoZamYhUODW8", //process.env.FIREBASE_KEY,
  authDomain: "portfolio-blog-359a0.firebaseapp.com",
  projectId: "portfolio-blog-359a0",
  storageBucket: "portfolio-blog-359a0.appspot.com",
  messagingSenderId: "345611604822",
  appId: "1:345611604822:web:9f0627e75afeffaf31fcf7",
  measurementId: "G-7NBX4J0V71"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);