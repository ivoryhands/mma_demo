import React, { Component } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import LiveConsole from './LiveConsole.jsx';

class postEvent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allScores: []
    };
  }
  componentDidMount() {
    this.getLeaderboard();
  }
  getLeaderboard() {
    var usersRef = Firebase.database().ref('leaderboard/' + this.props.event_url);
    var that = this;

    usersRef.on('value', function (snapshot) {
      var scoresArr = [];
      var sortedScores = [];
      var photos = that.props.photos;
      snapshot.forEach(function (data) {
         var score = data.val();
         var count = 0;
         var flag = false;
         for (let x of photos) {
           if (x.uid === score.uid) {
             var photoURL = x.photoURL;
             flag = true;
           }
         }
         if (flag === true) {
           scoresArr.push([score.score, score.displayName, photoURL]);
           //console.log('true', score.score, score.displayName, photoURL);
         }
         if (flag === false) {
           scoresArr.push([score.score, score.displayName, 'https://firebasestorage.googleapis.com/v0/b/mma-live.appspot.com/o/images%2Fuser-icon.png?alt=media&token=e56eac00-f553-40dd-9252-e2bda3a34f23']);
           //console.log('false', score.score, score.displayName, 'default');
         }
         flag = false;
      });
      scoresArr.sort(function(a,b){
        return b[0] - a[0];
      });
      for (let x of scoresArr) {
        var newObj = {
          uid: x[1],
          score: x[0],
          photoURL: x[2]
        };
        //console.log(newObj, "NEW OBJ");
        sortedScores.push(newObj);
      }
      that.setState({allScores: sortedScores});
      //console.log(that.state.allScores);
    });
  }
  render () {
    //console.log(this.state.allScores, "STATE!!");
    //console.log(this.state.allScores, 'this is allscores');

    return (

      <div className ="compcontainer bg-cover animated fadeIn">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2">
          <h4><small>Event Over</small></h4>
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
                      <h4 className="center-element white-text margin-bot">Thanks for playing!</h4>
                  </div>
                </div>
                <div className="col-md-1 col-sm-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10">
                <div className="card blank outline">
                  <div className="card-block">
                    <div className="center-element">
                        <h1>Leaderboard</h1>
                        {this.state.allScores.map((item, i) => {
                          return  <div className="row " key={i}>
                                    <div className="col-md-2"></div>
                                    <div className="col-md-8">
                                      <div className="card-block lb-row">
                                        <div className="lb-rank"><h3>{i+1}</h3></div>
                                        <div className="lb-pic" style={{backgroundImage: 'url('+item.photoURL+')'}}></div>
                                        <div className="lb-name"><h4>{item.uid}</h4></div>
                                        <div className="lb-score"><h4>{item.score}</h4></div>
                                      </div>
                                    </div>
                                    <div className="col-md-2"></div>
                                  </div>
                        })}
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

export default postEvent = connect(mapStateToProps)(postEvent);
