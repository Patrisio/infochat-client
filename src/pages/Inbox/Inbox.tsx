import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

import socket from '../../socket';
import { Context } from '../../context/Context';
import {
  addIncomingMessage, addIncomingMessageForSelectedClient,
  assignTeammate, addTeammate, selectClient, fetchTeammates,
  fetchIncomingMessages, updateAssignedUser,
} from '../../actions';

import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import SidebarList from '../../components/Sidebar/components/SidebarList/SidebarList';
import Avatar from '../../components/Avatar/Avatar';

import AppealsContainerSelector from './components/AppealsContainerSelector/AppealsContainerSelector';
import AppealsContainerMessages from './components/AppealsContainerMessages/AppealsContainerMessages';
import PersonInfo from './components/PersonInfo/PersonInfo';

import styles from './inbox.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faEnvelope, faEnvelopeOpen, faAt, faComments } from '@fortawesome/free-solid-svg-icons';
import { generateRandomHash } from '../../utils/string';
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
  email: string,
  phone: string,
}

interface RootState {
  inbox: {
    messages: IMessagesHistory[]
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage
  },
}

interface InboxProps {
  messagesCount?: number,
  clientIds: string[]
}

interface IClient {
  projectId: string,
  clientId: string,
  message: IMessagesHistory,
  avatarName: string,
  avatarColor: string,
}

interface Teammate {
  avatar: string,
  email: string,
  role: string,
  status: string,
  username: string,
  allClientIds: IClient[],
  unreadCount: number,
  unreadClientIds: IClient[],
  assignedCount: number,
  assignedClientIds: IClient[],
  openedCount: number,
  openedClientIds: IClient[],
}

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
  assigned_to: string | null
}

interface RootState {
  inbox: {
    messages: IMessagesHistory[],
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage,
  },
  teammates: {
    teammates: Teammate[],
  },
  channels: {
    channels: Channel[],
  },
}

interface Channel {
  name: string,
}

