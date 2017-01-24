import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import LiveConsole from './LiveConsole.jsx';
import {initializeClock} from '../classes/countdown.js';

class preEvent extends Component {
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    console.log('preEVENT!');
    this.getTime();
  }
  getTime() {
    var ref = Firebase.database().ref('events/'+this.props.event_url);
    ref.once('value', function (snapshot) {
      var event = snapshot.val();
      var d = new Date(event.time);
      initializeClock('clockdiv', d);
    });
  }
  render () {

    let liveConsole = null;

    if (this.props.event_url) {
      liveConsole = <LiveConsole
                      uid={this.props.uid}
                      event_url={this.props.event_url}
                      photos={this.props.photos}
                    />
    }

    return (

      <div className ="compcontainer bg-cover animated fadeIn">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2">
          <h4><small>Waiting for Event to Begin</small></h4>
        </nav>
        <div>
            <div className="row below-second-nav">
                <div className="col-md-1 col-sm-1"></div>
                <div className="col-md-10 col-sm-10">
                  {liveConsole}
                  <div className="row">
                    <div className="spinner">
                      <div className="rect1"></div>
                      <div className="rect2"></div>
                      <div className="rect3"></div>
                      <div className="rect4"></div>
                      <div className="rect5"></div>
                    </div>
                      <h4 className="center-element white-text margin-bot">Event begins in...</h4>
                  </div>
                </div>
                <div className="col-md-1 col-sm-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10">
                <div className="card blank">
                  <div className="card-block">
                    <div className="center-element">
                      <div id="clockdiv">
                        <div>
                          <span className="days"></span>
                          <div className="smalltext">Days</div>
                        </div>
                        <div>
                          <span className="hours"></span>
                          <div className="smalltext">Hours</div>
                        </div>
                        <div>
                          <span className="minutes"></span>
                          <div className="smalltext">Minutes</div>
                        </div>
                        <div>
                          <span className="seconds"></span>
                          <div className="smalltext">Seconds</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
              <div className="col-md-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10 no-padding-left-right">
                <div className="info">
                  <h4 className="center-element white-text margin-bot">Make your picks before the event begins by clicking on the <span>My Picks</span> tab</h4>
                </div>
              </div>
              <div className="col-md-1"></div>
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

export default preEvent = connect(mapStateToProps)(preEvent);
