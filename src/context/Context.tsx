import { createContext } from 'react';

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

interface IUser {
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
  closedCount: number,
  closedClientIds: IClient[],
}

type ContextProps = {
  currentUser: IUser,
  setCurrentUser: any
};

export const Context = createContext<ContextProps>({
  currentUser: {
    avatar: '',
    email: '',
    role: '',
    status: '',
    username: '',
    allClientIds: [],
    unreadCount: 0,
    unreadClientIds: [],
    assignedCount: 0,
    assignedClientIds: [],
    openedCount: 0,
    openedClientIds: [],
    closedCount: 0,
    closedClientIds: [],
  },
  setCurrentUser: () => {}
});