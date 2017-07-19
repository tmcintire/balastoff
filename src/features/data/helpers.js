import _ from 'lodash';

export function sortRegistrations(registrations) {
  return registrations.sort((a, b) => {
    const nameA = a['Last Name'].toLowerCase();
    const nameB = b['Last Name'].toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}
