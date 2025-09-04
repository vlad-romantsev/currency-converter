import React, { memo } from 'react';
import styles from './SwapButton.module.css';
import SwitchIcon from '../../icons/SwitchIcon';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SwapButtonComponent: React.FC<SwapButtonProps> = ({
  onClick,
  disabled = false
}) => {
  return (
    <button
      type="button"
      className={styles.swapButton}
      onClick={onClick}
      disabled={disabled}
      aria-label="Swap currencies"
    >
      <SwitchIcon/>
    </button>
  );
};

export const SwapButton = memo(SwapButtonComponent);