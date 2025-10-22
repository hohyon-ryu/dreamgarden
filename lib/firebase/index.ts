// Firebase 모듈 통합 export
export { auth, db, storage } from "./config";
export {
  sendEmailLink,
  completeEmailLinkSignIn,
  signInWithGoogle,
  signOut,
  getCurrentUser,
} from "./auth";
