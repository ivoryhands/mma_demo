import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Header from './common/Header';

class NotFound extends Component {
  constructor (props) {
    super(props);

  }
  render() {

    return (
      <div className ="compcontainer">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2 slideRight">
          <h4><small>404 Error</small></h4>
        </nav>
        <div className="bg-cover">
          <div className="row below-second-nav">
            <div className="col-md-2 col-sm-1"></div>
            <div className="col-md-8 col-sm-10">
              <div className="404">
                <img src="../src/images/404.jpg" style={{width: "300px"}}/>
                <h1 className="white-text">404 Error.</h1>
                <h3 className="white-text">The page you requested could not be found.</h3>
              </div>
            </div>
            <div className="col-md-2 col-sm-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    email: state.user.email,
    displayName: state.user.displayName,
    photoURL: state.user.photoURL,
    uid: state.user.uid,
    authCompleted: state.auth.authCompleted
  }
}

export default NotFound = connect(mapStateToProps)(NotFound);
