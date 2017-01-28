import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link, browserHistory } from 'react-router';

class LiveConsole extends Component {
  constructor (props) {
    super(props);
    this.handleFightPicks = this.handleFightPicks.bind(this);
    this.handleAutoPick = this.handleAutoPick.bind(this);
    this.state = {
      picksOpen: false,
      leaderboardOpen: false,
      scoresOpen: false,
      fightList: [],
      rounds_three: ['1', '2', '3'],
      rounds_five: ['1', '2', '3', '4', '5'],
      autoPickActivated: false
    };

  }
  componentDidMount() {
    this.fightPickScaffolding();
    this.leaderboardConsole();
    console.log(this.props.photos, 'LIVE CONSOLE PHOTOS!!!!');

  }
  leaderboardConsole() {
    console.log("LEADERBOARD CONSOLE PROPSLEADERBOARD CONSOLE PROPS");
    var usersRef = Firebase.database().ref('leaderboard/' + this.props.event_url);
    var that = this;

    usersRef.on('value', function (snapshot) {
      var scoresArr = [];
      var sortedScores = [];
      var photos = that.props.photos;
      snapshot.forEach(function (data) {
         var score = data.val();
         var count = 0;
         var flag = false;
         console.log('SCORE LEADERBOARD', score, photos);
         for (let x of photos) {
           if (x.uid === score.uid) {
             var photoURL = x.photoURL;
             flag = true;
           }
         }
         if (flag === true) {
           scoresArr.push([score.score, score.displayName, photoURL]);
           console.log('true', score.score, score.displayName, photoURL);
         }
         if (flag === false) {
           scoresArr.push([score.score, score.displayName, 'https://firebasestorage.googleapis.com/v0/b/mma-live.appspot.com/o/images%2F11868.jpg?alt=media&token=d643dc00-f379-4de9-8c25-4ed2d23ed04a']);
           console.log('false', score.score, score.displayName, 'default');
         }
         flag = false;
      });
      scoresArr.sort(function(a,b){
        return b[0] - a[0];
      });
      for (let x of scoresArr) {
        var newObj = {
          uid: x[1],
          score: x[0],
          photoURL: x[2]
        };
        sortedScores.push(newObj);
      }
      that.setState({allScores: sortedScores});
      console.log(sortedScores, 'sortedScores Leaderboard');
    });

  }
  getFightList() {
    var picksRef = Firebase.database().ref('picks/'+this.props.event_url+'/'+this.props.uid+'/');
    var that = this;

    picksRef.on('value', function (snapshot) {
      var picks = snapshot.val();
      var pickListArr = [];
      var fightScaffold = that.state.scaffoldingFightList;
      var fightListArr = [];
      snapshot.forEach(function (data) {
        var pickList = {
          fighter: data.val().winner,
          method: data.val().method_pick,
          round: data.val().round_pick,
          color: data.val().winner
        };
        pickListArr.push(pickList);
      });

      that.setState({pickList: pickListArr});
      var flag = false;
      for (let y of that.state.scaffoldingFightList) {
        for (let x of pickListArr) {
          if (x.fighter === y.red || x.fighter === y.blue) {
            var flag = true;
            var fight = {
              blue: y.blue,
              red: y.red,
              total_rounds: y.total_rounds,
              winner: x.fighter,
              round_pick: x.round,
              method_pick: x.method,
              open: y.open
            };
          }
        }
        if (flag === true) {
            fightListArr.push(fight);
        }
        else {
            var fight = {
              blue: y.blue,
              red: y.red,
              total_rounds: y.total_rounds,
              winner: '',
              round_pick:'',
              method_pick: '',
              open: y.open
            };
            fightListArr.push(fight);
        }
        var flag = false;
      }
      that.setState({fightList: fightListArr});
    });

  }
  fightPickScaffolding () {
    var fightsRef = Firebase.database().ref('events/'+this.props.event_url+'/fights/');
    var scaffoldingFightList = [];
    var that = this;
    fightsRef.once('value', function (snapshot) {
      snapshot.forEach(function(data) {
        var fight = {
          blue: data.val().blue,
          red: data.val().red,
          total_rounds: data.val().total_rounds,
          winner: '',
          round_pick: '',
          method_pick: '',
          open: data.val().open
        };
        scaffoldingFightList.push(fight);
      });
      that.setState({
        scaffoldingFightList: scaffoldingFightList }, () => {
        that.getFightList();
      });
    });
  }
  insertPicks (obj, i) {
    console.log(obj, i, 'insertPicks entered');
    Firebase.database().ref('/picks/'+uid+'/'+event_url).update({
      uid: uid
    });
    return Firebase.database().ref().update(updates);
    function writeEventData(postData, fight_pointer, uid, event_url) {
      var updates = {};
      updates['/picks/'+uid+'/'+event_url+'/'+fight_pointer+'/'] = postData;
      return Firebase.database().ref().update(updates);
    }

    writeEventData(obj, i, this.props.uid, this.props.event_url);
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
    var a = this.state.fightList;
    var i = parseInt(event.target.id);

    if (event.target.name === "method") {
      a[i] =  {
                winner: a[i].winner,
                blue: a[i].blue,
                method_pick: event.target.value,
                round_pick: a[i].round_pick,
                red: a[i].red,
                total_rounds: a[i].total_rounds
              };
    }
    else if (event.target.name === "round") {
      a[i] =  {
                winner: a[i].winner,
                blue: a[i].blue,
                method_pick: a[i].method_pick,
                round_pick: event.target.value,
                red: a[i].red,
                total_rounds: a[i].total_rounds
              };
    }
    else {
      a[i] = {
                winner: event.target.value,
                blue: a[i].blue,
                method_pick: a[i].method_pick,
                round_pick: a[i].round_pick,
                red: a[i].red,
                total_rounds: a[i].total_rounds
              };
    }

    this.setState({fightList: a});

    this.insertPicks(a[i], i);

  }
  handleAutoPick(event) {
    console.log('autopick', this.state.fightList);
    this.setState({autoPickActivated: true});
    var that = this;
    setTimeout(function () {
      that.setState({autoPickActivated: false});
    }, 3000);

    var allFights = this.state.scaffoldingFightList;
    var autoPickFights = [];
    for (let x of allFights) {
      var total_rounds = x.total_rounds;
      var methods = ['KNOCKOUT', 'SUBMISSION', 'DECISION'];
      var redFighter = x.red;
      var blueFighter = x.blue;
      //var fightKey = x.key;
      var fighters = [redFighter, blueFighter];
      if (total_rounds === "3") {
        var rounds = ["1", "2", "3"];
      }
      if (total_rounds === "5") {
        var rounds = ["1", "2", "3", "4", "5"];
      }
      var randomMethod = methods[Math.floor(Math.random()*methods.length)];
      var randomFighter = fighters[Math.floor(Math.random()*fighters.length)];
      var randomRound = rounds[Math.floor(Math.random()*rounds.length)];
      var resultObj = {
        winner: randomFighter,
        blue: blueFighter,
        method_pick: randomMethod,
        round_pick: randomRound,
        red: redFighter,
        total_rounds: total_rounds
      };
      console.log(resultObj);
      autoPickFights.push(resultObj);
    }
    console.log(autoPickFights, this.props.uid, this.props.event_url);
    var uidObj = {uid: this.props.uid};
    var postData = {
      fights: autoPickFights,
    };
    var updates = {};
    updates['picks/'+this.props.event_url+'/'+this.props.uid] = autoPickFights;
    //updates['picks/'+this.props.event_url] = uidObj;
    return Firebase.database().ref().update(updates);

  }

