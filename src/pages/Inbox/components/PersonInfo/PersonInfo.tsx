import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import Accordion from '../../../../components/Accordion/Accordion';
import Animal from '../../../../components/Animal/Animal';
import Input from '../../../../components/Input/Input';
import styles from './personInfo.module.scss';
import { getClientName } from '../../../../utils/clientData';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faTimes } from '@fortawesome/free-solid-svg-icons'
import { updateIncomingMessage, updateSelectedClient, updateAssignedUser, updateClientData as updateClientDataAction } from '../../../../actions';
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
  email: string,
  phone: string,
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
  teammates: {
    teammates: Teammate[],
  },
}

interface Teammate {
  avatar: string,
  email: string,
  role: string,
  status: string,
  username: string,
}

interface ITeammate {
  icon?: string,
  value: string | '' |  null,
}

interface IProps {
  selectedClient: IIncomingMessage
}

interface IGeneralInfoItem {
  name: string,
  field: string,
  value: string,
  isEditable: boolean,
}

export default function PersonInfo({ selectedClient }: IProps) {
  const defaultGeneralInfo = [
    {
      name: 'Телефон',
      field: 'phone',
      value: 'Добавить',
      isEditable: true,
    },
    {
      name: 'E-mail',
      field: 'email',
      value: 'Добавить',
      isEditable: true,
    },
  ];
  let fieldInitialValue: string | null = '';
  const [assignedTeammates, setAssignedTeammate] = useState<ITeammate[]>([]);
  const [generalInfo, setGeneralInfo] = useState<IGeneralInfoItem[]>(defaultGeneralInfo);
  // const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const teammates = useSelector((state: RootState) => state.teammates.teammates);
  const dispatch = useDispatch();
  let { projectId } = useParams<{ projectId: string }>();
  const { currentUser, setCurrentUser } = useContext(Context);

  const clientData = {
    avatarName: selectedClient.avatarName,
    email: selectedClient.email,
    phone: selectedClient.phone,
    assigned_to: selectedClient.assigned_to,
    clientId: selectedClient.clientId,
    projectId,
  };

  useEffect(() => {
    const assignedTeammate = {
      value: selectedClient.assigned_to,
    };
    const generalClientData = generalInfo.reduce((acc: IGeneralInfoItem[], field: IGeneralInfoItem) => {
      if (field.field === 'phone') {
        field.value = selectedClient.phone;
      }

      if (field.field === 'email') {
        field.value = selectedClient.email;
      }
      
      return acc.concat(field);
    }, []);

    setAssignedTeammate([assignedTeammate].filter(item => item.value !== '' && item.value !== null));
    setGeneralInfo(generalClientData);
  }, [selectedClient]);

  const assignTeammate = (teammate: ITeammate) => {
    if (!assignedTeammates.find((item: ITeammate) => item.value === teammate.value)) {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
  
      setCurrentUser((prev: any) => {
        const client = {
          clientId: selectedClient.clientId,
          projectId,
          avatarName: selectedClient.avatarName,
          avatarColor: selectedClient.avatarColor,
          messagesHistory: selectedClient.messagesHistory
        };
  
        const assignedClientIds = prev.assignedClientIds.concat(client);
        const assignedCount = prev.assignedCount + 1;
  
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

        dispatch(updateAssignedUser({
          clientId: selectedClient.clientId,
          username: prev.username,
          email: prev.email,
          projectId,
  
          assignedClientIds,
          assignedCount,
  
          ...getUnreadClientIds(prev.unreadClientIds),
          ...getOpenedClientIds(prev.openedClientIds),
  
          closedClientIds: prev.closedClientIds,
          closedCount: prev.closedCount,
        }));

        const successCallback = () => {
          setAssignedTeammate([{ value: teammate.value }]);
          dispatch(updateIncomingMessage({
            clientId: selectedClient?.clientId,
            assigned_to: teammate.value
          }));
          dispatch(updateSelectedClient({
            assigned_to: teammate.value
          }));
        };
  
        dispatch(updateClientDataAction(Object.assign(clientData, {
          assigned_to: teammate.value,
          successCallback,
        })));
  
        return cloneDeep(Object.assign(prev,
          {
            ...getUnreadClientIds(prev.unreadClientIds),
            ...getOpenedClientIds(prev.openedClientIds),
  
            assignedClientIds,
            assignedCount,
          }
        ));
      });
    }
  };

  const removeAssignedTeammate = (teammate: ITeammate) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    setCurrentUser((prev: any) => {
      const assignedClientIds = prev.assignedClientIds.filter((client: any) => client.clientId !== selectedClient.clientId);
      const assignedCount = prev.assignedCount - 1;

      const successCallback = () => {
        setAssignedTeammate(prev => prev.filter(assignedTeammate => assignedTeammate.value !== teammate.value));
        dispatch(updateIncomingMessage({
          clientId: selectedClient?.clientId,
          assigned_to: ''
        }));
        dispatch(updateSelectedClient({
          assigned_to: ''
        }));
      };

      dispatch(updateAssignedUser({
        clientId: selectedClient.clientId,
        username: prev.username,
        email: prev.email,
        projectId,

        assignedClientIds,
        assignedCount,

        unreadClientIds: prev.unreadClientIds,
        unreadCount: prev.unreadCount,

        openedClientIds: prev.openedClientIds,
        openedCount: prev.openedCount,

        closedClientIds: prev.closedClientIds,
        closedCount: prev.closedCount,

        successCallback,
      }));

      dispatch(updateClientDataAction(Object.assign(clientData, { assigned_to: '', })));

      return cloneDeep(Object.assign(prev,
        {
          assignedClientIds,
          assignedCount,
        }
      ));
    });
  };

  const getTeammates = () => {
    return teammates.map((teammate) => ({ value: teammate.username }));
  };

  const updateClientData = (e: React.SyntheticEvent) => {
    const target = e.currentTarget;
    const fieldValue: string | null = target.textContent;
    const fieldName: string | null | undefined = target.parentElement?.getAttribute('data-field');
    const isDifferentFieldValues = fieldInitialValue !== fieldValue;

    if (fieldName && isDifferentFieldValues) {
      const successCallback = () => {
        dispatch(updateIncomingMessage({
          clientId: selectedClient?.clientId,
          [fieldName]: fieldValue
        }));
      };

      dispatch(updateClientDataAction(Object.assign(clientData, {
        [fieldName]: fieldValue,
        successCallback,
      })));
    }
  };

  const saveInitialFieldValue = (e: React.SyntheticEvent) => {
    const target = e.currentTarget;
    fieldInitialValue = target.textContent;
  };

  return (
    <div className={styles.personInfoContainer}>
      <div className={styles.personGeneralInfo}>
        <Animal
          name={selectedClient.avatarName}
          color={selectedClient.avatarColor}
          size='60px'
        />

        <div
          className={styles.clientName}
        >
          { getClientName(selectedClient.avatarColor, selectedClient.avatarName) }
        </div>

        <div className={styles.blackListIcon}>
          <FontAwesomeIcon icon={faEllipsisV} color='#444' />
        </div>
      </div>

      <Accordion
        title='Основное'
      >
        <ul className={styles.generalList}>
          {
            generalInfo.map((field, idx) => {
              return (
                <li
                  key={idx}
                  className={styles.generalListItem}
                  data-field={field.field}
                >
                  <span className={styles.nameField}>{field.name}:</span>
                  <span
                    className={styles.valueField}
                    contentEditable={field.isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={updateClientData}
                    onFocus={saveInitialFieldValue}
                  >
                    {field.value}
                  </span>
                </li>
              );
            })
          }
        </ul>
      </Accordion>

      <Accordion
        title='Назначить на'
      >
        <div>
          <Input
            type='text'
            placeholder='+ Выбрать сотрудника'
            classNames={styles.checkTeammateInput}
            fluid
            onClick={assignTeammate}
            data={getTeammates()}
          />

          <div className={styles.assignedTeammatesList}>
            {
              assignedTeammates.map((teammate: ITeammate, idx) => {
                return (
                  <div
                    key={idx}
                    className={styles.assignedTeammate}
                  >
                    <p className={styles.teammateName}>{teammate.value}</p>
                    <div
                      onClick={() => removeAssignedTeammate(teammate)}
                      className={styles.removeIcon}
                    >
                      <FontAwesomeIcon icon={faTimes} color='#cac9c9' />
                    </div>
                  </div> 
                );
              })
            }
          </div>
        </div>
      </Accordion>

      <Accordion
        title='История изменений'
      >

      </Accordion>
    </div>
  );
}