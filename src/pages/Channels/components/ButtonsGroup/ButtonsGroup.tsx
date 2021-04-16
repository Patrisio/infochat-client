import React, { useState, useEffect } from 'react';

import Button from '../../../../components/Button/Button';
import styles from './buttonsGroup.module.scss';

interface Props {
  hasChanges: Boolean,
  toggleChanges: (bool: boolean) => void,
  setActiveTab?: (index: number) => void,
  resetBlockSettings: () => void,
}

export default function ButtonsGroup({ hasChanges, toggleChanges, setActiveTab, resetBlockSettings }: Props) {
  const [isOpenButtonsGroup, toggleState] = useState(hasChanges);

  useEffect(() => {
    toggleState(hasChanges);
  }, [hasChanges]);

  return (
    <div className={styles.footer}>
      {
        isOpenButtonsGroup ? 
        <>
          <Button
            type='button'
            fluid
            stylesList={{
              padding: '10px',
            }}
            onClick={() => {
              toggleChanges(false);
            }}
          >
            Сохранить
          </Button>
          <Button
            type='button'
            background='edit'
            fluid
            stylesList={{
              marginLeft: '10px',
              padding: '10px',
            }}
            onClick={() => {
              toggleChanges(false);
              setActiveTab && setActiveTab(-1);
              resetBlockSettings();
            }}
          >
            Отмена
          </Button>
        </> :
        <Button
          type='button'
          background='edit'
          stylesList={{
            padding: '10px 46px',
          }}
          onClick={() => setActiveTab && setActiveTab(-1)}
        >
          Закрыть
        </Button>
      }
    </div>
  );
}