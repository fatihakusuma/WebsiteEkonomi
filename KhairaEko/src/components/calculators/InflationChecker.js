import { useState } from 'react';

export default function InflationChecker() {
  const [initialAmount, setInitialAmount] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [result, setResult] = useState(null);

  const calculateInflation = () => {
    const amount = parseFloat(initialAmount);
    const start = parseInt(startYear);
    const end = parseInt(endYear);
    const rate = parseFloat(inflationRate) / 100;
    
    if (isNaN(amount) || isNaN(start) || isNaN(end) || isNaN(rate)) {
      alert('Please fill all fields with valid numbers');
      return;
    }
    
    const years = end - start;
    const futureValue = amount * Math.pow(1 + rate, years);
    setResult(futureValue.toFixed(2));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Inflation Checker</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#FF477E] mb-1">Initial Amount</label>
          <input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 1000000"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Annual Inflation Rate (%)</label>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 3.5"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Start Year</label>
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 2023"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">End Year</label>
          <input
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            placeholder="e.g. 2030"
          />
        </div>
      </div>

      <button
        onClick={calculateInflation}
        className="w-full bg-gradient-to-r from-[#FF0A54] to-[#FF477E] text-white py-3 rounded-full font-semibold hover:from-[#FF477E] hover:to-[#FF0A54] transition-all"
      >
        Calculate
      </button>

      {result !== null && (
        <div className="mt-6 p-4 bg-[#FFF0F3] rounded-lg">
          <p className="text-lg text-[#FF477E]">
            The value of <span className="font-bold">{initialAmount} in {startYear}</span>
          </p>
          <p className="text-2xl font-bold text-[#FF0A54]">
            will be equivalent to {result} in {endYear}
          </p>
          <p className="text-[#FF477E] mt-2">
            assuming a constant annual inflation rate of {inflationRate}%
          </p>
        </div>
      )}
    </div>
  );
}