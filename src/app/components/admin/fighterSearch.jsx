/*import React, { Component } from 'react';
import Firebase from 'firebase';

var ref = firebase.database().ref('events');

ref.on('value', function(snapshot) {
          var data = snapshot.val();
          that.setState({events: data }, function afterChange () {
             that.loadItems();
          });
        }, function(error) {
          console.error(error);
        });

class fighterSearch extends Component {
  constructor(props) {
    super(props);

    this.state={ term: '' };
  }
  render() {
    return (
      <div classname="fighter-search">
        <input value={this.state.term} onChange={event => this.setState({term: event.target.value})} />
      </div>
    );
  }
}

export default fighterSearch;*/
