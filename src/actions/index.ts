import { MESSAGES, INCOMING_MESSAGES, SELECT_CLIENT,
         INCOMING_MESSAGES_FOR_SELECTED_CLIENT,
         SELECTED_CLIENT_UPDATE, ASSIGNED_USER, CLIENT_DATA,
         SELECTED_CLIENT_GET_INFO
       } from '../constants/inbox';
import { TEAMMATE } from '../constants/teammates';
import { CHANNELS, CHANNEL } from '../constants/channels';
import { AUTH } from '../constants/auth';

const authInvite = (payload: any) => ({
  type: AUTH.INVITE,
  payload,
});

const authSignIn = (payload: any) => ({
  type: AUTH.SIGNIN,
  payload,
});

const authSignUp = (payload: any) => ({
  type: AUTH.SIGNUP,
  payload,
});

const addMessage = (message: any) => ({
  type: MESSAGES.ADD,
  message
});

const getClientInfo = (payload: any) => ({
  type: SELECTED_CLIENT_GET_INFO,
  payload
});

const addToInboxIncomingMessage = (payload: any) => ({
  type: INCOMING_MESSAGES.ADD_TO_INBOX,
  payload,
});

const fetchIncomingMessages = (incomingMessage: any) => ({
  type: INCOMING_MESSAGES.FETCH,
  incomingMessage
});

const updateAssignedUser = (incomingMessage: any) => ({
  type: ASSIGNED_USER.UPDATE,
  incomingMessage
});

const updateClientData = (payload: any) => ({
  type: CLIENT_DATA.UPDATE,
  payload,
});

const addIncomingMessage = (incomingMessage: any) => ({
  type: INCOMING_MESSAGES.ADD,
  incomingMessage
});

const selectClient = (client: any) => ({
  type: SELECT_CLIENT,
  client
});

const addTeammate = (teammate: any) => ({
  type: TEAMMATE.ADD,
  teammate
});

const deleteTeammate = (teammate: any) => ({
  type: TEAMMATE.DELETE,
  teammate
});

const assignTeammate = (payload: any) => ({
  type: TEAMMATE.ASSIGN,
  payload
});

const addIncomingMessageForSelectedClient = (incomingMessage: any) => ({
  type: INCOMING_MESSAGES_FOR_SELECTED_CLIENT.ADD,
  incomingMessage
});

const updateIncomingMessage = (payload: any) => ({
  type: INCOMING_MESSAGES.UPDATE,
  payload
});

const updateSelectedClient = (payload: any) => ({
  type: SELECTED_CLIENT_UPDATE,
  payload
});

const fetchChannels = (payload: any) => ({
  type: CHANNELS.FETCH,
  payload
});

const addChannels = (payload: any) => ({
  type: CHANNELS.ADD,
  payload
});

const addChannel = (payload: any) => ({
  type: CHANNEL.ADD,
  payload
});

const updateChannelSettings = (payload: any) => ({
  type: CHANNELS.UPDATE_SETTINGS,
  payload
});

const fetchTeammates = (payload: any) => ({
  type: TEAMMATE.FETCH,
  payload
});

export {
  authInvite,
  authSignIn,
  authSignUp,

  addMessage,
  addIncomingMessage,
  selectClient,
  addIncomingMessageForSelectedClient,
  updateIncomingMessage,
  updateSelectedClient,
  fetchIncomingMessages,
  updateAssignedUser,
  updateClientData,
  addToInboxIncomingMessage,
  getClientInfo,

  fetchChannels,
  addChannel,
  addChannels,
  updateChannelSettings,

  fetchTeammates,
  addTeammate,
  deleteTeammate,
  assignTeammate,
}