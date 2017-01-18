import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import { insert, moduleController } from '../classes/insert.js'

class Tally extends Component {
  constructor (props) {
    super(props);

    this.getPick();
  }



  getPick () {
    var that = this;
    console.log(this.props.uid, this.props.fight_pointer, this.props.event_url, 'props');
    return Firebase.database().ref('/picks/' + this.props.uid+'/'+this.props.event_url+'/'+this.props.fight_pointer).once('value').then(function(snapshot) {
      console.log(snapshot.val(), 'snappers');
      var picks = snapshot.val();
      var color_pick = picks.winner;
      console.log(color_pick, 'color pick');
      that.setState({fighter_pick: snapshot.val().fighter, round_pick: snapshot.val().round, method_pick: snapshot.val().method, color: snapshot.val().winner});
    });
  }
  render () {

    if (this.state.method === "DECISION") {
      var pick_str = this.state.fighter_pick + ' VIA ' + this.state.method_pick;
    }
    else {
      var pick_str = this.state.fighter_pick + ' VIA ' + this.state.method_pick + ' in ROUND ' + this.state.round_pick;
    }

    return (

      <div className ="compcontainer bg-cover">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2">
          <h4><small></small></h4>
        </nav>
        <div>
            <div className="row below-second-nav">
                <div className="col-md-1 col-sm-1"></div>
                <div className="col-md-10 col-sm-10">
                  <div className="row">

                      <h4 className="center-element white-text margin-bot">Fight Result</h4>


                  </div>
                  <div className="row">
                    <div className="center-element">
                      <h5 className="playTitle">Your Pick</h5>
                      <h2 className="playTitle">{pick_str}</h2>
                      <h5 className="playTitle">Result</h5>
                      <h2 className="playTitle">Fake result goes here</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-1 col-sm-1"></div>
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

export default Tally = connect(mapStateToProps)(Tally);



function FighterButton(props) {
  return (
    <button className={props.fighterClass} onClick={props.onChange} name={props.name} value={props.color}>SELECT</button>
  );
}
