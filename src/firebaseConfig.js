// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAgq2gwOvGEF52C8ZLIvvXijxblLF2U2XI",
  authDomain: "cinematch-6ab6a.firebaseapp.com",
  projectId: "cinematch-6ab6a",
  storageBucket: "cinematch-6ab6a.firebasestorage.app",
  messagingSenderId: "406241130989",
  appId: "1:406241130989:web:70f8a36592d13dcec58fe4"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
