import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "./config";

const actionCodeSettings = {
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  handleCodeInApp: true,
};

/**
 * 이메일 링크 인증: 이메일 주소로 로그인 링크 전송
 * Firebase 문서: https://firebase.google.com/docs/auth/web/email-link-auth
 */
export async function sendEmailLink(email: string): Promise<void> {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // 이메일 주소를 로컬 스토리지에 저장하여 이메일 링크 클릭 시 사용
    if (typeof window !== "undefined") {
      window.localStorage.setItem("emailForSignIn", email);
    }
  } catch (error) {
    console.error("Error sending email link:", error);
    throw error;
  }
}

/**
 * 이메일 링크로 로그인 완료
 */
export async function completeEmailLinkSignIn(
  url: string,
  email?: string
): Promise<User> {
  try {
    if (!isSignInWithEmailLink(auth, url)) {
      throw new Error("Invalid sign-in link");
    }

    // 이메일이 제공되지 않으면 로컬 스토리지에서 가져오기
    let userEmail = email;
    if (!userEmail && typeof window !== "undefined") {
      userEmail = window.localStorage.getItem("emailForSignIn") || "";
    }

    if (!userEmail) {
      throw new Error("Email is required to complete sign-in");
    }

    const result = await signInWithEmailLink(auth, userEmail, url);

    // 로컬 스토리지에서 이메일 제거
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("emailForSignIn");
    }

    return result.user;
  } catch (error) {
    console.error("Error completing email link sign-in:", error);
    throw error;
  }
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

/**
 * 현재 인증된 사용자 가져오기
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
