import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as Actions from '../../actions/index.js';
import Firebase from 'firebase';
import Spinner from '../Spinner.jsx';

class Profile extends Component {
  constructor(props) {
        super(props);
        this.state = {
          progressBar: "0%",
          imageLoaded: false
        };

  }
  componentDidMount() {

  }
  handleImageLoaded() {
    console.log('imageloaded true!');
    this.setState({imageLoaded: true});
  }
  renderSpinner() {
    if (!this.state.imageLoaded) {
      return <div className="spinnerDots">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
              </div>
    }
    else {
      return null;
    }

  }
  getProfile() {
    var that = this;
    var user = Firebase.auth().currentUser;
    console.log(user, 'user is logged in.....');
    return <div className="profile-top">
              <div className="profile-image-parent">
                  {this.renderSpinner()}
                  <img src={user.photoURL} onLoad={this.handleImageLoaded.bind(this)}/>
                }
              </div>
              <h3 className="white-text">{user.email}</h3>
              <h2 className="white-text">{user.displayName}</h2>
            </div>


  }
  handleFormSubmit(formValues){
    const storageRef = Firebase.storage().ref();
    var that = this;
    var file = formValues.file[0];
    var storageURL = new Promise (function
      (resolve, reject) {
      var uploadTask = storageRef.child('images/' + file.name).put(file);
          uploadTask.on('state_changed', function(snapshot){
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            var str_progress = progress + '%';
            that.setState({ progressBar: str_progress });
            }, function(error) {
              // Handle unsuccessful uploads
            }, function() {
              var downloadURL = uploadTask.snapshot.downloadURL;
              var user = Firebase.auth().currentUser;
              if (user) {
                user.updateProfile({
                  photoURL: downloadURL
                })
                .then(function () {
                  Firebase.database().ref('pics/' + user.uid).set({
                     photoURL: downloadURL,
                     uid: user.uid
                   });
                  that.props.updateProfile(formValues);
                });
              }
          });
      }
    );
  }

  render() {
    const { handleSubmit } = this.props;
    //console.log(this.photoURL, 'profile state');

    return (
      <div className ="compcontainer bg-cover">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2 slideRight">
          <h4><small>Profile</small></h4>
        </nav>
      <div className="row below-second-nav">
          <div className="col-md-2 col-sm-1"></div>
          <div className="col-md-8 col-sm-10">
              {this.getProfile()}
              <div className="card blank outline login slideUp">
                <div className="card-block">
                  <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                    <div className="form-group">
                      <label htmlFor="file">Profile Image</label>
                      <Field name="file" className="form-control-black" component="input" type="file"/>
                    </div>
                    <button type="submit" className="blocks-full">Submit</button>
                  </form>
                </div>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{width: this.state.progressBar}}>{this.state.progressBar}</div>
              </div>
          </div>

          <div className="col-md-2 col-sm-1"></div>
      </div>
    </div>
    );
  }
}
function mapStateToProps (state) {
  return {
    email: state.user.email,
    displayName: state.user.displayName,
    photoURL: state.user.photoURL
  }
}

Profile = reduxForm({
  form: 'profile'
})(Profile);
export default Profile = connect(mapStateToProps, Actions)(Profile);
