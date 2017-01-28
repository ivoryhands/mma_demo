import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import { Line, Circle } from 'rc-progress';


class PickPercentage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      percent: 0,
      color: '#EE543A',
      redCount: '',
      blueCount: ''
    };
  }
  componentDidMount() {
    this.getStats();
  }

  getStats () {
    var that = this;
    var pickCountRef = Firebase.database().ref('stats/' + this.props.event_url + '/' + this.props.fight_pointer);
    pickCountRef.on('value', function(snapshot) {
      console.log(snapshot.val(), 'getStats');
      that.setState({redCount: snapshot.val().red, blueCount: snapshot.val().blue});
    });
  }
  render () {
    //const total = this.state.redCount + this.state.blueCount;
    const containerStyle = {
     width: '150px',
    };
    const circleContainerStyle = {
     width: '150px',
     height: '150px',
    };
    let percent = 0;
    var red = parseInt(this.state.redCount);
    var blue = parseInt(this.state.blueCount);
    var total = blue + red;
    if (this.props.color === "red") {
      percent = Math.round(red/total * 100);
      //this.setState=({ percent:percent });
    }
    if (this.props.color === "blue") {
      percent = Math.round(blue/total * 100);
      //this.setState=({ percent:percent });
    }

    return (

          <div className="margin-auto center-element circle-wrapper" style={circleContainerStyle}>
            <Circle
              percent={percent}
              strokeWidth="2"
              strokeLinecap="square"
              strokeColor={this.state.color}
            />
          <h5>Picked by Players</h5>
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

export default PickPercentage = connect(mapStateToProps)(PickPercentage);
