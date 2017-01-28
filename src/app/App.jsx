import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Main from './components/Main';
import Home from './components/home/Home';
import About from './components/about/About';
import SignIn from './components/users/SignIn';
import Profile from './components/users/Profile';
import Play from './components/Play';
import Events from './components/Events';
import addEvent from './components/admin/addEvent';
import Controller from './components/admin/Controller';
import SignUp from './components/users/SignUp';
import RequireAuth from './components/RequireAuth'
import NotFound from './components/NotFound';
import * as Actions from './actions';

import reducers from './reducers';

import './components/bundle.scss';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
console.log(store.getState(), 'current state');

console.log('verifyAuth ');


class Routes extends Component {
  constructor (props) {
    super(props);
    store.dispatch(Actions.verifyAuth());
  }
  render () {
    return (
      <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
        <Route path="/" component={Main}>
          <IndexRoute component={Home} />;
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/events" component={RequireAuth(Events)} />
          <Route path="/profile" component={RequireAuth(Profile)} />
          <Route path="/play/*" component={RequireAuth(Play)} />
          <Route path="/admin/addEvent" component={addEvent} />
          <Route path="/admin/Controller" component={Controller} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    );
  }
}


class App extends Component {
  //constructor (props) {
  //  super(props);
  //  store.dispatch(Actions.verifyAuth());
  //  console.log(this.props, 'hey this is from APP');
  //}
  render () {

      return (
        <Provider store={store}>
          <Routes />
        </Provider>
      );
  }
}



export default App;
