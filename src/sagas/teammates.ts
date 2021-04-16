import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { getTeammates, teammateAdd, sendEmail, removeTeammate } from '../api';

function* fetchTeammates(action: any): Generator<StrictEffect> {
  try {
    const user = yield call(getTeammates, action.payload.projectId);
    yield put({
      type: 'TEAMMATES_ADD',
      teammate: user
    });
  } catch (e) {
    yield put({
      type: 'TEAMMATES_ADD_FAILED',
      message: e.message
    });
  }
}

function* addTeammate(action: any): Generator<StrictEffect> {
  try {
    const { email, projectId, role, status, username } = action.teammate;

    yield call(teammateAdd, { email, projectId, role, status, username });
    yield call(sendEmail, { email, projectId });
  } catch (e) {
    yield put({
      type: 'TEAMMATE_ADD_FAILED',
      message: e.message
    });
  }
}

function* deleteTeammate(action: any): Generator<StrictEffect> {
  try {
    yield call(removeTeammate, action.teammate);
  } catch (e) {
    yield put({
      type: 'DELETE_TEAMMATE_FAILED',
      message: e.message
    });
  }
}

function* watchFetchTeammates(): Generator<StrictEffect> {
  yield takeEvery('TEAMMATE_FETCH', fetchTeammates);
}

function* watchAddTeammate(): Generator<StrictEffect> {
  yield takeEvery('TEAMMATE_ADD', addTeammate);
}

function* watchDeleteTeammate(): Generator<StrictEffect> {
  yield takeEvery('TEAMMATE_DELETE', deleteTeammate);
}

export default [
  watchFetchTeammates(),
  watchAddTeammate(),
  watchDeleteTeammate(),
];