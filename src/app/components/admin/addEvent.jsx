import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions/index.js';
import Firebase from 'firebase';
//import fighterSearch from 'fighterSearch.jsx';

class addEvent extends Component {
  constructor(props) {
        super(props);
        this.state = {
          fights: [],
          red: '',
          blue: '',
          division: '',
          rounds: '',
          date: '',
          eventtitle: '',
          eventurl: '',
          location: '',
          submitted: false
        };
  }
  handleFormSubmit(formValues){
    formValues.preventDefault();
    var newFights = [];
    var curr = [];
    var oldfights =   {
                        red: this.state.red,
                        blue: this.state.blue,
                        division: this.state.division,
                        total_rounds: this.state.rounds,
                        status: '',
                        time: '',
                        round_finish: '',
                        method: '',
                        winner: ''
                      };
    var curr = this.state.fights;
    curr.push(oldfights);
    this.setState({fights: curr});
    this.setState({red: '', blue: '', division: '', rounds: ''});
  }
  addFight(e) {
    e.preventDefault();
    this.setState({[e.target.name] : e.target.value});
  }
  addDetails(e) {
    e.preventDefault();
    this.setState({[e.target.name] : e.target.value});
  }
  addEvent() {
    this.setState({submitted: true});
    console.log(this.state.fights, this.state.location, this.state.date, this.state.eventtitle, this.state.eventurl);
    function writeEventData(fights, location, date, eventtitle, eventurl) {
      var postData = {
        fights: fights,
        location: location,
        date: date,
        event_title: eventtitle,
        event_url: eventurl
      };
      var newPostKey = Firebase.database().ref().child('events').push().key;
      var updates = {};
      updates['/events/'+eventurl] = postData;
      return Firebase.database().ref().update(updates);
    }
    writeEventData(this.state.fights, this.state.location, this.state.date, this.state.eventtitle, this.state.eventurl);
    this.setState({fights: [], red: '', blue: '', division: '', date: '', eventtitle: '', eventurl: '', location: '', rounds: ''});
  }
  alertClose() {
    this.setState({submitted: false});
    console.log(this.state.submitted);
  }
  submission() {
    if (this.state.submitted) {
      return <div className="alert alert-success" role="alert">
        <button type="button" className="close" aria-label="Close" onClick={this.alertClose.bind(this)}>
          <span aria-hidden="true">&times;</span>
        </button>
        <strong>Event Created!</strong> Your submission was successful.
      </div>
    }
    else {
      return <div></div>
    }
  }
  render() {
    return (
      <div className="row">
          <div className="jumbotron jumbotron-fluid jumbo-short-stack">
            <div className="container">
              <h1 className="display-4">addEvent</h1>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-block login card-outline-secondary opaque-card">
              <form>
                <div className="form-group">
                  <label htmlFor="eventtitle">Event Title</label>
                  <input name="eventtitle" className="form-control" type="text" onChange = {this.addDetails.bind(this)} value={this.state.eventtitle}/>
                </div>
                <div className="form-group">
                  <label htmlFor="eventurl">Event URL</label>
                  <input name="eventurl" className="form-control" type="text" onChange = {this.addDetails.bind(this)} value={this.state.eventurl}/>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input name="date" className="form-control" type="date" onChange = {this.addDetails.bind(this)} value={this.state.date}/>
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input name="location" className="form-control" type="text" onChange = {this.addDetails.bind(this)} value={this.state.location}/>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-block login card-outline-secondary opaque-card">
              <form onSubmit={this.handleFormSubmit.bind(this)}>
                <div className="form-group">
                  <label htmlFor="red">Red Corner</label>
                  <input name="red" className="form-control" type="text" onChange = {this.addFight.bind(this)} value = {this.state.red}/>
                </div>
                <div className="form-group">
                  <label htmlFor="blue">Blue Corner</label>
                  <input name="blue" className="form-control" type="text"  onChange = {this.addFight.bind(this)} value = {this.state.blue}/>
                </div>
                <div className="form-group">
                  <label htmlFor="division">Division</label>
                  <input name="division" className="form-control" type="text" onChange = {this.addFight.bind(this)} value = {this.state.division}/>
                </div>
                <div className="form-group">
                  <label htmlFor="rounds">Rounds</label>
                  <input name="rounds" className="form-control" type="text" onChange = {this.addFight.bind(this)} value = {this.state.rounds}/>
                </div>
                <button type="submit" className="btn btn-secondary float-xs-right"><i className="fa fa-plus" aria-hidden="true"></i> Fight</button>
              </form>
            </div>
          </div>
          <div className="col-md-6">

            <h4 className="login">Fights</h4>
            {this.submission()}
            {this.state.fights.map((item, i) => {
              return <ul className="list-group" key={i}> <li className="list-group-item">{item.red} vs. {item.blue} \ {item.division} \ {item.total_rounds} rounds<button type="button" className="btn btn-outline-danger btn-sm float-xs-right"><i className="fa fa-times" aria-hidden="true"></i></button></li></ul>
            })}

          </div>
          <button type="submit" className="btn btn-secondary" onClick={this.addEvent.bind(this)}>Submit</button>
    </div>
    );
  }
}


export default addEvent;
