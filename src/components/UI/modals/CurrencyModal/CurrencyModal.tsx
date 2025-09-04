import React, { useState, useMemo, useEffect, memo } from 'react';
import styles from './CurrencyModal.module.css';
import type { Currency } from '../../../../types';
import { SearchInput } from '../../form-elements/SearchInput/SearchInput';
import { getCurrencySymbol } from '../../../../utils/currencySymbols';
import CloseButton from '../../icons/CloseButton';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currencyCode: string) => void;
  currencies: Currency[];
  selectedCurrency: string;
  title?: string;
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currencies,
  selectedCurrency,
  title = 'Select currency'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoFocus, setIsAutoFocus] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencies;
    
    const term = searchTerm.toLowerCase();
    return currencies.filter(currency =>
      currency.code.toLowerCase().includes(term) ||
      currency.name.toLowerCase().includes(term) ||
      currency.symbol.toLowerCase().includes(term)
    );
  }, [currencies, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setIsAutoFocus(true);
      setFocusedIndex(0);
      const timer = setTimeout(() => setIsAutoFocus(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredCurrencies.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % filteredCurrencies.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + filteredCurrencies.length) % filteredCurrencies.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const currency = filteredCurrencies[focusedIndex];
        if (currency) handleCurrencySelect(currency.code);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCurrencies, focusedIndex]);

  const handleCurrencySelect = (currencyCode: string) => {
    onSelect(currencyCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose} />
      
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <p className={styles.modalDescription}>
            Choose a currency from the list below or use the search bar to find a specific currency.
          </p>
        </div>

        <div className={styles.searchContainer}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search currencies..."
            autoFocus={isAutoFocus}
          />
        </div>

        <div className={styles.currenciesList}>
          {filteredCurrencies.length === 0 ? (
            <div className={styles.noResults}>
              No currencies found for "{searchTerm}"
            </div>
          ) : (
            filteredCurrencies.map((currency, index) => (
              <button
                key={currency.code}
                type="button"
                className={`${styles.currencyItem} 
                  ${currency.code === selectedCurrency ? styles.selected : ''} 
                  ${index === focusedIndex ? styles.focused : ''}`}
                onClick={() => handleCurrencySelect(currency.code)}
              >
                <span className={styles.currencyCode}>{getCurrencySymbol(currency.code)}</span>
                <div className={styles.currencyContent}>
                  <span className={styles.currencyName}>{currency.name}</span>
                  <span className={styles.currencySymbol}>{currency.symbol}</span>
                </div>
              </button>
            ))
          )}
        </div>
        
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close modal"
        >
          <CloseButton/>
        </button>
      </div>
    </>
  );
};

export default memo(CurrencyModal);
