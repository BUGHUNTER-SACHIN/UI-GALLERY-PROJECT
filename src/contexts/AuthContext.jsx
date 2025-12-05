import React from 'react';
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
const AuthContext = createContext(void 0);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user2) => {
      setUser(user2);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const signIn = async (email, password) => {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  };
  const signUp = async (email, password) => {
    await setPersistence(auth, browserSessionPersistence);
    await createUserWithEmailAndPassword(auth, email, password);
  };
  const logout = async () => {
    await signOut(auth);
  };
  return /* @__PURE__ */ React.createElement(AuthContext.Provider, { value: { user, loading, signIn, signUp, logout } }, children);
};
