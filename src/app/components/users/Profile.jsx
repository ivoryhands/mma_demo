import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as Actions from '../../actions/index.js';
import Firebase from 'firebase';

class Profile extends Component {
  constructor(props) {
        super(props);
        this.state = { progressBar: "0%"};
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
                  displayName: formValues.displayname,
                  photoURL: downloadURL
                })
                .then(function () {
                  that.props.updateProfile(formValues);
                });
              }
          });
      }
    );
  }

  render() {
    const { handleSubmit } = this.props;
    console.log(this.props.photoURL, 'profile photo');
    return (
      <div className="row">
          <div className="col-md-2 col-sm-1"></div>
          <div className="col-md-8 col-sm-10">
              <div className="profile-top">
                <div className="profile-image-parent">
                  <img src={this.props.photoURL}/>
                </div>
                <h2>{this.props.email}</h2>
              </div>
              <div className="card card-block login">
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                  <div className="form-group">
                    <label htmlFor="displayname">Display Name</label>
                    <Field name="displayname" placeholder={this.props.displayName} className="form-control" component="input" type="text"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="file">Profile Image</label>
                    <Field name="file" className="form-control" component="input" type="file"/>
                  </div>
                  <button type="submit" className="btn btn-default">Submit</button>
                </form>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{width: this.state.progressBar}}>{this.state.progressBar}</div>
              </div>
          </div>

          <div className="col-md-2 col-sm-1"></div>
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


// Decorate the form component
Profile = reduxForm({
  form: 'profile' // a unique name for this form
})(Profile);
export default Profile = connect(mapStateToProps, Actions)(Profile);
