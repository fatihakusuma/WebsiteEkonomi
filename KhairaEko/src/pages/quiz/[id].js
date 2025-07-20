import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import QuizEngine from '../../components/quiz/QuizEngine';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export default function QuizDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, 'quizzes', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setQuiz({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1] flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-[#FF0A54] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#FF0A54] mb-4">Kuis tidak ditemukan</h1>
          <button
            onClick={() => router.push('/learn')}
            className="bg-gradient-to-r from-[#FF0A54] to-[#FF477E] text-white px-6 py-3 rounded-full font-semibold"
          >
            Kembali ke Perpustakaan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1] py-12">
      <div className="container mx-auto px-4">
        <QuizEngine quiz={quiz} />
      </div>
    </div>
  );
}