import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { CurrencySelect } from '../../form-elements/CurrencySelect/CurrencySelect';
import { SwapButton } from '../../buttons/SwapButton/SwapButton';
import { ConvertButton } from '../../buttons/ConvertButton/ConvertButton';
import { CurrencyInput } from '../../form-elements/CurrencyInput/CurrencyInput';
import { useExchangeRates } from '../../../../hooks/useExchangeRates';
import { useCurrencies } from '../../../../hooks/useCurrencies';
import { calculateConversion } from '../../../../utils/calculation';
import { formatCacheDateCustom } from '../../../../utils/cache';
import styles from './ConversionForm.module.css';
import { NetworkStatus } from '../../NetworkStatus';
import ClockIcon from '../../icons/ClockIcon';
import { getCurrencySymbol } from '../../../../utils/currencySymbols';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useDebouncedCallback } from '../../../../hooks/useDebouncedCallback';

interface ConversionFormProps {
  loading: boolean;
}

const ConversionForm: React.FC<ConversionFormProps> = ({ loading }) => {
  const { rates, isOnline, refreshRates, lastUpdated } = useExchangeRates();
  const { currencies, loading: currenciesLoading } = useCurrencies();
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [inverseResult, setInverseResult] = useState<number | null>(null);
  const debouncedAmount = useDebounce(amount, 250);

  useEffect(() => {
    const savedState = localStorage.getItem('conversion_state');
    if (savedState) {
      try {
        const { amount: savedAmount, from: savedFrom, to: savedTo } = JSON.parse(savedState);
        if (savedAmount) setAmount(savedAmount);
        if (savedFrom) setFromCurrency(savedFrom);
        if (savedTo) setToCurrency(savedTo);
      } catch (error) {
        console.warn('Failed to parse saved conversion state');
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      amount,
      from: fromCurrency,
      to: toCurrency
    };
    localStorage.setItem('conversion_state', JSON.stringify(stateToSave));
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    if (!debouncedAmount || !rates || fromCurrency === toCurrency) {
      setResult(null);
      setInverseResult(null);
      return;
    }
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const conversionResult = calculateConversion(
        parseFloat(debouncedAmount.replace(',', '.')),
        fromCurrency,
        toCurrency,
        rates.rates,
        rates.base
      );
      const inverseResult = calculateConversion(
        parseFloat(debouncedAmount.replace(',', '.')),
        toCurrency,
        fromCurrency,
        rates.rates,
        rates.base
      );
      
      const roundedResult = Math.round(conversionResult * 1000000) / 1000000;
      const roundedInverse = Math.round(inverseResult * 1000000) / 1000000;
      
      setResult(roundedResult);
      setInverseResult(roundedInverse);
      setIsCalculating(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [debouncedAmount, fromCurrency, toCurrency, rates]);

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = useCallback((value: string) => {
    if (/^[0-9]*[.,]?[0-9]*$/.test(value) || value === '') {
      setAmount(value);
    }
  }, []);

  const formatResultTwoDigits = useMemo(() => {
    if (result === null) return '-';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(result);
  }, [result]);

  const formatResultSixDigits = useMemo(() => {
    if (result === null) return '-';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 6, 
      maximumFractionDigits: 6  
    }).format(result);
  }, [result]);

  const formatInverseResultSixDigits = useMemo(() => {
    if (inverseResult === null) return '-';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6  
    }).format(inverseResult);
  }, [inverseResult]);

  const formattedDate = formatCacheDateCustom(lastUpdated);

  const debouncedRefresh = useDebouncedCallback(refreshRates, 1000);

  return (
    <div className={styles.formWrapper}>
      <div className={styles.statusBar}>
        <NetworkStatus isOnline={isOnline} />
        <p className={styles.lastUpdatedText}> {<ClockIcon/>} Last updated: {formattedDate}</p>
        <ConvertButton
          onClick={debouncedRefresh}
          disabled={!isOnline}
          loading={loading}
        />
      </div>
      <div className={styles.formElements}>
        <div className={styles.form}>
          <CurrencyInput
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              disabled={loading}
              label='Amount'
          />
          <div className={styles.inputGroup}>
              <CurrencySelect
                value={fromCurrency}
                onChange={setFromCurrency}
                currencies={currencies}
                loading={currenciesLoading}
                label="From"
              />
              <SwapButton onClick={handleSwapCurrencies} disabled={loading} />

              <CurrencySelect
                  value={toCurrency}
                  onChange={setToCurrency}
                  currencies={currencies}
                  loading={currenciesLoading}
                  label="To"
              />
          </div>
        </div>
        <div className={styles.resultDisplay}>
          <div className={styles.resultLabel}>Conversion result</div>
          <div className={styles.resultValueWrapper}>
            <div className={styles.resultValueTo}>
              {isCalculating ? (
                <div className={styles.skeleton}>Calculating...</div>
              ) : (
                `${getCurrencySymbol(toCurrency)} ${formatResultTwoDigits}`
              )}
            </div>
            <div className={styles.resultValueFrom}>{amount ? amount : 0} {fromCurrency} {'='}  </div>
          </div>
          <div className={styles.listRates}>
            <div className={styles.rate}>
              <p className={styles.rateTitle}>Exchange Rate</p>
              <p className={styles.rateValue}>{amount} {fromCurrency} {'='} {formatResultSixDigits} {toCurrency}</p>
            </div>
            <div className={styles.rate}>
              <p className={styles.rateTitle}>Inverse Rate</p>
              <p className={styles.rateValue}>{amount} {toCurrency} {'='} {formatInverseResultSixDigits} {fromCurrency}</p>
            </div>
          </div>
          <p className={styles.ratesDescription}>Rates are for informational purposes only and may not reflect real-time market rates</p>
        </div>
      </div>
    </div>
  );
};

export default memo(ConversionForm);