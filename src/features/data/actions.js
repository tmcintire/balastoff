export const START_FETCHING_REGISTRATIONS = 'START_FETCHING_REGISTRATIONS';
export const INITIALIZED = 'INITIALIZED';

export const initialized = () => ({
  type: INITIALIZED,
});

export function registrationsReceived(registrations) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_REGISTRATIONS' });
    dispatch({
      type: 'RECEIVED_REGISTRATIONS',
      registrations,
    });
  };
}

export function partnersReceived(partners) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_PARTNERS' });
    dispatch({
      type: 'RECEIVED_PARTNERS',
      partners,
    });
  };
}

export function tracksReceived(tracks) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_TRACKS' });
    dispatch({
      type: 'RECEIVED_TRACKS',
      tracks,
    });
  };
}

export function configReceived(config) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_CONFIG' });
    dispatch({
      type: 'RECEIVED_CONFIG',
      config,
    });
  };
}

export function fieldsReceived(fields) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_FIELDS' });
    dispatch({
      type: 'RECEIVED_FIELDS',
      fields,
    });
  };
}

export function passesReceived(passes) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_PASSES' });
    dispatch({
      type: 'RECEIVED_PASSES',
      passes,
    });
  };
}

export function compsReceived(comps) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_COMPS' });
    dispatch({
      type: 'RECEIVED_COMPS',
      comps,
    });
  };
}

export function storeReceived(store) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_STORE' });
    dispatch({
      type: 'RECEIVED_STORE',
      store,
    });
  };
}

export function dancesReceived(dances) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_DANCES' });
    dispatch({
      type: 'RECEIVED_DANCES',
      dances,
    });
  };
}

export function pricesReceived(prices) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_PRICES' });
    dispatch({
      type: 'RECEIVED_PRICES',
      prices,
    });
  };
}

export function moneyLogReceived(log) {
  return function (dispatch) { // eslint-disable-line
    dispatch({ type: 'START_FETCHING_MONEY_LOG' });
    dispatch({
      type: 'RECEIVED_MONEY_LOG',
      log,
    });
  };
}

export function updateAmateurComp(bookingID, amateur, amateurPartner) {
  return function (dispatch) { // eslint-disable-line
    dispatch({
      type: 'UPDATED_AMATEUR_COMP',
      amateur,
      amateurPartner,
    });
  };
}

export function updateCheckBox(bookingID, checked) {
  return function (dispatch) { // eslint-disable-line
    dispatch({
      type: 'CHECKBOX_UPDATED',
      bookingID,
      checked,
    });
  };
}

export function updatePaidCheckBox(bookingID, checked) {
  return function (dispatch) { // eslint-disable-line
    dispatch({
      type: 'PAID_CHECKBOX_UPDATED',
      bookingID,
      checked,
    });
  };
}

export function totalCollectedReceived(totalCollected) {
  return function (dispatch) {
    dispatch({
      type: 'TOTAL_COLLECTED_RECEIVED',
      totalCollected,
    });
  };
}

export function setConnectionState(state) {
  return function (dispatch) {
    dispatch({
      type: 'SETTING_CONNECTION_STATE',
      state,
    });
  };
}
