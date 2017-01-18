import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import Intermission from './Intermission.jsx';
import Fight from './Fight.jsx';
import Tally from './Tally.jsx';



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

    };
    /*  Get Event from URL
    *   @params event_url = event URL from props
    *   @params event_url_split = parse event key
    */
    var event_url = this.props.params.splat;
    var event_url_split = event_url.split('/');

      this.eventStartListener(event_url_split[0]);



      /*  Listen for Tally Changes from Firebase
      *   @params tallyListener
      */
      this.tallyListener(event_url_split[0]);

      /*  Listen for Controller Changes from Firebase
      *   @params eventStartListener
      */



  }

  tallyListener(url) {

    localStorage.setItem('tally', 'false');
    //this.setState({tally: false});
    /*Firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var tallyStatusRef = Firebase.database().ref('users/' + url + '/' + user.uid);
        tallyStatusRef.on('value', function(snapshot) {
          console.log(snapshot.val());
          var tally = snapshot.val().tally;
          that.setState({tally: tally});
        });

      } else {
         //No user is signed in.
      }
    });*/

  }
  eventStartListener (url) {
    /*  Listen for Controller changes from Firebase and put into state
    *   @params controllerObj = holds current Controller Object from Firebase
    */
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
      //console.log(controllerObj, event.fight_num, 'internal promise');
      that.setState({controller: controllerObj, fight_pointer: event.fight_num, event_url: url});
      that.preEvent(url, event.fight_num);
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
      //console.log(snapshot.val());
      var event = snapshot.val();
      var first_fight = event.fights[fight_pointer];
      //console.log(first_fight, fight_pointer, 'first fight');
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
        event_url: event_url
      });
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

    //console.log(this.state.event_url, 'play event_url');
    let fight = null;
    let intermission = null;
    let tally = null;

    let user_tally = localStorage.getItem('tally');
    const fight_status = this.state.controller.fight_status;
    //console.log(fight_status, 'fightstatus');

    if (fight_status === "INTERMISSION" || user_tally === "false") {
      //INTERMISSION OR USERS TALLY = FALSE
        fight = null;
        intermission = <Intermission
                        red_fighter_fullName={this.state.red_fighter_fullName}
                        red_fighter_firstName={this.state.red_fighter_firstName}
                        red_fighter_lastName={this.state.red_fighter_lastName}
                        blue_fighter_fullName={this.state.blue_fighter_fullName}
                        blue_fighter_firstName={this.state.blue_fighter_firstName}
                        blue_fighter_lastName={this.state.blue_fighter_lastName}
                        event_url={this.state.event_url}
                        fight_pointer={this.state.fight_pointer}
                      />


    }

    if (fight_status === "FIGHTING") {
      //SET USER TALLY to true
        localStorage.setItem('tally', 'true');
        intermission = null;
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
                      />
    }
    if (fight_status === "TALLY" && user_tally === "true") {
      intermission = null;
      fight = null;
      tally = <Tally  fight_pointer={this.state.fight_pointer}
                      event_url={this.state.event_url}
              />
    }


    return (
        <div>
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
