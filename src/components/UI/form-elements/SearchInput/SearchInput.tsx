import React, { memo } from 'react';
import styles from './SearchInput.module.css';
import SearchIcon from '../../icons/SearchIcon';
import SearchIconGray from '../../icons/SearchIconGray';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const SearchInputComponent: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false,
  autoFocus = false
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onChange('');
    }
  };

  const showGrayIcon = value.length === 0;

  return (
    <div className={styles.searchInput}>
      <div className={styles.inputWrapper}>
        {showGrayIcon ? (
          <SearchIconGray className={styles.searchIcon}/>
        ) : (
          <SearchIcon className={styles.searchIcon}/>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          autoFocus={autoFocus}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            disabled={disabled}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export const SearchInput = memo(SearchInputComponent);
