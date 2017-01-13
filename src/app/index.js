import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import Home from './components/home/Home';
import About from './components/about/About';
import SignIn from './components/users/SignIn';
import Profile from './components/users/Profile';
import Play from './components/Play';
import Events from './components/Events';
import addEvent from './components/admin/addEvent';
import SignUp from './components/users/SignUp';
import RequireAuth from './components/RequireAuth'
import * as Actions from './actions';

import reducers from './reducers';

import './components/bundle.scss';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
console.log(store.getState(), 'current state');

console.log('verifyAuth ');
store.dispatch(Actions.verifyAuth());

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />;
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/events" component={RequireAuth(Events)} />
        <Route path="/profile" component={Profile} />
        <Route path="/play/*" component={Play} />
        <Route path="/admin/addEvent" component={addEvent} />
      </Route>
    </Router>
  </Provider>
  , document.getElementById('react-root'));
