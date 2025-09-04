import React from 'react';
import styles from './CurrencyModal.module.css';

export const CurrencyModalLoading: React.FC = () => {
  return (
    <div className={styles.modalLoading}>
      <div className={styles.modalSpinner}></div>
      <p className={styles.modalLoadingText}>Loading currency list...</p>
    </div>
  );
};