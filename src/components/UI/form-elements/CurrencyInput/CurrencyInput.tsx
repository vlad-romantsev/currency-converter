import React, { memo } from 'react';
import styles from './CurrencyInput.module.css';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

const CurrencyInputComponent: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter amount',
  disabled = false,
  label = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(',', '.');

    if (/^[0-9]*\.?[0-9]*$/.test(inputValue) || inputValue === '') {
      onChange(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9.,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.currencyInput}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.input}
        inputMode="decimal"
      />
    </div>
  );
};

export const CurrencyInput = memo(CurrencyInputComponent);
