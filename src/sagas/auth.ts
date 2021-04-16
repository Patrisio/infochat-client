import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { inviteUser, signIn, signUp } from '../api';

function* authInvite(action: any): Generator<StrictEffect> {
  try {
    const { username, password, projectId, inviteId, successCallback } = action.payload;
    const data: any = yield call(inviteUser, { username, password, projectId, inviteId });
    
    successCallback(data);
  } catch (e) {
    yield put({
      type: 'AUTH_INVITE_FAILED',
      message: e.message,
    });
  }
}

function* authSignUp(action: any): Generator<StrictEffect> {
  try {
    const { email, password, successCallback } = action.payload;
    const data: any = yield call(signUp, action.payload);

    if (data.statusCode !== 400) {
      yield put({
        type: 'AUTH_SIGNIN',
        payload: { email, password, successCallback }
      });
    }
  } catch (e) {
    yield put({
      type: 'AUTH_SIGNUP_FAILED',
      message: e.message,
    });
  }
}

function* authSignIn(action: any): Generator<StrictEffect> {
  try {
    const { email, password, successCallback } = action.payload;
    const data: any = yield call(signIn, { email, password });
    
    if (data.statusCode !== 500) {
      successCallback(data);
    }
  } catch (e) {
    yield put({
      type: 'AUTH_SIGNIN_FAILED',
      message: e.message,
    });
  }
}

function* watchInvite(): Generator<StrictEffect> {
  yield takeEvery('AUTH_INVITE', authInvite);
}

function* watchSignIn(): Generator<StrictEffect> {
  yield takeEvery('AUTH_SIGNIN', authSignIn);
}

function* watchSignUp(): Generator<StrictEffect> {
  yield takeEvery('AUTH_SIGNUP', authSignUp);
}

export default [
  watchInvite(),
  watchSignIn(),
  watchSignUp(),
];