  render () {
    let picks = null;
    let leaderboard = null;
    let howtoplay = null;
    let autoPick = null;
    //console.log(this.props.live_status, 'LIVE CONSOLE EVENT STATUS');
    if (this.props.live_status !== "PRE") {
      autoPick = true;
    }
    else {
      autoPick = this.state.autoPickActivated;
    }

    if (this.state.picksOpen) {
      picks = <Picks
                  fightList={this.state.fightList}
                  onChangeFighter={this.handleFightPicks}
                  onChangeAutoPick={this.handleAutoPick}
                  autoPickActivated={autoPick}
              />
      leaderboard = null
      howtoplay = null
    }
    if (this.state.leaderboardOpen) {
      leaderboard = <Leaderboard
                      scores={this.state.allScores}
                      photoURL={this.props.photoURL}
                    />
      picks = null
      howtoplay = null
    }
    if (this.state.scoresOpen) {
      howtoplay = <HowToPlay />
      picks = null
      leaderboard = null
    }
    return (
    <div>
      <div className="row margin-bot">
        <div className="col-md-4">
          <button className="blocks-full" value = "picks"  onClick={this.handlePicks.bind(this)}>MY PICKS</button>
        </div>
        <div className="col-md-4">
          <button className="blocks-full" value = "leaderboard"  onClick={this.handleLeaderboard.bind(this)}>LEADERBOARD</button>
        </div>
        <div className="col-md-4">
          <button className="blocks-full" value = "howtoplay" onClick={this.handleScores.bind(this)}>HOW TO PLAY</button>
        </div>
        <div className="center-element margin-auto">
        </div>
        <div className="one-spacer"></div>

      </div>
      <div className="row">
        {picks}
        {leaderboard}
        {howtoplay}
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
    uid: state.user.uid,
  }
}

export default LiveConsole = connect(mapStateToProps)(LiveConsole);

function Picks(props) {
  //console.log(props, 'picks');
  const KNOCKOUT="KNOCKOUT";
  const SUBMISSION="SUBMISSION";
  const DECISION="DECISION";
  return (
        <div className="card blank  bg-50">
            <div className="center-element fightList">
              <div className="auto-pick">
                <button className="blocks-auto-pick" disabled={props.autoPickActivated} onClick={props.onChangeAutoPick}>AUTOPICK</button>
              </div>
            <ul>
                {props.fightList.map((item, i) => {
                  if (item.open) {
                    return  <div className="col-md-6 margin-bot pick-min" key={i}>
                                <div className="card-block outline">
                                      <div className="col-md-5">
                                        {item.winner===item.red ?
                                          <input type="button" className="blocks-small-selected" name="red" id={i} value={item.red} onClick={props.onChangeFighter}/> :
                                          <input type="button" className="blocks-small" name="red" id={i} value={item.red} onClick={props.onChangeFighter}/>}
                                      </div>
                                      <div className="col-md-2 vs">VS</div>
                                      <div className="col-md-5">
                                        {item.winner===item.blue ?
                                          <input type="button" className="blocks-small-selected" name="blue" id={i} value={item.blue} onClick={props.onChangeFighter}/> :
                                          <input type="button" className="blocks-small" name="blue" id={i} value={item.blue} onClick={props.onChangeFighter}/>}
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label htmlFor="methodSelect">Method</label>
                                          <select className="form-control select-center" id={i} name="method" onChange={props.onChangeFighter} value={item.method_pick}>
                                              <option value="" disabled>--SELECT WIN METHOD--</option>
                                              <option value="KNOCKOUT">KNOCKOUT</option>
                                              <option value="SUBMISSION">SUBMISSION</option>
                                              <option value="DECISION">DECISION</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label htmlFor="roundSelect">Round</label>
                                          {item.total_rounds === "3" ?
                                            <select className="form-control select-center" id={i} name="round" onChange={props.onChangeFighter} value={item.round_pick}>
                                                <option value="" disabled>--SELECT ROUND--</option>
                                                <option value="1">ROUND 1</option>
                                                <option value="2">ROUND 2</option>
                                                <option value="3">ROUND 3</option>
                                            </select> :
                                            <select className="form-control select-center" id={i} name="round" onChange={props.onChangeFighter} value={item.round_pick}>
                                                <option value="" disabled>--SELECT ROUND--</option>
                                                <option value="1">ROUND 1</option>
                                                <option value="2">ROUND 2</option>
                                                <option value="3">ROUND 3</option>
                                                <option value="4">ROUND 4</option>
                                                <option value="5">ROUND 5</option>
                                            </select>}
                                        </div>
                                      </div>
                                </div>
                              </div>
                  }
                  else {
                      return <div className="col-md-6 margin-bot" key={i}>
                                  <div className="card-block outline pick-min center-element">
                                    <h1 className="text-middle">CLOSED</h1>
                                  </div>
                              </div>
                  }

                })}
              </ul>
            </div>

        </div>

  );
}
function Leaderboard(props) {
  var that = this;
  console.log(props, 'leaderboard props');

  return (
        <div className="card blank outline">
          <div className="card-block">
            <div className="center-element">
                <h1>Leaderboard</h1>
                <div className="row">
                  <div className="col-md-2"></div>
                  <div className="col-md-8">
                    <div className="lb-container">
                      {props.scores.map((item, i) => {
                        return    <div className="card-block lb-row" key={i}>
                                      <div className="lb-rank"><span className="lb-span-heavy">{i+1}</span></div>
                                      <div className="lb-pic" style={{backgroundImage: 'url('+item.photoURL+')'}}></div>
                                      <div className="lb-name"><span className="lb-span">{item.uid}</span></div>
                                      <div className="lb-score"><span className="lb-span">{item.score}</span></div>
                                    </div>
                      })}
                    </div>
                  <div className="col-md-2"></div>
                  </div>
                  </div>
                </div>
            </div>
          </div>


  );
}
function HowToPlay(props) {
  return (
        <div className="card blank outline">
          <div className="card-block black-bg-fade">
            <div className="center-element">
              <div className="howtoplay">
                <h1>How To Play</h1>
                <h3>Step 1 - <span>Make Your Picks</span></h3>
                <p>Click on the <span>My Picks</span> tab to see all of the fights for event.</p>
                <p>Click on the <span>fighter</span> you think will win the fight.</p>
                <p>Select the <span>method</span> in which the fighter will be victorious.</p>
                <p>Select the <span>round</span> in which the fighter will win (note: If your method selection is by <span>DECISION</span>, you will not be able to pick the round).</p>
                <p><span>Repeat</span> this process for all fights that are listed for the event.  Make sure you pick before that particular fight begins or else you will be unable to do so.</p>
                <h3>Step 2 - <span>Participation</span></h3>
                <p>Once the event has begun, the <span>Live Console</span> will be active and will notify you of <span>fight progress</span> and <span>fight results.</span></p>
                <p>From here, you will earn points for correctly picking the outcome based on fighter, method and round selection.</p>
                <h3>Step 3 - <span>Scoring</span></h3>
                <p><span>100</span> points for picking correct fighter.</p>
                <p><span>50</span> points for picking correct method.</p>
                <p><span>25</span> points for picking correct round.</p>
                <h4>Step 4 - <span>Leaderboard</span></h4>
                <p>Check the <span>leaderboard</span> to see how you are doing compared to other fight fans.</p>
                <h4>Step 5 - <span>Profile</span></h4>
                <p>Check <span>My Profile</span> to upload your own custom image.</p>
              </div>
            </div>
          </div>
        </div>

  );
}
