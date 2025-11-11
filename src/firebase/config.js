import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLMOSq8Y_TlGCSdHORengE2Jdy_gtaNoI",
  authDomain: "firs-project-abu.firebaseapp.com",
  projectId: "firs-project-abu",
  storageBucket: "firs-project-abu.firebasestorage.app",
  messagingSenderId: "518129346239",
  appId: "1:518129346239:web:efc68c4d3c5dfbf886c80a",
  measurementId: "G-MV7KE77ELJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore() 