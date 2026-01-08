import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBu-d29DEhEXlanMEXCNJRrbDLIitd4p5s",
  authDomain: "event-o-sphere.firebaseapp.com",
  projectId: "event-o-sphere",
  storageBucket: "event-o-sphere.firebasestorage.app",
  messagingSenderId: "908289059246",
  appId: "1:908289059246:web:681ae815d8364ecd05403f",
  measurementId: "G-QHWHDRRQXX"
};

const app = initializeApp(firebaseConfig);

// 🔥 THIS LINE IS MANDATORY
export const auth = getAuth(app);
export const db = getFirestore(app);

