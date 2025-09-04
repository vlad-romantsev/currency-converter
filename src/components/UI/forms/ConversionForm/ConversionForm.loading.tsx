import React from 'react';
import styles from './ConversionForm.module.css';

export const ConversionFormLoading: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.formSpinner}></div>
      <p className={styles.loadingText}>Loading currency converter...</p>
    </div>
  );
};