import React, { useState, cloneElement } from 'react';
import Panel from './components/Panel/Panel';
import styles from './accordion2.module.scss';

interface Panel {
  imageSrc: string,
  label: string,
  content: React.ReactElement,
}

interface Props {
  panels: Panel[],
}

export default function Accordion({ panels }: Props) {
  const [activeTab, setActiveTab] = useState<number>(0);
	
	const activateTab = (index: number) => {
    setActiveTab(prev => prev === index ? -1 : index );
  }

  return (
    <div className={styles.accordion} role='tablist'>
      {panels.map((panel: Panel, index) => {
        const updatedPanel = Object.assign(panel, { content: cloneElement(panel.content, { setActiveTab }) });

        return (
          <Panel
            key={index}
            activeTab={activeTab}
            index={index}
            {...updatedPanel} 
            activateTab={() => activateTab(index)}
          />
        );
      })}
    </div>
  );
}