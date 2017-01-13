import Firebase from 'firebase';

export function insert (fighter_pick,method_pick,round_pick,uid,event_url, current_fight, fighter_color_pick, fight_pointer) {
  var ref = Firebase.database().ref('mma-live');
  var postData={
    winner: fighter_color_pick,
    method: method_pick,
    round: round_pick
  };

  console.log(postData);
  function writeEventData(postData, fight_pointer, uid, event_url) {
    var newPostKey = Firebase.database().ref().child('picks').push().key;
    var updates = {};
    console.log(newPostKey);
    updates['/picks/'+uid+'/'+event_url+'/'+fight_pointer+'/'] = postData;
    return Firebase.database().ref().update(updates);
  }
  writeEventData(postData, fight_pointer, uid, event_url);
}
