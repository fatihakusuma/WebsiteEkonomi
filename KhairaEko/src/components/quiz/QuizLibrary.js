import { useState, useEffect } from 'react';
import { getQuizLibrary } from '../../firebase/firestoreOps';

export default function QuizLibrary() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizData = await getQuizLibrary();
        setQuizzes(quizData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-16 h-16 border-t-4 border-b-4 border-[#FF0A54] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Perpustakaan Kuis</h2>
      
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari kuis..."
          className="w-full p-3 border border-[#FFB3C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0A54]"
        />
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#FF477E]">Tidak ada kuis yang ditemukan</p>
          <p className="text-[#FF8FAB] mt-2">Buat kuis baru untuk mulai belajar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <div key={index} className="border border-[#FFE5EC] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-5 bg-[#FFF0F3]">
                <h3 className="font-bold text-lg text-[#FF0A54] truncate">{quiz.title}</h3>
                <p className="text-sm text-[#FF477E] mt-1">
                  {quiz.questions.length} pertanyaan • {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="p-5">
                // Di dalam map quiz, tambahkan:
{quiz.pdfUrl && (
  <a 
    href={quiz.pdfUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center text-[#FF0A54] hover:text-[#FF477E] mb-3"
  >
    <span className="mr-2">📄</span>
    Lihat Materi PDF
  </a>
)}
                
                <div className="flex justify-between mt-4">
                  <button className="text-sm bg-[#FFB3C6] hover:bg-[#FF8FAB] text-[#FF0A54] px-4 py-2 rounded-full">
                    Mulai Kuis
                  </button>
                  <button className="text-sm bg-white border border-[#FFB3C6] text-[#FF0A54] px-4 py-2 rounded-full hover:bg-[#FFF0F3]">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}