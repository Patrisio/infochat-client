import React, { useState } from 'react';
import styles from './popup.module.scss';
import OutsideClickHandler from 'react-outside-click-handler';

interface IProps {
  children: React.ReactNode,
  body: React.ReactNode,
  width?: string,
  center?: boolean,
  onClick?: () => void,
}

export default function Popup({ children, width = '200px', body, center, onClick }: IProps) {
  const [isOpen, toggle] = useState(false);

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        toggle(false);
      }}
    >
      <div className={styles.popupContainer}>
        <div onClick={() => {
          toggle(prev => !prev);
          onClick && onClick!();
        }}>
          {children}
        </div>

        {
          isOpen &&
          <div
            className={`
              ${styles.popup}
              ${center && styles.center}
            `}
            style={{
              width
            }}
          >
            { body }
          </div>
        }
      </div>
    </OutsideClickHandler>
  );
}