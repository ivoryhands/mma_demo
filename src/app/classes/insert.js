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

export function currentFightNum () {
  var controllerRef = Firebase.database().ref('controller/' + postId + '/starCount');
  starCountRef.on('value', function(snapshot) {
    updateStarCount(postElement, snapshot.val());
  });
}

/*export function eventStartListener (url) {
  return new Promise (function (resolve) {
      var eventStatusRef = Firebase.database().ref('controller/events/' + url);
      eventStatusRef.on('value', function(snapshot) {
        var event = snapshot.val();
        var controllerObj = {
          event_status: event.event_status,
          fight_status: event.fight_status,
          round: event.round,
          fight_num: event.fight_num
        };
        resolve(controllerObj);
      });
  });
}*/
export function eventStartListener (url) {
  var eventStatusRef = Firebase.database().ref('controller/events/' + url);
  eventStatusRef.on('value', function(snapshot) {
    var event = snapshot.val();
    var controllerObj = {
      event_status: event.event_status,
      fight_status: event.fight_status,
      round: event.round,
      fight_num: event.fight_num
    };
    console.log(controllerObj, 'external promise');
    //moduleController(controllerObj);
  });
}

export function moduleController (Obj) {
  console.log(Obj, 'moduleController');

}
