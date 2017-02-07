import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import LiveConsole from './LiveConsole.jsx';
import PickPercentage from './PickPercentage.jsx';
import PlayerConsole from './PlayerConsole.jsx';

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
    var percentageRef = Firebase.database().ref('stats/'+ this.props.event_url + '/' + this.props.fight_pointer);
    percentageRef.on('value', function(snapshot) {
      that.setState({redPercent: snapshot.val().red, bluePercent: snapshot.val().blue});
    })
  }
  render () {
    let liveConsole = null;
    let playerConsole = null;
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
                      photos={this.props.photos}
                      event_status={this.props.event_status}
                      fight_status={this.props.fight_status}
                    />
      let red = "red";
      pickPercentageRed = <PickPercentage
                          fight_pointer={this.props.fight_pointer}
                          event_url={this.props.event_url}
                          uid={this.props.uid}
                          color={red}
                          redPercent={this.state.redPercent}
                          bluePercent={this.state.bluePercent}
        />
      let blue = "blue";
      pickPercentageBlue = <PickPercentage
                          fight_pointer={this.props.fight_pointer}
                          event_url={this.props.event_url}
                          uid={this.props.uid}
                          color={blue}
                          redPercent={this.state.redPercent}
                          bluePercent={this.state.bluePercent}
        />
      const status = "FIGHT IN PROGRESS";
      const controllerTally = false;
      playerConsole = <PlayerConsole
                        round={this.props.round}
                        status={status}
                        controllerTally={controllerTally}
                        currentScore={this.props.currentScore}

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
                      {playerConsole}
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

                    <div className="col-md-12">
                      <div className="card blank outline">
                        <div className="fight-title"><h5 className="center-element black-text">Your Pick</h5></div>
                        <div className="card-block">
                          <div className="center-element">
                            <h4>{str}</h4>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="card blank outline">
                        <div className="fight-title"><h5 className="center-element black-text">Round</h5></div>
                        <div className="card-block">
                          <div className="center-element">
                            <h4>{this.props.round}</h4>
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

export default Fight = connect(mapStateToProps)(Fight);



function FighterButton(props) {
  return (
    <button className={props.fighterClass} onClick={props.onChange} name={props.name} value={props.color}>SELECT</button>
  );
}
