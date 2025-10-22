// Firebase 모듈 통합 export
export { auth, db, storage } from "./config";
export {
  sendEmailLink,
  completeEmailLinkSignIn,
  signOut,
  getCurrentUser,
} from "./auth";
