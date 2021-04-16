import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { getChannels, channelAdd } from '../api';

function* fetchChannels(action: any): Generator<StrictEffect> {
  try {
    const channels = yield call(getChannels, action.payload.projectId);
    yield put({
      type: 'ADD_CHANNELS',
      channels,
    });
  } catch (e) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* addChannel(action: any): Generator<StrictEffect> {
  console.log(action);
  try {
    yield call(channelAdd, action.payload);
  } catch (e) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* watchFetchChannels(): Generator<StrictEffect> {
  yield takeEvery('FETCH_CHANNELS', fetchChannels);
}

function* watchAddChannel(): Generator<StrictEffect> {
  yield takeEvery('ADD_CHANNEL', addChannel);
}

export default [
  watchFetchChannels(),
  watchAddChannel(),
];