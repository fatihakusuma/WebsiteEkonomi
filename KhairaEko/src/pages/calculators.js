import ScientificCalculator from '../components/calculators/ScientificCalculator';
import TVMCalculator from '../components/calculators/TVMCalculator';
import MatrixStatsCalculator from '../components/calculators/MatrixStatsCalculator';
import CurrencyConverter from '../components/calculators/CurrencyConverter';
import InflationChecker from '../components/calculators/InflationChecker';
import ROICalculator from '../components/calculators/ROICalculator';
import BreakEvenPoint from '../components/calculators/BreakEvenPoint';
import { useState } from 'react';

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState('scientific');
  
  const tabs = [
    { id: 'scientific', name: 'Scientific' },
    { id: 'tvm', name: 'Time Value' },
    { id: 'matrix', name: 'Matrix & Stats' },
    { id: 'currency', name: 'Currency' },
    { id: 'inflation', name: 'Inflation' },
    { id: 'roi', name: 'ROI' },
    { id: 'bep', name: 'Break Even' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF0A54] mb-4">Kalkulator Ekonomi</h1>
          <p className="text-lg text-[#FF477E]">Alat hitung untuk berbagai kebutuhan ekonomi</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex overflow-x-auto border-b border-[#FFE5EC]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 font-semibold ${
                  activeTab === tab.id
                    ? 'text-[#FF0A54] border-b-2 border-[#FF0A54]'
                    : 'text-[#FF8FAB] hover:text-[#FF477E]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'scientific' && <ScientificCalculator />}
            {activeTab === 'tvm' && <TVMCalculator />}
            {activeTab === 'matrix' && <MatrixStatsCalculator />}
            {activeTab === 'currency' && <CurrencyConverter />}
            {activeTab === 'inflation' && <InflationChecker />}
            {activeTab === 'roi' && <ROICalculator />}
            {activeTab === 'bep' && <BreakEvenPoint />}
          </div>
        </div>
      </div>
    </div>
  );
}