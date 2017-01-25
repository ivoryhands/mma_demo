import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Firebase from 'firebase';

export default function(WrappedComponent) {
  class Auth extends React.Component {
    componentWillMount() {
      if (!this.props.authenticated) {
        let hasLocalStorageUser = false;

        for (let key in localStorage) {
          if (key.startsWith("firebase:authUser:")) {

            hasLocalStorageUser = true;
          }
        }

        if (!hasLocalStorageUser) {
          browserHistory.push('/signin');
        }
      }
    }

    render() {
      //if (!this.props.uid) {
      //  return <div>Loading...</div>
      //}
      return <WrappedComponent {...this.props}/>
    }
  }

  function mapStateToProps(state) {
    return {  authenticated: state.auth.authenticated,
              uid: state.user.uid
     };
  }

  return connect(mapStateToProps)(Auth);
}
