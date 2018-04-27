import axios from 'axios';
import _ from 'lodash';
import firebase, { firebaseRef } from '../../../firebase';
import * as actions from '../data/actions';
import store from '../../store';

/* Firebase References */
let headers;
let rawData;

let lastBookingId = 0;

const regRef = firebaseRef.child('registrations');
const development = true;

if (development === true) {
  axios({
    method: 'get',
    url: 'https://cors-anywhere.herokuapp.com/http://balastoff.dancecamps.org/api.php?token=67905e25c961&format=json&report=RegistrationApp',
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
        object[data[1]].LevelChecked = false;
        object[data[1]].BadgeUpdated = false;
        object[data[1]].MissedLevelCheck = false;
        object[data[1]].MissionGearIssues = [];
        object[data[1]].Comments = [];
        object[data[1]]['Original Amount Owed'] = data[5];
        object[data[1]].OriginalLevel = data[18];
        object[data[1]].WalkIn = false;

        // Handle Paid entries
        if (data[5] === '0.00') {
          object[data[1]].HasPaid = true;
        } else {
          object[data[1]].HasPaid = false;
        }

        // Handle Level Check
        object[data[1]].HasLevelCheck = data[18] === 'Gemini' || data[18] === 'Apollo' || data[18] === 'Skylab';


        let level;
        switch (data[18]) {
          case 'Beginner':
            level = 'Beginner';
            break;
          case 'Mercury':
            level = 'Intermediate';
            break;
          case 'Gemini':
            level = 'Intermediate-Advanced';
            break;
          case 'Apollo':
            level = 'Advanced';
            break;
          case 'Skylab':
            level = 'Advanced-Plus';
            break;
          case 'SpaceX':
            level = 'Invitational';
            break;
          case 'DancePass':
            level = 'Dance Pass';
            break;
          default:
            return;
        }

        object[data[1]].Level = {
          name: data[18],
          level,
        };

        // check for gear
        object[data[1]].HasGear = (data[45] || data[48]) ? 'Yes' : 'No';
      });
    });

    // Setup partners
    _.forEach(object, (r) => {
      if (r) {
        let registrationToUpdate = [];
        let first;
        let last;
        if (r.Open === 'Yes' && r.Partner !== '') {
          first = r.Partner.split(' ')[0].toLowerCase() || 'TBD';
          last = r.Partner.split(' ')[1].toLowerCase() || 'TBD';
          registrationToUpdate = _.find(object, reg =>
            reg['First Name'].toLowerCase() === first && reg['Last Name'].toLowerCase() === last);

          if (!_.isEmpty(registrationToUpdate)) {
            registrationToUpdate.Open = 'Yes';
            registrationToUpdate.Partner = `${r['First Name']} ${r['Last Name']}`;
          }
        }
        if (r['Amateur Couples'] === 'Yes' && r['Amateur Partner'] !== '') {
          first = r['Amateur Partner'].split(' ')[0];
          last = r['Amateur Partner'].split(' ')[1];
          registrationToUpdate = _.find(object, (reg) => {
            if (!first) {
              first = 'TBD';
            }
            if (!last) {
              last = 'TBD';
            }
            return reg['First Name'].toLowerCase() === first.toLowerCase() && reg['Last Name'].toLowerCase() === last.toLowerCase();
          });

          if (!_.isEmpty(registrationToUpdate)) {
            registrationToUpdate['Amateur Couples'] = 'Yes';
            registrationToUpdate['Amateur Partner'] = `${r['First Name']} ${r['Last Name']}`;
          }
        }
      }
    });

    regRef.set(object);
  }).catch((error) => {
    console.log(error);
  });
}

export function setupConnectionListener() {
  const connectedRef = firebase.database().ref('.info/connected');
  connectedRef.on('value', (snap) => {
    store.dispatch(actions.setConnectionState(snap.val()));
  });
}
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

export function fetchConfig() {
  firebaseRef.child('config').on('value', (snapshot) => {
    const config = snapshot.val();
    store.dispatch(actions.configReceived(config));
  });
}

export function fetchTracks() {
  firebaseRef.child('Tracks').on('value', (snapshot) => {
    const tracks = snapshot.val();
    store.dispatch(actions.tracksReceived(tracks));
  });
}

export function fetchPasses() {
  firebaseRef.child('Passes').on('value', (snapshot) => {
    const passes = snapshot.val();
    store.dispatch(actions.passesReceived(passes));
  });
}

export function fetchDances() {
  firebaseRef.child('Dances').on('value', (snapshot) => {
    const dances = snapshot.val();
    store.dispatch(actions.dancesReceived(dances));
  });
}

export function fetchComps() {
  firebaseRef.child('Comps').on('value', (snapshot) => {
    const comps = snapshot.val();
    store.dispatch(actions.compsReceived(comps));
  });
}

export function fetchStore() {
  firebaseRef.child('Store').on('value', (snapshot) => {
    const storeItem = snapshot.val();
    store.dispatch(actions.storeReceived(storeItem));
  });
}


export function fetchPrices() {
  firebaseRef.child('prices').on('value', (snapshot) => {
    const prices = snapshot.val();
    store.dispatch(actions.pricesReceived(prices));
  });
}

export function fetchMoneyLog() {
  firebaseRef.child('moneyLog').on('value', (snapshot) => {
    const log = snapshot.val();
    store.dispatch(actions.moneyLogReceived(log));
  });
}


export function getTotalCollected() {
  firebaseRef.child('totalCollected').on('value', (snapshot) => {
    const totalCollected = snapshot.val();
    if (totalCollected === null) {
      firebaseRef.child('totalCollected').set(0).then(() => {
        store.dispatch(actions.totalCollectedReceived(totalCollected));
      });
    } else {
      store.dispatch(actions.totalCollectedReceived(totalCollected));
    }
  });
}

// Updates to registrations

export function updateRegistration(bookingID, object) {
  return new Promise((resolve) => {
    regRef.child(bookingID).update(object).then(() => {
      resolve();
    });
  });
}

export function addRegistration(id, object) {
  return new Promise((resolve) => {
    regRef.child(id).set(object).then(() => {
      resolve();
    });
  });
}

export function updateTotalCollected(amount) {
  firebaseRef.child('totalCollected').once('value').then((res) => {
    const amountToUpdate = res.val() + parseInt(amount, 10);
    firebaseRef.child('totalCollected').set(amountToUpdate);
  });
}

export function updateMoneyLog(log) {
  const key = firebaseRef.child('moneyLog').push().key;
  firebaseRef.child('moneyLog').child(key).update(log);

  this.updateTotalCollected(log.amount);
}

export const getLastBookingId = () => lastBookingId;

export function update(child, index, data, isUpdate, nextIndex) {
  if (isUpdate) {
    firebaseRef.child(child).child(index).update(data);
  } else {
    firebaseRef.child(child).child(nextIndex).set(data);
  }
}

export function updateConfig(value) {
  firebaseRef.child('config').update(value);
}

export function deleteRef(child, index) {
  firebaseRef.child(child).child(index).remove();
}

export function voidTransaction(id, initials) {
  firebaseRef.child('moneyLog').child(id).update({ status: 'Voided', initials });
}

export function updateStoreItemCount(id, newCount) {
  firebaseRef.child('Store').child(id).update({ count: newCount });
}
