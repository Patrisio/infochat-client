import React from 'react';
import CSS from 'csstype';
import styles from './Button.module.scss';

interface IButtonProps {
  children: React.ReactNode,
  type: 'submit' | 'reset' | 'button',
  fluid?: boolean,
  size?: string,
  background?: string,
  onClick?: () => void,
  stylesList?: CSS.Properties | undefined,
  disabled?: boolean,
}

export default function Button({
  children,
  type,
  fluid,
  size,
  background,
  onClick,
  stylesList,
  disabled
}: IButtonProps) {

  return (
    <button
      className={`
        ${styles.button}
        ${background === 'edit' ? styles.edit :
          background === 'delete' ? styles.delete :
          background === 'success' ? styles.success : 
          background === 'transparent' ? styles.transparent :styles.default
        }
        ${fluid ? styles.fluid : null}
        ${size === 'large' ? styles.large :
          size === 'medium' ? styles.medium :
          size === 'small' ? styles.small : null
        }
      `}
      style={stylesList}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      { children }
    </button>
  );
}