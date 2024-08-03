import React, { useState } from 'react';
import Select from 'react-select';

interface SymbolSelectorProps {
  onChange: (newSymbol: string) => void;
}

const symbolOptions = [
  { value: 'BTC', label: 'BTC' },
  { value: 'ETH', label: 'ETH' },
  { value: 'USDT', label: 'USDT' },
  { value: 'SOL', label: 'SOL' },
  { value: 'BNB', label: 'BNB' },
];

const SymbolSelector: React.FC<SymbolSelectorProps> = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption.value);
  };

  return (
    <div className="symbol-selector">
      <Select
        options={symbolOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder="Select symbol"
        className="symbol-select"
      />
    </div>
  );
};

export default SymbolSelector;
