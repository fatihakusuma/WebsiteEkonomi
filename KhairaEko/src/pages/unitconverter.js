import UnitConverter from '../components/unitconverter/UnitConverter';
import MacroDataViewer from '../components/unitconverter/MacroDataViewer';
import { useState } from 'react';

export default function UnitConverterPage() {
  const [activeTab, setActiveTab] = useState('converter');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF0A54] mb-4">Konversi & Data</h1>
          <p className="text-lg text-[#FF477E]">Alat konversi satuan dan data makroekonomi global</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-[#FFE5EC]">
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex-1 py-4 font-semibold ${
                activeTab === 'converter'
                  ? 'text-[#FF0A54] border-b-2 border-[#FF0A54]'
                  : 'text-[#FF8FAB] hover:text-[#FF477E]'
              }`}
            >
              Unit Converter
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 py-4 font-semibold ${
                activeTab === 'data'
                  ? 'text-[#FF0A54] border-b-2 border-[#FF0A54]'
                  : 'text-[#FF8FAB] hover:text-[#FF477E]'
              }`}
            >
              Data Makroekonomi
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'converter' && <UnitConverter />}
            {activeTab === 'data' && <MacroDataViewer />}
          </div>
        </div>
      </div>
    </div>
  );
}