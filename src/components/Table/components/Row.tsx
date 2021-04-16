import React from 'react';
import Button from '../../Button/Button';
import Avatar from '../../Avatar/Avatar';
import styles from './row.module.scss';

interface Teammate {
  id: string,
  username: string,
  phone: string,
  email: string,
  avatar: string,
  role: string,
  status: string,
}

interface IData {
  row: any,
  columns: any
}

export default function Row({ row, columns }: IData) {
  return (
    <div
      className={styles.gridRow}
    >
      {
        columns.map((column: any, idx: number) => {
          return (
            <div
              key={idx}
              className={styles.gridCell}
            >
              { column.cellComponent ? column.cellComponent(row) : row[column.key] }
            </div>
          )
        })
      }
    </div>
  );
};