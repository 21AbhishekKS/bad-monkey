import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBVDWYm4-9Hnlt32LHbFu3GhkepjvRfm9I",
  authDomain: "bad-monkey-store.firebaseapp.com",
  projectId: "bad-monkey-store",
  storageBucket: "bad-monkey-store.firebasestorage.app",
  messagingSenderId: "895634724255",
  appId: "1:895634724255:web:38caf73f80a583abda19aa",
  measurementId: "G-R06DKRWWCE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;