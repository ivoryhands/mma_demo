import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import LiveGradient from './LiveGradient.jsx';
import Spinner from './Spinner.jsx';

class Events extends Component {
  constructor (props) {
    super(props);
    this.state = {
      events : [],
      eventsIsLoaded: false
    };

  }
  componentDidMount() {
    this.getEventList();
    console.log('mounted!');
  }
  getEventList() {
    /***********************************
    * GET LIST OF EVENTS FROM FIREBASE
    ***********************************/
    var ref = Firebase.database().ref('events/');
    var that = this;
    var events = [];
    ref.once('value', function (snapshot) {
      snapshot.forEach(function(data) {
        var event = data.val();
        var eventObj = {
                date: event.date,
                event_title: event.event_title,
                event_url: event.event_url,
                location: event.location,
                status: event.status,
                live: event.live
            };
        events.push(eventObj);
        events.sort(function(a,b){
          return  new Date(b.date) - new Date(a.date);
        });
        console.log('event loaded....');
        that.setState({events: events, eventsIsLoaded: true});
      });
    });
  }

  render() {
    if (!this.state.eventsIsLoaded) {
      return <Spinner />
    }
    return (
      <div className ="compcontainer">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2 slideRight">
          <h4><small>Events</small></h4>
        </nav>
        <div className="bg-cover">
          <div className="row below-second-nav">
            <div className="col-md-2 col-sm-1"></div>
            <div className="col-md-8 col-sm-10">

                {this.state.events.map((item, i) => {
                    return  <div className="card blank outline login slideUp" key={i}>
                              <div className="card-block" >
                                <div className="clearfix">
                                  <div className="float-left">
                                    <Link to ={ 'play/' + item.event_url }><h5>{item.event_title}</h5></Link>
                                    <h6 className="float:left">{item.date}</h6>
                                  </div>
                                  <div className="float-right">
                                    {item.live ?
                                      <LiveGradient /> :
                                      <div></div>}
                                  </div>
                                </div>
                              </div>
                            </div>
                })}

            </div>
            <div className="col-md-2 col-sm-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Events;
