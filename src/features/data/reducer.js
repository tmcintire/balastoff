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
    case 'UPDATED_AMATEUR_COMP':
      return {
        ...state,
        registrations: state.registrations.map(registration =>
          registration.BookingID === action.bookingID ? { ...registration,
            'Amateur Couples': action.amateur,
            'Amateur Parter': action.partner,
          } : registration),
      }
    case 'RECEIVED_PARTNERS':
      return {
        ...state,
        partners: action.partners,
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

export const prices = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_PRICES':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_PRICES':
      return {
        ...state,
        prices: action.prices,
        loading: false,
      };
    default:
      return state;
  }
};

export const totalCollected = (state = [], action) => {
  switch (action.type) {
    case 'TOTAL_COLLECTED_RECEIVED':
      return {
        ...state,
        totalCollected: action.totalCollected,
      };
    default:
      return state;
  }
};


export default combineReducers({
  registrations,
  tracks,
  totalCollected,
  prices,
});
