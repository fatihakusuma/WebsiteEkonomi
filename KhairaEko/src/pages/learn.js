import QuizCreator from '../components/quiz/QuizCreator';
import QuizLibrary from '../components/quiz/QuizLibrary';
import { useState } from 'react';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('library');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF0A54] mb-4">Belajar & Kuis</h1>
          <p className="text-lg text-[#FF477E]">Tingkatkan pemahaman ekonomi dengan kuis interaktif</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-[#FFE5EC]">
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 py-4 font-semibold ${
                activeTab === 'library'
                  ? 'text-[#FF0A54] border-b-2 border-[#FF0A54]'
                  : 'text-[#FF8FAB] hover:text-[#FF477E]'
              }`}
            >
              Perpustakaan Kuis
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 font-semibold ${
                activeTab === 'create'
                  ? 'text-[#FF0A54] border-b-2 border-[#FF0A54]'
                  : 'text-[#FF8FAB] hover:text-[#FF477E]'
              }`}
            >
              Buat Kuis Baru
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'library' ? <QuizLibrary /> : <QuizCreator />}
          </div>
        </div>
      </div>
    </div>
  );
}