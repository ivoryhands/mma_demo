import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as Actions from '../../actions/index.js';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: true
    };
  }
  componentDidMount() {
    if (this.props.authenticationError) {
      this.setState({error: false});
    }
    else {
      this.setState({error: true});
    }
  }
  handleFormSubmit(formValues){
    //console.log(formValues);
    this.setState({error: true});
    this.props.signInUser(formValues);
  }
  render() {
    const { handleSubmit } = this.props;

    let auth_message = null;
    if (this.props.authenticationError) {
      auth_message =  <AuthMessage
                        authenticationError = {this.props.authenticationError}
                        errorFlag = {this.state.error}
                      />
    }
    else {
      auth_message = null;
    }

    return (
      <div className ="compcontainer bg-cover">
        <nav className="navbar fixed-top second-navbar center-element drop-shadow2 slideRight">
          <h4><small>Sign In</small></h4>
        </nav>
      <div className="row below-second-nav">

          <div className="col-md-2 col-sm-1"></div>
          <div className="col-md-8 col-sm-10">
            <div className="card blank outline login slideUp">
              <div className="card-block">
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" className="form-control-black" component="input" type="text"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field name="password" className="form-control-black" component="input" type="password"/>
                  </div>
                  <button type="submit" className="blocks-full">Submit</button>
                </form>
                { auth_message }
              </div>
            </div>

          </div>

          <div className="col-md-2 col-sm-1"></div>
    </div>
    </div>

    );
  }
}

function mapStateToProps(state) {
  return {
    authenticationError: state.auth.error
  }
}

SignIn = reduxForm({
  form: 'login'
})(SignIn);
export default SignIn = connect(mapStateToProps, Actions)(SignIn);

function AuthMessage(props) {
  let auth_msg = null;
  //console.log(props, 'auth message props');
  if (props.errorFlag) {
    auth_msg = <div className="alert alert-danger authorize">{ props.authenticationError }</div>
  }
  else {
    auth_msg = null;
  }
  return (
    <div>{auth_msg}</div>
  );
}
