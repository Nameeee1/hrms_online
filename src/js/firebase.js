
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyBm92k-jvKz0JnB8_vbMxTVwC95DPqc-7w",
    authDomain: "hrms-3abba.firebaseapp.com",
    projectId: "hrms-3abba",
    storageBucket: "hrms-3abba.firebasestorage.app",
    messagingSenderId: "944153999300",
    appId: "1:944153999300:web:dc3315eb61ed2fb5799691"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions, app };

export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

export { 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  collection
} from 'firebase/firestore';

export default app;