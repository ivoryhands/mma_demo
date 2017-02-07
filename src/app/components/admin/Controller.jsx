import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions/index.js';
import { Field, reduxForm } from 'redux-form';
import Firebase from 'firebase';
//import fighterSearch from 'fighterSearch.jsx';

class Controller extends Component {
  constructor(props) {
        super(props);

        this.handleFightSubmit = this.handleFightSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
        this.handleRound = this.handleRound.bind(this);
        this.handleFightNum = this.handleFightNum.bind(this);
        this.handleGetScores = this.handleGetScores.bind(this);
        this.handleGetResults = this.handleGetResults.bind(this);
        this.handleGetPicks = this.handleGetPicks.bind(this);
        this.handleCalcScores = this.handleCalcScores.bind(this);
        this.handleCalcPercentages = this.handleCalcPercentages.bind(this);
        this.state = {

        };

  }
  componentDidMount() {
    //this.getScores();
  }

  compileScores() {
    var scores = this.state.scores;


  }
  getAllFights(url) {
    console.log (url);
    var fightsRef = Firebase.database().ref('events/'+url+'/fights/');
    var scaffoldingFightList = [];
    var that = this;
    fightsRef.once('value', function (snapshot) {
      snapshot.forEach(function(data) {
        var fightData = data.val();
        var fight = {
          blue: data.val().blue,
          red: data.val().red,
          total_rounds: data.val().total_rounds,
          open: data.val().open,
          key: data.val().key
        };
        scaffoldingFightList.push(fight);
      });
      that.setState({
        scaffoldingFightList: scaffoldingFightList
      });
    });
  }
  handleFightSubmit(event){
    console.log(event.target.value, event.target.name, event.target.id, 'fightpickshandler');

    if (event.target.name === "winner") {
      this.setState({winner: event.target.value});
    }
    if (event.target.name === "method") {
      this.setState({method: event.target.value});
    }
    if (event.target.name === "round") {
      this.setState({round: event.target.value});
    }

  }
  handleStatus() {
  Firebase.database().ref('controller/events/' + this.state.url).update({
    fight_status: this.state.console
  });

  }
  handleSubmit(event){
    console.log(event.target.id, this.state);
    var obj = {
      winner: this.state.winner,
      method: this.state.method,
      round_finish: this.state.round
    };
    this.insertResult(obj, event.target.id);
  }
  handleRound(event){
    console.log('handleround', this.state.url);
    if (this.state.url) {
      Firebase.database().ref('controller/events/' + this.state.url).update({
        round: this.state.event_round
      });
    }
    else {
      alert('URL not set!');
    }

  }
  handleFightNum(event){
    console.log('handlefightnum', this.state.fight_num);
    if (this.state.url) {
      Firebase.database().ref('controller/events/' + this.state.url).update({
        fight_num: this.state.fight_num
      });
    }
    else {
      alert('URL not set!');
    }

  }
  insertResult(obj, i) {
    console.log('insert result');
    var updates = {};
    updates['fight_results/' + this.state.url + '/' + i] = obj;
    return Firebase.database().ref().update(updates);
  }
  fightStatusController(e) {
    e.preventDefault();
    if (e.target.value === "TALLY") {
      this.setState({console: "TALLY"});
    }
    if (e.target.value === "FIGHTING") {
      this.setState({console: "FIGHTING"});
    }
    if (e.target.value === "TABULATING") {
      this.setState({console: "TABULATING"});
    }
  }
  roundController(e) {
    e.preventDefault();
    this.setState({event_round: e.target.value});
    console.log(e.target.value);
  }
  fightNumController(e) {
    e.preventDefault();
    this.setState({fight_num: e.target.value});
    console.log(e.target.value);
  }
  eventURLController(e) {
    e.preventDefault();
    this.setState({url: e.target.value});
    this.getAllFights(e.target.value);
    this.getEventInfo(e.target.value);
  }
  getEventInfo(url) {
    var that = this;
    var eventsRef = Firebase.database().ref('events/'+url);
    eventsRef.once('value', function (snapshot) {
      var eventData = snapshot.val();
      that.setState({
        event_title: eventData.event_title,
        event_date: eventData.date
      });
    });
  }
  handleGetScores() {
    this.getScores();
  }
  handleGetResults() {
    this.getResults();
  }
  handleGetPicks() {
    this.getPicks();
  }
  handleCalcScores() {
    this.calcScores();
  }
  handleCalcPercentages() {
    this.calcPercentages();
  }
  calcPercentages() {
    var that = this;
    var percentagesRef = Firebase.database().ref('picks/'+this.state.url);
    var percentagesArr = [];
    var users = [];
    var color_pick = [];
    return percentagesRef.once('value').then(function(snapshot) {
      snapshot.forEach(function(data) {
        console.log(data.val(), 'calcPercentages');
        users.push(data.val());
      });
      var red_count = 0;
      var blue_count = 0;
      for (let x of users) {
        //console.log(x, that.state.fight_num, x[0]);
        var winner = x[that.state.fight_num].winner;
        var blue = x[that.state.fight_num].blue;
        var red = x[that.state.fight_num].red;
        console.log(winner, blue, red);
        if (winner === blue) {
          var winner_color = "blue";
          blue_count++;
        }
        if (winner === red) {
          var winner_color = "red";
          red_count++;
        }
      }
      var statsObj = {};
      var statsObj2 = {};
      statsObj["red"] = red_count;
      statsObj["blue"] = blue_count;
      statsObj2['stats/'+that.state.url+'/'+that.state.fight_num+'/'] = statsObj;
      console.log(statsObj2);
      return Firebase.database().ref().update(statsObj2);

    });
  }
  getScores() {
    var that = this;
    var scoreRef = Firebase.database().ref('users/'+this.state.url);
    var scoresArr = [];
    return scoreRef.once('value').then(function(snapshot) {
      snapshot.forEach(function(data) {
        console.log(data.val());
        var scores = data.val();
        var score = scores.score;
        var uid = data.key;
        var displayName = scores.displayName;
        var obj = {
          score: score,
          uid: uid,
          displayName: displayName
        };
        console.log(obj);
        scoresArr.push(obj);
      });
      that.setState({
        scores: scoresArr }, () => {
        alert('All current scores compiled.  Please compile picks.');
      });
    });
  }
  getResults() {
    var that = this;
    var fight_num = this.state.fight_num;
    console.log(fight_num);
    var resultsRef = Firebase.database().ref('fight_results/'+this.state.url+'/'+fight_num);
    return resultsRef.once('value').then(function(snapshot) {
      var results = snapshot.val();
      console.log(results, 'getResults');
      var result_winner = results.winner;
      var result_round = results.round_finish;
      var result_method = results.method;
      console.log(result_winner, result_round, result_method, 'result');
      that.setState({result_winner: result_winner, result_round: result_round, result_method: result_method});
    });

  }
  getPicks() {
    var picksArr = [];
    var that = this;
    var fight_num = this.state.fight_num;
    var picksRef = Firebase.database().ref('picks/'+this.state.url);
    return picksRef.once('value').then(function(snapshot) {
      snapshot.forEach(function(data) {
        console.log(data.val(), 'getPicks!!');
        var score = 0;
        var picks = data.val();
        var key = data.key;
        var pick_winner = picks[fight_num].winner;
        var pick_round = picks[fight_num].round_pick;
        var pick_method = picks[fight_num].method_pick;
        var obj = {
          key: key,
          winner: pick_winner,
          round: pick_round,
          method: pick_method
        };
        picksArr.push(obj);
      });
      that.setState({
        picks: picksArr }, () => {
        alert('All picks compiled.  Please calculate scores');
      });
    });
  }
  calcScores() {
    var that = this;
    var result_winner = this.state.result_winner;
    var result_method = this.state.result_method;
    var result_round = this.state.result_round;
    var picks = this.state.picks;
    var scores = this.state.scores;
    var fight_num = this.state.fight_num;
    var leaderboard = {};
    var fight_scores = {};

    for (let x of picks) {
      console.log(x, result_winner, result_round, result_method);
      var score = 0;
      if (result_method != "DECISION") {
        if (this.state.result_winner === x.winner) {
          score = score + 100;
        }
        if (this.state.result_round === x.round) {
          score = score + 25;
        }
        if (this.state.result_method === x.method) {
          score = score + 50;
        }
      }
      else {
        if (this.state.result_winner === x.winner) {
          score = score + 100;
        }
        if (this.state.result_method === x.method) {
          score = score + 50;
        }
      }

      var uid;
      var current_score = 0;
      var displayName;
      for (let y of scores) {
        if (y.uid === x.key) {
          uid = y.uid;
          current_score = y.score;
          displayName = y.displayName;
        }
      }
      //console.log(current_score, score, "SCORES");
      var new_score = current_score + score;
      var obj = {
        uid: uid,
        score: new_score,
        displayName: displayName,
        event_date: this.state.event_date,
        event_title: this.state.event_title,
        current_score: score
      };

      leaderboard[uid] = obj;
    }
    var fight_scoresObj = {};
    Firebase.database().ref('fight_scores/' + this.state.url).once('value').then(function (snapshot) {
        snapshot.forEach(function (data) {
          var fight_scores = data.val();
          console.log(fight_scores, "fight scores");
          var key = data.key;

          if (fight_scores) {
            fight_scores[fight_num] = leaderboard[key].current_score;
            fight_scoresObj[key] = fight_scores;
          }
          console.log(fight_scoresObj, 'fightscores object!!!!');
          Firebase.database().ref('/fight_scores/' + that.state.url + '/').update(fight_scoresObj);
        });
        if (!snapshot.val()) {
          for (let key in leaderboard) {
            var newObj = {};
            console.log(key, leaderboard[key]);
            var uid = leaderboard[key].uid;
            newObj[fight_num] = leaderboard[key].current_score;
            newObj["key"] = uid;
            fight_scoresObj[uid] = newObj;
          }
          //updates[] = fight_scoresObj;
          Firebase.database().ref('/fight_scores/' + that.state.url + '/').set(fight_scoresObj);
        }
        //console.log(fight_scoresObj, leaderboard, 'fightScores object!');
    });

    //console.log(leaderboard, 'LEADERBOARD');
    var updates = {};
    updates['/leaderboard/' + this.state.url + '/'] = leaderboard;
    updates['/users/' + this.state.url + '/'] = leaderboard;

    return Firebase.database().ref().update(updates);
  }

