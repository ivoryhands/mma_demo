import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../../actions/index.js';
import Firebase from 'firebase';

class Header extends Component {
  handleSignout() {
    console.log('signing out....');
    this.props.signOutUser();
  }
  profileImage() {
    var user = Firebase.auth().currentUser;
    var divImage = {
      backgroundImage: 'url(' + user.photoURL + ')'
    }
        return <div>
              <span className="navbar-text float-xs-right user-greet">
                  {user.displayName}
              </span>
              <span className="navbar-text float-xs-right user-greet no-padding-bottom">
                <div className="profile-image-sm-parent" style={divImage}>
                </div>
              </span>
            </div>
  }
  adminMenu() {
    if (this.props.admin) {
        return <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Admin
                  </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link to ="/admin/addEvent" className="dropdown-item">Add Event</Link>
                    <Link to ="/editData" className="dropdown-item">Edit Data</Link>
                    <Link to ="/editPrefs" className="dropdown-item">Edit Preferences</Link>
                  </div>
              </li>
    }
    else {
      return <div></div>
    }
  }
  renderAuthLink() {
    //console.log(this.props, 'header props');
    if (this.props.authenticated) {
      return<div>
            <ul className="nav navbar-nav float-xs-right">
                {this.adminMenu()}
                <li className="nav-item">
                    <Link to="/profile" className="nav-link nav-text">Profile</Link>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link nav-text" onClick={() => this.handleSignout()}>Sign Out</a>
                </li>
            </ul>

          </div>
    }
    else {
      return <ul className="nav navbar-nav float-xs-right" style={{marginTop: '0', marginBottom: '1rem'}}>
                <li className="nav-item">
                    <Link to="/signin" className="nav-link nav-text">Sign In</Link>
                </li>
                <li className="nav-item">
                    <Link to="/signup" className="nav-link nav-text">Sign Up</Link>
                </li>
            </ul>
    }
  }
  render () {
    return (
      <nav className="navbar fixed-top navbar-light bg-faded .zindex-topnav nav-bar-first">
        <Link to="/" className="navbar-brand"><img src="./src/images/logo.png" className="d-inline-block align-top" width="40" height="40" alt=""/></Link>
        <ul className="nav navbar-nav" style={{marginTop: '1rem'}}>
          <li className="nav-item">
            <Link to="/" className="nav-link nav-text">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/events" className="nav-link nav-text">Events</Link>
          </li>
        </ul>
            {this.renderAuthLink()}
      </nav>
    );
  }
}
function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    email: state.user.email,
    admin: state.user.admin,
    displayName: state.user.displayName,
    photoURL: state.user.photoURL
  }
}
export default connect(mapStateToProps, Actions)(Header);
