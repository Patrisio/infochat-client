import React, { useState, useEffect, useRef } from 'react';
import styles from './panel.module.scss';

import arrowRight from '../../../../assets/arrow-right.svg';

interface Props {
  imageSrc: string,
  label: string,
  content: React.ReactNode,
  activeTab: number,
  index: number,
  activateTab: () => void,
}

export default function Panel({ imageSrc, label, content, activeTab, index, activateTab }: Props) {
  const [height, setHeight] = useState(0);
  const panelContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.setTimeout(() => {
      let height;
      const element = panelContentRef.current;

      if (element) {
        height = element.scrollHeight;
        setHeight(height);
      }
		}, 333);
  }, []);

  const isActive = activeTab === index;
  const innerStyle = {
    height:  `${isActive ? height : 0}px`
  }
    
  return (
    <div
      className={styles.panel}
      role='tabpanel'
      aria-expanded={isActive}
    >
      <button
        className={styles.panel__label}
        role='tab'
        onClick={activateTab}
      >
        <div className={styles.panelLabelBlock}>
          <div className={styles.icon}>
            <img src={imageSrc} alt='icon' />
          </div>

          <span>{ label }</span>
        </div>

        <div className={styles.arrow}>
          <img src={arrowRight} alt='arrow-right' />
        </div>
      </button>

      <div
        ref={panelContentRef}
        className={styles.panel__inner}
        style={innerStyle}
        aria-hidden={!isActive}
      >
        <div className={styles.panel__content}>
          { content }
        </div>
      </div>
    </div>
  );
}