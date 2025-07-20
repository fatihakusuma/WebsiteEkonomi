import { useState } from 'react';

export default function TVMCalculator() {
  const [values, setValues] = useState({
    pv: '',
    fv: '',
    rate: '',
    nper: '',
    pmt: '',
    type: 0 // 0 = end of period, 1 = beginning
  });
  
  const [result, setResult] = useState(null);
  
  const calculateTVM = (target) => {
    const { pv, fv, rate, nper, pmt, type } = values;
    const r = parseFloat(rate) / 100;
    const n = parseFloat(nper);
    const payment = parseFloat(pmt) || 0;
    
    if (target === 'pv') {
      // Present Value calculation
      const pvVal = (parseFloat(fv) || 0) / Math.pow(1 + r, n) + 
                   payment * (1 - Math.pow(1 + r, -n)) / r;
      setResult({ type: 'Present Value', value: pvVal.toFixed(2) });
    } else if (target === 'fv') {
      // Future Value calculation
      const fvVal = (parseFloat(pv) || 0) * Math.pow(1 + r, n) + 
                   payment * (Math.pow(1 + r, n) - 1) / r;
      setResult({ type: 'Future Value', value: fvVal.toFixed(2) });
    } else if (target === 'pmt') {
      // Payment calculation
      const pmtVal = r * (parseFloat(fv) || 0) / (Math.pow(1 + r, n) - 1);
      setResult({ type: 'Payment', value: pmtVal.toFixed(2) });
    } else if (target === 'nper') {
      // Number of periods
      if (!pv || !fv || !r) return;
      const nperVal = Math.log(parseFloat(fv) / parseFloat(pv)) / Math.log(1 + r);
      setResult({ type: 'Number of Periods', value: nperVal.toFixed(2) });
    } else if (target === 'rate') {
      // Rate of return (using approximation)
      if (!pv || !fv || !nper) return;
      const rateVal = (Math.pow(parseFloat(fv) / parseFloat(pv), 1 / n) - 1) * 100;
      setResult({ type: 'Interest Rate', value: rateVal.toFixed(2) + '%' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleReset = () => {
    setValues({
      pv: '',
      fv: '',
      rate: '',
      nper: '',
      pmt: '',
      type: 0
    });
    setResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Time Value of Money</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#FF477E] mb-1">Present Value (PV)</label>
          <input
            type="number"
            name="pv"
            value={values.pv}
            onChange={handleChange}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Future Value (FV)</label>
          <input
            type="number"
            name="fv"
            value={values.fv}
            onChange={handleChange}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Interest Rate (%)</label>
          <input
            type="number"
            name="rate"
            value={values.rate}
            onChange={handleChange}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Number of Periods</label>
          <input
            type="number"
            name="nper"
            value={values.nper}
            onChange={handleChange}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Payment (PMT)</label>
          <input
            type="number"
            name="pmt"
            value={values.pmt}
            onChange={handleChange}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">Payment Type</label>
          <select
            name="type"
            value={values.type}
            onChange={handleChange}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          >
            <option value={0}>End of Period</option>
            <option value={1}>Beginning of Period</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {['pv', 'fv', 'rate', 'nper', 'pmt'].map((type) => (
          <button
            key={type}
            onClick={() => calculateTVM(type)}
            className="bg-[#FF8FAB] hover:bg-[#FF0A54] text-white p-2 rounded"
          >
            Calculate {type.toUpperCase()}
          </button>
        ))}
        <button
          onClick={handleReset}
          className="bg-[#FFB3C6] hover:bg-[#FF8FAB] text-[#FF0A54] p-2 rounded col-span-2 md:col-span-1"
        >
          Reset
        </button>
      </div>

      {result && (
        <div className="p-4 bg-[#FFF0F3] rounded-lg">
          <p className="text-[#FF0A54] font-semibold">{result.type}: <span className="text-lg">{result.value}</span></p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-[#FF477E] mb-2">Formulas</h3>
        <div className="bg-[#FFF0F3] p-3 rounded-lg">
          <p className="text-[#FF0A54]">FV = PV × (1 + r)<sup>n</sup> + PMT × [(1 + r)<sup>n</sup> - 1]/r</p>
          <p className="text-[#FF0A54] mt-2">PV = FV / (1 + r)<sup>n</sup> + PMT × [1 - (1 + r)<sup>-n</sup>]/r</p>
        </div>
      </div>
    </div>
  );
}