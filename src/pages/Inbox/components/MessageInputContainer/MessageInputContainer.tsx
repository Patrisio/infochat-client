import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import socket from '../../../../socket';
import styles from './messageInputContainer.module.scss';
import Button from '../../../../components/Button/Button';
import { addIncomingMessage, assignTeammate, addIncomingMessageForSelectedClient, updateAssignedUser, addToInboxIncomingMessage } from '../../../../actions';
import { Context } from '../../../../context/Context';
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
  avatarName: string,
  avatarColor: string,
}

interface IClient {
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
}

interface RootState {
  inbox: {
    messages: IMessagesHistory[],
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage
  },
}

export default function MessageInputContainer() {
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();
  let pressed = new Set();

  const { currentUser, setCurrentUser } = useContext(Context);

  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const isAssigned = Boolean(selectedClient.assigned_to);
  const dispatch = useDispatch();

  const clearInputArea = (inputArea: any) => {
    setTimeout(() => {
      for (let i = 0; i < inputArea.children.length; i++) {
        inputArea.children[i].remove();
      }
    }, 0)
  };

  const sendMessage = (inputArea: any) => {
    const message = inputArea.innerHTML;
    const timestamp = Date.now();
    const newMessage = {
      clientId: selectedClient.clientId,
      username: 'operator',
      message,
      timestamp,
      assignedTo: selectedClient.assigned_to
    };

    const successCallback = () => {
      setCurrentUser((prev: any) => {
        const openedClientIds = prev.openedClientIds;
        const assignedClientIds = prev.assignedClientIds;
        const foundOpenedDialog = openedClientIds.find((dialog: any) => dialog.clientId === selectedClient.clientId);
        const foundAssignedDialog = assignedClientIds.find((dialog: any) => dialog.clientId === selectedClient.clientId);

        foundOpenedDialog.messagesHistory.push(newMessage);
        foundAssignedDialog.messagesHistory.push(newMessage);

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
  
          assignedClientIds,
          assignedCount: prev.assignedCount,
  
          unreadClientIds: currentUser.unreadClientIds,
          unreadCount: currentUser.unreadCount,
  
          openedClientIds,
          openedCount: currentUser.openedCount,
  
          closedClientIds: prev.closedClientIds,
          closedCount: currentUser.closedCount,

          successCallback,
        }));

        return Object.assign(prev,
          {
            openedClientIds,
            assignedClientIds
          }
        );
      });

      dispatch(addIncomingMessage({
        clientId: selectedClient.clientId,
        projectId,
        messagesHistory: [newMessage]
      }));

      dispatch(addIncomingMessageForSelectedClient(newMessage));

      inputArea.innerHTML = '';
      clearInputArea(inputArea);
      socket.emit('operatorMessageFromInfochat', {
        room: selectedClient.clientId,
        message: {
          clientId: selectedClient.clientId,
          projectId,
          message: newMessage,
          timestamp,
        }
      }, 
      (data: any) => console.log(data));
    };

    dispatch(addToInboxIncomingMessage({
      clientId: selectedClient.clientId,
      projectId,
      message: newMessage,
      timestamp,
      successCallback,
    }));
  };

  const runOnKeys = (event: any, func: any) => {
    const inputArea = event.target;
    pressed.add(event.which);

    if (pressed.has(16)) {
      return;
    }

    if (pressed.has(13) && pressed.size === 1 && inputArea.textContent !== '') {
      func(inputArea);
    }
    
    pressed.clear();

    document.addEventListener('keyup', function(event) {
      pressed.delete(event.which);
    });
  }

  const appointDialog = () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    setCurrentUser((prev: any) => {
      console.log(6);

      const client = {
        clientId: selectedClient.clientId,
        projectId: selectedClient.projectId,
        messagesHistory: selectedClient.messagesHistory,
        avatarName: selectedClient.avatarName,
        avatarColor: selectedClient.avatarColor,
      };

      const getOpenedClientIds = (openedClientIds: IClient[]) => {
        if (openedClientIds.find((client: IClient) => client.clientId === selectedClient.clientId)) {
          return {
            openedClientIds,
            openedCount: prev.openedCount,
          };
        }

        return {
          openedClientIds: openedClientIds.concat(client),
          openedCount: prev.openedCount + 1,
        };
      };

      const getUnreadClientIds = (unreadClientIds: IClient[]) => {
        if (unreadClientIds.find((client: IClient) => client.clientId === selectedClient.clientId)) {
          return {
            unreadClientIds: unreadClientIds.filter((client: IClient) => client.clientId !== selectedClient.clientId),
            unreadCount: prev.unreadCount - 1,
          };
        }

        return {
          unreadClientIds: prev.unreadClientIds,
          unreadCount: prev.unreadCount,
        };
      };

      const successCallback = () => {
        dispatch(assignTeammate({
          username: currentUser.username,
          clientId: selectedClient.clientId
        }));

        socket.emit('reduceUnreadCountAnybody', {
          unreadCount: prev.unreadCount,
          unreadClientIds: prev.unreadClientIds.filter((client: IClient) => client.clientId !== selectedClient.clientId),
          openedCount: prev.openedCount,
          openedClientIds: prev.openedClientIds,
          assignedClientIds: prev.assignedClientIds,
          assignedCount: prev.assignedCount
        });

        socket.emit('updateAssignedToAnybody', {
          assigned_to: prev.username,
          clientId: client.clientId
        });
      };

      dispatch(updateAssignedUser({
        clientId: selectedClient.clientId,
        username: prev.username,
        email: prev.email,
        projectId,

        assignedClientIds: prev.assignedClientIds.concat(client),
        assignedCount: prev.assignedCount + 1,

        ...getUnreadClientIds(prev.unreadClientIds),
        ...getOpenedClientIds(prev.openedClientIds),

        closedClientIds: prev.closedClientIds,
        closedCount: prev.closedCount,

        successCallback,
      }));
         
      return cloneDeep(Object.assign(prev, {
        assignedClientIds: prev.assignedClientIds.concat(client),
        assignedCount: prev.assignedCount + 1,

        ...getUnreadClientIds(prev.unreadClientIds),
        ...getOpenedClientIds(prev.openedClientIds),
      }));
    });
  };

  return (
    <>
      {
        isAssigned ?
        <div
          className={styles.inputArea}
          placeholder='Введите сообщение'
          contentEditable
          onKeyDown={(e) => runOnKeys(e, sendMessage)}
        /> :
        <div className={styles.appointedContainer}>
          <div className={styles.appointedArea}>
            <Button
              type='button'
              fluid
              background='success'
              onClick={appointDialog}
              stylesList={{
                padding: '7px 5px',
              }}
            >
              Взять в работу
            </Button>

            <p className={styles.appointedNotice}>Диалог будет закреплен за вами</p>
          </div>
        </div>
      }
    </>
  );
}