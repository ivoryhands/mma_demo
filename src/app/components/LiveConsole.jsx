import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link, browserHistory } from 'react-router';
import { insert, moduleController } from '../classes/insert.js'

class LiveConsole extends Component {
  constructor (props) {
    super(props);
    this.handleFightPicks = this.handleFightPicks.bind(this);
    this.state = {
      picksOpen: false,
      leaderboardOpen: false,
      scoresOpen: false,
      fightList: [],
      rounds_three: ['1', '2', '3'],
      rounds_five: ['1', '2', '3', '4', '5']
    };
    this.getFightList();
  }

  getFightList() {
    var picksRef = Firebase.database().ref('picks/'+this.props.uid+'/'+this.props.event_url+'/');
    var fightsRef = Firebase.database().ref('events/'+this.props.event_url+'/fights/');
    var fightListArr = [];
    var that = this;

    picksRef.on('value', function (snapshot) {
      var picks = snapshot.val();
      var pickListArr = [];
      snapshot.forEach(function (data) {
        var pickList = {
          fighter: data.val().fighter,
          method: data.val().method,
          round: data.val().round,
          color: data.val().winner
        };
        pickListArr.push(pickList);
      });

      console.log(pickListArr, 'newfightlistarr');
      that.setState({pickList: pickListArr});
    });
    fightsRef.once('value', function (snapshot) {
      snapshot.forEach(function(data) {
        var fight = {};
        for (let x of that.state.pickList) {
          if (x.fighter === data.val().red || x.fighter === data.val().blue) {
            var flag = true;
            var fight = {
              blue: data.val().blue,
              red: data.val().red,
              total_rounds: data.val().total_rounds,
              winner: x.fighter,
              round_pick: x.round,
              method_pick: x.method
            };
          }
        }
        if (flag === true) {
            fightListArr.push(fight);
        }
        else {
            var fight = {
              blue: data.val().blue,
              red: data.val().red,
              total_rounds: data.val().total_rounds,
              winner: '',
              round_pick:'',
              method_pick: ''
            };
            fightListArr.push(fight);
        }
        var flag = false;
      });
      that.setState({fightList: fightListArr});
    });



  }
  insertPicks() {
    console.log('insertpicks');

  }
  handlePicks(event) {
    if (this.state.picksOpen) {
        this.setState({picksOpen: false, leaderboardOpen: false, scoresOpen: false});
    }
    else {
        this.setState({picksOpen: true, leaderboardOpen: false, scoresOpen: false});
    }

  }
  handleLeaderboard(event) {
    if (this.state.leaderboardOpen) {
      this.setState({picksOpen: false, leaderboardOpen: false, scoresOpen: false});
    }
    else {
      this.setState({picksOpen: false, leaderboardOpen: true, scoresOpen: false});
    }

  }
  handleScores(event) {
    if (this.state.scoresOpen) {
      this.setState({picksOpen: false, leaderboardOpen: false, scoresOpen: false});
    }
    else {
      this.setState({picksOpen: false, leaderboardOpen: false, scoresOpen: true});
    }
  }
  handleFightPicks(event) {
    console.log(event.target.value, event.target.name, event.target.id, 'fightpickshandler');
    var ref = Firebase.database().ref('picks');
    var postData={
      color: event.target.value,
      fighter: event.target.name
    };

    function writeEventData(postData, fight_pointer, event_url, uid) {
      var newPostKey = Firebase.database().ref().child('picks').push().key;
      var updates = {};
      console.log(newPostKey);
      console.log(fight_pointer, 'fight pointer!');
      updates['/picks/'+uid+'/'+event_url+'/'+fight_pointer+'/'] = postData;
      return Firebase.database().ref().update(updates);
    }
    writeEventData(postData, event.target.id, this.props.event_url, this.props.uid);
  }

  render () {
    let picks = null;
    let leaderboard = null;
    let scores = null;
    if (this.state.picksOpen) {
      picks = <Picks
                  fightList={this.state.fightList}
                  onChangeFighter={this.handleFightPicks}
              />
      leaderboard = null
      scores = null
    }
    if (this.state.leaderboardOpen) {
      leaderboard = <Leaderboard />
      picks = null
      scores = null
    }
    if (this.state.scoresOpen) {
      scores = <Scores />
      picks = null
      leaderboard = null
    }
    return (
      <div id="myGroup">
        <div className="center-element margin-auto">
          <button className="blocks" value = "picks"  onClick={this.handlePicks.bind(this)}>Event Picks</button>
          <button className="blocks" value = "leaderboard"  onClick={this.handleLeaderboard.bind(this)}>Event Leaderboard</button>
          <button className="blocks" value = "scores" onClick={this.handleScores.bind(this)}>Event Scores</button>
        </div>
        <div className="one-spacer"></div>
          {picks}
          {leaderboard}
          {scores}
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
  }
}

export default LiveConsole = connect(mapStateToProps)(LiveConsole);

function Picks(props) {
  console.log(props, 'picks');
  return (
        <div className="card blank outline">
          <div className="card-block">
            <div className="center-element fightList">
              <ul>
                {props.fightList.map((item, i) => {
                  return  <form onChange={props.onChangeFighter} key={i}>
                            <div className="row">
                              <div className="col-sm-5">
                                {item.winner ? <input type="button" className="blocks-small-selected" name="red" id={i} value={item.red}/> : <input type="button" className="blocks-small" name="red" id={i} value={item.red}/>}

                              </div>
                              <div className="col-sm-2">VS</div>
                              <div className="col-sm-5">
                                <input type="button" className="blocks-small" name="blue" id={i} value={item.blue}/>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-5">
                                Method
                                <select multiple className="form-control" id="methood">
                                  <option>KNOCKOUT</option>
                                  <option>SUBMISSION</option>
                                  <option>DECISION</option>
                                </select>
                              </div>
                              <div className="col-sm-2">|</div>
                              <div className="col-sm-5">
                                Round

                              </div>
                          </div>
                          </form>

                })}
              </ul>
            </div>
          </div>
        </div>

  );
}
function Leaderboard(props) {
  return (
        <div className="card blank outline">
          <div className="card-block">
            <div className="center-element">
              These are Leaderboard.
            </div>
          </div>
        </div>

  );
}
function Scores(props) {
  return (
        <div className="card blank outline">
          <div className="card-block">
            <div className="center-element">
              These are Scores.
            </div>
          </div>
        </div>

  );
}
