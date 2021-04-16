import React, { useState, useEffect } from 'react';
import styles from './modal.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Props {
  show: boolean,
  onClose: () => void,
  title?: string,
  body: React.ReactNode | null,
  footer?: React.ReactNode | null,
  width?: string,
  height?: string,
  position?: 'center' | 'top',
}

export default function Modal({ show, onClose, title, body, footer, width, height, position = 'center' }: Props) {
  const closeModal = () => {
    onClose();
  };

  return (
    show ?
    <div>
      <div className={styles.overlay}>
        <div
          className={`
            ${styles.modalContent}
            ${position === 'center' ? styles.center : styles.top}
          `}
          style={{ width, height }}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>{ title }</h3>
            <div
              className={styles.closeIcon}
              onClick={closeModal}
            >
              <FontAwesomeIcon
                icon={faTimes}
                color='#ccc'
              />
            </div>
          </div>

          <div className={styles.modalBody}>
            { body }
          </div>

          {
            footer && 
            <div>
              { footer }
            </div>
          }
        </div>
      </div>
    </div> :
    null
  );
}