import React from 'react';
import styles from './title.module.scss';

interface IProps {
  text: string
}

export default function Title({ text }: IProps) {
  return (
    <div>
      <h1 className={styles.title}>{ text }</h1>
    </div>
  );
}