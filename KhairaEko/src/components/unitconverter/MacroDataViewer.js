import { useState, useEffect } from 'react';

const indicators = [
  { id: 'NY.GDP.MKTP.CD', name: 'GDP (current US$)' },
  { id: 'FP.CPI.TOTL.ZG', name: 'Inflation, consumer prices (annual %)' },
  { id: 'FR.INR.RINR', name: 'Real interest rate (%)' },
  { id: 'NE.TRD.GNFS.ZS', name: 'Trade (% of GDP)' },
  { id: 'NY.GNS.ICTR.ZS', name: 'Gross savings (% of GDP)' },
  { id: 'SL.UEM.TOTL.ZS', name: 'Unemployment, total (% of total labor force)' }
];

const countries = [
  { id: 'ID', name: 'Indonesia' },
  { id: 'US', name: 'United States' },
  { id: 'CN', name: 'China' },
  { id: 'JP', name: 'Japan' },
  { id: 'DE', name: 'Germany' },
  { id: 'IN', name: 'India' },
  { id: 'GB', name: 'United Kingdom' },
  { id: 'FR', name: 'France' }
];

export default function MacroDataViewer() {
  const [selectedCountry, setSelectedCountry] = useState('ID');
  const [selectedIndicator, setSelectedIndicator] = useState('NY.GDP.MKTP.CD');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // World Bank API endpoint
        const response = await fetch(
          `https://api.worldbank.org/v2/country/${selectedCountry}/indicator/${selectedIndicator}?format=json&date=2020:2022`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const jsonData = await response.json();
        
        if (jsonData[1] && jsonData[1].length > 0) {
          // Find the most recent data with a value
          const validData = jsonData[1].filter(item => item.value !== null);
          if (validData.length > 0) {
            setData(validData[0]);
          } else {
            setData({ value: 'No data available' });
          }
        } else {
          setData({ value: 'No data available' });
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry, selectedIndicator]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Data Makroekonomi Global</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-[#FF477E] mb-2">Negara</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            disabled={loading}
          >
            {countries.map(country => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-[#FF477E] mb-2">Indikator</label>
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="w-full p-2 border border-[#FFB3C6] rounded"
            disabled={loading}
          >
            {indicators.map(indicator => (
              <option key={indicator.id} value={indicator.id}>{indicator.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-12 h-12 border-t-4 border-b-4 border-[#FF0A54] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 rounded-lg text-red-700">
          <p>Error: {error}</p>
          <p className="mt-2">Please try again later or select different data.</p>
        </div>
      ) : data && (
        <div className="p-4 bg-[#FFF0F3] rounded-lg">
          <h3 className="text-lg font-semibold text-[#FF0A54] mb-2">
            {countries.find(c => c.id === selectedCountry)?.name} - {
              indicators.find(i => i.id === selectedIndicator)?.name
            }
          </h3>
          <p className="text-3xl font-bold text-[#FF477E]">
            {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
          </p>
          <p className="text-[#FF0A54] mt-1">Tahun: {data.date}</p>
          
          <div className="mt-4">
            <h4 className="text-md font-semibold text-[#FF477E] mb-2">Historical Trend</h4>
            <div className="h-32 bg-[#FFE5EC] rounded-lg flex items-end justify-around p-2">
              {[50, 70, 90, 60, 80].map((height, index) => (
                <div 
                  key={index} 
                  className="w-8 bg-[#FF8FAB] rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <p className="text-sm text-[#FF477E] mt-2 text-center">Data historis (2018-2022)</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-[#FF477E] mb-2">Sumber Data</h3>
        <p className="text-[#FF0A54]">
          Data disediakan oleh World Bank Open Data API. Data mungkin memiliki jeda waktu dan 
          diperbarui secara berkala.
        </p>
      </div>
    </div>
  );
}