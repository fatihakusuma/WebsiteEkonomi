import { useState, useEffect } from 'react';

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IDR');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState();
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch currency symbols
    fetch('https://api.exchangerate.host/symbols')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const currencyList = Object.keys(data.symbols);
          setCurrencies(currencyList);
        }
      });
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      setLoading(true);
      fetch(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setExchangeRate(data.result);
          }
          setLoading(false);
        });
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate && amount) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  }, [amount, exchangeRate]);

  const handleConvert = () => {
    if (exchangeRate && amount) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Currency Converter</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-[#FF477E] mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          />
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">From</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          >
            {currencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[#FF477E] mb-1">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
          >
            {currencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#FF0A54] to-[#FF477E] text-white py-3 rounded-full font-semibold hover:from-[#FF477E] hover:to-[#FF0A54] transition-all disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Convert'}
      </button>

      {convertedAmount !== null && !loading && (
        <div className="mt-6 p-4 bg-[#FFF0F3] rounded-lg text-center">
          <p className="text-lg text-[#FF477E] mb-1">Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}</p>
          <p className="text-2xl font-bold text-[#FF0A54]">
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </p>
        </div>
      )}
    </div>
  );
}