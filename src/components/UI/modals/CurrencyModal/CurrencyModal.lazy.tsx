import { lazy } from 'react';
import { CurrencyModalLoading } from './CurrencyModal.loading';

const CurrencyModalLazy = lazy(() => 
  import('./CurrencyModal').then(module => ({
    default: module.default
  }))
);

export { CurrencyModalLazy, CurrencyModalLoading };