import React from 'react';
import CSS from 'csstype';
import styles from './sidebarItem.module.scss';

interface IProps {
  name?: string,
  count?: number,
  icon?: React.ReactNode,
  onClick?: () => void,
  stylesList?: CSS.Properties | undefined,
  mode?: 'light' | 'dark',
}

interface Item {
  name: string,
  count?: number,
  onClick?: () => void
}

export default function SidebarList({ name, count, icon, onClick, stylesList, mode = 'dark' }: IProps ) {
  const setActiveSidebarItem = (e: any) => {
    const target = e.currentTarget;
    const sidebarItems = document.getElementsByClassName(styles.listItem);

    for (let i = 0; i < sidebarItems.length; i++) {
      const sidebarItem = sidebarItems[i];
      sidebarItem.className = `${styles.listItem} ${mode === 'dark' ? styles.dark : styles.light}`;
    }

    target.className += ` ${styles.active}`;
  };

  const displayMesssagesCount = Boolean(count && count > 0) && <span className={styles.count}>{count}</span>;

  return (
    <div
      className={`
        ${styles.listItem}
        ${mode === 'light' ? styles.light : styles.dark}
      `}
      onClick={(e) => {
        setActiveSidebarItem(e);
        onClick!();
      }}
    >
      <div className={styles.iconAndName}>
        {icon}
        <span style={stylesList}>{name}</span>
      </div>
      { displayMesssagesCount }
    </div>
  );
}