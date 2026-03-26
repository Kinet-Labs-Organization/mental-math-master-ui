import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  initializeAuth,
  signInWithCredential,
  type Auth,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
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

const isNativePlatform = Capacitor.isNativePlatform();

export const firebaseAuth: Auth = isNativePlatform
  ? initializeAuth(firebaseApp, {
      persistence: browserLocalPersistence,
    })
  : getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

const signInWithGoogleNative = async () => {
  const result = await FirebaseAuthentication.signInWithGoogle({
    skipNativeAuth: true,
  });
  const idToken = result.credential?.idToken;
  const accessToken = result.credential?.accessToken;
  if (!idToken && !accessToken) {
    throw new Error('Google authentication did not return tokens.');
  }
  const credential = GoogleAuthProvider.credential(idToken ?? undefined, accessToken ?? undefined);
  return signInWithCredential(firebaseAuth, credential);
};

const signInWithGoogleWeb = async () => {
  return signInWithPopup(firebaseAuth, googleProvider);
};

export const signInWithGoogle = async () => {
  return isNativePlatform ? signInWithGoogleNative() : signInWithGoogleWeb();
};

export const signOutFromFirebase = () => signOut(firebaseAuth);

export default firebaseApp;
