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

export const issues = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_MISSION_GEAR_ISSUES':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_MISSION_GEAR_ISSUES':
      return {
        ...state,
        issues: action.issues,
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

export const moneyLog = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_MONEY_LOG':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_MONEY_LOG':
      return {
        ...state,
        moneyLog: action.log,
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

export const connectionState = (state = [], action) => {
  switch (action.type) {
    case 'SETTING_CONNECTION_STATE':
      return {
        ...state,
        state: action.state,
      };
    default:
      return state;
  }
};

export const passes = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_PASSES':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_PASSES':
      return {
        ...state,
        passes: action.passes,
        loading: false,
      };
    default:
      return state;
  }
};

export const config = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_CONFIG':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_CONFIG':
      return {
        ...state,
        config: action.config,
        loading: false,
      };
    default:
      return state;
  }
};

export const fields = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_FIELDS':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_FIELDS':
      return {
        ...state,
        fields: action.fields,
        loading: false,
      };
    default:
      return state;
  }
};

export const dances = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_DANCES':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_DANCES':
      return {
        ...state,
        dances: action.dances,
        loading: false,
      };
    default:
      return state;
  }
};

export const comps = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_COMPS':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_COMPS':
      return {
        ...state,
        comps: action.comps,
        loading: false,
      };
    default:
      return state;
  }
};

export const store = (state = [], action) => {
  switch (action.type) {
    case 'START_FETCHING_STORE':
      return {
        ...state,
        loading: true,
      };
    case 'RECEIVED_STORE':
      return {
        ...state,
        store: action.store,
        loading: false,
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
  moneyLog,
  connectionState,
  passes,
  config,
  dances,
  store,
  comps,
  fields,
  issues,
});
