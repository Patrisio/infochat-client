import React, { useState, useEffect } from 'react';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import styles from './textarea.module.scss';

interface Props {
  value?: string,
  className?: string,
  onChange?: (e: any) => void,
  maxLength?: number,
  disabled?: boolean,
}

export default function Textarea({ value, className, onChange, maxLength, disabled }: Props) {
  const [textareaValue, setTextareaValue] = useState(value);
  
  useEffect(() => {
    setTextareaValue(value);
  }, [value]);

  return (
    <textarea
      className={styles.textarea}
      value={textareaValue}
      onChange={(e) => {
        onChange && onChange(e);
        setTextareaValue(e.target.value);
      }}
      maxLength={maxLength}
      disabled={disabled}
    />
  );
}