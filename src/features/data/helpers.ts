import * as _ from 'lodash';
import { ILevels } from './interfaces';

export function sortRegistrations(registrations, filter) {
  return registrations.sort((a, b) => {
    let A;
    let B;
    if (filter === 'BookingID') {
      A = parseInt(a[filter], 10);
      B = parseInt(b[filter], 10);
    } else {
      A = a[filter].toLowerCase();
      B = b[filter].toLowerCase();
    }

    if (A < B) {
      return -1;
    }
    if (A > B) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}

export function sortTracks(data) {
  return data.sort((a, b) => {
    if (a.sortBy < b.sortBy) {
      return -1;
    }
    if (a.sortBy > b.sortBy) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}

export function checkMobile() {
  return window.innerWidth < 400 ? 'mobile-view' : '';
}

export function hasLevelCheck(level: string, levels: ILevels[]) {
  const lev = _.find(levels, t => t.name === level);
  return lev.levelCheck;
}