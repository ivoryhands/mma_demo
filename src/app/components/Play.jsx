import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import { insert } from '../classes/insert.js'

class Play extends Component {
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
      fight_pointer: 0,
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
      event_url
    };
    var event_url = this.props.params.splat;
    console.log(event_url, 'eventurl');
    var event_url_split = event_url.split('/');
    console.log(event_url_split[1], 'event_url');
    this.preEvent(event_url);
    console.log(this.props, 'uid');
  }
  nameSplit(name) {
    this.name = name;
    var split = this.name.split(" ");
    return split;
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

  preEvent(event_url) {
    console.log('pre-event');
    var ref = Firebase.database().ref('events/'+event_url);
    var that = this;
    var events = [];
    ref.once('value', function (snapshot) {
      console.log(snapshot.val());
      var event = snapshot.val();
      var first_fight = event.fights[0];
      console.log(first_fight);
      var red_fighter = that.nameSplit(first_fight.red);
      var blue_fighter = that.nameSplit(first_fight.blue);
      that.setState({
        event: event,
        current_fight: first_fight,
        all_fights: event.fights,
        fight_pointer: 0,
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
  render () {
    const redFighter =  <FighterButton onChange={this.handleRedFighter} redFighterClass={this.state.btn_red_fighter_select} name={this.state.red_fighter_fullName} color={this.state.fighter_color_pick}/>;
    const blueFighter =  <FighterButton onChange={this.handleBlueFighter} redFighterClass={this.state.btn_blue_fighter_select} name={this.state.blue_fighter_fullName} color={this.state.fighter_color_pick}/>;
    let method = null;
    let round = null;
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

    const round_pick = this.state.round_pick;
    const fighter_pick = this.state.fighter_pick;

    if (round_pick && method_pick && fighter_pick) {
        insert(this.state.fighter_pick_name, this.state.method_pick_name, this.state.round_select, this.props.uid, this.state.event_url, this.state.current_fight, this.state.fighter_color_pick, this.state.fight_pointer);

        if (this.state.disabled_round_btn) {
          var str = this.state.fighter_pick_name +' via '+ this.state.method_pick_name;
        }
        else {
          var str = this.state.fighter_pick_name +' via '+ this.state.method_pick_name +' in Round '+ this.state.round_select;
        }

        var finalPick = <FinalPick className={this.state.final_pick_class} fighterPick={this.state.fighter_pick_name} methodPick={this.state.method_pick_name} roundPick={this.state.round_select} str={str}/>
    }

    return (

      <div className ="compcontainer bg-cover">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow">
          <h4><small>{this.state.header_text}</small></h4>
        </nav>
        <div>
            <div className="row below-second-nav">
                <div className="col-md-1 col-sm-1"></div>
                <div className="col-md-10 col-sm-10">
                  <div className="row">
                    <div className="spinner">
                      <div className="rect1"></div>
                      <div className="rect2"></div>
                      <div className="rect3"></div>
                      <div className="rect4"></div>
                      <div className="rect5"></div>
                    </div>
                      <h4 className="center-element white-text margin-bot">Waiting for the event to begin...</h4>

                    <div className="col-sm-6">
                      <div className="card blank outline">
                        <div className="card-block">
                          <div className="center-element">
                            <h3 className="card-title no-bot-margin">{this.state.red_fighter_firstName}</h3>
                            <h1 className="card-title">{this.state.red_fighter_lastName}</h1>
                          </div>
                            {redFighter}
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="card blank outline">
                        <div className="card-block">
                          <div className="clearfix">
                            <div className="center-element">
                              <h3 className="card-title no-bot-margin">{this.state.blue_fighter_firstName}</h3>
                              <h1 className="card-title">{this.state.blue_fighter_lastName}</h1>
                            </div>
                          </div>
                            {blueFighter}
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="row">
                        {method}
                        {finalPick}
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

export default Play = connect(mapStateToProps)(Play);

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
    <button className={props.redFighterClass} onClick={props.onChange} name={props.name} value={props.color}>SELECT</button>
  );
}

function FinalPick(props) {
  return (
      <div className="col-sm-6">
        <div className="card blank">
          <div className="card blank no-margin-bottom">
            <div className="card-block">
              <div className="center-element">
                  <h2 className="playTitle"><small>Your Pick</small></h2>
                  <h2 className={props.className}>{props.str}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
}
function PlaceHolder(props) {
  return (
    <h2></h2>
  );
}
