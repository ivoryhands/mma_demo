import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import { insert, moduleController } from '../classes/insert.js';
import LiveConsole from './LiveConsole.jsx';
import PickPercentage from './PickPercentage.jsx';

class Fight extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fighter_pick: '',
      round_pick: '',
      method_pick: ''
    };
  //  console.log('uid', this.props.uid);

  }
  componentDidMount() {
    this.getPick();
  }
  getPick() {
    var that = this;
    console.log(this.props.uid, this.props.fight_pointer, this.props.event_url, 'props');
    return Firebase.database().ref('/picks/' + this.props.uid+'/'+this.props.event_url+'/'+this.props.fight_pointer).once('value').then(function(snapshot) {
      console.log(snapshot.val(), 'snappers');
      var picks = snapshot.val();
      if (picks.winner === picks.blue) {
        var color_pick = "blue";
      }
      if (picks.winner === picks.red) {
        var color_pick = "red";
      }
      console.log(color_pick, 'color pick');
      that.setState({fighter_pick: snapshot.val().fighter, round_pick: snapshot.val().round, method_pick: snapshot.val().method, color: snapshot.val().winner});

      //Submit Pick to stats

      var postRef = Firebase.database().ref('stats/'+that.props.event_url+'/'+that.props.fight_pointer+'/');
      postRef.transaction(function(post) {
        console.log('post stats', that.props.event_url, that.props.fight_pointer, that.props.uid);
        if (post) {
          var uid = that.props.uid;
          switch (color_pick) {
            case "red":
              if (post.users[uid] === 'red') {
                console.log('red pick already in db');
                break;
              }
              else if (post.users[uid] === 'blue'){
                console.log('blue pick already in db, switch to red');
                post.red++;
                post.blue--;
                post.users = {};
                post.users[uid] = 'red';
                break;
              }
              else {
                console.log('increase red vote');
                post.red++;
                post.users = {};
                post.users[uid] = 'red';
                break;
              }
            case "blue":
              if (post.users[uid] === 'blue') {
                console.log('blue pick already in db');
                break;
              }
              else if (post.users[uid] === 'red'){
                console.log('red pick already in db, switch to blue');
                post.blue++;
                post.red--;
                post.users = {};
                post.users[uid] = 'blue';
                break;
              }
              else {
                console.log('increase blue vote');
                post.blue++;
                post.users = {};
                post.users[uid] = 'blue';
                break;
              }
          }
        }
        return post;
      });

    });


  }
  render () {
    let liveConsole = null;
    let pickPercentageRed = null;
    let pickPercentageBlue = null;
    const redFighter =  <FighterButton onChange={this.handleRedFighter} fighterClass={this.state.btn_red_fighter_select} name={this.props.red_fighter_fullName} color={this.state.fighter_color_pick}/>;
    const blueFighter =  <FighterButton onChange={this.handleBlueFighter} fighterClass={this.state.btn_blue_fighter_select} name={this.props.blue_fighter_fullName} color={this.state.fighter_color_pick}/>;

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
      liveConsole = <LiveConsole
                      uid={this.props.uid}
                      event_url={this.props.event_url}
                    />
      let red = "red";
      pickPercentageRed = <PickPercentage
                          fight_pointer={this.props.fight_pointer}
                          event_url={this.props.event_url}
                          uid={this.props.uid}
                          color={red}
        />
      let blue = "blue";
      pickPercentageBlue = <PickPercentage
                          fight_pointer={this.props.fight_pointer}
                          event_url={this.props.event_url}
                          uid={this.props.uid}
                          color={blue}
        />
    }

    return (

      <div className ="compcontainer bg-cover">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2">
          <h4><small>Fight {Number(this.props.fight_pointer)+1}</small></h4>
        </nav>
        <div>
            <div className="row below-second-nav">
                <div className="col-md-1 col-sm-1"></div>
                <div className="col-md-10 col-sm-10">
                  {liveConsole}
                  <div className="row">

                      <h4 className="center-element white-text margin-bot">Fight In Progress...</h4>
                    <div className="col-sm-6">
                      <div className="card blank outline">
                        <div className="card-block">
                          <div className="center-element">
                            <h3 className="card-title no-bot-margin">{this.props.red_fighter_firstName}</h3>
                            <h1 className="card-title">{this.props.red_fighter_lastName}</h1>
                            {pickPercentageRed}
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="card blank outline">
                        <div className="card-block">
                          <div className="clearfix">
                            <div className="center-element">
                              <h3 className="card-title no-bot-margin">{this.props.blue_fighter_firstName}</h3>
                              <h1 className="card-title">{this.props.blue_fighter_lastName}</h1>
                              {pickPercentageBlue}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="center-element">
                      <h2 className="playTitle">Round {this.props.round}</h2>
                      <h5 className="playTitle">Your Pick</h5>
                      <h2 className="playTitle">{str}</h2>

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

export default Fight = connect(mapStateToProps)(Fight);



function FighterButton(props) {
  return (
    <button className={props.fighterClass} onClick={props.onChange} name={props.name} value={props.color}>SELECT</button>
  );
}
