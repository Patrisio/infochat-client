import { combineReducers } from 'redux';
import { channelsReducer } from './channels';
import { inboxReducer } from './inbox';
import { teammatesReducer } from './teammates';

export const rootReducer = combineReducers({
  inbox: inboxReducer,
  teammates: teammatesReducer,
  channels: channelsReducer,
});