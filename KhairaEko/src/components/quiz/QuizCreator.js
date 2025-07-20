import { useState, useEffect } from 'react';
import { addQuizToLibrary } from '../../firebase/firestoreOps';

export default function QuizCreator() {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [isCreatingFromPdf, setIsCreatingFromPdf] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState('');
  const [knowledgePercentage, setKnowledgePercentage] = useState(50);
  const [calculationPercentage, setCalculationPercentage] = useState(50);

  // Fungsi untuk mengekstrak teks dari PDF
  const extractTextFromPDF = async (file) => {
    setAiProgress('Mengekstrak teks dari PDF...');
    
    // Lazy load pdfjs-dist
    const pdfjs = await import('pdfjs-dist/build/pdf');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let text = '';
    const maxPages = Math.min(pdf.numPages, 10); // Batasi 10 halaman pertama
    
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    
    return text;
  };

  // Fungsi untuk generate quiz dengan Gemini API
  const generateQuizWithGemini = async () => {
    if (!pdfFile) return;
    
    setAiGenerating(true);
    setQuestions([]);
    
    try {
      // 1. Ekstrak teks dari PDF
      const pdfText = await extractTextFromPDF(pdfFile);
      
      // 2. Generate prompt untuk Gemini
      setAiProgress('Membuat soal dengan AI...');
      
      const prompt = `
        Anda adalah asisten pembuat soal ujian ekonomi. Buat ${questionCount} soal pilihan ganda berdasarkan materi berikut.
        
        Ketentuan:
        - ${knowledgePercentage}% soal pengetahuan konsep
        - ${calculationPercentage}% soal perhitungan numerik
        - Setiap soal harus memiliki 4 pilihan jawaban
        - Untuk soal perhitungan, sertakan langkah penyelesaian di balasan tapi JANGAN dimasukkan dalam soal
        - Cantumkan jawaban yang benar pada akhir setiap soal dalam format: [ANSWER:index]
        - Format soal: "Pertanyaan: [soal]\nA) [opsi1]\nB) [opsi2]\nC) [opsi3]\nD) [opsi4]\n[ANSWER:X]"
        
        Materi:
        ${pdfText.substring(0, 30000)} // Batasi teks untuk efisiensi
      `;
      
      // 3. Kirim permintaan ke Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // 4. Parse hasil menjadi struktur quiz
      setAiProgress('Memproses hasil...');
      const newQuestions = [];
      const questionBlocks = generatedText.split('Pertanyaan:').slice(1);
      
      for (const block of questionBlocks) {
        const lines = block.trim().split('\n');
        const questionText = lines[0];
        
        const options = lines
          .slice(1, 5)
          .filter(line => line.match(/^[A-D]\)/))
          .map(line => line.replace(/^[A-D]\)\s*/, ''));
        
        const answerLine = lines.find(line => line.includes('[ANSWER:'));
        const answerIndex = answerLine ? parseInt(answerLine.match(/\[ANSWER:(\d)\]/)?.[1] || 0) : 0;
        
        if (questionText && options.length === 4) {
          newQuestions.push({
            question: questionText,
            options: options,
            answer: answerIndex
          });
        }
      }
      
      setQuestions(newQuestions);
      setAiProgress(`Berhasil membuat ${newQuestions.length} soal`);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setAiProgress("Gagal membuat quiz: " + error.message);
    } finally {
      setAiGenerating(false);
    }
  };

  // Fungsi untuk upload file
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setAiProgress('PDF siap diproses');
    } else {
      alert('Hanya file PDF yang diperbolehkan');
    }
  };

  // Fungsi untuk menyimpan quiz
  const saveQuiz = async () => {
    if (!quizTitle.trim()) {
      alert('Judul kuis tidak boleh kosong');
      return;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Pertanyaan ${i+1} tidak boleh kosong`);
        return;
      }
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Opsi ${j+1} untuk pertanyaan ${i+1} tidak boleh kosong`);
          return;
        }
      }
    }
    
    const quizData = {
      title: quizTitle,
      questions,
      pdfUrl: pdfFile ? URL.createObjectURL(pdfFile) : null,
      createdAt: new Date().toISOString()
    };
    
    try {
      await addQuizToLibrary(quizData);
      setQuizSaved(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setQuizTitle('');
        setQuestions([]);
        setPdfFile(null);
        setQuizSaved(false);
        setAiProgress('');
      }, 2000);
    } catch (error) {
      alert('Error menyimpan kuis: ' + error.message);
    }
  };

  // Fungsi untuk menambah pertanyaan kosong
  const addEmptyQuestion = () => {
    setQuestions([...questions, { 
      question: '', 
      options: ['', '', '', ''], 
      answer: 0 
    }]);
  };

  // Update calculation percentage when knowledge changes
  useEffect(() => {
    setCalculationPercentage(100 - knowledgePercentage);
  }, [knowledgePercentage]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Buat Kuis Baru</h2>
      
      <div className="mb-6">
        <label className="block text-[#FF477E] mb-2">Judul Kuis</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="w-full p-3 border border-[#FFB3C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0A54]"
          placeholder="Masukkan judul kuis"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#FF477E]">Upload Materi PDF</h3>
          <button 
            onClick={() => setIsCreatingFromPdf(!isCreatingFromPdf)}
            className={`px-4 py-2 rounded-full ${
              isCreatingFromPdf 
                ? 'bg-[#FF0A54] text-white' 
                : 'bg-[#FFE5EC] text-[#FF0A54]'
            }`}
          >
            {isCreatingFromPdf ? 'Batal' : 'Buat dari PDF'}
          </button>
        </div>
        
        {isCreatingFromPdf && (
          <div className="mb-4 p-4 bg-[#FFF0F3] rounded-lg border-2 border-dashed border-[#FFB3C6]">
            <label className="block mb-2 text-[#FF477E]">Pilih File PDF</label>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handlePdfUpload}
              className="block w-full text-sm text-[#FF477E]
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#FF0A54] file:text-white
                hover:file:bg-[#FF477E]"
            />
            {pdfFile && (
              <div className="mt-3 p-3 bg-white rounded-lg flex items-center">
                <span className="text-[#FF0A54]">✓</span>
                <span className="ml-2 text-sm truncate">{pdfFile.name}</span>
              </div>
            )}
            
            {pdfFile && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-[#FF477E] mb-2">Jumlah Soal</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="w-full p-2 border border-[#FFB3C6] rounded"
                      disabled={aiGenerating}
                    >
                      {[3, 5, 10, 15].map(num => (
                        <option key={num} value={num}>{num} Soal</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[#FF477E] mb-2">% Soal Pengetahuan</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={knowledgePercentage}
                      onChange={(e) => setKnowledgePercentage(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[#FF8FAB]">
                      <span>0%</span>
                      <span>{knowledgePercentage}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-[#FFE5EC] p-2 rounded text-center">
                    <span className="block text-[#FF0A54] font-bold">Pengetahuan</span>
                    <span>{knowledgePercentage}%</span>
                  </div>
                  <div className="bg-[#FFE5EC] p-2 rounded text-center">
                    <span className="block text-[#FF0A54] font-bold">Perhitungan</span>
                    <span>{calculationPercentage}%</span>
                  </div>
                </div>
                
                <button
                  onClick={generateQuizWithGemini}
                  disabled={aiGenerating}
                  className={`w-full py-2 rounded-full font-semibold ${
                    aiGenerating
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  {aiGenerating ? 'Membuat Soal...' : 'Buat Soal Otomatis dengan AI'}
                </button>
                
                {aiProgress && (
                  <div className="mt-3 p-2 bg-blue-50 text-blue-700 rounded text-center">
                    {aiProgress}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#FF477E]">Pertanyaan</h3>
          <button 
            onClick={addEmptyQuestion}
            className="bg-[#FFB3C6] hover:bg-[#FF8FAB] text-[#FF0A54] px-4 py-2 rounded-full"
          >
            + Tambah Pertanyaan Manual
          </button>
        </div>

        {questions.length === 0 && !aiGenerating && (
          <div className="text-center py-8 text-[#FF8FAB]">
            {isCreatingFromPdf 
              ? 'Unggah PDF dan klik "Buat Soal Otomatis" atau tambahkan pertanyaan manual'
              : 'Mulai tambahkan pertanyaan'}
          </div>
        )}

        {aiGenerating && questions.length === 0 && (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 border-t-4 border-b-4 border-[#FF0A54] rounded-full animate-spin mb-4"></div>
            <p className="text-[#FF477E]">{aiProgress}</p>
          </div>
        )}

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 p-4 bg-[#FFF0F3] rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-[#FF477E]">Pertanyaan {qIndex + 1}</label>
              <button 
                onClick={() => {
                  const newQuestions = [...questions];
                  newQuestions.splice(qIndex, 1);
                  setQuestions(newQuestions);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Hapus
              </button>
            </div>
            <input
              type="text"
              value={q.question}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[qIndex].question = e.target.value;
                setQuestions(newQuestions);
              }}
              className="w-full p-3 border border-[#FFB3C6] rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#FF0A54]"
              placeholder="Tulis pertanyaan disini"
            />
            
            <label className="block text-[#FF477E] mb-2">Pilihan Jawaban</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center">
                  <input
                    type="radio"
                    name={`answer-${qIndex}`}
                    checked={q.answer === oIndex}
                    onChange={() => {
                      const newQuestions = [...questions];
                      newQuestions[qIndex].answer = oIndex;
                      setQuestions(newQuestions);
                    }}
                    className="mr-2 h-5 w-5 text-[#FF0A54] focus:ring-[#FF0A54]"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[qIndex].options[oIndex] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="flex-grow p-2 border border-[#FFB3C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0A54]"
                    placeholder={`Opsi ${String.fromCharCode(65 + oIndex)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveQuiz}
        className="w-full bg-gradient-to-r from-[#FF0A54] to-[#FF477E] text-white py-3 rounded-full font-semibold hover:from-[#FF477E] hover:to-[#FF0A54] transition-all disabled:opacity-50"
        disabled={quizSaved || questions.length === 0}
      >
        {quizSaved ? 'Kuis Disimpan ✓' : 'Simpan Kuis'}
      </button>

      {quizSaved && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
          Kuis berhasil disimpan! Anda dapat menemukannya di perpustakaan kuis.
        </div>
      )}
    </div>
  );
}