import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginonecart-1398d.firebaseapp.com",
  projectId: "loginonecart-1398d",
  storageBucket: "loginonecart-1398d.firebasestorage.app",
  messagingSenderId: "331878315972",
  appId: "1:331878315972:web:09ef74e93c0a01dba91691"
};


const app = initializeApp(firebaseConfig);

const auth=getAuth(app)
const provider= new GoogleAuthProvider()

export {auth,provider}