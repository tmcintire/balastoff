import { takeEvery } from 'redux-saga';
import { call } from 'redux-saga/effects';
import * as actions from './actions';
import * as api from './api';


function* initialize() {
  // yield call(helpers.getUser);
  yield call(api.fetchRegistrations, 1);
  yield call(api.fetchDances, 1);
  yield call(api.fetchTracks, 1);
  yield call(api.fetchConfig, 1);
  yield call(api.fetchStore, 1);
  yield call(api.fetchComps, 1);
  yield call(api.fetchAdminFields, 1);
  yield call(api.getTotalCollected, 1);
  yield call(api.fetchPasses, 1);
  yield call(api.fetchMoneyLog, 1);
  yield call(api.setupConnectionListener, 1);
}

export default function* saga() {
  yield* takeEvery(actions.INITIALIZED, initialize);
}
