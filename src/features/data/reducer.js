import { combineReducers } from 'redux';

export const registrations = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_REGISTRATIONS':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_REGISTRATIONS':
      return {
        ...state,
        registrations: action.registrations,
        loading: false,
      };
    case 'CHECKBOX_UPDATED':
      return {
        ...state,
        registrations: state.registrations.map(registration =>
          registration.BookingID === action.bookingID ? { ...registration, CheckedIn: action.checked } : registration),
      };
    case 'PAID_CHECKBOX_UPDATED':
      return {
        ...state,
        registrations: state.registrations.map(registration =>
          registration.BookingID === action.bookingID ? { ...registration, HasPaid: action.checked } : registration),
      };
    default:
      return state;
  }
};

export const tracks = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_TRACKS':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_TRACKS':
      return {
        ...state,
        tracks: action.tracks,
        loading: false,
      };
    default:
      return state;
  }
};


export default combineReducers({
  registrations,
  tracks,
});
