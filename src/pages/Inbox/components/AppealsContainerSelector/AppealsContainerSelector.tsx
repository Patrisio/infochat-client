import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import styles from './appealsContainerSelector.module.scss';
import { selectClient } from '../../../../actions';
import cloneDeep from 'lodash/cloneDeep';
import Animal from '../../../../components/Animal/Animal';
import { getClientName } from '../../../../utils/clientData';
import { updateIncomingMessage, getClientInfo } from '../../../../actions';
import moment from 'moment';
import 'moment/locale/ru';

type IMessagesHistory = {
  message: string,
  clientId: string,
  username: string,
  timestamp: number,
};

type IIncomingMessage = {
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  avatarName: string,
  avatarColor: string,
  assigned_to: string | null,
};

interface RootState {
  inbox: {
    messages: IMessagesHistory[]
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage
  },
}

interface AppealsContainerSelectorProps {
  messages: IIncomingMessage[]
}

export default function AppealsContainerSelector({
  messages
}: AppealsContainerSelectorProps) {
  const incomingMessages = useSelector((state: RootState) => state.inbox.incomingMessages);
  const selectedClientId = useSelector((state: RootState) => state.inbox.selectedClient.clientId);
  const dispatch = useDispatch();
  let { projectId } = useParams<{projectId: string}>();

  const showClientMessages = (clientId: string) => {
    if (clientId !== selectedClientId) {
      const successCallback = (clientInfo: any) => {
        dispatch(updateIncomingMessage({
          clientId,
          assigned_to: clientInfo.assignedTo
        }));
        const selectedClient: IIncomingMessage | undefined = incomingMessages.find(message => message.clientId === clientId);
        dispatch(selectClient(cloneDeep(selectedClient)));
      };

      dispatch(getClientInfo({
        projectId,
        clientId,
        successCallback,
      }));
    }
  };

  const getLastUnreadMessagesCount = (incomingMessage: IIncomingMessage) => {
    let count = 0;

    for (let i = incomingMessage.messagesHistory.length - 1; i >= 0; i--) {
      const message = incomingMessage.messagesHistory[i];

      if (message.username === 'client') {
        count++;
      } else {
        break;
      }
    }

    return count;
  };
  
  const getLastMessage = (messagesHistory: IMessagesHistory[], clientName: string) => {
    const lastMessage = messagesHistory[messagesHistory.length - 1];
    const pureLastMessage = lastMessage.message.replace(/<[^>]*>?/gm, '');
    const username = lastMessage.username;

    return username === 'client' ? `<span class=${styles.greeting}>${clientName}:</span> ${pureLastMessage}` : `<span class=${styles.greeting}>Вы:</span> ${pureLastMessage}`;
  };

  const getLastMessageCreationDate = (messagesHistory: IMessagesHistory[]) => {
    const lastMessage = messagesHistory[messagesHistory.length - 1];
    const timestamp = lastMessage.timestamp;

    if (timestamp) {
      const date = moment(timestamp);
      date.locale('ru');

      return date.format('DD MMM');
    }

    return null;
  };

  if (messages && messages.length > 0) {
    return (
      <div className={styles.appealsContainerSeletor}>
        {
          messages.map((incomingMessage: IIncomingMessage, idx: number) => {
            const clientName = getClientName(incomingMessage.avatarColor, incomingMessage.avatarName);
            const unreadMessagesCount = getLastUnreadMessagesCount(incomingMessage);

            return (
              <div
                key={idx}
                className={`
                  ${styles.incomingMessage}
                  ${incomingMessage.clientId === selectedClientId ? styles.selected : styles.message }
                `}
                onClick={() => showClientMessages(incomingMessage.clientId)}
              >
                <Animal
                  name={incomingMessage.avatarName}
                  color={incomingMessage.avatarColor}
                  size='26px'
                />

                <div className={styles.clientAndLastMessage}>
                  <div className={styles.clientName}>{ clientName }</div>
                  <div
                    className={`
                      ${styles.lastMessage}
                      ${incomingMessage.clientId === selectedClientId && styles.lastMessageSelected}`
                    }
                    dangerouslySetInnerHTML={{__html: getLastMessage(incomingMessage.messagesHistory, clientName)}}
                  />
                </div>

                <div className={styles.countAndCreationDate}>
                  <span
                    className={`
                      ${styles.time}
                      ${incomingMessage.clientId === selectedClientId && styles.timeSelected}
                    `}
                  >
                    { getLastMessageCreationDate(incomingMessage.messagesHistory) }
                  </span>
                  {
                    !(incomingMessage.clientId === selectedClientId) && unreadMessagesCount > 0 &&
                    <div className={styles.count}>{unreadMessagesCount}</div>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  return null;
};