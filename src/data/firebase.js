import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHH_wmLowcERBLQbkkIpoy-kMNy3kkwD8",
  authDomain: "spacekids-8f0a3.firebaseapp.com",
  projectId: "spacekids-8f0a3",
  storageBucket: "spacekids-8f0a3.firebasestorage.app",
  messagingSenderId: "839825758402",
  appId: "1:839825758402:web:0292bdc60c0b8102f0835b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);