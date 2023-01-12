import { Injectable, NgZone } from '@angular/core';
import {
  FirebaseAuthentication,
  SignInResult,
} from '@capacitor-firebase/authentication';

import { BehaviorSubject } from 'rxjs';
import {
  fetchSignInMethodsForEmail,
  getAuth,
  GoogleAuthProvider,
  signOut,
  signInWithCredential,
  EmailAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { AlertController } from '@ionic/angular';

import { UserDetail } from '../interfaces/user.model';
import {
  FIRESTORE_DB_NAME,
  LOCALSTORAGE_KEYS,
} from '../utils/common-constants';

import { map } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';

import { FirestoreService } from './firestore.service';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { auth } from './firebase-auth-setup.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * - Used to store current logged in user details.
   * - For use it globally.
   */
  public userDetail: UserDetail | null = null;
  public uid: string | null = '';

  /**
   * - For get updated user details.
   */
  public userDetails$: BehaviorSubject<UserDetail | null> =
    new BehaviorSubject<UserDetail | null>(null);

  /**
   * - Used to check and get callback for storage and user details ready state
   */
  public isReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * - Used to check user authenticated state(user already logged in or not).
   * - Mainly use in auth guard
   */
  public isAuthenticated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * - Used to store firebase token for current logged in user.
   */
  public token = '';

  private _unexpectedError = 'Unexpected error';

  constructor(
    private readonly _ngZone: NgZone,
    private _alertCtrl: AlertController,
    private _firestoreService: FirestoreService
  ) {
    this.init();
    // this.loadToken();
  }

  init() {
    /**
     * - Check uid store in localstorage
     */
    const uid = localStorage.getItem(LOCALSTORAGE_KEYS.uid);
    if (uid) {
      /**
       * - Get user details and update observable
       */
      this.uid = uid;
      const user = JSON.parse(
        localStorage.getItem(LOCALSTORAGE_KEYS.user) ?? ''
      );
      if (user) {
        this.userDetail = user as UserDetail;
        this.refreshUserData()?.subscribe();
      }
    }

    /**
     *
     * - Register listener for get and store current logged in user in firebase.
     * - Get details and store in firebase and update userDetails$ observable.
     *
     * - Get token from firebase and store in local storage.
     */
    FirebaseAuthentication.addListener('authStateChange', async (change) => {
      console.log('authStateChange');
      this.uid = change?.user?.uid ? change?.user?.uid : null;
      if (this.uid) {
        this.userDetail = {
          ...(change.user as UserDetail),
        };
        localStorage.setItem(LOCALSTORAGE_KEYS.uid, this.uid);
        localStorage.setItem(
          LOCALSTORAGE_KEYS.user,
          JSON.stringify(this.userDetail)
        );
        const token = await FirebaseAuthentication.getIdToken();
        if (token?.token) {
          await Preferences.set({
            key: LOCALSTORAGE_KEYS.token,
            value: token.token,
          });
          this.isAuthenticated.next(true);
        } else {
          this.isAuthenticated.next(false);
        }
      } else {
        this.userDetail = null;
        this.uid = null;
        this.userDetails$.next(null);
      }
    });

    auth.onAuthStateChanged((state) => {
      console.log('onAuthStateChanged ==== ', state);
      this.uid = state?.uid || '';
      this.refreshUserData()?.subscribe();
      if (this.uid) {
        this.isAuthenticated.next(true);
      }
    });
  }

  /**
   * - Load already store token from capacitor.
   * - Update authentication observable.
   */
  // async loadToken() {
  //   const token = await Preferences.get({ key: LOCALSTORAGE_KEYS.token });
  //   if (token && token.value) {
  //     this.token = token.value;
  //     this.isAuthenticated.next(true);
  //   } else {
  //     this.isAuthenticated.next(false);
  //   }
  // }

  /**
   *
   * - Used to get current user data according uid from firebase and update userDetails observable.
   *
   * @returns Subscription
   */
  public refreshUserData() {
    if (this.uid) {
      return this._firestoreService
        .getDataWithSnap(FIRESTORE_DB_NAME.userCollection, this.uid)
        .pipe(
          map((data) => {
            const details = data as UserDetail;
            localStorage.setItem(
              LOCALSTORAGE_KEYS.user,
              JSON.stringify(details)
            );
            this.userDetail = details;
            this.userDetails$.next(details);
            this.isReady$.next(true);
            return data;
          })
        );
    } else {
      return null;
    }
  }

  /**
   *
   * - Sign in firebase using email and password.
   *
   * @param email `string`
   * @param password `string`
   * @returns `Promise<SignInResult>`
   */
  public async signinWithEmail(
    email: string,
    password: string
  ): Promise<SignInResult> {
    const data = await FirebaseAuthentication.signInWithEmailAndPassword({
      email,
      password,
    });
    if (Capacitor.isNativePlatform()) {
      const creds = EmailAuthProvider.credential(email, password);
      console.log(creds);
      await signInWithCredential(auth, creds);
    }
    return data;
  }

  /**
   *
   * - Check account is exist in firebase with provided email address.
   *
   * @param email `string`
   * @returns `Promise<string[]> `
   */
  public async fetchSignInMethodsForEmail(email: string): Promise<string[]> {
    return fetchSignInMethodsForEmail(getAuth(), email);
  }

  /**
   *
   * - Create account in firebase using email and password,
   *
   * @param email `string`
   * @param password `string`
   * @returns `Promise<SignInResult>`
   */
  public async signupWithEmail(
    email: string,
    password: string
  ): Promise<SignInResult> {
    const data = await FirebaseAuthentication.createUserWithEmailAndPassword({
      email,
      password,
    });
    if (Capacitor.isNativePlatform()) {
      const creds = EmailAuthProvider.credential(email, password);
      console.log(creds);
      await signInWithCredential(auth, creds);
    }
    return data;
  }

  /**
   * - Sign in firebase using facebook provider.
   *
   * @returns `Promise<SignInResult>`
   */
  public async signInWithFacebook(): Promise<SignInResult> {
    const data = await FirebaseAuthentication.signInWithFacebook();
    if (Capacitor.isNativePlatform()) {
      console.log('Data -- ', data);
      const creds = FacebookAuthProvider.credential(
        data.credential?.accessToken || ''
      );
      console.log(creds);
      await signInWithCredential(auth, creds);
    }

    return data;
  }

  /**
   * - Sign in firebase using google provider.
   *
   * @returns `Promise<SignInResult>`
   */
  public async signInWithGoogle(): Promise<SignInResult> {
    const data = await FirebaseAuthentication.signInWithGoogle();
    if (Capacitor.isNativePlatform()) {
      const creds = GoogleAuthProvider.credential(data.credential?.idToken);
      console.log(creds);
      await signInWithCredential(auth, creds);
    }
    return data;
  }

  /**
   * - Sign in firebase using twitter provider.
   *
   * @returns `Promise<SignInResult>`
   */
  public async signInWithTwitter(): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithTwitter();
  }

  /**
   * - Sign in firebase using apple provider.
   *
   * @returns `Promise<SignInResult>`
   */
  public async signInWithApple(): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithApple();
  }

  /**
   * - Sign out from firebase (@capacitor-firebase/authentication plugin and firebase js sdk).
   * - Clear localstorage and capacitor storage.
   * - Update authentication observable.
   *
   * @returns `Promise<void>`
   */
  public async signOut(): Promise<void> {
    await signOut(auth);
    await FirebaseAuthentication.signOut();
    localStorage.clear();
    this.isAuthenticated.next(false);
    return Preferences.clear();
  }

  /**
   * - Manage all firebase error related to authentication
   *
   * @param error `Firebase auth error object`
   */
  async authError(error: any) {
    console.log('auth error', error);
    let message = '';
    const errorcode = error.code;

    switch (errorcode) {
      case 'auth/wrong-password':
        message = 'Invalid password.';
        break;
      case 'auth/user-not-found':
        message = 'User does not exist';
        break;
      case 'auth/email-already-in-use':
        message = 'User is already registered. Please login.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operation is not allowed';
        break;
      case 'auth/weak-password':
        message = 'Password is weak.';
        break;
      default:
        message = this._unexpectedError;
        break;
    }

    try {
      let appInfo = null;
      if (Capacitor.isNativePlatform()) {
        appInfo = await App.getInfo();
      }
      const alert = await this._alertCtrl.create({
        header: appInfo?.name || 'Error!',
        message,
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
    } catch (err) {
      console.log(err);
    }
  }
}
