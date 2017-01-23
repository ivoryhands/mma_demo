import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';

class PlayerConsole extends Component {
  constructor (props) {
    super(props);

  }

  render () {

    return (

              <div>
                <div className="col-md-4">
                  <div className="card blank outline">
                    <div className="card-block" style={{backgroundImage: 'url('+this.props.photoURL+')', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                      <div className="center-element">
                        <div className="profile-name"><h4>{this.props.displayName}</h4></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card blank outline">
                    <div className="card-block">
                      <div className="center-element">
                        {this.props.controllerTally ?
                          <h4>Score: {this.props.currentScore}<span className="orange-text"> (+{this.props.fight_score})</span></h4> :
                          <h4>Score: {this.props.currentScore}</h4>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card blank outline">
                    <div className="card-block">
                      <div className="center-element">
                        <h4 className="orange-text">{this.props.status}</h4>
                      </div>
                    </div>
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
    uid: state.user.uid
  }
}

export default PlayerConsole = connect(mapStateToProps)(PlayerConsole);
