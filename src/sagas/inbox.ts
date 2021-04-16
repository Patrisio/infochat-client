import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import {
  getTeammates, incomingMessagesFetch, assignedUserUpdate,
  selectedClientUpdate, messageToInboxAdd, selectedClientInfoGet,
} from '../api';

function* fetchIncomingMessages(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.incomingMessage.successCallback;
    const incomingMessage = yield call(incomingMessagesFetch, action.incomingMessage);

    if (successCallback) {
      successCallback(incomingMessage);
    }

    yield put({
      type: 'ADD_INCOMING_MESSAGES',
      incomingMessage,
    });
  } catch (e) {
    yield put({
      type: 'INCOMING_MESSAGES_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* updateAssignedUser(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.incomingMessage.successCallback;

    yield call(assignedUserUpdate, action.incomingMessage);
    
    if (successCallback) {
      yield successCallback();
    }
  } catch (e) {
    yield put({
      type: 'UPDATE_ASSIGNED_USER_FAILED',
      message: e.message,
    });
  }
}

function* updateSelectedClient(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.payload.successCallback;

    yield call(selectedClientUpdate, action.payload);
    if (successCallback) {
      yield successCallback();
    }
  } catch (e) {
    yield put({
      type: 'UPDATE_SELECTED_CLIENT_USER_FAILED',
      message: e.message,
    });
  }
}

function* addMessageToInbox(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.payload.successCallback;

    yield call(messageToInboxAdd, action.payload);

    if (successCallback) {
      yield successCallback();
    }
  } catch (e) {
    yield put({
      type: 'ADD_TO_INBOX_INCOMING_MESSAGES_FAILED',
      message: e.message,
    });
  }
}

function* getSelectedClientInfo(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.payload.successCallback;

    const clientInfo = yield call(selectedClientInfoGet, action.payload);

    if (successCallback) {
      yield successCallback(clientInfo);
    }
  } catch (e) {
    yield put({
      type: 'GET_SELECTED_CLIENT_INFO_FAILED',
      message: e.message,
    });
  }
}

function* watchFetchMessagesHistoryByProject(): Generator<StrictEffect> {
  yield takeEvery('FETCH_INCOMING_MESSAGES', fetchIncomingMessages);
}

function* watchUpdateAssignedUser(): Generator<StrictEffect> {
  yield takeEvery('ASSIGNED_USER_UPDATE', updateAssignedUser);
}

function* watchUpdateSelectedClient(): Generator<StrictEffect> {
  yield takeEvery('CLIENT_DATA_UPDATE', updateSelectedClient);
}

function* watchAddMessageToInbox(): Generator<StrictEffect> {
  yield takeEvery('ADD_TO_INBOX_INCOMING_MESSAGE', addMessageToInbox);
}

function* watchGetInfoForSelectedClient(): Generator<StrictEffect> {
  yield takeEvery('SELECTED_CLIENT_GET_INFO', getSelectedClientInfo);
}

export default [
  watchFetchMessagesHistoryByProject(),,
  watchUpdateAssignedUser(),
  watchUpdateSelectedClient(),
  watchAddMessageToInbox(),
  watchGetInfoForSelectedClient(),
];