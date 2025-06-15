// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQwvkqUfV0EjXVFg3XglDS2pLwrDFEXU0",
  authDomain: "cinematch-9df0e.firebaseapp.com",
  projectId: "cinematch-9df0e",
  storageBucket: "cinematch-9df0e.appspot.com",
  messagingSenderId: "406581882414",
  appId: "1:406581882414:web:3612dc7676a14643d939bf",
  measurementId: "G-MHS80RX6BE"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
