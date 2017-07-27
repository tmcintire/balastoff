import _ from 'lodash';

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
