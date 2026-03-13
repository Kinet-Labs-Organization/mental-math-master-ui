import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import config from '../config/env';

const firebaseApp = initializeApp({
  apiKey: config.firebaseApiKey,
  authDomain: config.firebaseAuthDomain,
  projectId: config.firebaseProjectId,
  storageBucket: config.firebaseStorageBucket,
  messagingSenderId: config.firebaseMessagingSenderId,
  appId: config.firebaseAppId,
  measurementId: config.firebaseMeasurementId,
});

void isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(firebaseApp);
    }
  })
  .catch(() => {
    // Analytics is optional here.
  });

export const firebaseAuth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  // await setPersistence(firebaseAuth, browserLocalPersistence);
  // return signInWithRedirect(firebaseAuth, googleProvider);
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  console.log(result.user);
  return result;
};
export const signOutFromFirebase = () => signOut(firebaseAuth);

export default firebaseApp;
