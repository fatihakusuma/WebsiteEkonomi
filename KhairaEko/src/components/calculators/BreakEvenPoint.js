import { useState } from 'react';

export default function BreakEvenPoint() {
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCosts, setVariableCosts] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [result, setResult] = useState(null);

  const calculateBEP = () => {
    const fixed = parseFloat(fixedCosts);
    const variable = parseFloat(variableCosts);
    const price = parseFloat(pricePerUnit);
    
    if (isNaN(fixed) || isNaN(variable) || isNaN(price)) {
      alert('Please fill all fields with valid numbers');
      return;
    }
    
    if (price <= variable) {
      alert('Price per unit must be greater than variable cost per unit');
      return;
    }
    
    const bep = fixed / (price - variable);
    setResult(bep.toFixed(2));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Break Even Point Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-[#FF477E] mb-1">Fixed Costs</label>
          <input
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 5000000"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Variable Costs per Unit</label>
          <input
            type="number"
            value={variableCosts}
            onChange={(e) => setVariableCosts(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 25000"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Price per Unit</label>
          <input
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 50000"
          />
        </div>
      </div>

      <button
        onClick={calculateBEP}
        className="w-full bg-gradient-to-r from-[#FF0A54] to-[#FF477E] text-white py-3 rounded-full font-semibold hover:from-[#FF477E] hover:to-[#FF0A54] transition-all"
      >
        Calculate BEP
      </button>

      {result !== null && (
        <div className="mt-6 p-4 bg-[#FFF0F3] rounded-lg text-center">
          <p className="text-lg text-[#FF477E] mb-1">Break Even Point</p>
          <p className="text-4xl font-bold text-[#FF0A54]">
            {result} units
          </p>
          <p className="text-[#FF477E] mt-2">
            You need to sell {result} units to break even
          </p>
        </div>
      )}
    </div>
  );
}