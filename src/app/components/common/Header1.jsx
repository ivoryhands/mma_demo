import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../../actions/index.js';

class Header extends Component {
  handleSignout() {
    console.log('signing out....');
    this.props.signOutUser();
  }
  adminMenu() {
    var sess = JSON.parse(localStorage.getItem('session'));
    if (sess.access === "admin") {
        return <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Admin
                  </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link to ="admin/addEvent" className="dropdown-item">Add Event</Link>
                    <Link to ="editData" className="dropdown-item">Edit Data</Link>
                    <Link to ="editPrefs" className="dropdown-item">Edit Preferences</Link>
                  </div>
              </li>
    }
    else {
      var admin = '';
    }
  }
  renderAuthLink() {
      if (this.props.authenticated) {
        var sess = JSON.parse(localStorage.getItem('session'));
        console.log(sess.access);
        return<div>
              <ul className="nav navbar-nav float-xs-right">
                {this.adminMenu()}
                  <li className="nav-item">
                      <Link to="profile" className="nav-link">Profile</Link>
                  </li>
                  <li className="nav-item">
                      <a href="#" className="nav-link" onClick={() => this.handleSignout()}>Sign Out</a>
                  </li>

              </ul>
              <span className="navbar-text float-xs-right user-greet">
                {sess.username}
              </span>
            </div>
      }
      else {
        return <ul className="nav navbar-nav float-xs-right">
                  <li className="nav-item">
                      <Link to="login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                      <Link to="signup" className="nav-link">Signup</Link>
                  </li>
              </ul>
      }
  }
  render () {
    return (
      <nav className="navbar navbar-light navbar-fixed-top bg-faded navbar-w">
        <Link to="/" className="navbar-brand">MMALive</Link>
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="events" className="nav-link">Events</Link>
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
  }
}
export default connect(mapStateToProps, Actions)(Header);