  render() {
    let tally = null;
    let setscore = null;
    let fight = null;
    if (this.state.console === "TALLY") {
      tally = <div>
        {this.state.scaffoldingFightList.map((item, i) => {
            return  <div key={i}>
                      <div>{item.key}</div>
                      <div>{item.red}vs{item.blue}</div>
                        <div className="form-group">
                          <label htmlFor="winner">Winner</label>
                          <select className="form-control select-center" name="winner" id={item.key} onChange={this.handleFightSubmit}>
                              <option value="" disabled>--SELECT WINNER--</option>
                              <option value={item.red}>{item.red}</option>
                              <option value={item.blue}>{item.blue}</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="method">Method</label>
                          <select className="form-control select-center" name="method" id={item.key} onChange={this.handleFightSubmit}>
                              <option value="" disabled>--SELECT METHOD--</option>
                              <option value="KNOCKOUT">KNOCKOUT</option>
                              <option value="SUBMISSION">SUBMISSION</option>
                              <option value="DECISION">DECISION</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="method">Round</label>
                          <select className="form-control select-center" name="round" id={item.key} onChange={this.handleFightSubmit}>
                              <option value="" disabled>--SELECT ROUND--</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="method">Fight Key</label>
                          <select className="form-control select-center" name="key" id={item.key} onChange={this.handleFightSubmit}>
                              <option value={item.key}>{item.key}</option>
                          </select>
                        </div>
                        <button id={item.key} className="btn btn-secondary" onClick={this.handleSubmit}>Submit</button>
                    </div>
        })}
      </div>

      setscore =  <div>
                    <h5>Get Scores</h5>
                    <button className="btn btn-secondary" onClick={this.handleGetScores}>Get Scores</button>
                      <h5>Get Results</h5>
                      <button className="btn btn-secondary" onClick={this.handleGetResults}>Get Results</button>
                        <h5>Get Picks</h5>
                        <button className="btn btn-secondary" onClick={this.handleGetPicks}>Get Picks</button>
                          <h5>Calc Scores</h5>
                          <button className="btn btn-secondary" onClick={this.handleCalcScores}>Calc Scores</button>
                  </div>
  }
    else {
      tally = null;
      setscore = null;
    }
    if (this.state.console === "FIGHTING") {
      fight = <div>
                <h2>{this.state.fight_num}</h2>
                <h4>Calculate Fight Percentages</h4>
                <button className="btn btn-secondary" onClick={this.handleCalcPercentages}>Calc Fight %</button>
              </div>
    }

    return (
      <div className="row">
          <div className="jumbotron jumbotron-fluid jumbo-short-stack">
            <div className="container">
              <h1 className="display-4">Controller</h1>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-block login card-outline-secondary opaque-card">
              <div className="form-group">
                <label htmlFor="eventURL">eventURL</label>
                  <select className="form-control select-center" name="event_url" onChange={this.eventURLController.bind(this)}>
                      <option value="">--SELECT EVENT--</option>
                      <option value="ufc-fight-night-104">UFC FN 104</option>
                      <option value="ufc-on-fox-23">UFC ON FOX 23</option>
                      <option value="ufc-fight-night-103">UFC FN 103</option>
                  </select>
              </div>
              <div className="form-group">
                <label htmlFor="controllerSelect">Fight Status</label>
                <select className="form-control select-center" name="fight_status" onChange={this.fightStatusController.bind(this)}>
                    <option value="">--SELECT FIGHT STATUS--</option>
                    <option value="PRE">PRE-FIGHT</option>
                    <option value="INTERMISSION">INTERMISSION</option>
                    <option value="FIGHTING">FIGHT</option>
                    <option value="TABULATING">TABULATING</option>
                    <option value="TALLY">TALLY</option>
                    <option value="POST">POST-FIGHT</option>
                </select>
              </div>
              <button className="btn btn-secondary" onClick={this.handleStatus}>Set Fight Status</button>
              <div className="form-group">
                <label htmlFor="controllerSelect">Round</label>
                <select className="form-control select-center" name="round" onChange={this.roundController.bind(this)}>
                    <option value="">--SELECT CURRENT ROUND--</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
              </div>
              <button className="btn btn-secondary" onClick={this.handleRound}>Set Round</button>
              <div className="form-group">
                <label htmlFor="controllerSelect">Fight Num</label>
                <input name="fight_num" type="text" onChange={this.fightNumController.bind(this)}/>
              </div>
              <button className="btn btn-secondary" onClick={this.handleFightNum}>Set Fight Num</button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-block login card-outline-secondary opaque-card">
                {tally}
                {fight}
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-block login card-outline-secondary opaque-card">
                <h5>Winner</h5>
                <h6>{this.state.winner}</h6>
                <h5>Method</h5>
                <h6>{this.state.method}</h6>
                <h5>Round</h5>
                <h6>{this.state.round}</h6>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-block login card-outline-secondary opaque-card">
                {setscore}
            </div>
          </div>
    </div>
    );
  }
}

export default Controller;