export default function Inbox({
  messagesCount,
  clientIds
}: InboxProps) {
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();
  const { currentUser, setCurrentUser } = useContext<any>(Context);
  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const teammates = useSelector((state: RootState) => state.teammates.teammates);
  const channels = useSelector((state: RootState) => state.channels.channels);

  console.log(currentUser, '__currentUser__');
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    socket.emit('joinRoom', projectId);

    var myHeaders = new Headers();
    const token = localStorage.getItem('token') || '';
    myHeaders.append("Authorization", `Bearer ${token}`);
    console.log(projectId, '__ID__');
    dispatch(fetchIncomingMessages({projectId}));
    
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);

    var requestUserOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    fetch('/auth/getCurrentUser', requestUserOptions)
      .then(response => response.json())
      .then(currentUser => {
        setCurrentUser(currentUser);
      })
      .catch(error => console.log('error', error));

    dispatch(fetchTeammates({ projectId }));
  }, []);

  useEffect(() => {
    socket.on('updateAssignedToAnybody', (payload: any) => {
      dispatch(assignTeammate({
        username: payload.assigned_to,
        clientId: payload.clientId
      }));
    });

    socket.on('addIncomingMessage', (message: any) => {
      const newClient = {
        id: generateRandomHash(),
        projectId: message.projectId,
        clientId: message.clientId,
        messagesHistory: [message.message],
        avatarName: message.avatarName,
        avatarColor: message.avatarColor,
      };

      dispatch(addIncomingMessageForSelectedClient(message.message));
      dispatch(addIncomingMessage(newClient));
    });

    socket.on('updateUnreadDialog', (payload: IClient) => {
      setCurrentUser((prev: any) => {
        const unreadClients: any[] = cloneDeep(prev.unreadClientIds);
        const assignedClients: any[] = cloneDeep(prev.assignedClientIds);
        const openedClients: any[] = cloneDeep(prev.openedClientIds);

        const client = {
          clientId: payload.clientId,
          projectId: payload.projectId,
          avatarName: payload.avatarName,
          avatarColor: payload.avatarColor,
          messagesHistory: [payload.message]
        };
        const foundClientInUnread = unreadClients.find((client: IClient) => client.clientId === payload.clientId);
        
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        if (foundClientInUnread) {
          const foundClientIndexInUnread = unreadClients.findIndex((client: IClient) => client.clientId === payload.clientId);

          foundClientInUnread.messagesHistory.push(payload.message);
          unreadClients.splice(foundClientIndexInUnread, 1, foundClientInUnread);
        }

        const foundClientInAssigned = assignedClients.find((client: IClient) => client.clientId === payload.clientId);

        if (foundClientInAssigned) {
          const foundClientIndexInAssigned = assignedClients.findIndex((client: IClient) => client.clientId === payload.clientId);
          foundClientInAssigned.messagesHistory.push(payload.message);
          assignedClients.splice(foundClientIndexInAssigned, 1, foundClientInAssigned);

          const foundClientIndexInOpened = openedClients.findIndex((client: IClient) => client.clientId === payload.clientId);
          const foundClientInOpened = openedClients.find((client: IClient) => client.clientId === payload.clientId);
          foundClientInOpened.messagesHistory.push(payload.message);
          openedClients.splice(foundClientIndexInOpened, 1, foundClientInOpened);
        }

        if (foundClientInUnread || foundClientInAssigned) {
          dispatch(updateAssignedUser({
            clientId: prev.clientId,
            username: prev.username,
            email: prev.email,
            projectId,
    
            assignedClientIds: assignedClients,
            assignedCount: prev.assignedCount,
    
            unreadClientIds: unreadClients,
            unreadCount: prev.unreadCount,
    
            openedClientIds: openedClients,
            openedCount: prev.openedCount,
    
            closedClientIds: prev.closedClientIds,
            closedCount: prev.closedCount,
          }));
          
          return cloneDeep(Object.assign(prev,
            {
              unreadClientIds: unreadClients,
              openedClientIds: openedClients,
              assignedClientIds: assignedClients
            }
          ));
        }

        dispatch(updateAssignedUser(Object.assign({
          assignedCount: prev.assignedCount,
          unreadCount: prev.unreadCount + 1,
          openedCount: currentUser.openedCount,
          projectId,
        },{
          clientId: selectedClient.clientId,
          username: currentUser.username,
          email: currentUser.email,
  
          assignedClientIds: assignedClients,
          assignedCount: prev.assignedCount,
  
          unreadClientIds: unreadClients.concat(client),
          unreadCount: prev.unreadCount + 1,
  
          openedClientIds: openedClients,
          openedCount: currentUser.openedCount,
  
          closedClientIds: prev.closedClientIds,
          closedCount: currentUser.closedCount,
        })));

        return cloneDeep(Object.assign(prev,
          {
            unreadCount: prev.unreadCount + 1,
            unreadClientIds: unreadClients.concat(client)
          }
        ));
      });
    });

    socket.on('reduceUnreadCountAnybody', (payload: any) => {
      setCurrentUser((prev: any) => {
        return cloneDeep(Object.assign(prev, { 
          unreadCount: payload.unreadCount,
          unreadClientIds: payload.unreadClientIds,
          openedCount: payload.openedCount,
          openedClientIds: payload.openedClientIds,
          assignedClientIds: payload.assignedClientIds,
          assignedCount: payload.assignedCount
        }));
      });
    });

    socket.on('reduceOpenedToAnybody', (payload: any) => {
      setCurrentUser((prev: any) => {
        return cloneDeep(Object.assign(prev, {
          openedCount: payload.openedCount,
          openedClientIds: payload.openedClientIds,
        }));
      });
    });

    return () => {
      socket.off('updateAssignedToAnybody');
      socket.off('addIncomingMessage');
      socket.off('updateUnreadDialog');
      socket.off('reduceUnreadCountAnybody');
      socket.off('reduceOpenedToAnybody');
    };
  }, [socket]);

  const hideOpenedMessagesArea = () => {
    if (selectedClient.clientId !== '') {
      dispatch(selectClient(cloneDeep({
        id: '',
        projectId: '',
        clientId: '',
        messagesHistory: [],
        assigned_to: ''
      })));
    }
  };

  const switchDialog = (dialog: string) => {
    if (dialogType !== dialog) {
      history.push(`/project/${projectId}/inbox/${dialog}`);
      hideOpenedMessagesArea();
    }
  };

  const formatDialogs = (teammate: Teammate) => {
    const {
      allClientIds, unreadCount, unreadClientIds,
      assignedCount, assignedClientIds,
      openedCount, openedClientIds
    } = teammate;
    
    const all = {
      name: 'Все',
      allClientIds,
      icon: <FontAwesomeIcon icon={faInbox} />,
      stylesList: {
        marginLeft: '8px',
      },
      onClick: () => switchDialog('all'),
    };
    const unread = {
      name: 'Непрочитанные',
      count: unreadCount,
      icon: <FontAwesomeIcon icon={faEnvelope} />,
      stylesList: {
        marginLeft: '8px',
      },
      unreadClientIds,
      onClick: () => switchDialog('unread')
    };
    const opened = {
      name: 'Открытые',
      count: openedCount,
      icon: <FontAwesomeIcon icon={faEnvelopeOpen} />,
      stylesList: {
        marginLeft: '8px',
      },
      openedClientIds,
      onClick: () => switchDialog('opened')
    };
    const assigned = {
      name: 'Назначенные мне',
      count: assignedCount,
      icon: <FontAwesomeIcon icon={faAt} />,
      stylesList: {
        marginLeft: '8px',
      },
      assignedClientIds,
      onClick: () => switchDialog('assigned')
    };

    const dialogs = [all, unread, opened, assigned];

    return dialogs;
  };

  const formatTeammates = (teammates: Teammate[]) => {
    const result = [];

    for (let { username } of teammates) {
      result.push({
        name: username,
        icon: <Avatar name={username} size='small' />
      });
    }

    if (currentUser.role === 'owner') {
      result.push({
        name: 'Добавить сотрудника',
        stylesList: {
          color: '#4eaaff',
          fontWeight: '500',
        },
        onClick: () => history.push(`/project/${projectId}/settings/teammates`),
      });
    }

    return result;
  };

  const formatChannels = (channels: Channel[]) => {
    const result = [];

    if (channels.length > 0) {
      for (let { name } of channels) {
        result.push({
          name,
          icon: <FontAwesomeIcon icon={faComments} />,
        });
      }
  
      if (currentUser.role === 'owner') {
        result.push({
          name: 'Добавить канал',
          stylesList: {
            color: '#4eaaff',
            fontWeight: '500',
          },
          onClick: () => history.push(`/project/${projectId}/settings/channels`),
        });
      }
    }

    return result;
  };

  const dialogTitle = () => <h3 className={styles.title}>Диалоги</h3>;
  const teammatesTitle = () => (
    <Link
      className={styles.title}
      to={`/project/${projectId}/settings/teammates`}
    >
      Сотрудники
    </Link>
  );
  const channelsTitle = () => (
    <Link
      className={styles.title}
      to={`/project/${projectId}/settings/channels`}
    >
      Каналы
    </Link>
  );

  return (
    <div>
      <div className={styles.conversationsContainer}>
        <Sidebar>
          <SidebarList
            title={dialogTitle()}
            listItems={formatDialogs(currentUser)}
          />

          <SidebarList
            title={channelsTitle()}
            listItems={formatChannels(channels)}
          />

          <SidebarList
            title={teammatesTitle()}
            listItems={formatTeammates(teammates)}
          />

          <div className={styles.fixedSidebarSection}>
            <SidebarList
              listItems={[{
                name: 'Настройки',
                onClick: () => history.push(`/project/${projectId}/settings/start`),
              }]}
            />
          </div>
        </Sidebar>

        <div className={styles.conversationsHeaderDialogs}>
          <Header />
          <div className={styles.conversationsDialogs}>
            <AppealsContainerSelector
              messages={dialogType === 'all' ? [...currentUser.unreadClientIds, ...currentUser.openedClientIds] : currentUser[`${dialogType}ClientIds`]}
            />
            {
              selectedClient.clientId === '' ?
              <div className={styles.notSelectedClientIdContainer}>
                <p className={styles.notSelectedClientIdNotice}>Пожалуйста, выберите диалог, чтобы начать общение</p>
              </div> :
              <>
                <AppealsContainerMessages clientIds={clientIds} />
                <PersonInfo selectedClient={selectedClient} />
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}