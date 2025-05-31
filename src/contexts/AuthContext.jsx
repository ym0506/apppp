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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// 인증 Context 생성
const AuthContext = createContext();

// Context 사용을 위한 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  // 사용자 상태 관리
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 회원가입 함수 - Firebase Auth 사용
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 프로필 업데이트
      await updateProfile(user, {
        displayName: displayName
      });

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: new Date(),
        avatar: '👨‍🍳'
      });

      return user;
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    }
  };

  // 프로필 업데이트 함수
  function updateUserProfile(user, profile) {
    return updateProfile(user, profile);
  }

  // 로그인 함수 - Firebase Auth 사용
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    }
  };

  // 구글 로그인 함수
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Firestore에 사용자 정보 저장 (최초 로그인 시)
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date(),
          provider: 'google'
        });
      }

      return result.user;
    } catch (error) {
      console.error('구글 로그인 오류:', error);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  };

  // 인증 상태 변경 감지
  useEffect(() => {
    // 타임아웃 설정 (5초 후 강제로 로딩 완료)
    const timeoutId = setTimeout(() => {
      console.warn('Firebase 인증 초기화 타임아웃 - 기본값으로 진행');
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeoutId); // 정상 응답 시 타임아웃 해제

      if (user) {
        // Firestore에서 추가 사용자 정보 가져오기
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({
              ...user,
              ...userDoc.data()
            });
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error('사용자 정보 로드 오류:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  // Context에 전달할 값
  const value = {
    currentUser,
    register,
    login,
    logout,
    googleLogin,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#fff',
          flexDirection: 'column'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #ff6b35',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            marginTop: '20px',
            color: '#666',
            fontSize: '16px'
          }}>앱을 시작하는 중...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}; 