import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import DataTable from './components/DataTable';
import Modal from './components/Modal';
import SymbolSelector from './components/SymbolSelector';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchData } from './store/dataSlice';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://fomo-assignment.onrender.com/');

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.data.data);
  const loading = useAppSelector((state) => state.data.loading);
  const error = useAppSelector((state) => state.data.error);

  const [symbol, setSymbol] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (symbol) {
      dispatch(fetchData(symbol)).catch((err) => {
        console.error('Failed to fetch data:', err);
      });
    }
  }, [dispatch, symbol]);

  React.useEffect(() => {
    const handleDataUpdate = (newData: any) => {
      if (!symbol) {
        dispatch({ type: 'data/fetchData/fulfilled', payload: [newData, ...data].slice(0, 20) });
      }
    };

    socket.on('dataUpdate', handleDataUpdate);

    return () => {
      socket.off('dataUpdate', handleDataUpdate);
    };
  }, [dispatch, data, symbol]);

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    dispatch(fetchData(newSymbol.toUpperCase())).catch((err) => {
      console.error('Failed to fetch data:', err);
    });
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setSymbol(null);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          <header className="App-header">
            <h1>Real-Time Crypto Data</h1>
            {symbol && <h2>Displaying data for: {symbol}</h2>}
          </header>
          <main>
            <button onClick={() => setIsModalOpen(true)} className="open-modal-button">
              Select Symbol
            </button>
            <button onClick={handleReset} className="reset-button">
              Reset
            </button>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable data={data} />
            )}
            {error && <p className="error">Error: {error.message}</p>}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <SymbolSelector onChange={handleSymbolChange} />
            </Modal>
          </main>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;
