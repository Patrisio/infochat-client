import React from 'react';
import Animal from '../../../../components/Animal/Animal';
import Avatar from '../../../../components/Avatar/Avatar';
import styles from './messageInner.module.scss';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ru';

type IMessagesHistory = {
  message: string,
  clientId: string,
  username: string
};

type IIncomingMessage = {
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  avatarName: string,
  avatarColor: string,
};

interface RootState {
  inbox: {
    messages: IMessagesHistory[]
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage
  },
}

export default function MessageInput({ message }: any) {
  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);

  const getMessageCreationTime = (timestamp: number) => {
    if (timestamp) {
      const date = moment(timestamp);
      date.locale('ru');

      return date.format('HH:mm');
    }

    return null;
  };

  return (
    <div className={`
      ${styles.messageInnerContainer}
      ${message.username === 'client' ? styles.messageInnerContainerLeft : styles.messageInnerContainerRight}
    `}>
      <div className={styles.messageBody}>
        {
          message.username === 'client' &&
          <Animal
            name={selectedClient.avatarName}
            color={selectedClient.avatarColor}
            size='26px'
          />
        }
        <div
          className={`${message.username === 'client' ? styles.clientMessage : styles.teammateMessage} ${styles.messageWrapper}`}
          dangerouslySetInnerHTML={{__html: message.message}}
        />
        {
          message.username === 'operator' &&
          <Avatar
            name={message.assignedTo}
            stylesList={{ marginBottom: '5px' }}
          />
        }
      </div>
      <div
        className={`
          ${styles.creationTime}
          ${message.username === 'client' ? styles.creationTimeClient : styles.creationTimeTeammate}
        `}
      >
          {getMessageCreationTime(message.timestamp)}
        </div>
    </div>
  );
}