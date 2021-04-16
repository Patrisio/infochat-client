import React from 'react';
import { Link } from 'react-router-dom';
import { useParams, useHistory } from 'react-router';
import Sidebar from '../../components/Sidebar/Sidebar';
import Teammates from '../Teammates/Teammates';
import Start from '../Start/Start';
import Channels from '../Channels/Channels';

import SidebarList from '../../components/Sidebar/components/SidebarList/SidebarList';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

import styles from './settings.module.scss';


interface IProps {
  children: React.ReactNode,
}

export default function Settings() {
  let { projectId, pageId } = useParams<{ projectId: string, pageId: string }>();
  const history = useHistory();

  const settingsTitle = () => (
    <Link
      className={styles.title}
      to={`/project/${projectId}/settings/start`}
    >
      Настройки
    </Link>
  );

  const formatSettings = () => {
    const channels = {
      name: 'Каналы',
      stylesList: {
        color: '#363636',
      },
      onClick: () => history.push(`/project/${projectId}/settings/channels`),
    };
    const teammates = {
      name: 'Сотрудники',
      stylesList: {
        color: '#363636',
      },
      onClick: () => {
        history.push({
          pathname: `/project/${projectId}/settings/teammates`,
          state: { page: 'teammates' }
        })
      },
    };

    const dialogs = [channels, teammates];

    return dialogs;
  };

  const displayPage = () => {
    switch (pageId) {
      case 'start':
        return <Start />
      case 'teammates':
        return <Teammates />
      case 'channels':
        return <Channels />
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <Sidebar mode='light'>
        <Link
          className={styles.link}
          to={`/project/${projectId}/inbox/opened`}
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          <span className={styles.linkText}>Закрыть настройки</span>
        </Link>

        <SidebarList
          mode='light'
          title={settingsTitle()}
          listItems={formatSettings()}
        />
      </Sidebar>

      {displayPage()}
    </div>
  );
}