import React, { useEffect, useState } from 'react';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import SignInPage from './pages/SignInPage/SignInPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import Inbox from './pages/Inbox/Inbox';
import Chat from './pages/Chat/Chat';
import InviteForm from './pages/InviteForm/InviteForm';
import ChatSettings from './pages/ChatSettings/ChatSettings';
import Teammates from './pages/Teammates/Teammates';
import Settings from './pages/Settings/Settings';
import socket from './socket';
import { Context } from './context/Context';
import { Location } from "history";

import 'normalize.css';
import './App.css';

const store = configureStore();

interface ILocationState {
  page: Location<string>
}

function App() {
  useEffect(() => {
    socket.on('msgToClient', (message: any) => {
      console.log(message);
    });
  }, []);

  const initialCurrentUser = {
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
    closedClientIds: []
  };

  const [currentUser, setCurrentUser] = useState(initialCurrentUser);

  const location = useLocation<ILocationState>();

  let locationState = location.state;
  return (
    <Provider store={store}>
      <Context.Provider value={{ currentUser, setCurrentUser }}>
        <div className="App">
          <Switch location={{ ...location, state: locationState } || location}>
            <Route exact path="/" component={SignInPage} />
            <Route path="/signin/" component={SignInPage} />
            <Route path="/signup/" component={SignUpPage} />
            <Route path="/project/:projectId/inbox/:dialogType">
              <Inbox
                clientIds={currentUser.openedClientIds}
                messagesCount={currentUser.openedCount}
              />
            </Route>
            <Route path="/project/:projectId/iframe/:clientId" component={Chat} />
            <Route path="/project/:projectId/chat-settings" component={ChatSettings} />
            { 
              <Route path={`/project/:projectId/settings/:pageId`} exact>
                <Settings />
              </Route>
            }
            {/* <Route path="/project/:projectId/settings" exact>
              <Settings>
                <Teammates />
              </Settings>
            </Route> */}
            <Route path="/project/:projectId/teammate/invite/:inviteId" component={InviteForm} />
          </Switch>
        </div>
      </Context.Provider>
    </Provider>
  );
}

export default App;