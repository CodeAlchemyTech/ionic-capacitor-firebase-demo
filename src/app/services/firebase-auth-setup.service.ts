/* eslint-disable @typescript-eslint/no-shadow */
import {
  Auth,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Capacitor } from '@capacitor/core';
import { firebaseConfig } from '../config/firebase-config';

const whichAuth = () => {
  let auth: Auth;
  const app = initializeApp(firebaseConfig);
  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    auth = getAuth();
  }
  return auth;
};

export const auth = whichAuth();
