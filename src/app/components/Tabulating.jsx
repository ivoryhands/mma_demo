import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import LiveConsole from './LiveConsole.jsx';
import PlayerConsole from './PlayerConsole.jsx';

class Tabulating extends Component {
  constructor (props) {
    super(props);
    

    this.state = {
      event: '',
      current_fight: '',
      all_fights: [],
      fight_pointer: this.props.fight_pointer,
      red_fighter_firstName: '',
      red_fighter_lastName: '',
      blue_fighter_firstName: '',
      blue_fighter_lastName: '',
      division: '',
      total_rounds: '',
      fighter_color_pick: '',
      fighter_pick: false,
      fighter_pick_name: '',
      method_pick: false,
      method_pick_name: '',
      round_pick: false,
      round_pick_name: '',
      round_select: '',
      btn_tko_active: 'blocks',
      btn_sub_active: 'blocks',
      btn_dec_active: 'blocks',
      btn_round_1: 'blocks-round',
      btn_red_fighter_select: 'blocks-fighter btn-block no-margin-left',
      btn_blue_fighter_select: 'blocks-fighter btn-block no-margin-left',
      final_pick_class: 'playTitle center-element',
      header_text: 'Waiting for Results',
      disabled_round_btn: false,
      event_url : '',
      controller: ''
    };
  }
  componentDidMount() {
    console.log(this.props, 'TABULATING PROPS');
    //this.myPick();
  }
  myPick() {
    //console.log(this.props.uid_props, this.props.event_url, this.props.fight_pointer);

  }



  render () {
    if (!this.props.uid) {
      return <div>Loading Module...</div>
    }

    let method = null;
    let round = null;
    let liveConsole = null;
    let playerConsole = null;
    const method_pick = this.state.fighter_pick;

    if (method_pick) {
      method =  <MethodButton
                  onChangeMethod={this.handleMethod}
                  round1Class={this.state.btn_round_1}
                  onChangeRound={this.handleRound}
                  tkoClass={this.state.btn_tko_active}
                  subClass={this.state.btn_sub_active}
                  decClass={this.state.btn_dec_active}
                  disabled={this.state.disabled_round_btn}
                />;
    } else {
      method = null;
    }
    if (this.props.event_url) {
      liveConsole = <LiveConsole
                      uid={this.props.uid}
                      event_url={this.props.event_url}
                      photos={this.props.photos}
                      event_status={this.props.event_status}
                      fight_status={this.props.fight_status}
                    />

      const status = "INTERMISSION";
      const controllerTally = false;
      playerConsole = <PlayerConsole
                        round={this.props.round}
                        status={status}
                        fight_score={this.state.fight_score}
                        controllerTally={controllerTally}
                        currentScore={this.props.currentScore}
                      />
    }


    const round_pick = this.state.round_pick;
    const fighter_pick = this.state.fighter_pick;

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


    var finalPick = <FinalPick str={str} />

    return (

      <div className ="compcontainer bg-cover animated fadeIn">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2">
          <h4><small>{this.state.header_text}</small></h4>
        </nav>
        <div>
            <div className="row below-second-nav">
                <div className="col-md-1 col-sm-1"></div>
                <div className="col-md-10 col-sm-10">
                  {liveConsole}

                  <div className="row">
                    {playerConsole}
                  </div>


                        <div className="spinner">
                          <div className="rect1"></div>
                          <div className="rect2"></div>
                          <div className="rect3"></div>
                          <div className="rect4"></div>
                          <div className="rect5"></div>
                        </div>

                        <h4 className="center-element white-text margin-bot">Compiling Results and Scores...</h4>

                        <div className="card-block">
                          <div className="col-md-5"><h1 className="center-element white-text card-title">{this.props.red_fighter_fullName}</h1></div>
                          <div className="col-md-2">
                            <h1 className="center-element white-text card-title">VS</h1>
                          </div>
                          <div className="col-md-5"><h1 className="center-element white-text card-title">{this.props.blue_fighter_fullName}</h1></div>
                        </div>

                </div>
                <div className="col-md-1 col-sm-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10 no-padding-left-right">

                <div className="col-sm-12">
                  <div className="card blank outline">
                    <div className="card blank no-margin-bottom">
                      <div className="fight-title"><h5 className="center-element black-text">Your Pick</h5></div>
                      <div className="card-block">
                        <div className="center-element">
                            {finalPick}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="card blank outline">
                    <div className="card blank no-margin-bottom">
                      <div className="fight-title"><h5 className="center-element black-text">Rounds</h5></div>
                      <div className="card-block">
                        <div className="center-element">
                            <h2 className="playTitle"><small>{this.props.total_rounds}</small></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
              <div className="col-md-1"></div>


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

export default Tabulating = connect(mapStateToProps)(Tabulating);

function FinalPick(props) {
  return (
            <h2 className="playTitle"><small>{props.str}</small></h2>
          );
}
