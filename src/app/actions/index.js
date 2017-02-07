//export const SIGN_IN_USER = 'SIGN_IN_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const USER_UPDATE = 'USER_UPDATE';
export const USER_INIT = 'USER_INIT';
export const USER_EXISTING = 'USER_EXISTING';
export const PROGRESS_BAR = 'PROGRESS_BAR';
import { browserHistory } from 'react-router';
import Firebase from 'firebase';
import imageUpload from './classes/imageUpload.js'

const config = {
  apiKey: "AIzaSyAPknhGQ-fbeyVOwWJk8DRyVoUa7FYIWZ0",
    authDomain: "mma-live.firebaseapp.com",
    databaseURL: "https://mma-live.firebaseio.com",
    storageBucket: "mma-live.appspot.com",
    messagingSenderId: "971036752073"
  };
  Firebase.initializeApp(config);

export function updateProfile(forminput) {
  return function (dispatch) {
      //console.log(forminput);
      var user = Firebase.auth().currentUser;
      //console.log(user.displayName, "post");
      dispatch(userUpdate(user.displayName, user.photoURL));
      browserHistory.push('/profile');
  }
}

export function signInUser(credentials) {
  return function (dispatch) {
    Firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(response=> {
        dispatch(getUser());
        dispatch(authUser());
        browserHistory.push('/events');
      })
      .catch (error=> {
        dispatch(authError(error.code));
      });
  }
}

export function signUpUser(credentials) {
  //console.log('signing up!');
  var user = null;
  return function (dispatch) {
    Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(function() {
        user = Firebase.auth().currentUser;
      }).then(function () {
        user.updateProfile({
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/mma-live.appspot.com/o/images%2F11868.jpg?alt=media&token=d643dc00-f379-4de9-8c25-4ed2d23ed04a',
          displayName: credentials.username
        });
        Firebase.database().ref('pics/' + user.uid).set({
           photoURL: 'https://firebasestorage.googleapis.com/v0/b/mma-live.appspot.com/o/images%2F11868.jpg?alt=media&token=d643dc00-f379-4de9-8c25-4ed2d23ed04a',
           uid: user.uid
        });
        var d = new Date();
        var n = d.toString();
        //console.log('signUpUser', user.uid, credentials.username, n);
        Firebase.database().ref('users/' + user.uid).set({
           createdAt: n,
           displayName: credentials.username,
           uid: user.uid
        });
      })
      .then(function() {
          //console.log('success!');
          dispatch(initUser());
          dispatch(authUser());
      }).then(function() {
          browserHistory.push('/events');
      })
      .catch(function (error) {
        //console.log(error.code, 'error code is:')
        dispatch(authError(error.code));
      });
  }
}

export function signOutUser(props) {
  for (let key in localStorage) {
    //console.log(key, 'key!');
    if (key.substring(0,9) == 'firebase:') {
      localStorage.removeItem(key);
    }
  }
  browserHistory.push('/');
  //console.log('Logged out!');

  return {
    type: SIGN_OUT_USER
  }
}
// PROGRESS BAR STATE
export function progressBar(progress) {
  return {
    type: PROGRESS_BAR,
    payload: progress
  }
}
// AUTHORIZE USER STATE
export function authUser() {
  return {
    type: AUTH_USER
  }
}
//UPDATE PROFILE
export function userUpdate(displayName, photoURL) {
  var user = {
    displayName: displayName,
    photoURL: photoURL
  };
  return {
    type: USER_UPDATE,
    payload: user
  }
}
//
export function initProfile(user) {
  return {
    type: USER_INIT,
    payload: user
  }
}

export function initUser() {
  return function (dispatch) {
    var user = Firebase.auth().currentUser;
    if (user) {
      dispatch(initProfile(user));
    }
  }
}

export function existingProfile(user) {
  return {
    type: USER_EXISTING,
    payload: user
  }
}

export function getUser() {
  return function (dispatch) {
    var user = Firebase.auth().currentUser;
    if (user) {
      dispatch(existingProfile(user));
    }
  }
}
//VERIFY IF TOKEN STILL VALID WHEN PAGE RELOADED
export function verifyAuth() {
  return function (dispatch) {
    //console.log('verify stage 1');
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //console.log('verify stage 2!');
        dispatch(initProfile(user));
        dispatch(authUser());
      }
      else {
        //console.log("signed out!!");
        dispatch(signOutUser());
      }
    });
  }
}
// INVALID LOGIN ATTEMPT
export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}
