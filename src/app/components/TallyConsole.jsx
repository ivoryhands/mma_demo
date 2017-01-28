import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';

class TallyConsole extends Component {
  constructor (props) {
    super(props);

  }

  render () {
    console.log('tally console!!', this.props.result_pick);
    return (

              <div>




                    <div className="col-md-12">
                      <div className="card blank no-outline">
                        <div className="card-block orange-bg">
                          <div className="center-element">
                            <h4 className="white-text">FIGHT RESULTS</h4>
                          </div>
                        </div>
                      </div>
                    </div>




                <div className="col-md-12">
                  <div className="card blank outline">
                    <div className="card-block">
                      <div className="center-element">
                        <h6>Result</h6>
                        <h3>{this.props.result_pick}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="card blank outline">
                    <div className="card-block">
                      <div className="center-element">
                        <h6>Your Pick</h6>
                        <h3>{this.props.your_pick}</h3>
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

export default TallyConsole = connect(mapStateToProps)(TallyConsole);
