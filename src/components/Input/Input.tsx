import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './input.module.scss';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

interface IData {
  id?: string,
  icon?: string,
  value: string,
}

interface IInputProps {
  placeholder?: string,
  value?: string,
  type: string,
  name?: string,
  onChange?: (e: any) => void,
  onClick?: (item: {icon?: string, value: string}) => void,
  onSelect?: (arg0: string) => void,
  onBlur?: () => void,
  onFocus?: () => void,
  fluid?: boolean,
  width?: string,
  classNames?: string,
  data?: IData[],
  fixedSelect?: boolean,
  allowClear?: boolean,
  readOnly?: boolean,
  disabled?: boolean,
  addonAfter?: React.ReactNode,
  maxLength?: number,
};

export default function Input({
  placeholder,
  value = '',
  type = 'text',
  name,
  fluid,
  width,
  classNames,
  onChange,
  onClick,
  onSelect,
  onBlur,
  onFocus,
  data = [],
  fixedSelect,
  allowClear,
  readOnly,
  disabled,
  addonAfter,
  maxLength,
}: IInputProps) {
  const [isOpen, setOpen] = useState(false);
  const [fieldValue, setFieldValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setFieldValue(value), [value]);

  useEffect(() => {
    const clickHandler = (e: any) => {
      const target: any = e.target;

      if (!(inputRef.current && inputRef.current.contains(target))) {
        setOpen(false);
      }
    };

    if (data.length > 0) {
      document.addEventListener('click', clickHandler);
    }

    return document.removeEventListener('click', clickHandler);
  }, [isOpen]);

  return (
    <div
      className={styles.inputContainer}
    >
      <input
        readOnly={readOnly}
        ref={inputRef}
        placeholder={placeholder}
        value={fieldValue || value}
        type={type}
        name={name}
        className={`
          ${styles.input}
          ${fluid ? styles.fluid : null}
          ${classNames}
        `}
        style={fluid ? { width: '100%' } : { width }}
        onChange={(e) => {
          onChange && onChange(e);
          setFieldValue(e.target.value);
        }}
        onFocus={() => {
          setOpen(true);
          onFocus && onFocus();
        }}
        onBlur={onBlur}
        disabled={disabled}
        maxLength={maxLength}
      />

      {
        addonAfter
      }

      {
        allowClear && fieldValue &&
        <div
          className={styles.clearSearchFieldIcon}
          onClick={() => {
            setFieldValue('');
          }}
        >
          <FontAwesomeIcon
            icon={faTimesCircle}
            color='#aaa'
            size='lg'
          />
        </div>
      }

      {
        isOpen && data.length > 0 &&
        <OutsideClickHandler
          onOutsideClick={(e: any) => {
            const target = e.target;
            const inputNode = inputRef.current;

            if (inputNode && !inputNode.contains(target)) {
              setOpen(false);
            }
          }}
        >
          <div className={styles.popup}>
            {
              data.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (fixedSelect) {
                        if (item.value !== fieldValue) {
                          setFieldValue(item.value)
                          if (onSelect && item.id) onSelect(item.id);
                          setOpen(false);
                        }

                        return;
                      }

                      setOpen(false);
                      onClick!(item);
                    }}
                  >
                    {item.icon && <img src={item.icon} />}
                    <p className={styles.popupValue}>{item.value}</p>
                  </div>
                );
              })
            }
          </div>
        </OutsideClickHandler>
      }
    </div>
  );
}