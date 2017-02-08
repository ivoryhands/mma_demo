import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Home extends Component {
  constructor (props) {
    super(props);
    console.log(this.props, 'Home props');
  }
  showButtons() {
    if (this.props.authenticated) {
      return <div></div>
    }
    else {
      return  <div className="home-buttons">
                <Link to ="signup" className="blocks" role="button">Sign Up</Link>
                <Link to ="signin" className="blocks" role="button">Sign In</Link>
              </div>
    }
  }
  render() {
    return (
      <div>
          <section className="intro bg-cover">
            <div className="content">
              <div className="grad" id="cool"></div>
              <div id="logo-below">
                <h1 className="white-text" id="logo-title">STRYD</h1>
                <h5 className="white-text text-drop"><strong>Afrikaans</strong>.  From Dutch <em>strijd</em></h5><h5 className="white-text tab text-drop">1. Fight, Battle, Conflict.</h5>

              </div>
              <p className="white-text motto">Compete against other fight fans as you make fight picks in realtime and compete for top spot.</p>
              {this.showButtons()}

           </div>
          </section>
          <footer>
              <span>Made by <a className="home-link" href="http://www.ericpage.ca/pt/">Eric Page</a></span>
          </footer>
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
    authCompleted: state.auth.authCompleted,
    authenticated: state.auth.authenticated
  }
}

export default Home = connect(mapStateToProps)(Home);
