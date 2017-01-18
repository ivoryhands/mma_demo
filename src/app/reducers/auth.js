import { SIGN_OUT_USER, AUTH_USER, AUTH_ERROR } from '../actions';

const initialState =  {
  authenticated: false,
  error: null,
  authCompleted: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state, authenticated: true, error: null, authCompleted: true
      };
    case AUTH_ERROR:
      return {
        ...state, error: action.payload, authCompleted: true
      };
    case SIGN_OUT_USER:
      return {
        ...state, authenticated: false, authCompleted: true
      };
    default:
      return state;
  }
}
