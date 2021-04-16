import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SidebarList from './components/SidebarList/SidebarList';
import Avatar from '../../components/Avatar/Avatar';
import { addTeammate, selectClient, fetchTeammates, updateAssignedUser } from '../../actions';
import styles from './sidebar.module.scss';
import { Context } from '../../context/Context';
import socket from '../../socket';
import cloneDeep from 'lodash/cloneDeep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faEnvelope, faEnvelopeOpen, faAt } from '@fortawesome/free-solid-svg-icons';

interface IParams {
  projectId: string,
  dialogType: string,
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
    selectedClient: IIncomingMessage
  },
  teammates: {
    teammates: Teammate[]
  }
}

interface IProps {
  children: React.ReactNode,
  mode?: 'light' | 'dark',
}

export default function Sidebar({ children, mode = 'dark' }: IProps) {
  let { projectId, dialogType } = useParams<IParams>();
  let history = useHistory();
  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const { currentUser, setCurrentUser } = useContext<any>(Context);

  const dialogTitle = () => <h3 className={styles.title}>Диалоги</h3>;
  const teammatesTitle = () => (
    <Link
      className={styles.title}
      to={`/project/${projectId}/settings/teammates`}
    >
      Сотрудники
    </Link>
  );

  const teammates = useSelector((state: RootState) => state.teammates.teammates);
  const dispatch = useDispatch();

  useEffect(() => {
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
      socket.off('updateUnreadDialog');
      socket.off('reduceUnreadCountAnybody');
      socket.off('reduceOpenedToAnybody');
    }
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
  
  return (
    <div
      className={`
        ${styles.sidebarContainer}
        ${mode === 'light' ? styles.lightMode : styles.darkMode}
      `}
    >
      {children}
    </div>
  );
}