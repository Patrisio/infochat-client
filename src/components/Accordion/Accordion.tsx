import React, { useState } from 'react';
import styles from './accordion.module.scss';

interface IProps {
  title: string,
  children: React.ReactNode
}

export default function Accordion({ title, children }: IProps) {
  const [isOpened, toggleOpen] = useState(true);

  return (
    <div className={styles.accordion}>
      <div
        onClick={() => toggleOpen(prev => !prev)}
        className={styles.accordionHeader}
      >
        <p className={styles.accordionTitle}>
          { title }
        </p>
      </div>

      {
        isOpened &&
        <div className={styles.accordionBody}>
          { children }
        </div>
      }
    </div>
  );
}