import { useState } from 'react';

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [result, setResult] = useState(null);

  const calculateROI = () => {
    const investment = parseFloat(initialInvestment);
    const value = parseFloat(finalValue);
    
    if (isNaN(investment) || isNaN(value)) {
      alert('Please fill all fields with valid numbers');
      return;
    }
    
    const roi = ((value - investment) / investment) * 100;
    setResult(roi.toFixed(2));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">ROI Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#FF477E] mb-1">Initial Investment</label>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 10000000"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Final Value</label>
          <input
            type="number"
            value={finalValue}
            onChange={(e) => setFinalValue(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 15000000"
          />
        </div>
      </div>

      <button
        onClick={calculateROI}
        className="w-full bg-gradient-to-r from-[#FF0A54] to-[#FF477E] text-white py-3 rounded-full font-semibold hover:from-[#FF477E] hover:to-[#FF0A54] transition-all"
      >
        Calculate ROI
      </button>

      {result !== null && (
        <div className="mt-6 p-4 bg-[#FFF0F3] rounded-lg text-center">
          <p className="text-lg text-[#FF477E] mb-1">Return on Investment</p>
          <p className="text-4xl font-bold text-[#FF0A54]">
            {result}%
          </p>
          <p className="text-[#FF477E] mt-2">
            {result >= 0 ? 'Positive' : 'Negative'} return
          </p>
        </div>
      )}
    </div>
  );
}