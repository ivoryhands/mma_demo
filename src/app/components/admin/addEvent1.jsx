import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as Actions from '../../actions/index.js';

class addEvent extends Component {
  constructor(props) {
        super(props);
        this.state = {inputs: [0]};
  }
  handleFormSubmit(formValues){
    console.log(formValues);
    //this.props.addEvent(formValues);
  }
  addFight() {
    var len = this.state.inputs.length;
    this.setState({inputs: this.state.inputs.concat(len)});
  }
  removeFight(item) {
    console.log(item);
    var input = this.state.inputs;
    console.log(input[item]);
    this.setState({inputs: input.splice(item, 1)});
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
              <div className="card card-block login card-outline-info">
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                  <div className="form-group">
                    <label htmlFor="eventtitle">Event Title</label>
                    <Field name="eventtitle" className="form-control" component="input" type="text"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <Field name="date" className="form-control" component="input" type="date"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <Field name="location" className="form-control" component="input" type="text"/>
                  </div>
                  {this.state.inputs.map(item => {
                    return (
                      <div key={item} className="card card-block card-outline-secondary">
                        <button type="submit" className="btn btn-outline-danger float-xs-right" onClick={ () => this.removeFight(item) }><i className="fa fa-times fa-2" aria-hidden="true"></i></button>
                        <h4>Fight {item+1}</h4>
                        <div className="form-group">
                          <label htmlFor="redcorner">Red Corner</label>
                          <Field name={ String(item)+"-red" } className="form-control" component="input" type="text"/>
                        </div>
                        <div className="form-group">
                          <label htmlFor="bluecorner">Blue Corner</label>
                          <Field name={ String(item)+"-blue" } className="form-control" component="input" type="text"/>
                        </div>
                        <div className="form-group">
                          <label htmlFor="division">Division</label>
                          <Field name={ String(item)+"-division" } className="form-control" component="input" type="text"/>
                        </div>
                      </div>
                    )
                  })}
                  <button type="submit" className="btn btn-secondary float-xs-right" onClick={ () => this.addFight() }><i className="fa fa-plus" aria-hidden="true"></i> Fight</button>
                  <br /><br />
                  <button type="submit" className="btn btn-outline-info">Submit</button>
                </form>
              </div>
          </div>
          <div className="col-md-3"></div>
    </div>
    );
  }
}

addEvent = reduxForm({
  form: 'addEvent' // a unique name for this form
})(addEvent);
export default addEvent = connect(null, Actions)(addEvent);
