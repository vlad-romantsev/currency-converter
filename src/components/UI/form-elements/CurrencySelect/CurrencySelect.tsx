import React, { memo, Suspense, useState } from 'react';
import styles from './CurrencySelect.module.css';
import type { Currency } from '../../../../types';
import { getCurrencySymbol } from '../../../../utils/currencySymbols';
import { CurrencyModalLazy, CurrencyModalLoading } from '../../modals/CurrencyModal/CurrencyModal.lazy';

interface CurrencySelectProps {
  value: string;
  onChange: (currencyCode: string) => void;
  currencies: Currency[];
  loading?: boolean;
  label: string;
}

const CurrencySelectComponent: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
  currencies,
  loading = false,
  label
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCurrency = currencies.find(currency => currency.code === value);

  const handleOpenModal = () => {
    if (!loading) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectCurrency = (currencyCode: string) => {
    onChange(currencyCode);
  };

  return (
    <div className={styles.currencySelect}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selectContainer}>
        <button
          type="button"
          className={styles.selectButton}
          onClick={handleOpenModal}
          disabled={loading}
        >
          {loading ? (
            <div className={styles.loadingText}>
              <div className={styles.loadingSpinner}></div>
              Loading...
            </div>
          ) : selectedCurrency ? (
            <div className={styles.selectButtonContent}>
              <span className={styles.currencyCode}>
                {getCurrencySymbol(selectedCurrency.code)}
              </span>
              <div className={styles.currencyContent}>
                <span className={styles.currencyName}>
                  {selectedCurrency.name}
                </span>
                <span className={styles.currencySymbol}>
                  {selectedCurrency.symbol}
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.selectButtonContent}>
              <span className={styles.currencyCode}>
                {getCurrencySymbol(value)}
              </span>
              <div className={styles.currencyContent}>
                <span className={styles.currencyName}>
                  {value}
                </span>
                <span className={styles.currencySymbol}>
                  {value}
                </span>
              </div>
            </div>
          )}
        </button>
      </div>
      <Suspense fallback={<CurrencyModalLoading />}>
        <CurrencyModalLazy
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSelect={handleSelectCurrency}
          currencies={currencies}
          selectedCurrency={value}
        />
      </Suspense>
    </div>
  );
};

export const CurrencySelect = memo(CurrencySelectComponent);