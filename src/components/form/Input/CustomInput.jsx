import React, { useState, useEffect } from 'react';
import styles from './CustomInput.module.css';

const CustomInput = React.memo(
  ({
    value,
    label,
    inputRef,
    name,
    placeholder,
    type,
    onChange,
    required,
    error,
    description,
    maxLength,
    test,
    testError,
  }) => {
    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
      setIsFilled(!!value);
    }, [value]);

    const handleClearInput = () => {
      onChange({ target: { name, value: '' } });
    };

    return (
      <div>
        <div className={styles.inp}>
          <input
            type={type}
            value={value}
            name={name}
            id={name}
            ref={inputRef}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            maxLength={maxLength}
            data-testid={test ? test : undefined}
          />

          {label && (
            <label htmlFor={name} className={styles.label}>
              {label}
            </label>
          )}
          {isFilled && (
            <span className="cross-icon" onClick={handleClearInput}>
              Close
            </span>
          )}
        </div>
        {description && <div className="input-description">{description}</div>}
        {error && (
          <div
            className="error-message"
            data-testid={testError ? testError : undefined}
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

export default CustomInput;
