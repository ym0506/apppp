// Firebase 구성
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 구성 정보
// 실제 값은 .env 파일 또는 환경 변수로 관리하는 것이 좋습니다
const firebaseConfig = {
  apiKey: "AIzaSyCPE45MtrHjzX4Mrj7OScNuyE_JJVOx6Qg",
  authDomain: "login-baa7f.firebaseapp.com",
  projectId: "login-baa7f",
  storageBucket: "login-baa7f.firebasestorage.app",
  messagingSenderId: "296899354710",
  appId: "1:296899354710:web:fcf0d584b294b8a9505bf7",
  measurementId: "G-SNZFLHVVSX"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth 및 Firestore 인스턴스 생성
export const auth = getAuth(app);
export const db = getFirestore(app);


export default app; 