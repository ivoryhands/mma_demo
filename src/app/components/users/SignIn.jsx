import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as Actions from '../../actions/index.js';

class SignIn extends Component {
  handleFormSubmit(formValues){
    console.log(formValues);
    this.props.signInUser(formValues);
  }
  renderAuthenticationError() {
    if (this.props.authenticationError) {
      return <div className="alert alert-danger authorize">{ this.props.authenticationError }</div>;
    }
    return <div></div>;
  }

  render() {
    const { handleSubmit } = this.props;
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
                { this.renderAuthenticationError() }
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

// Decorate the form component
SignIn = reduxForm({
  form: 'login'
})(SignIn);
export default SignIn = connect(mapStateToProps, Actions)(SignIn);
