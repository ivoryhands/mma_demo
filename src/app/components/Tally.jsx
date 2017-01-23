import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link, browserHistory } from 'react-router';
import { insert, moduleController } from '../classes/insert.js';
import LiveConsole from './LiveConsole.jsx';
import PickPercentage from './PickPercentage.jsx';
import PlayerConsole from './PlayerConsole.jsx';
import TallyConsole from './TallyConsole.jsx';

class Tally extends Component {
  constructor (props) {
    super(props);
    this.state = {
      method_pick: '',
      tally_finish: false,
      blueWinner: false,
      redWinner: false,
      colorWinner: ""
    };

  }
  componentDidMount() {
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
      var color_winner = snapshot.val().color;
      that.setState({result_method: result_method, result_round_finish: result_round_finish, result_winner: result_winner, color_winner: color_winner});
      console.log('scoring::', result_winner, pick_winner);
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
      console.log(that.props.uid, 'is UID here???');
        function writeUserData(score, currentScore) {
          Firebase.database().ref('users/' + that.props.uid + '/' + url).set({
            score: score + currentScore,
            event_title: that.props.event_title,
            event_date: that.props.event_date,
            displayName: that.props.displayName
          });
          that.setState({total_score: score + currentScore, fight_score: score});

          //var key = that.props.displayName;
          var obj = {displayName: that.props.displayName, uid: that.props.uid, score: score+currentScore};
          //obj[key] = score + currentScore;
          Firebase.database().ref('leaderboard/'+url+'/'+that.props.uid).set(obj);


        }
      writeUserData(score, that.props.currentScore);
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
      console.log(snapshot.val(), 'getPICK  snappers');
      var picks = snapshot.val();
      var color_pick = picks.winner;
      console.log(color_pick, 'color pick');
      that.setState({fighter_pick: snapshot.val().fighter, round_pick: snapshot.val().round, method_pick: snapshot.val().method, color: snapshot.val().winner});
      that.setScore(snapshot.val().winner, snapshot.val().round_pick, snapshot.val().method_pick);
    });
  }
  render () {
    let liveConsole = null;
    let playerConsole = null;
    let tallyConsole = null;

    let red_result = null;
    let blue_result = null;
    let pick_str = null;
    let redWinner = null;
    let blueWinner = null;

    if (this.state.color_winner === "blue") {
      console.log('blue winner');
      red_result = "DEFEAT";
      blue_result = "WINNER";
      redWinner = false;
      blueWinner = true;
    }
    if (this.state.color_winner === "red") {
      console.log('red winner');
      red_result = "WINNER";
      blue_result = "DEFEAT";
      redWinner = true;
      blueWinner = false;
    }


    if (this.state.result_method === "DECISION") {
      pick_str = this.state.result_winner + ' VIA ' + this.state.result_method;
      console.log(this.state.result_winner, this.state.result_method, 'decision!!!');
    }
    else {
      pick_str = this.state.result_winner + ' VIA ' + this.state.result_method + ' in ROUND ' + this.state.result_round_finish;
      console.log(this.state.result_winner, this.state.result_method, this.state.result_round_finish, ' no decision!!!');
    }

    if (this.props.pickMade) {
      if (this.props.pickMethod === "DECISION") {
        var str = this.props.pickFighter +' via '+ this.props.pickMethod;
      }
      else {
        var str = this.props.pickFighter +' via '+ this.props.pickMethod +' in Round '+ this.props.pickRound;
      }
    }
    if (!this.props.pickMade) {
      var str = 'N/A';
    }

    if (this.props.event_url) {
      console.log(pick_str, 'pick_str!!!');
      liveConsole =   <LiveConsole
                        uid={this.props.uid}
                        event_url={this.props.event_url}
                      />
      const status = "FIGHT OVER";
      const controllerTally = true;
      playerConsole = <PlayerConsole
                        round={this.props.round}
                        status={status}
                        fight_score={this.state.fight_score}
                        controllerTally={controllerTally}
                        currentScore={this.props.currentScore}
                      />

      tallyConsole = <TallyConsole
                        result_pick={pick_str}
                        your_pick={str}
                      />
    }

    return (


      <div className ="compcontainer bg-cover">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2">
          <h4><small>Fight {Number(this.props.fight_pointer)+1} Results</small></h4>
        </nav>
        <div>
            <div className="row below-second-nav">
                <div className="col-md-1 col-sm-1"></div>
                <div className="col-md-10 col-sm-10">
                  {liveConsole}
                  <div className="row">
                      {playerConsole}
                      {tallyConsole}
                    <div className="col-sm-6">
                      <div className="card blank outline">
                        {redWinner ?
                          <div className="card-block" style={{color: "#EE543A", backgroundColor: "rgb(0,0,0,0.75)"}}>
                            <div className="center-element">
                              <h3 className="card-title no-bot-margin">{this.props.red_fighter_firstName}</h3>
                              <h1 className="card-title">{this.props.red_fighter_lastName}</h1>
                              <h4>{red_result}</h4>
                            </div>
                          </div> :
                          <div className="card-block">
                            <div className="center-element">
                              <h3 className="card-title no-bot-margin">{this.props.red_fighter_firstName}</h3>
                              <h1 className="card-title">{this.props.red_fighter_lastName}</h1>
                              <h4>{red_result}</h4>
                            </div>
                          </div>
                        }

                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="card blank outline">
                        {blueWinner ?
                          <div className="card-block" style={{color: "#EE543A"}}>
                            <div className="clearfix">
                              <div className="center-element">
                                <h3 className="card-title no-bot-margin">{this.props.blue_fighter_firstName}</h3>
                                <h1 className="card-title">{this.props.blue_fighter_lastName}</h1>
                                <h4>{blue_result}</h4>
                              </div>
                            </div>
                          </div> :
                          <div className="card-block">
                            <div className="clearfix">
                              <div className="center-element">
                                <h3 className="card-title no-bot-margin">{this.props.blue_fighter_firstName}</h3>
                                <h1 className="card-title">{this.props.blue_fighter_lastName}</h1>
                                <h4>{blue_result}</h4>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card blank outline">
                        <div className="card-block">
                          <div className="center-element">
                            <button className="blocks-full" onClick={this.handleProceed.bind(this)}>PROCEED</button>
                          </div>
                        </div>
                      </div>
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
