import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link, browserHistory } from 'react-router';
import { insert, moduleController } from '../classes/insert.js'

class Tally extends Component {
  constructor (props) {
    super(props);
    this.state = {
      method_pick: '',
      tally_finish: false
    };

    this.getPick();
  }
  setScore(pick_winner, pick_round, pick_method) {
    var url = this.props.event_url;
    var fight_pointer = this.props.fight_pointer;
    var score = 0;
    var that = this;
    return Firebase.database().ref('fight_results/' + url + '/' + fight_pointer).once('value').then(function(snapshot) {
      console.log(snapshot.val(), 'snappers', url, fight_pointer);
      var result = snapshot.val();
      var result_method = snapshot.val().method;
      var result_round_finish = snapshot.val().round_finish;
      var result_winner = snapshot.val().winner;
      that.setState({result_method: result_method, result_round_finish: result_round_finish, result_winner: result_winner});
      if (result_winner === pick_winner) {
        score = score + 100;
      }
      if (result_round_finish === pick_round) {
        score = score + 50;
      }
      if (result_method === pick_method) {
        score = score + 50;
      }
      console.log(score, 'this is the score', result_winner, pick_winner, result_round_finish, pick_round, result_method, pick_method);
      that.setState({fight_score: score});
      return Firebase.database().ref('users/' + url+'/'+that.props.uid+'/').once('value').then(function(snapshot) {
        var db_score = snapshot.val().score;
        function writeUserData(score, db_score) {
          Firebase.database().ref('users/' + url + '/'+that.props.uid+'/').set({
            score: score + db_score
          });
          that.setState({total_score: score + db_score, fight_score: score});
        }
      });
    });

  }
  handleProceed() {
    localStorage.setItem('tally', 'false');
    browserHistory.push('/play/'+this.props.event_url);
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
      that.setScore(snapshot.val().fighter, snapshot.val().round, snapshot.val().method);
    });
  }
  render () {

    if (this.state.method_pick === "DECISION") {
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
                    <div className="center-element">
                      <h4 className="center-element white-text margin-bot">Fight Result</h4>

                      <h2 className="playTitle">{this.state.result_winner} VIA {this.state.result_method} in ROUND {this.state.result_round_finish},</h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="center-element">
                      <h5 className="playTitle">Your Pick</h5>
                      <h2 className="playTitle">{pick_str}</h2>
                      <h5 className="playTitle">Result</h5>
                      <h2 className="playTitle"> Fight Score: {this.state.fight_score}</h2>
                      <h2 className="playTitle"> Total Score: {this.state.total_score}</h2>
                      <button className="blocks" name="proceed" value="proceed" aria-pressed="true" onClick={this.handleProceed.bind(this)}>PROCEED</button>
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
