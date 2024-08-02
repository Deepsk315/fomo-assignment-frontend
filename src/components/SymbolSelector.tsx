import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks'; // Use the typed useDispatch
import { fetchData } from '../store/dataSlice';

const SymbolSelector: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const dispatch = useAppDispatch(); // Use the typed dispatch

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchData(symbol));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={symbol} onChange={handleChange} placeholder="Enter symbol" />
        <button type="submit">Fetch Data</button>
      </form>
    </div>
  );
};

export default SymbolSelector;
