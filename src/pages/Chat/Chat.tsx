import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import socket from '../../socket';
import styles from './chat.module.scss';
import { addMessage, fetchIncomingMessages, addToInboxIncomingMessage } from '../../actions';
import Animal from '../../components/Animal/Animal';

interface IMessagesHistory {
  message: string,
  clientId: string,
  username: string
}

interface IIncomingMessage {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[]
}

interface RootState {
  inbox: {
    messages: IMessagesHistory[],
    selectedClient: IIncomingMessage
  }
}

export default function Chat() {
  const messages = useSelector((state: RootState) => state.inbox.messages);
  const dispatch = useDispatch();

  interface ParamTypes {
    clientId: string,
    projectId: string
  }

  interface IMessages {
    clientId: string,
    username: string,
    msg: string
  }

  let { clientId, projectId } = useParams<ParamTypes>();
  let pressed = new Set();

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

  useEffect(() => {
    socket.emit('joinRoom', clientId);
    getMessagesHistory();
  }, []);

  useEffect(() => {
    socket.on('addMessageToClientChat', (message: any) => {
      dispatch(addMessage(message.message));
    });

    return () => {
      socket.off('addMessageToClientChat');
    };
  }, [socket]);

  const getMessagesHistory = async () => {
    dispatch(fetchIncomingMessages({
      projectId,
      clientId,
      successCallback: (messages: any) => dispatch(addMessage(messages.messagesHistory)),
    }));
  };

  const sendMessage = (inputArea: any) => {
    const animal = new Animal({ name: '' });
    const avatarName = animal.validateName().animal;
    const avatarColor = animal.validateColor().color;
    const timestamp = Date.now();

    const message = inputArea.innerHTML;
    const newMessage = {
      clientId,
      username: 'client',
      message,
      avatarName,
      avatarColor,
      timestamp
    };

    const successCallback = () => {
      dispatch(addMessage(newMessage));
      inputArea.innerHTML = '';
      clearInputArea(inputArea);
      socket.emit('chatMessage', {
        clientId,
        projectId,
        message: newMessage,
        avatarName,
        avatarColor,
        timestamp,
      }, (data: any) => console.log(data));
    };

    dispatch(addToInboxIncomingMessage({
      clientId,
      projectId,
      message: newMessage,
      avatarName,
      avatarColor,
      timestamp,
      successCallback,
    }));
  };

  const clearInputArea = (inputArea: any) => {
    setTimeout(() => {
      for (let i = 0; i < inputArea.children.length; i++) {
        inputArea.children[i].remove();
      }
    }, 0)
  };

  return (
    <div>
      <div className={styles.chatWrapper}>
        <div>
          {
            messages && messages.length > 0 &&
            messages.map((message, idx) => (
              <div
                className={`${message.username === 'client' ? styles.clientMessage : styles.teammateMessage} ${styles.messageWrapper}`}
                key={idx}
                dangerouslySetInnerHTML={{__html: message.message}}
              />
            ))
          }
        </div>

        <div
          className={styles.inputArea}
          placeholder='Введите сообщение'
          contentEditable
          onKeyDown={(e) => runOnKeys(e, sendMessage)}
        />
      </div>
    </div>
  );
}