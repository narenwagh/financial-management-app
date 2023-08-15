import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const app = firebase.initializeApp({
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
    apiKey: "AIzaSyDRWwBJOIzpaCglCL39q7Afo01RPfjwtz4",
  authDomain: "finance-planning-50dde.firebaseapp.com",
  projectId: "finance-planning-50dde",
  storageBucket: "finance-planning-50dde.appspot.com",
  messagingSenderId: "622083685219",
  appId: "1:622083685219:web:d5924531ddd13c8189b156"
});

export const auth = app.auth();
export const firestore = app.firestore();

export default app;
