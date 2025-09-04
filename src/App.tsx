import { Suspense } from 'react'; 
import { useExchangeRates } from './hooks/useExchangeRates';
import './index.css';
import { ConversionFormLazy, ConversionFormLoading } from './components/UI/forms/ConversionForm/ConversionForm.lazy';
function App() {
  const {loading } = useExchangeRates();

  return (
    <div>
      <header className="app-header-wrapper">
        <div className="app-header">
          <h1 className='header-title'>Currency Converter</h1>
          <p className="header-description">Get real-time exchange rates</p>
        </div>
      </header>
      
      <main className="app-main">
        <Suspense fallback={<ConversionFormLoading />}>
          <ConversionFormLazy loading={loading} />
        </Suspense>      
      </main>
    </div>
  );
}

export default App;