// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore,doc,setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-QtllfbeomDRwXk-hAGhtG81fJWUeAIY",
  authDomain: "financial-tracker-app-aac3d.firebaseapp.com",
  projectId: "financial-tracker-app-aac3d",
  storageBucket: "financial-tracker-app-aac3d.firebasestorage.app",
  messagingSenderId: "15096592950",
  appId: "1:15096592950:web:8f0e2fcbdd60df4a593697",
  measurementId: "G-PZTVCVQZM9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};