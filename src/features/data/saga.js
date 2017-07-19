import { takeEvery } from 'redux-saga';
import { call } from 'redux-saga/effects';
import * as actions from './actions';
import * as api from './api';


function* initialize() {
  // yield call(helpers.getUser);
  yield call(api.fetchRegistrations, 1);
  yield call(api.fetchTracks, 1);
}

export default function* saga() {
  yield* takeEvery(actions.INITIALIZED, initialize);
}
