import axios from 'axios';
import * as _ from "lodash";
import firebase, { firebaseRef } from '../../../firebase';
import * as actions from '../data/actions';
import store from '../../store';
import { IRegistration, Registration, IMoneyLogEntry, IStore, IMissionGearIssue } from './interfaces';

/* Firebase References */
let headers;
let rawData;

let lastBookingId = 0;

const regRef = firebaseRef.child('registrations');

firebaseRef.child('config').child('development').once('value').then((res) => {
  const development = res.val();

  if (development === true) {
    firebaseRef.child('Tracks').once('value').then((res) => {
      const tracks = res.val();
    
      axios({
        method: 'get',
        url: 'https://evening-headland-93756.herokuapp.com/http://balastoff.dancecamps.org/api.php?token=990a673570ef&format=json&report=RegistrationApp',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      }).then((response) => {
        headers = response.data.header;
        rawData = response.data.data;
    
        const object = {};
        _.forEach(rawData, (data) => {
          let registration = new Registration();
          registration.Comps = [];
          _.forEach(headers, (header, headerIndex) => {
            switch (header) {
              case 'BookingID':
                registration.BookingID = parseInt(data[headerIndex], 10);
                break;
              case 'US State':
                registration.USState = data[headerIndex];
                break;
              case 'Amount Owed':
                registration.AmountOwed = parseFloat(data[headerIndex]);
                registration.OriginalAmountOwed = parseFloat(data[headerIndex]);
                break;
              case 'Total Cost':
                registration.TotalCost = parseFloat(data[headerIndex]);
                break;
              case 'Paid':
                registration.Paid = parseFloat(data[headerIndex]);
                break;
              default:
                registration[header] = data[headerIndex];
                break;
            }

            registration.CheckedIn = false;
            registration.HasComments = false;
            registration.Shirt1 = false;
            registration.Shirt2 = false;
            registration.Patch = false;
            registration.LevelChecked = false;
            registration.BadgeUpdated = false;
            registration.MissedLevelCheck = false;
            registration.MissionGearIssues = [];
            registration.Comments = [];
            registration.OriginalLevel = data[18];
            registration.WalkIn = false;
            
            // Fix names with spaces
    
            // Setup Comps Object
            if (header === 'AdNov' && data[33] === 'Yes') {
              registration.Comps.push({
                name: 'AdNov Draw',
                key: header,
                role: data[34],
                partner: null,
              });
            } else if (header === 'Open' && data[35] === 'Yes') {
              registration.Comps.push({
                name: 'Open',
                key: header,
                role: null,
                partner: data[36],
              });
            } else if (header === 'ChallengerThrowdown' && data[37] === 'Yes') {
              registration.Comps.push({
                name: 'Challenger Throwdown',
                key: 'ChallengerThrowdown',
                role: null,
                partner: data[38],
              });
            } else if (header === 'AmateurDraw' && data[39] === 'Yes') {
              registration.Comps.push({
                name: 'Amateur Draw',
                key: header,
                role: data[40],
                partner: null,
              });
            }
    
            // Handle Paid entries -- Need to remove this and handle it just by checking the amount
            if (parseInt(data[5], 10) <= 0) {
              registration.HasPaid = true;
            } else {
              registration.HasPaid = false;
            }
    
            // Handle Level Check
            const foundTrack = _.find(tracks, track => track.name === data[18]);
            registration.HasLevelCheck = foundTrack ? foundTrack.levelCheck : false;
    
            // check for gear
            registration.HasGear = data[46] || data[49];

            // Handle all yes/no values
            if (data[headerIndex] === 'Yes' || data[headerIndex] === 'No') {
              registration[header] = data[headerIndex] === 'Yes';
            }
          });

          object[data[1]] = registration; // set the registration
        });
    
        // Setup partners
        _.forEach(object, (r: any) => {
          if (r) {
            let registrationToUpdate: any = [];
            let first;
            let last;
            if (r.Open === 'Yes' && r.Partner !== '') {
              first = r.Partner.split(' ')[0].toLowerCase() || 'TBD';
              last = r.Partner.split(' ')[1].toLowerCase() || 'TBD';
              registrationToUpdate = _.find(object, (reg: any) =>
                reg['First Name'].toLowerCase() === first && reg['Last Name'].toLowerCase() === last);
    
              if (!_.isEmpty(registrationToUpdate)) {
                registrationToUpdate.Open = 'Yes';
                registrationToUpdate.Partner = `${r['First Name']} ${r['Last Name']}`;
              }
            }
            if (r['Amateur Couples'] === 'Yes' && r['Amateur Partner'] !== '') {
              first = r['Amateur Partner'].split(' ')[0];
              last = r['Amateur Partner'].split(' ')[1];
              registrationToUpdate = _.find(object, (reg: any) => {
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
    });

    // Reset these values under development only
    firebaseRef.child('totalCollected').set(0);
    firebaseRef.child('moneyLog').remove();
    firebaseRef.child('MissionGearIssues').remove();
    firebaseRef.child('Store').once('value').then((snapshot) => {
      const storeItem = snapshot.val();
      _.forEach(storeItem, (item, key) => {
        firebaseRef.child('Store').child(key).update({ count: 0 });
      });
    });
  }
});

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
        if (parseInt(r.BookingID, 10) > lastBookingId) {
          lastBookingId = r.BookingID;
        }
      }
    });
    // const sortedRegistrations = helpers.sortRegistrations(registrations);
    store.dispatch(actions.registrationsReceived(registrations));
  });
}

export function subscribeToRegistration(id: string, callback: (registration: IRegistration) => void) {
  regRef.child(id).on('value', snapshot => {
    callback(snapshot.val());
  });
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

export function fetchMissionGearIssues() {
  firebaseRef.child('MissionGearIssues').on('value', (snapshot) => {
    const issues = snapshot.val();
    store.dispatch(actions.missionGearIssuesReceived(issues));
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

export function fetchAdminFields() {
  firebaseRef.child('Fields').orderByChild('sortOrder').on('value', snapshot => {
    const fields = snapshot.val();
    store.dispatch(actions.fieldsReceived(fields));
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

export function updateRegistration(bookingID: number, object: IRegistration) {
  return new Promise((resolve) => {
    regRef.child(bookingID.toString()).update(object).then(() => {
      resolve();
    });
  });
}

// Updates to comps on a registration
export function updateRegistrationComps(bookingID, comps) {
  return new Promise((resolve) => {
    regRef.child(bookingID).child('Comps').set(comps).then(() => {
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

export function updateMoneyLog(log: IMoneyLogEntry) {
  const key = firebaseRef.child('moneyLog').push().key;
  const date = new Date();
  log.date = date;
  firebaseRef.child('moneyLog').child(key).update(log);

  this.updateTotalCollected(log.amount);
}

export const getLastBookingId = (): number => lastBookingId;

export function update(child, index, data, isUpdate) {
  if (isUpdate) {
    firebaseRef.child(child).child(index).update(data);
  } else {
    const key = firebaseRef.child('Fields').push().key;
    firebaseRef.child(child).child(key).set(data);
  }
}

export function updateFields(data) {
  firebaseRef.child('Fields').set(data);
}

export function updateConfig(value) {
  firebaseRef.child('config').update(value);
}

export function deleteRef(child, index) {
  firebaseRef.child(child).child(index).remove();
}

export function voidTransaction(id, initials, reason) {
  firebaseRef.child('moneyLog').child(id).update({ void: true, initials, reason });
}

export function unvoidTransaction(id, initials, reason) {
  firebaseRef.child('moneyLog').child(id).update({ void: false, initials, reason });
}

export function updateStoreItemCount(newStoreCounts: IStore[]) {
  firebaseRef.child('Store').update(newStoreCounts);
}

export function backupRegistrations(level, leadFollow) {
  firebaseRef.child('registrations').once('value').then((res) => {
    const registrations = res.val();
    const string = `${level} ${leadFollow}`;
    const key = firebaseRef.child('backupRegistrations').push().key;
    registrations.label = string;
    registrations.date = new Date().toString();
    firebaseRef.child('backupRegistrations').child(key).set(registrations);
  });
}

export function reportMissionGearIssue(issue: IMissionGearIssue) {
  const key = firebaseRef.child('MissionGearIssues').push().key;
  firebaseRef.child('MissionGearIssues').child(key).set(issue);
}

export function editMissionGearIssue(id: string, issue: IMissionGearIssue) {
  firebaseRef.child('MissionGearIssues').child(id).update(issue);
}
