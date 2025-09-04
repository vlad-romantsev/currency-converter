import React, { memo } from 'react';
import styles from './ConvertButton.module.css';
import RefreshIcon from '../../icons/RefreshIcon';

interface ConvertButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ConvertButtonComponent: React.FC<ConvertButtonProps> = ({
  onClick,
  disabled = false,
  loading = false
}) => {
  return (
    <button
      type="button"
      className={styles.convertButton}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <div className={styles.spinner}></div>
          Loading...
        </>
      ) : (
        <>
          <RefreshIcon/>
          Refresh Rates
        </>
      )}
    </button>
  );
};

export const ConvertButton = memo(ConvertButtonComponent);
