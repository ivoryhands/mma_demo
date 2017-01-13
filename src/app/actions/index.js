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
    databaseURL: "mma-live.firebaseio.com",
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
      browserHistory.push('/');
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
        dispatch(authError(error));
      });
  }
}

export function signUpUser(credentials) {
  console.log('signing up!');
  return function (dispatch) {
    Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .catch(function (error) {
        console.log(error.code, 'error code is:')
      })
      .then(function() {
        var user = Firebase.auth().currentUser;
        if (user) {
          user.updateProfile({
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/mma-live.appspot.com/o/images%2Fuser-icon.png?alt=media&token=e56eac00-f553-40dd-9252-e2bda3a34f23'
          });
        }
      })
      .then(function() {
          console.log('success!');
          dispatch(initUser());
          dispatch(authUser());
          browserHistory.push('/profile');
      });
  }
}

export function signOutUser(props) {
  browserHistory.push('/');
  console.log('Logged out!');
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
  console.log('verify!');
  return function (dispatch) {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user auth!');
        dispatch(initProfile(user));
        dispatch(authUser());
      }
      else {
        dispatch(signOutUser());
      }
    });
  }
}
// INVALID LOGIN ATTEMPT
export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: 'Invalid login attempt.  Please try again.'
  }
}
