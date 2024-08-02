import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { fetchData } from '../src/store/dataSlice';
import DataTable from '../src/components/DataTable';
import SymbolSelector from '../src/components/SymbolSelector';
import io from 'socket.io-client';

const socket = io('http://localhost:4002'); // Adjust the URL if necessary

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.data.data);
  const loading = useAppSelector((state) => state.data.loading);
  const error = useAppSelector((state) => state.data.error);

  useEffect(() => {
    dispatch(fetchData('BTC'));

    socket.on('dataUpdate', (newData) => {
      dispatch({ type: 'data/fetchData/fulfilled', payload: [newData, ...data].slice(0, 5) });
    });

    return () => {
      socket.off('dataUpdate');
    };
  }, [dispatch, data]);

  return (
    <div className="App">
      <SymbolSelector />
      {loading ? <p>Loading...</p> : <DataTable data={data} />}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default App;
