import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import firebase, { firebaseRef } from '../../../firebase';
import * as actions from '../data/actions';
import * as helpers from '../data/helpers';
import store from '../../store';

/* Firebase References */
let headers;
let rawData;

const regRef = firebaseRef.child('registrations');

axios({
  method: 'get',
  url: 'https://cors-anywhere.herokuapp.com/http://balastoff.dancecamps.org/api.php?token=aa8cb508a33d&format=json&report=registration',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
}).then((response) => {
  headers = response.data.header;
  rawData = response.data.data;

  const object = {};
  _.forEach(rawData, (data) => {
    // console.log("************");
    object[data[1]] = {};
    _.forEach(headers, (header, headerIndex) => {
      // console.log("Header", header);
      // console.log("Data", data[headerIndex]);
      object[data[1]][header] = data[headerIndex];
      object[data[1]].CheckedIn = false;
      object[data[1]].HasComments = false;
      object[data[1]].Shirt1 = false;
      object[data[1]].Shirt2 = false;
      object[data[1]].Patch = false;

      // Handle Paid entries
      if (data[5] === '0.00') {
        object[data[1]].HasPaid = true;
      } else {
        object[data[1]].HasPaid = false;
      }

      // Handle Level Check
      if (data[16] === 'Gemini' || data[16] === 'Apollo' || data[16] === 'Skylab') {
        object[data[1]].HasLevelCheck = 'Yes';
      } else {
        object[data[1]].HasLevelCheck = 'No';
      }

      // check for gear
      object[data[1]].HasGear = (data[40] || data[42] || data[44]) ? 'Yes' : 'No';
    });
  });
  regRef.set(object);
}).catch((error) => {
  console.log(error);
});


/* Fetch Registrations from firebase and set them to the redux store */
export function fetchRegistrations() {
  regRef.on('value', (snapshot) => {
    const registrations = snapshot.val();
    const sortedRegistrations = helpers.sortRegistrations(registrations);
    store.dispatch(actions.registrationsReceived(sortedRegistrations));
  });
}

export function fetchTracks() {
  firebaseRef.child('Tracks').on('value', (snapshot) => {
    const tracks = snapshot.val();
    store.dispatch(actions.tracksReceived(tracks));
  });
}

// Updates to registrations

export function updateRegistration(bookingID, object) {
  regRef.child(bookingID).update(object);
}
