import { useState, useEffect } from 'react';

const categories = [
  { 
    id: 'length', 
    name: 'Panjang', 
    units: [
      { name: 'Meter', factor: 1 },
      { name: 'Kilometer', factor: 1000 },
      { name: 'Sentimeter', factor: 0.01 },
      { name: 'Milimeter', factor: 0.001 },
      { name: 'Inch', factor: 0.0254 },
      { name: 'Feet', factor: 0.3048 },
      { name: 'Yard', factor: 0.9144 },
      { name: 'Mile', factor: 1609.344 }
    ]
  },
  { 
    id: 'mass', 
    name: 'Massa', 
    units: [
      { name: 'Kilogram', factor: 1 },
      { name: 'Gram', factor: 0.001 },
      { name: 'Miligram', factor: 0.000001 },
      { name: 'Pound', factor: 0.453592 },
      { name: 'Ounce', factor: 0.0283495 },
      { name: 'Ton', factor: 1000 }
    ]
  },
  { 
    id: 'volume', 
    name: 'Volume', 
    units: [
      { name: 'Liter', factor: 1 },
      { name: 'Mililiter', factor: 0.001 },
      { name: 'Gallon', factor: 3.78541 },
      { name: 'Quart', factor: 0.946353 },
      { name: 'Pint', factor: 0.473176 },
      { name: 'Cup', factor: 0.24 },
      { name: 'Barrel (oil)', factor: 158.987 }
    ]
  },
  { 
    id: 'temperature', 
    name: 'Suhu', 
    units: [
      { name: 'Celsius', factor: 1, offset: 0 },
      { name: 'Fahrenheit', factor: 5/9, offset: -32 },
      { name: 'Kelvin', factor: 1, offset: -273.15 }
    ]
  },
  { 
    id: 'energy', 
    name: 'Energi', 
    units: [
      { name: 'Joule', factor: 1 },
      { name: 'Kilojoule', factor: 1000 },
      { name: 'Kalori', factor: 4.184 },
      { name: 'Kilokalori', factor: 4184 },
      { name: 'kWh', factor: 3600000 }
    ]
  },
  { 
    id: 'economic', 
    name: 'Ekonomi', 
    units: [
      { name: 'Barrel (minyak)', factor: 1 },
      { name: 'Ton CO2', factor: 1 },
      { name: 'Dollar AS', factor: 1 },
      { name: 'Euro', factor: 1.07 }
    ]
  }
];

export default function UnitConverter() {
  const [category, setCategory] = useState(categories[0]);
  const [fromUnit, setFromUnit] = useState(categories[0].units[0]);
  const [toUnit, setToUnit] = useState(categories[0].units[1]);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    convert();
  }, [category, fromUnit, toUnit, inputValue]);

  const convert = () => {
    if (inputValue === '') {
      setResult('');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('Invalid input');
      return;
    }

    if (category.id === 'temperature') {
      // Handle temperature separately
      let converted;
      if (fromUnit.name === 'Celsius') {
        if (toUnit.name === 'Fahrenheit') {
          converted = (value * 9/5) + 32;
        } else if (toUnit.name === 'Kelvin') {
          converted = value + 273.15;
        } else {
          converted = value;
        }
      } else if (fromUnit.name === 'Fahrenheit') {
        if (toUnit.name === 'Celsius') {
          converted = (value - 32) * 5/9;
        } else if (toUnit.name === 'Kelvin') {
          converted = (value - 32) * 5/9 + 273.15;
        } else {
          converted = value;
        }
      } else if (fromUnit.name === 'Kelvin') {
        if (toUnit.name === 'Celsius') {
          converted = value - 273.15;
        } else if (toUnit.name === 'Fahrenheit') {
          converted = (value - 273.15) * 9/5 + 32;
        } else {
          converted = value;
        }
      }
      setResult(converted.toFixed(2));
    } else {
      // Handle other conversions
      const baseValue = (value - (fromUnit.offset || 0)) * fromUnit.factor;
      const converted = (baseValue / toUnit.factor) + (toUnit.offset || 0);
      setResult(converted.toFixed(2));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Unit Converter</h2>
      
      <div className="mb-4">
        <label className="block text-[#FF477E] mb-2">Kategori</label>
        <select
          value={category.id}
          onChange={(e) => {
            const selectedCategory = categories.find(cat => cat.id === e.target.value);
            setCategory(selectedCategory);
            setFromUnit(selectedCategory.units[0]);
            setToUnit(selectedCategory.units[1]);
          }}
          className="w-full p-2 border border-[#FFB3C6] rounded"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-[#FF477E] mb-2">Dari</label>
          <select
            value={fromUnit.name}
            onChange={(e) => setFromUnit(category.units.find(unit => unit.name === e.target.value))}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          >
            {category.units.map(unit => (
              <option key={unit.name} value={unit.name}>{unit.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-[#FF477E] mb-2">Ke</label>
          <select
            value={toUnit.name}
            onChange={(e) => setToUnit(category.units.find(unit => unit.name === e.target.value))}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          >
            {category.units.map(unit => (
              <option key={unit.name} value={unit.name}>{unit.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-[#FF477E] mb-2">Nilai</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="Masukkan nilai"
          />
        </div>
      </div>

      {result !== '' && (
        <div className="p-4 bg-[#FFF0F3] rounded-lg text-center">
          <p className="text-2xl font-bold text-[#FF0A54]">
            {inputValue} {fromUnit.name} = {result} {toUnit.name}
          </p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-[#FF477E] mb-2">Satuan Ekonomi Populer</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.find(c => c.id === 'economic').units.map(unit => (
            <div key={unit.name} className="bg-[#FFE5EC] p-3 rounded-lg text-center">
              <p className="text-[#FF0A54] font-medium">{unit.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}