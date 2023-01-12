# Ionic Capacitor Firebase authentication

This is a demo project with use of Firebase js sdk to authenticate firebase user with different methods provided by firebase.

This project was built using [Capacitor Firebase Authenthentication](https://github.com/robingenz/capacitor-firebase/tree/main/packages/authentication) and [Firebase JS SDK](https://www.npmjs.com/package/firebase).


## How to use
1. To run project
```
npm install
```

  
2. Create a Firebase project 
  - Use this link to create project in [Firebase](https://console.firebase.google.com/).

3. Add config object from Firebase Webapp in to /src/app/services/firebase/firebase-config.ts
  
```
export const firebaseConfig = {
    apiKey: "xxxxxxxx-xxxxxxxx",
    authDomain: "xxxxxxxxxxxxxxxxxxxxxxxx",
    databaseURL: "xxxxxxxxxxxxxxxxxxxxxxxx",
    projectId: "xxxxxxxx",
    storageBucket: "xxxxxxxx",
    messagingSenderId: "xxxxxx",
    appId: "xxxxx",
    measurementId: "xxxxxxxxxxxxxxxx"
};
``` 

- Before configure Google and Facebook. Change app id in <b>capacitor.config.ts</b> file.
- Create Android and iOS application in firebase  project setting  with your app id. 
- Download <b>GoogleService-Info.plist</b> file for iOS app and add that file under <b>ios/App/App</b> folder.
- Download <b>google-services.json</b> file for Android app and add this file under <b>/android/app</b> folder.


### Google Authenthentication

- Enable google authentication in firebase authentication provider.
- Follow step mention in below link for configure google authentication.
- [Configure Google Authentication in Android, iOS and Web](https://github.com/robingenz/capacitor-firebase/blob/main/packages/authentication/docs/setup-google.md)


### Facebook Authenthentication

- Create facebook app using facebook developer account.
- Add Android, iOS and web platform on facebook app.
- Enable facebook authentication and set facebook app id and secrate key.
- Enable google authentication in firebase authentication provider.
- Follow step mention in below link for configure google authentication.
- [Configure Facebook Authentication in Android, iOS and Web](https://github.com/robingenz/capacitor-firebase/blob/main/packages/authentication/docs/setup-facebook.md)

### Apple Authenthentication

- Enable apple authentication in firebase
- Before you begin. Follow this steps:
- [Android](https://firebase.google.com/docs/auth/android/apple#before-you-begin)
- [iOS](https://firebase.google.com/docs/auth/ios/apple#before-you-begin)
- [Web](https://firebase.google.com/docs/auth/web/apple#before-you-begin)


### Twitter Authenthentication

- Enable twitter authentication provider.
- Follow this steps [before you begin](https://github.com/robingenz/capacitor-firebase/blob/main/packages/authentication/docs/setup-twitter.md)