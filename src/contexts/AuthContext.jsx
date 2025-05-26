import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

// 인증 Context 생성
const AuthContext = createContext();

// Context 사용을 위한 Hook
export function useAuth() {
  return useContext(AuthContext);
}

// Context Provider 컴포넌트
export function AuthProvider({ children }) {
  // 사용자 상태 관리
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 회원가입 함수
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // 프로필 업데이트 함수
  function updateUserProfile(user, profile) {
    return updateProfile(user, profile);
  }

  // 로그인 함수
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 구글 로그인 함수
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // 로그아웃 함수
  function logout() {
    return signOut(auth);
  }

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // cleanup function
    return unsubscribe;
  }, []);

  // Context에 전달할 값
  const value = {
    currentUser,
    signup,
    login,
    logout,
    googleLogin,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 