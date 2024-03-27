import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "portfolio-blog-359a0.firebaseapp.com",
  projectId: "portfolio-blog-359a0",
  storageBucket: "portfolio-blog-359a0.appspot.com",
  messagingSenderId: "345611604822",
  appId: "1:345611604822:web:9f0627e75afeffaf31fcf7",
  measurementId: "G-7NBX4J0V71"
};

export const app = initializeApp(firebaseConfig);