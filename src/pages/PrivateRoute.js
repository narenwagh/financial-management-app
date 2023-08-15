import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth, firestore } from '../firebase';


const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  //  auth.signInWithEmailAndPassword('guest@gmail.com', 'guest123').then(() => {});
  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
