import React, { createContext, useEffect, useState } from 'react';

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';

import app from '../Firebase/Firebase.config';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAxiosCommon from '../hooks/useAxiosCommon';

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const axiosCommon = useAxiosCommon();

  //create user

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //login

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  //login with google

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  //logOut

  const logOut = () => {
    return signOut(auth);
  };

  //save user
  // console.log(dateOfBirth);
  // const saveUser = async (user, dateOfBirth) => {
  //   const currentUser = {
  //     email: user?.email,
  //     role: 'employee',
  //     hrData: dateOfBirth,
  //   };
  //   const { data } = await axios.put(
  //     `${import.meta.env.VITE_API_URL}/user`,
  //     currentUser
  //   );
  //   return data;
  // };

  //profileupdsate

  const profileUpdate = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const allInfo = {
    user,
    createUser,
    signIn,
    googleLogin,
    logOut,
    profileUpdate,
    loading,
    setUser,
    setReload,
    setLoading,
    setDateOfBirth,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      const loggedUser = { email: currentUser?.email };
      if (currentUser) {
        setUser(currentUser);
        // saveUser(currentUser, dateOfBirth);
        console.log(currentUser);

        axiosCommon.post(`/jwt`, loggedUser).then(res => {
          if (res.data.token) {
            localStorage.setItem('access-token', res.data.token);
            setLoading(false);
          }
          // console.log('token Response', res.data);
        });
      } else {
        localStorage.removeItem('access-token');
        setUser(null);

        setLoading(false);
        toast.success('Logout Successfully');
      }
    });

    return () => {
      return unsubscribe();
    };
  }, [axiosCommon]);
  return (
    <AuthContext.Provider value={allInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
