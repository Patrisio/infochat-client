import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Title from '../../components/Title/Title';
import Switcher from '../../components/Switcher/Switcher';
import Accordion from '../../components/Accordion2/Accordion2';

import InstallBlock from './components/InstallBlock/InstallBlock';
import GeneralSettingsBlock from './components/GeneralSettingsBlock/GeneralSettingsBlock';
import OperatorsBlock from './components/OperatorsBlock/OperatorsBlock';
import ClockBlock from './components/ClockBlock/ClockBlock';
import AutomationBlock from './components/AutomationBlock/AutomationBlock';
import ChatPreview from './components/ChatPreview/ChatPreview';

import styles from './channels.module.scss';
import cloneDeep from 'lodash/cloneDeep';
import { addChannel as addChannelAction, fetchChannels } from '../../actions';

import chat from '../../assets/chat.svg';
import chatChannels from '../../assets/chat-channels.svg';
import invite from '../../assets/invite.svg';
import clock from '../../assets/clock.svg';
import install from '../../assets/install.svg';
import operators from '../../assets/operators.svg';
import style from '../../assets/style.svg';

interface Channel {
  [key: string]: string,
}

interface Response {
  code: number,
  channels: Channel[],
}

interface ModalProps {
  show: boolean,
  title: string,
  body: React.ReactNode | null,
  footer: React.ReactNode | null,
  onClose: () => void,
  width: string,
  height?: string,
}

interface RootState {
  channels: {
    channels: Channel[]
  },
}

export default function Channels() {
  const [isModalAddChannelShow, setStateModal] = useState(false);
  // const [connectedChannels, setConnectedChannels] = useState<Channel[]>([]);
  const [currentModal, setModalProps] = useState<ModalProps>({
    show: false,
    title: '',
    body: null,
    footer: null,
    onClose: () => setStateModal(false),
    width: '',
    height: '',
  });
  const connectedChannels = useSelector((state: RootState) => state.channels.channels);
  let dispatch = useDispatch();
  let { projectId } = useParams<{ projectId: string }>();

  const getChannelPreview = (data: string) => {
    switch(data) {
      case 'chat':
        return chatChannels;
    }
  };

  const getChannelName = (name: string) => {
    switch(name) {
      case 'chat':
        return 'Чат на сайте';
    }
  };

  const getChannelStatus = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Ожидание';
      case 'disabled':
        return 'Выключено';
    }
  };

  const StatusSwitcher = (data: any) => {
    const [statuses, setStatus] = useState([data.status, 'disabled']);
    const [prevStatus, setNewStatus] = useState(data.status);

    return (
      <div className={styles.switcher}>
        <span className={`
          ${styles.switcherLabel}
          ${data.status === 'pending' ? styles.pending :
            data.status === 'disabled' ? styles.disabled : ''}
        `}>
          {getChannelStatus(data.status)}
        </span>
        <Switcher
          onChange={(value: boolean) => {
            const channel = connectedChannels.find((channel: Channel) => channel.name === data.name);

            if (channel) {
              if (prevStatus === 'disabled') {
                channel.status = data.status;
              }
              
              channel.status = statuses.find(((statusItem: string) => statusItem !== channel.status));
              setNewStatus(channel.status);
            }
          }}
          value={true}
        />
      </div>
    );
  };

  const panels = [
    {
      imageSrc: install,
      label: 'Установите чат на сайт',
      content: <InstallBlock/>,
    },
    {
      imageSrc: style,
      label: 'Основные настройки',
      content: <GeneralSettingsBlock />,
    },	
    {
      imageSrc: operators,
      label: 'Операторы',
      content: <OperatorsBlock />,
    },
    {
      imageSrc: clock,
      label: 'Часы работы',
      content: <ClockBlock />,
    },
    {
      imageSrc: invite,
      label: 'Автоматические действия',
      content: <AutomationBlock />
    },
  ];

  const columns = [
    {
      key: 'avatar',
      visible: true,
      headerComponent: (data: any) => (
        <Button
          type='button'
          background='transparent'
          stylesList={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#0a86f9',
            padding: '0',
          }}
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Добавить новый канал',
              body: <ModalBody />,
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          Добавить новый канал
        </Button>
      ),
      cellComponent: (data: any) => (
        <div className={styles.channelNameContainer}>
          <img src={getChannelPreview(data.name)} />
          <span className={styles.channelName}>{getChannelName(data.name)}</span>
        </div>
      ),
    },
    {
      key: 'name',
      visible: false,
      cellComponent: (data: any) => (
        <span className={styles.channel}>{getChannelName(data.name)}</span>
      ),
    },
    {
      key: 'status',
      visible: false,
      cellComponent: StatusSwitcher,
    },
    {
      key: 'action',
      visible: true,
      headerComponent: (data: any) => (
        <Button
          type='button'
          background='edit'
          stylesList={{
            background: '#fff',
            color: '#0a86f9',
            fontWeight: 400,
            padding: '10px',
            fontSize: '13px',
          }}
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Добавить новый канал',
              body: <ModalBody />,
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          + Добавить
        </Button>
      ),
      cellComponent: (data: any) => (
        <Button
          type='button'
          background='edit'
          stylesList={{
            fontWeight: 500,
            fontSize: '13px',
            padding: '10px 14px',
          }}
          onClick={() => setModalProps({
            show: true,
            title: 'Редактировать чат на сайте',
            body: (
              <div className={styles.modalBody}>
                <div className={styles.chatSettingsContainer}>
                  <Accordion panels={panels}/>
                </div>

                <ChatPreview />
              </div>
            ),
            footer: null,
            onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
            width: '900px',
            height: '90%',
          })}
        >
          Изменить
        </Button>
      ),
    },
  ];
  const channels = [
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: '#0084ff',
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: '#0084ff',
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: '#0084ff',
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: '#0084ff',
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: '#0084ff',
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: '#0084ff',
      title: 'Чат на сайте',
      id: 'chat',
    },
  ];

  useEffect(() => {
    getChannels();
  }, []);

  const getChannels = () => {
    dispatch(fetchChannels({ projectId }));
  };

  const addChannel = (id: string) => {
    dispatch(addChannelAction({ projectId, name: id }));
  };

  const ModalBody = () => {
    return (
      <div className={styles.modalBody}>
        {
          channels.map(({  imageSrc, alt, backgroundColor, title, id }, idx) => {
            const isAlreadyConnectedChannel = connectedChannels.find((channel: Channel) => channel.name === id);

            return (
              <div
                key={idx}
                className={`
                  ${styles.channelCard}
                  ${isAlreadyConnectedChannel && styles.disabledChannel}
                `}
                onClick={() => {
                  if (isAlreadyConnectedChannel) return;

                  addChannel(id);
                  setStateModal(false);
                }}
              >
                <div
                  className={styles.imageContainer}
                  style={{ backgroundColor }}
                >
                  <img
                    src={imageSrc}
                    alt={alt}
                  />
                </div>
                <p className={styles.title}>{title}</p>
              </div>
            );
          })
        }
      </div>
    );
  };

  return (
    <div className={styles.channelsContainer}>
      <Title text='Каналы' />

      <Table
        columns={columns}
        data={connectedChannels}
      />

      <Modal
        {...currentModal}
      />
    </div>
  );
}