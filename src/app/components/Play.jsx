import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import Intermission from './Intermission.jsx';
import Fight from './Fight.jsx';
import Tally from './Tally.jsx';
import Spinner from './Spinner.jsx';
import PreEvent from './preEvent.jsx';


class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controller: '',
      event_url: '',
      tally: false,
      uidIsLoaded: false,
      preEventIsLoaded: false,
      eventStartListenerIsLoaded: false,
      fight_pick_name: '',
      currentScore: 0
    };
  }

  componentDidMount() {
    var event_url = this.props.params.splat;
    var event_url_split = event_url.split('/');
    this.eventStartListener(event_url_split[0]);
    this.tallyListener(event_url_split[0]);
    this.insertScoreStructure(event_url_split[0]);
    this.getPhotos(event_url_split[0]);
  }
  insertScoreStructure(url) {
    var d = new Date();
    var n = d.toString();
    var obj = {
      modifiedAt: n
    };
    Firebase.database().ref('users/' + this.props.uid + '/' + url).set(obj);
    this.currentScore(url);
  }
  currentScore(url) {
    var that = this;
    console.log(url, this.props.uid, 'preppin for score lookup');
    var scoreRef = Firebase.database().ref('users/' + this.props.uid + '/' + url);
    scoreRef.on('value', function(snapshot) {
      var score = snapshot.val();
      console.log(score, 'ooooo what is my SCORE?!?');
      that.setState({currentScore: score.score})
    });
  }
  insertVoteStructure(url, fight_pointer, uid, event_length) {
    var ref = Firebase.database().ref('stats/'+url);
    ref.once('value', function (snapshot) {
      var count = 0;
      snapshot.forEach(function (fights) {
        var fight = fights.val();
        if (fight.users[uid]) {
        }
        else {
          var key = uid;
          var obj = {};
          obj[key] = "";
          Firebase.database().ref('stats/' + url + '/' + count + '/' + 'users').set(obj);
        }
        count++;
      });
    });
  }
  tallyListener(url) {

    localStorage.setItem('tally', 'false');

  }
  eventStartListener (url) {
    /*  Listen for Controller changes from Firebase and put into state
    *   @params controllerObj = holds current Controller Object from Firebase
    */
    console.log('eventListener');
    var that = this;
    var controllerObj = {};
    var eventStatusRef = Firebase.database().ref('controller/events/' + url);
    eventStatusRef.on('value', function(snapshot) {
      var event = snapshot.val();
      var controllerObj = {
        event_status: event.event_status,
        fight_status: event.fight_status,
        round: event.round,
        fight_num: event.fight_num
      };
      const fightNumber = parseInt(event.fight_num) +1;
      that.setState({controller: controllerObj, fight_pointer: event.fight_num, event_url: url, fightNumber: fightNumber});
      that.preEvent(url, event.fight_num);
      that.getFightPick(event.fight_num, that.props.uid, url, event.fights);

    });
  }
  getFightPick(fight_pos, uid, url) {
    console.log('getFightPick', fight_pos, uid, url);
    var myPickRef = Firebase.database().ref('picks/'+uid+'/'+url+'/'+fight_pos);
    var that = this;
    myPickRef.on('value', function (snapshot) {
      var picks = snapshot.val();
      console.log(picks, 'picks');
      if (picks === null) {
        console.log('picks are nullll');
        that.setState({pickMade: false});
      }
      else {
        console.log('oh shit picks made!!', picks.winner, picks.method_pick, picks.round_pick);
        that.setState({fighter_pick_name: picks.winner, method_pick_name: picks.method_pick, round_pick_name: picks.round_pick, pickMade: true});
      }
    });
  }
  getPhotos(url) {
    console.log('getPhotos');
    var that = this;
    var photoRef = Firebase.database().ref('pics/');
    photoRef.once('value', function (snapshot) {
      var photosArr = [];
      snapshot.forEach(function (data) {
        var photos = data.val();
        var obj = {
          uid: photos.uid,
          photoURL: photos.photoURL
        };
        photosArr.push(obj);
      });
      console.log(photosArr, 'photos ARRAYU');
      that.setState({photos: photosArr})
    });
  }
  preEvent(event_url, fight_pointer) {
    /*  Get Event details i.e. fighters, date, title, etc. from Firebase and put into state
    *   @params events = holds event Obj
    *   @params red_fighter = fighter in the red corner
    *   @params blue_fighter = fighter in the blue corner
    *   @params division = division fighters are in
    *   @params total_round = rounds the fight is schedule for (3 or 5)
    */
    //console.log('pre-event');
    var ref = Firebase.database().ref('events/'+event_url);
    var that = this;
    var events = [];
    ref.once('value', function (snapshot) {
      var event = snapshot.val();
      var first_fight = event.fights[fight_pointer];
      var red_fighter = that.nameSplit(first_fight.red);
      var blue_fighter = that.nameSplit(first_fight.blue);
      that.setState({
        event: event,
        current_fight: first_fight,
        all_fights: event.fights,
        red_fighter_fullName: first_fight.red,
        blue_fighter_fullName: first_fight.blue,
        red_fighter_firstName: red_fighter[0],
        red_fighter_lastName: red_fighter[1],
        blue_fighter_firstName: blue_fighter[0],
        blue_fighter_lastName: blue_fighter[1],
        divison: first_fight.division,
        total_rounds: first_fight.total_rounds,
        event_url: event_url,
        event_title: event.event_title,
        event_date: event.date
      });
      that.insertVoteStructure(event_url, fight_pointer, that.props.uid, event.fights.length);
    });
  }
  nameSplit(name) {
    /*  Split fighter's name from Firebase into first and last name variables
    *   @params split = array containing first and last name of fighter
    */
    this.name = name;
    var split = this.name.split(" ");
    return split;
  }
  render () {
    if (!this.props.uid) {
      return <div>Loading User Information...</div>
    }
    //console.log(this.state.event_url, 'play event_url');
    let fight = null;
    let intermission = null;
    let tally = null;
    let preEvent = null;
    let postEvent = null;

    let user_tally = localStorage.getItem('tally');
    const fight_status = this.state.controller.fight_status;
    const event_status = this.state.controller.event_status;

    console.log(this.state.controller.event_status, event_status, 'event status');

    if (fight_status === "INTERMISSION" || user_tally === "false") {
      //INTERMISSION OR USERS TALLY = FALSE
        fight = null;
        //preEvent = null;
        if (this.props.uid && this.state.event_url && this.state.fightNumber && this.state.photos) {
          //console.log('reload intermission', this.state.fight_pointer);
          intermission = <Intermission
                        red_fighter_fullName={this.state.red_fighter_fullName}
                        red_fighter_firstName={this.state.red_fighter_firstName}
                        red_fighter_lastName={this.state.red_fighter_lastName}
                        blue_fighter_fullName={this.state.blue_fighter_fullName}
                        blue_fighter_firstName={this.state.blue_fighter_firstName}
                        blue_fighter_lastName={this.state.blue_fighter_lastName}
                        event_url={this.state.event_url}
                        fight_pointer={this.state.fight_pointer}
                        total_rounds={this.state.total_rounds}
                        fight_number={this.state.fightNumber}
                        uid_props={this.props.uid}
                        pickMade={this.state.pickMade}
                        pickFighter={this.state.fighter_pick_name}
                        pickMethod={this.state.method_pick_name}
                        pickRound={this.state.round_pick_name}
                        currentScore={this.state.currentScore}
                        event_title={this.state.event_title}
                        event_date={this.state.event_date}
                        photos={this.state.photos}
                      />
        }
        else {
          intermission = <Spinner />
        }
    }

    if (fight_status === "FIGHTING") {
      //SET USER TALLY to true
        localStorage.setItem('tally', 'true');
        intermission = null;
        //preEvent = null;

        if (this.props.uid && this.state.event_url && this.state.fightNumber && this.state.photos) {
          fight = <Fight
                    red_fighter_fullName={this.state.red_fighter_fullName}
                    red_fighter_firstName={this.state.red_fighter_firstName}
                    red_fighter_lastName={this.state.red_fighter_lastName}
                    blue_fighter_fullName={this.state.blue_fighter_fullName}
                    blue_fighter_firstName={this.state.blue_fighter_firstName}
                    blue_fighter_lastName={this.state.blue_fighter_lastName}
                    round={this.state.controller.round}
                    fight_pointer={this.state.fight_pointer}
                    event_url={this.state.event_url}
                    pickMade={this.state.pickMade}
                    pickFighter={this.state.fighter_pick_name}
                    pickMethod={this.state.method_pick_name}
                    pickRound={this.state.round_pick_name}
                    currentScore={this.state.currentScore}
                    event_title={this.state.event_title}
                    event_date={this.state.event_date}
                    photos={this.state.photos}
                  />
        }
        else {
          fight = <Spinner />
        }
    }
    if (fight_status === "TALLY" && user_tally === "true") {
      intermission = null;
      fight = null;
      //preEvent = null;

      tally = <Tally  red_fighter_fullName={this.state.red_fighter_fullName}
                      red_fighter_firstName={this.state.red_fighter_firstName}
                      red_fighter_lastName={this.state.red_fighter_lastName}
                      blue_fighter_fullName={this.state.blue_fighter_fullName}
                      blue_fighter_firstName={this.state.blue_fighter_firstName}
                      blue_fighter_lastName={this.state.blue_fighter_lastName}
                      round={this.state.controller.round}
                      fight_pointer={this.state.fight_pointer}
                      event_url={this.state.event_url}
                      pickMade={this.state.pickMade}
                      pickFighter={this.state.fighter_pick_name}
                      pickMethod={this.state.method_pick_name}
                      pickRound={this.state.round_pick_name}
                      currentScore={this.state.currentScore}
                      event_title={this.state.event_title}
                      event_date={this.state.event_date}
                      photos={this.state.photos}
              />
    }
    if (event_status === "PRE" && fight_status === "PRE") {

      intermission = null;
      fight = null;
      tally=null;
      
      if (this.props.uid && this.state.event_url && this.state.fightNumber && this.state.photos) {

        preEvent =    <PreEvent
                        photos={this.state.photos}
                        event_url={this.state.event_url}
                      />
      }
      else {
        preEvent = <Spinner />
      }

    }


    return (
        <div>
          {preEvent}
          {intermission}
          {fight}
          {tally}
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

export default Play = connect(mapStateToProps)(Play);
