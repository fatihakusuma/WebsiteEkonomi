import { db } from './firebaseConfig';
import { 
  collection, addDoc, getDocs, query, where,
  doc, getDoc, setDoc, Timestamp
} from 'firebase/firestore';

// Simpan kuis baru ke perpustakaan
export const addQuizToLibrary = async (quizData) => {
  try {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      createdAt: Timestamp.fromDate(new Date(quizData.createdAt))
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Failed to save quiz: ' + error.message);
  }
};

// Ambil semua kuis dari perpustakaan
export const getQuizLibrary = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'quizzes'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString()
    }));
  } catch (error) {
    throw new Error('Failed to fetch quizzes: ' + error.message);
  }
};

// Simpan progress kuis user
export const saveQuizProgress = async (userId, quizId, score, answers) => {
  try {
    await addDoc(collection(db, 'userProgress'), {
      userId,
      quizId,
      score,
      answers,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    throw new Error('Failed to save progress: ' + error.message);
  }
};

// Ambil progress kuis user
export const getUserProgress = async (userId) => {
  try {
    const q = query(
      collection(db, 'userProgress'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    }));
  } catch (error) {
    throw new Error('Failed to fetch progress: ' + error.message);
  }
};