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

let lastBookingId = 0;

const regRef = firebaseRef.child('registrations');

// axios({
//   method: 'get',
//   url: 'https://cors-anywhere.herokuapp.com/http://balastoff.dancecamps.org/api.php?token=aa8cb508a33d&format=json&report=registration',
//   headers: { 'X-Requested-With': 'XMLHttpRequest' },
// }).then((response) => {
//   headers = response.data.header;
//   rawData = response.data.data;
//
//   const object = {};
//   _.forEach(rawData, (data) => {
//     // console.log("************");
//     object[data[1]] = {};
//     _.forEach(headers, (header, headerIndex) => {
//       // console.log("Header", header);
//       // console.log("Data", data[headerIndex]);
//       object[data[1]][header] = data[headerIndex];
//       object[data[1]].CheckedIn = false;
//       object[data[1]].HasComments = false;
//       object[data[1]].Shirt1 = false;
//       object[data[1]].Shirt2 = false;
//       object[data[1]].Patch = false;
//
//       // Handle Paid entries
//       if (data[5] === '0.00') {
//         object[data[1]].HasPaid = true;
//       } else {
//         object[data[1]].HasPaid = false;
//       }
//
//       // Handle Level Check
//       if (data[16] === 'Gemini' || data[16] === 'Apollo' || data[16] === 'Skylab') {
//         object[data[1]].HasLevelCheck = 'Yes';
//       } else {
//         object[data[1]].HasLevelCheck = 'No';
//       }
//
//       // check for gear
//       object[data[1]].HasGear = (data[40] || data[42] || data[44]) ? 'Yes' : 'No';
//     });
//   });
//
//   // Setup partners
//   _.forEach(object, (r) => {
//     if (r) {
//       let registrationToUpdate = [];
//       let first;
//       let last;
//       if (r.Open === 'Yes' && r.Partner !== '') {
//         first = r.Partner.split(' ')[0].toLowerCase() || 'TBD';
//         last = r.Partner.split(' ')[1].toLowerCase() || 'TBD';
//         registrationToUpdate = _.find(object, reg =>
//           reg['First Name'].toLowerCase() === first && reg['Last Name'].toLowerCase() === last);
//
//         if (!_.isEmpty(registrationToUpdate)) {
//           registrationToUpdate.Open = 'Yes';
//           registrationToUpdate.Partner = `${r['First Name']} ${r['Last Name']}`;
//         }
//       }
//       if (r['Amateur Couples'] === 'Yes' && r['Amateur Partner'] !== '') {
//         first = r['Amateur Partner'].split(' ')[0];
//         last = r['Amateur Partner'].split(' ')[1];
//         registrationToUpdate = _.find(object, (reg) => {
//           if (!first) {
//             first = 'TBD';
//           }
//           if (!last) {
//             last = 'TBD';
//           }
//           return reg['First Name'].toLowerCase() === first.toLowerCase() && reg['Last Name'].toLowerCase() === last.toLowerCase();
//         });
//
//         if (!_.isEmpty(registrationToUpdate)) {
//           registrationToUpdate['Amateur Couples'] = 'Yes';
//           registrationToUpdate['Amateur Partner'] = `${r['First Name']} ${r['Last Name']}`;
//         }
//       }
//     }
//   });
//
//   regRef.set(object);
// }).catch((error) => {
//   console.log(error);
// });

/* Fetch Registrations from firebase and set them to the redux store */
export function fetchRegistrations() {
  regRef.on('value', (snapshot) => {
    const registrations = snapshot.val();

    _.forEach(registrations, (r) => {
      if (r) {
        if (parseInt(r.BookingID, 10) > parseInt(lastBookingId, 10)) {
          lastBookingId = r.BookingID;
        }
      }
    });
    // const sortedRegistrations = helpers.sortRegistrations(registrations);
    store.dispatch(actions.registrationsReceived(registrations));
  });
}

function getPartners(registrations) {
  const updatedRegistrations = [];
  _.forEach(registrations, (r) => {
    if (r) {
      const first = r.Partner.split(' ')[0];
      const last = r.Partner.split(' ')[1];

      if (r.Open && r.Partner) {
        const registrationToUpdate = registrations.filter((reg) => {
          return reg['First Name'] === first && reg['Last Name'] === last;
        });

        registrationToUpdate.Open = 'Yes';
        registrationToUpdate.Partner = `${r['First Name']} ${r['Last Name']}`;
      }
      if (r['Amateur Couples'] && r['Amateur Partner']) {
        const registrationToUpdate = registrations.filter((reg) => {
          return reg['First Name'] === first && reg['Last Name'] === last;
        });

        const update = {
          'Amateur Couples': 'Yes',
          'Amateur Partner': `${r['First Name']} ${r['Last Name']}`,
        };

        if (registrationToUpdate.length !== 0) {
          updateRegistration(registrationToUpdate[0].BookingID, update);
        }
      }

      updatedRegistrations.push(registrationToUpdate);
    }
  });
  store.dispatch(actions.partnersReceived(partners));
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

export function addRegistration(id, object) {
  regRef.child(id).set(object);
}

export const getLastBookingId = () => lastBookingId;
