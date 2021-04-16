import { MESSAGES, INCOMING_MESSAGES, SELECT_CLIENT,
         INCOMING_MESSAGES_FOR_SELECTED_CLIENT,
         SELECTED_CLIENT_UPDATE
        } from '../constants/inbox';
import { TEAMMATE } from '../constants/teammates';

import cloneDeep from 'lodash/cloneDeep';

interface IMessagesHistory {
  message: string,
  clientId: string,
  username: string
}

interface IIncomingMessage {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assigned_to: string | null,
}

interface State {
  messages: IMessagesHistory[],
  incomingMessages: IIncomingMessage[],
  selectedClient: IIncomingMessage,
}

const initialState: State = {
  messages: [],
  incomingMessages: [],
  selectedClient: {
    id: '',
    projectId: '',
    clientId: '',
    messagesHistory: [],
    assigned_to: '',
  },
};

export const inboxReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case MESSAGES.ADD:
      const message: any = action.message;
      let newMessages: any;

      if (Array.isArray(message)) {
        newMessages = message;
      } else {
        newMessages = [message];
      }

      return {
        ...state,
        messages: [
          ...state.messages,
          ...newMessages
        ]
      };
    
    case INCOMING_MESSAGES.ADD:
      if (Array.isArray(action.incomingMessage)) {
        return cloneDeep({
          ...state,
          incomingMessages: action.incomingMessage
        });
      } else {
        const client = state.incomingMessages.find(incMsg => incMsg?.clientId === action.incomingMessage.clientId) as IIncomingMessage;
        const clientIndex = state.incomingMessages.findIndex(incMsg => incMsg.clientId === action.incomingMessage.clientId);
        const isNewClient = !client;

        if (isNewClient) {
          return {
            ...state,
            incomingMessages: [
              ...state.incomingMessages,
              action.incomingMessage
            ]
          };
        } else {
          const incomingMessagesCopy = cloneDeep(state.incomingMessages);
  
          client?.messagesHistory.push(...action.incomingMessage.messagesHistory);
          incomingMessagesCopy.splice(clientIndex, 1, client);
          
          return cloneDeep({
            ...state,
            incomingMessages: incomingMessagesCopy
          });
        }
      }

    case INCOMING_MESSAGES_FOR_SELECTED_CLIENT.ADD:
      if (action.incomingMessage.clientId === state.selectedClient.clientId) {
        const messagesHistory = state.selectedClient.messagesHistory;
        return { ...state, selectedClient: cloneDeep(Object.assign(state.selectedClient, { messagesHistory: [...messagesHistory, action.incomingMessage] })) };
      }

      return state;

    case SELECT_CLIENT:
      return { ...state, selectedClient: action.client };

    case SELECTED_CLIENT_UPDATE:
      return cloneDeep({ ...state, selectedClient: Object.assign(state.selectedClient, action.payload) });

    case INCOMING_MESSAGES.UPDATE:
      const client = state.incomingMessages.find(incMsg => incMsg?.clientId === action.payload.clientId) as IIncomingMessage;
      const clientIndex = state.incomingMessages.findIndex(incMsg => incMsg?.clientId === action.payload.clientId);

      // client.assigned_to = action.payload.assignedTo;
      const updatedClient = Object.assign(client, action.payload);

      state.incomingMessages.splice(clientIndex, 1, updatedClient);

      return {
        ...state,
        incomingMessages: state.incomingMessages
      };

    case TEAMMATE.ASSIGN:
      const incomingMessageIndex = state.incomingMessages.findIndex(incomingMessage => incomingMessage.clientId === action.payload.clientId);
      state.incomingMessages[incomingMessageIndex].assigned_to = action.payload.username;

      return {
        ...state,
        incomingMessages: state.incomingMessages,
        selectedClient: cloneDeep(Object.assign(state.selectedClient, { assigned_to: action.payload.username }))
      };
    
    default:
      return state;
  }
};