import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import AuthReducer from './auth.js';
import UserInfoReducer from './user.js';

//sconsole.log({})

const rootReducer = combineReducers({
  form: reduxFormReducer,
  auth: AuthReducer,
  user: UserInfoReducer
});
//console.log(rootReducer);
export default rootReducer;
