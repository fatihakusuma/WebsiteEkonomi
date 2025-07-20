import { useState, useEffect } from 'react';
import WelcomeAnimation from '../components/WelcomeAnimation';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []); // Perbaikan: tambahkan dependency array kosong

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1]">
      {showWelcome ? (
        <WelcomeAnimation />
      ) : (
        <div className="animate-fadeIn">
          <Dashboard />
        </div>
      )}
    </div>
  );
}