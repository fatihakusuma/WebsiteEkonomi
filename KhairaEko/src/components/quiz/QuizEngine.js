import { useState, useEffect } from 'react';

export default function QuizEngine({ quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 5); // 5 minutes

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    if (selectedAnswer === quiz.questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    // Move to next question or show results
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!quiz) return <div className="text-center py-12">Loading quiz...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#FF0A54]">{quiz.title}</h2>
        {quiz.pdfUrl && (
          <a 
            href={quiz.pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm bg-[#FFE5EC] text-[#FF0A54] px-3 py-1 rounded-full hover:bg-[#FFB3C6]"
          >
            Lihat Materi PDF
          </a>
        )}
      </div>
      
      {!showResult ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="text-[#FF477E] font-medium">
              Pertanyaan {currentQuestion + 1} dari {quiz.questions.length}
            </div>
            <div className="bg-[#FFF0F3] px-3 py-1 rounded-full text-[#FF0A54] font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#FF477E] mb-4">
              {quiz.questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedAnswer === index
                      ? 'border-[#FF0A54] bg-[#FFF0F3]'
                      : 'border-[#FFB3C6] hover:bg-[#FFF0F3]'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className={`w-full py-3 rounded-full font-semibold ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FF0A54] to-[#FF477E] text-white hover:from-[#FF477E] hover:to-[#FF0A54]'
            }`}
          >
            {currentQuestion < quiz.questions.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesaikan Kuis'}
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-[#FF0A54] mb-2">Hasil Kuis</h3>
          <div className="text-5xl font-bold mb-4 text-[#FF477E]">
            {score}/{quiz.questions.length}
          </div>
          <p className="text-lg mb-6">
            {score === quiz.questions.length ? 'Sempurna! 🎉' : 
             score >= quiz.questions.length * 0.7 ? 'Bagus! 👍' : 
             'Tetap semangat belajar! 💪'}
          </p>
          
          <div className="bg-[#FFF0F3] rounded-lg p-4 text-left">
            <h4 className="font-semibold text-[#FF0A54] mb-3">Review Jawaban:</h4>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {quiz.questions.map((q, index) => (
                <div key={index} className="border-b border-[#FFC2D1] pb-3">
                  <p className="font-medium">{q.question}</p>
                  <p className="mt-1 text-green-600">Jawaban benar: {q.options[q.answer]}</p>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-gradient-to-r from-[#FF0A54] to-[#FF477E] text-white px-6 py-3 rounded-full font-semibold hover:from-[#FF477E] hover:to-[#FF0A54] transition-all"
          >
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}