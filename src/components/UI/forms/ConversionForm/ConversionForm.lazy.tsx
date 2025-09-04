import { lazy } from 'react';
import { ConversionFormLoading } from './ConversionForm.loading';

const ConversionFormLazy = lazy(() => 
  import('./ConversionForm').then(module => ({
    default: module.default
  }))
);

export { ConversionFormLazy, ConversionFormLoading };