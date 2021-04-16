import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './appealsContainerMessages.module.scss';
import MessageInputContainer from '../../components/MessageInputContainer/MessageInputContainer';
import Button from '../../../../components/Button/Button';
import MessageInner from '../MessageInner/MessageInner';
import Modal from '../../../../components/Modal/Modal';
import { Context } from '../../../../context/Context';
import socket from '../../../../socket';
import { useParams } from 'react-router';
import { assignTeammate, selectClient, updateAssignedUser } from '../../../../actions';
import { getClientName } from '../../../../utils/clientData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive } from '@fortawesome/free-solid-svg-icons'

type IMessagesHistory = {
  message: string,
  clientId: string,
  username: string
};

interface IClient {
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
}

type IIncomingMessage = {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assigned_to: string,
  avatarName: string,
  avatarColor: string,
};

interface RootState {
  inbox: {
    messages: IMessagesHistory[]
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage,
  },
}

interface AppealsContainerMessagesProps {
  clientIds: string[]
}

export default function AppealsContainerMessages({
  clientIds
}: AppealsContainerMessagesProps) {
  const [isDeleteAppealModalVisible, setModalState] = useState(false);
  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useContext(Context);
  let { projectId } = useParams<{ projectId: string }>();

  const isDisabled = () => !!currentUser.closedClientIds.find((client: IClient) => client.clientId === selectedClient.clientId);

  const closeDialog = () => {
    setCurrentUser((prev: any) => {
      console.log(4);

      const client = {
        clientId: selectedClient.clientId,
        projectId: selectedClient.projectId,
        messagesHistory: selectedClient.messagesHistory,
        avatarName: selectedClient.avatarName,
        avatarColor: selectedClient.avatarColor,
      };

      const successCallback = () => {
        dispatch(assignTeammate({
          username: currentUser.username,
          clientId: selectedClient.clientId
        }));
        
        socket.emit('updateAssignedToAnybody', {
          username: currentUser.username,
          clientId: selectedClient.clientId
        });

        socket.emit('reduceOpenedToAnybody', {
          openedClientIds: currentUser.openedClientIds.filter((client: IClient) => client.clientId !== selectedClient.clientId),
          openedCount: currentUser.openedCount,
        });
      };

      dispatch(updateAssignedUser({
        clientId: selectedClient.clientId,
        username: currentUser.username,
        email: currentUser.email,
        projectId,

        assignedClientIds: currentUser.assignedClientIds.filter((client: IClient) => client.clientId !== selectedClient.clientId),
        assignedCount: prev.assignedCount - 1,

        unreadClientIds: currentUser.unreadClientIds,
        unreadCount: currentUser.unreadCount,

        openedClientIds: currentUser.openedClientIds.filter((client: IClient) => client.clientId !== selectedClient.clientId),
        openedCount: currentUser.openedCount - 1,

        closedClientIds: currentUser.closedClientIds.concat(client),
        closedCount: currentUser.closedCount + 1,

        successCallback,
      }));

      return Object.assign(prev, {
        assignedClientIds: currentUser.assignedClientIds.filter((client: IClient) => client.clientId !== selectedClient.clientId),
        assignedCount: prev.assignedCount - 1,

        unreadClientIds: currentUser.unreadClientIds,
        unreadCount: currentUser.unreadCount,

        openedClientIds: currentUser.openedClientIds.filter((client: IClient) => client.clientId !== selectedClient.clientId),
        openedCount: currentUser.openedCount - 1,

        closedClientIds: currentUser.closedClientIds.concat(client),
        closedCount: currentUser.closedCount + 1,
      });
    })
  };

  const buttonStyles = {
    padding: '9px 30px 10px',
    fontSize: '13px',
    fontWeight: 400,
  };

  const archiveDialog = () => {
    console.log('ARCHIVE DIALOG');
    setModalState(true);
  };

  const closeModal = () => {
    setModalState(false);
  };

  const ModalBody = () => <p className={styles.modalBody}>Вы действительно хотите удалить обращение?</p>;

  const ModalFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <Button
          type='button'
          stylesList={{ marginRight: '10px', ...buttonStyles }}
          background='edit'
          onClick={closeModal}
        >
          Отмена
        </Button>

        <Button
          type='button'
          stylesList={{ ...buttonStyles }}
          onClick={closeModal}
        >
          Удалить
        </Button>
      </div>
    );
  };

  const ModalTrigger = () => (
    <div
      onClick={archiveDialog}
    >
      <FontAwesomeIcon icon={faArchive} className={styles.iconArchive}/>
    </div>
  );

  return (
    <>
      <div className={styles.converasationChatContainer}>
        <div className={styles.dialogHeader}>
          <div>
            <p className={styles.clientName}>{ getClientName(selectedClient.avatarColor, selectedClient.avatarName) }</p>
          </div>

          <div
            onClick={archiveDialog}
            className={styles.archiveIconContainer}
          >
            <FontAwesomeIcon icon={faArchive} className={styles.iconArchive}/>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type='button'
              fluid
              background='edit'
              stylesList={{
                color: '#0a86f9',
                fontSize: '13px',
                padding: '6px 0'
              }}
              onClick={closeDialog}
              disabled={isDisabled()}
            >
              Закрыть диалог
            </Button>
          </div>
        </div>

        <div className={styles.messagesHistoryContainer}>
          {
            selectedClient.messagesHistory.map((message, idx) => {
              return (
                <MessageInner
                  key={idx}
                  message={message}
                />
              );
            })
          }
        </div>
        <MessageInputContainer />
      </div>

      <Modal
        show={isDeleteAppealModalVisible}
        onClose={() => setModalState(false)}
        title='Удалить обращение?'
        body={<ModalBody />}
        footer={<ModalFooter />}
        width='500px'
        position='top'
      />
    </>
  );
}