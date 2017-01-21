import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import LiveConsole from './LiveConsole.jsx';
//import { insert, moduleController } from '../classes/insert.js'

class Intermission extends Component {
  constructor (props) {
    super(props);
    this.handleMethod = this.handleMethod.bind(this);
    this.handleRound = this.handleRound.bind(this);
    this.handleRedFighter = this.handleRedFighter.bind(this);
    this.handleBlueFighter = this.handleBlueFighter.bind(this);

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
      header_text: 'Make Your Selection',
      disabled_round_btn: false,
      event_url : '',
      controller: ''
    };
    console.log('intermission constructor');
  }
  componentDidMount() {
    //this.myPick();
  }
  myPick() {
    //console.log(this.props.uid_props, this.props.event_url, this.props.fight_pointer);

  }

  handleRound(props) {
    this.setState({round_pick: true});
    this.setState({ round_select: props.target.name });

  }
  handleMethod(props) {
    console.log(props.target.value);
    this.setState({method_pick: true, method_pick_name: props.target.value});
    if (props.target.value === "KNOCKOUT") {
      this.setState({ btn_tko_active: 'blocks active',
                      btn_sub_active: 'blocks',
                      btn_dec_active: 'blocks',
                      btn_round_1: 'blocks-round',
                      disabled_round_btn: false
                    });
    }
    if (props.target.value === "SUBMISSION") {
      this.setState({ btn_tko_active: 'blocks',
                      btn_sub_active: 'blocks active',
                      btn_dec_active: 'blocks',
                      btn_round_1: 'blocks-round',
                      disabled_round_btn: false
                    });
    }
    if (props.target.value === "DECISION") {
      this.setState({ btn_tko_active: 'blocks',
                      btn_sub_active: 'blocks',
                      btn_dec_active: 'blocks active',
                      btn_round_1: 'blocks-round disabled',
                      disabled_round_btn: true
                    });
    }
  }
  handleRedFighter(props) {
    console.log('redFighterSelect');
    this.setState({fighter_pick: true, fighter_pick_name: props.target.name, fighter_color_pick: 'red'});
    this.setState({ btn_red_fighter_select: 'blocks-fighter btn-block no-margin-left active',
                    btn_blue_fighter_select: 'blocks-fighter btn-block no-margin-left'
                  });
  }
  handleBlueFighter(props) {
    console.log('blueFighterSelect');
    this.setState({fighter_pick: true, fighter_pick_name: props.target.name, fighter_color_pick: 'blue'});
    this.setState({ btn_blue_fighter_select: 'blocks-fighter btn-block no-margin-left active',
                    btn_red_fighter_select: 'blocks-fighter btn-block no-margin-left'
                  });
  }

  render () {
    if (!this.props.uid) {
      return <div>Loading Module...</div>
    }
    const redFighter =  <FighterButton onChange={this.handleRedFighter} fighterClass={this.state.btn_red_fighter_select} name={this.props.red_fighter_fullName} color={this.state.fighter_color_pick}/>;
    const blueFighter =  <FighterButton onChange={this.handleBlueFighter} fighterClass={this.state.btn_blue_fighter_select} name={this.props.blue_fighter_fullName} color={this.state.fighter_color_pick}/>;
    let method = null;
    let round = null;
    let liveConsole = null;
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
                    <div className="spinner">
                      <div className="rect1"></div>
                      <div className="rect2"></div>
                      <div className="rect3"></div>
                      <div className="rect4"></div>
                      <div className="rect5"></div>
                    </div>
                      <h4 className="center-element white-text margin-bot">Waiting for the fight to begin...</h4>
                  </div>
                </div>
                <div className="col-md-1 col-sm-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10 card blank outline no-padding-left-right">
                <div className="fight-title"><h5 className="center-element black-text">FIGHT {this.props.fight_number}</h5></div>
                <div className="card-block">
                  <div className="col-md-5"><h1 className="center-element white-text card-title">{this.props.red_fighter_fullName}</h1></div>
                  <div className="col-md-2">
                    <h1 className="center-element white-text card-title">VS</h1>
                  </div>
                  <div className="col-md-5"><h1 className="center-element white-text card-title">{this.props.blue_fighter_fullName}</h1></div>
                </div>
              </div>
              <div className="col-md-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10 no-padding-left-right">

                <div className="col-sm-6 no-padding-left">
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

                <div className="col-sm-6 no-padding-right">
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

export default Intermission = connect(mapStateToProps)(Intermission);

function MethodButton(props) {
  console.log('method button');
  return (  <div className="col-sm-6">
              <div className="card blank outline">
                <div className="card blank no-margin-bottom">
                  <div className="card-block">
                    <div className="center-element">
                        <h2 className="playTitle">Method</h2>
                        <button className={props.tkoClass} name="TKO" value="KNOCKOUT" aria-pressed="true" onClick={props.onChangeMethod}>KNOCKOUT</button>
                        <button className={props.subClass} name="SUBMISSION" value="SUBMISSION" aria-pressed="true" onClick={props.onChangeMethod}>SUBMISSION</button>
                        <button className={props.decClass} name="DECISION" value="DECISION" aria-pressed="true" onClick={props.onChangeMethod}>DECISION</button>
                    </div>
                  </div>
                </div>
                <div className="card blank">
                  <div className="card-block no-pad-top">
                    <div className="center-element">
                        <h2 className="playTitle">Round</h2>
                        <button className={props.round1Class} name="1" aria-pressed="true" onClick={props.onChangeRound} disabled={props.disabled}>1</button>
                        <button className={props.round1Class} name="2" aria-pressed="true" onClick={props.onChangeRound} disabled={props.disabled}>2</button>
                        <button className={props.round1Class} name="3" aria-pressed="true" onClick={props.onChangeRound} disabled={props.disabled}>3</button>
                    </div>
                  </div>
                </div>
            </div>
          </div>
  );
}

function FighterButton(props) {
  return (
    <button className={props.fighterClass} onClick={props.onChange} name={props.name} value={props.color}>SELECT</button>
  );
}

function FinalPick(props) {
  return (
            <h2 className="playTitle"><small>{props.str}</small></h2>
          );
}
