import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Header from './common/Header';

class Main extends Component {
  constructor (props) {
    super(props);

  }
  render() {
    if(!this.props.authCompleted) {
      return    <section className="intro bg-black">
                  <div className="content">
                    <div className="spinner">
                      <div className="rect1"></div>
                      <div className="rect2"></div>
                      <div className="rect3"></div>
                      <div className="rect4"></div>
                      <div className="rect5"></div>
                    </div>
                  </div>
                </section>
    }
    return (
      <div className="container">
        <Header />
        {this.props.children}
      </div>
    );
  }
}

Main.propTypes = { children: PropTypes.object };

function mapStateToProps (state) {
  return {
    email: state.user.email,
    displayName: state.user.displayName,
    photoURL: state.user.photoURL,
    uid: state.user.uid,
    authCompleted: state.auth.authCompleted
  }
}

export default Main = connect(mapStateToProps)(Main);
