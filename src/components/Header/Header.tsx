import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import CurrentUserInfo from '../CurrentUserInfo/CurrentUserInfo';
import { Context } from '../../context/Context';
import Switcher from '../Switcher/Switcher';
import Popup from '../Popup/Popup';
import Avatar from '../Avatar/Avatar';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faLayerGroup, faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  const [isOnline, toggleState] = useState(true);
  const { currentUser } = useContext(Context);
  const searchBy = [
    {
      id: 'text',
      value: 'Только в тексте',
    },
    {
      id: 'username',
      value: 'Только по имени',
    },
    {
      id: 'email',
      value: 'Только по email',
    },
    {
      id: 'phone',
      value: 'Только по телефону',
    },
  ];

  const switchState = (value: boolean) => {
    toggleState(value);
  };

  const PopupBodyUser = () => {
    return (
      <div className={styles.popup}>
        <p className={styles.email}>{ currentUser.email }</p>

        <div>
          <ul className={styles.list}>
            <li>
              <Link
                className={styles.link}
                to={`/profile`}
              >
                <div className={styles.icon}>
                  <FontAwesomeIcon icon={faUserEdit} />
                </div>
                <span>Изменить профиль</span>
              </Link>
            </li>
            <li>
              <Link
                className={styles.link}
                to={`/projects`}
              >
                <div className={styles.icon}>
                  <FontAwesomeIcon icon={faLayerGroup} />
                </div>
                <span>Мои проекты</span>
              </Link>
            </li>
          </ul>
        </div>

        <Link
          className={styles.link}
          to={`/projects`}
        >
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
          <span>Выход</span>
        </Link>
      </div>
    );
  };

  const selectOption = (id: string) => {
    console.log(id, '__ID__');
  };

  const PopupBodySearch = () => {
    return (
      <div>
        <p className={styles.title}>Поиск</p>

        <div className={styles.popupBodyContainer}>
          <div className={styles.selector}>
            <span className={styles.label}>Поиск по</span>
            <Input
              type='text'
              onSelect={selectOption}
              value={searchBy[0].value}
              fixedSelect
              readOnly
              classNames={styles.input}
              data={searchBy}
            />
          </div>

          <div className={styles.selector}>
            <span className={styles.label}>В канале</span>
            <Input
              type='text'
              onSelect={selectOption}
              value={searchBy[0].value}
              fixedSelect
              readOnly
              classNames={styles.input}
              data={searchBy}
            />
          </div>

          <div className={styles.selector}>
            <span className={styles.label}>Назначено</span>
            <Input
              type='text'
              onSelect={selectOption}
              value={searchBy[0].value}
              fixedSelect
              readOnly
              classNames={styles.input}
              data={searchBy}
            />
          </div>

          <div className={styles.searchButton}>
            <Button
              type='button'
              stylesList={{ padding: '8px' }}
              fluid
            >
              Поиск
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.searchContainer}>
        <FontAwesomeIcon
          icon={faSearch}
          className={styles.searchIcon}
          color='#aaa'
        />
        <Popup
          body={<PopupBodySearch />}
          width='337px'
        >
          <Input
            type='text'
            classNames={styles.search}
            placeholder='Поиск по людям или сообщениям'
            allowClear
          />
        </Popup>
      </div>

      <div className={styles.userBlock}>
        <div className={styles.userMenu}>
          <Avatar
            name={currentUser.username}
            size='medium'
          />
          <Popup
            body={<PopupBodyUser />}
            width='215px'
            center
          >
            <div className={styles.currentUserInfo}>
              <CurrentUserInfo />
            </div>
          </Popup>
        </div>

        <div className={styles.switcherBlock}>
          <span className={styles.stateLabel}>{ isOnline ? 'в сети' : 'не доступен' }</span>
          <Switcher
            onChange={switchState}
            value={true}
          />
        </div>
      </div>
    </header>
  );
}