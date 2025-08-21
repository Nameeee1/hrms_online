
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBTW_Wk2JcveC6M-jsOm0GoSCVz8RdFe3s",
  authDomain: "hhi-hrms-a52da.firebaseapp.com",
  projectId: "hhi-hrms-a52da",
  storageBucket: "hhi-hrms-a52da.firebasestorage.app",
  messagingSenderId: "250370095100",
  appId: "1:250370095100:web:79ab5e6782abc4236d6479"
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