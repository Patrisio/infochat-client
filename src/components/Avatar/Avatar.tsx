import React from 'react';
import CSS from 'csstype';
import styles from './avatar.module.scss';

interface IProps {
  name: string,
  size?: 'small' | 'medium' | 'large',
  stylesList?: CSS.Properties,
}

export default function Avatar({ name, size = 'medium', stylesList }: IProps) {
  const getUserInitials = (username: string) => {
    const nameAndSurname = username.split(' ');
    let initials = '';

    for (let word of nameAndSurname) {
      initials = initials.concat(word.charAt(0).toUpperCase());
    }

    return initials;
  };

  return (
    <div
      className={`
        ${styles.defaultAvatar}
        ${size === 'small' ? styles.small :
          size === 'large' ? styles.large : styles.medium} 
      `}
      style={stylesList}
    >
      {getUserInitials(name)}
    </div>
  );
}