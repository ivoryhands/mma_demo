import { USER_UPDATE, USER_INIT, USER_EXISTING, PROGRESS_BAR } from '../actions';

const initialState =  {
  displayName: null,
  email: null,
  photoURL : 'https://firebasestorage.googleapis.com/v0/b/mma-live.appspot.com/o/images%2Fuser-icon.png?alt=media&token=e56eac00-f553-40dd-9252-e2bda3a34f23',
  admin: false,
  progressBar: 0,
  uid: null
};

export default function (state = initialState, action) {
  //console.log(action, "action user");
  switch (action.type) {
    case USER_UPDATE:
      return {
        ...state, photoURL: action.payload.photoURL, displayName: action.payload.displayName, uid: action.payload.uid
      };
    case USER_INIT:
      return {
        ...state, email: action.payload.email, uid: action.payload.uid, displayName: action.payload.displayName, photoURL: action.payload.photoURL
      };
    case USER_EXISTING:
      if ( action.payload.email === 'test@test.com') {
        var admin = true;
      }
      else {
        var admin = false;
      }
      return {
        ...state, email: action.payload.email, photoURL: action.payload.photoURL, admin: admin, displayName: action.payload.displayName, uid: action.payload.uid
      };
    case PROGRESS_BAR:
      return {
        ...state, progressBar: action.payload.progressBar
      };
    default:
      return state;
  }
}
