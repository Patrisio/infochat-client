import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../../../components/Input/Input';
import Textarea from '../../../../components/Textarea/Textarea';
import Switcher from '../../../../components/Switcher/Switcher';
import ButtonsGroup from '../ButtonsGroup/ButtonsGroup';

import { updateChannelSettings } from '../../../../actions';
import styles from './generalSettingsBlock.module.scss';

import theme1 from '../../../../assets/theme1.png';
import theme2 from '../../../../assets/theme2.png';
import theme3 from '../../../../assets/theme3.png';
import { cloneDeep, debounce } from 'lodash';

interface Settings {
  chatName: '',
  greeting: '',
  backgroundImage: 1,
  buttonLocation: '',
  buttonScale: '',
  buttonText: '',
  infochatLinkEnabled: 1,
  customCss: '',
}

interface State {
  channels: [],
  settings: Settings,
}

interface RootState {
  channels: State,
}

interface Location {
  id: string,
  value: string,
}

interface Scale {
  id: string,
  value: string,
}

interface Props {
  setActiveTab?: () => void,
}

let defaultSettings: Settings | undefined;

export default function GeneralSettingsBlock({ setActiveTab }: Props) {
  const settings = useSelector((state: RootState) => state.channels.settings);
  let dispatch = useDispatch();
  
  if (!defaultSettings) defaultSettings = cloneDeep(settings);

  const generalSettingsBlockRef = useRef<HTMLDivElement>(null);

  const [isEnabledCustomCss, setIsEnabledCustomCss] = useState(Boolean(settings.customCss));
  const [hasChanges, toggleChanges] = useState(false);

  const chatBackgrounds = [
    {
      id: 1,
      imageSrc: theme1,
    },
    {
      id: 2,
      imageSrc: theme2,
    },
    {
      id: 3,
      imageSrc: theme3,
    },
    {
      id: 4,
      imageSrc: '',
    },
  ];

  const buttonLocation: Location[] = [
    {
      id: 'left',
      value: 'Внизу слева',
    },
    {
      id: 'right',
      value: 'Внизу справа',
    },
  ];

  const buttonScale: Scale[] = [
    {
      id: '1',
      value: '100%',
    },
    {
      id: '0.9',
      value: '90%',
    },
    {
      id: '0.8',
      value: '80%',
    },
    {
      id: '0.7',
      value: '70%',
    },
  ];

  const updateBlockSettings = (settings: any) => dispatch(updateChannelSettings(settings));

  const setActiveThemeCard = (e: any, elementIndex?: number) => {
    const themesCards = document.getElementsByClassName(styles.themeCard);

    const resetActiveStyles = () => {
      for (let i = 0; i < themesCards.length; i++) {
        const sidebarItem = themesCards[i];
        sidebarItem.className = styles.themeCard;
      }
    };

    if (typeof elementIndex === 'number') {
      resetActiveStyles();
      themesCards[elementIndex].className += ` ${styles.active}`;
    } else {
      const target = e.currentTarget;
      resetActiveStyles();
      target.className += ` ${styles.active}`;
    }
  };

  useEffect(() => {
    setActiveThemeCard(null, settings.backgroundImage - 1);
  }, [settings.backgroundImage]);

  return (
    <div ref={generalSettingsBlockRef}>
      <div>
        <p>Название чата</p>
        <Input
          type='text'
          fluid
          maxLength={30}
          value={settings.chatName}
          onChange={(e: any) => {
            updateBlockSettings({ chatName: e.target.value });
            toggleChanges(true);
          }}
        />
      </div>

      <div>
        <p>Приветствие</p>
        <Textarea
          value={settings.greeting}
          className={styles.textarea}
          maxLength={80}
          onChange={(e) => {
            updateBlockSettings({ greeting: e.target.value });
            toggleChanges(true);
          }}
        />
      </div>

      <div>
        <p>Фон чата</p>
        <div className={styles.themesContainer}>
          {
            chatBackgrounds.map((bg) => {
              return (
                <div
                  key={bg.id}
                  className={styles.themeCard}
                  onClick={(e) => {
                    if (bg.id === settings.backgroundImage) return;
                    setActiveThemeCard(e);
                    updateBlockSettings({ backgroundImage: bg.id });
                    toggleChanges(true);
                  }}
                >
                  {
                    bg.id !== 4 &&
                    <img
                      src={bg.imageSrc}
                      alt='chat-background'
                      className={styles.themeImage}
                    />
                  }
                </div>
              );
            })
          }
        </div>
      </div>

      <div className={styles.buttonsSettingsContaoner}>
        <div>
          <p>Расположение кнопки</p>
          <Input
            type='text'
            onSelect={(id) => {
              updateBlockSettings({ buttonLocation: id });
              toggleChanges(true);
            }}
            value={buttonLocation.find((location: Location) => location.id === settings.buttonLocation)?.value}
            fixedSelect
            readOnly
            classNames={styles.input}
            data={buttonLocation}
            width='170px'
          />
        </div>

        <div>
          <p>Масштаб кнопки</p>
          <Input
            type='text'
            onSelect={(id) => {
              updateBlockSettings({ buttonScale: id });
              toggleChanges(true);
            }}
            value={buttonScale.find((scale: Scale) => scale.id === settings.buttonScale)?.value}
            fixedSelect
            readOnly
            classNames={styles.input}
            data={buttonScale}
            width='130px'
          />
        </div>
      </div>

      <div>
        <div className={styles.buttonNoticeTitle}>
          <p>Надпись на кнопке</p>
          <span className={styles.lettersLimit}>16 символов</span>
        </div>

        <Input
          value={settings.buttonText}
          placeholder='Напишите нам!'
          type='text'
          fluid
          maxLength={16}
          onChange={(e) => {
            updateBlockSettings({ buttonText: e.target.value });
            toggleChanges(true);
          }}
        />
      </div>

      <div>
        <div className={styles.switcherContainer}>
          <Switcher
            value={Boolean(settings.infochatLinkEnabled)}
            onChange={(enable) => {
              const infochatLinkEnabled = enable ? 1 : 0;
              updateBlockSettings({ infochatLinkEnabled });
              toggleChanges(true);
            }}
          />
          <span className={styles.swictherLabel}>Ссылка на InfoChat</span>
        </div>

        <div className={styles.adviceNote}>
          <p className={styles.description}>Мы рекомендуем <span>не отключать ссылку</span>, так как вы будете получать отчисления со всех платежей тех клиентов, которые перешли и зарегистрировались по ссылке из вашего чата.</p>
          <p className={styles.price}>Отключение ссылки — 300 ₽/месяц.</p>
        </div>
      </div>

      <div>
        <div className={styles.switcherContainer}>
          <Switcher
            value={isEnabledCustomCss}
            onChange={(enable) => {
              setIsEnabledCustomCss(enable);
              toggleChanges(true);
            }}
          />
          <span className={styles.swictherLabel}>Собственный CSS</span>
        </div>
          
        <Textarea
          value={settings.customCss}
          className={styles.textarea}
          disabled={!isEnabledCustomCss}
          onChange={debounce((e) => {
            updateBlockSettings({ customCss: e.target.value });
            toggleChanges(true);
          }, 800)}
        />
      </div>

      <ButtonsGroup
        hasChanges={hasChanges}
        toggleChanges={toggleChanges}
        setActiveTab={setActiveTab}
        resetBlockSettings={() => {
          setIsEnabledCustomCss(Boolean(defaultSettings?.customCss));
          updateBlockSettings(defaultSettings);
        }}
      />
    </div>
  );
}