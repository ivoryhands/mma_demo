import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as Actions from '../../actions/index.js';

class SignUp extends Component {
  handleFormSubmit(formValues){
    console.log(formValues);
    this.props.signUpUser(formValues);
  }
  renderAuthenticationError() {
    if (this.props.authenticationError) {
      return <div className="alert alert-danger">{ this.props.authenticationError }</div>;
    }
    return <div></div>;
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <div className="jumbotron jumbotron-fluid jumbo-short-stack no-bot-margin">
          <div className="container">
            <h1 className="display-4">SignUp</h1>
          </div>
        </div>
      <section className="bg-cover">
      <div className="content no-vert-align">
      <div className="row">

          <div className="col-md-2 col-sm-1"></div>
          <div className="col-md-8 col-sm-10">
              <div className="card card-block login">
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" className="form-control" component="input" type="text"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field name="password" className="form-control" component="input" type="password"/>
                  </div>
                  <button type="submit" className="btn btn-default">Submit</button>
                </form>
              </div>
          </div>
          { this.renderAuthenticationError() }
          <div className="col-md-2 col-sm-1"></div>
    </div>
    </div>
    </section>
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
SignUp = reduxForm({
  form: 'register' // a unique name for this form
})(SignUp);
export default SignUp = connect(mapStateToProps, Actions)(SignUp);

//export default connect(null, Actions)reduxForm({
//  form: 'login'
//})(Login);

//export default Login;
