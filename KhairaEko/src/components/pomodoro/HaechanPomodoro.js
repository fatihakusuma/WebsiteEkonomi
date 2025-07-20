import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function HaechanPomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work/break
  const [quote, setQuote] = useState('');
  const [customWorkTime, setCustomWorkTime] = useState(25);
  const [customBreakTime, setCustomBreakTime] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);
  
  const haechanQuotes = [
    "Let's go! We're on the highway to heaven!",
    "Don't worry, be happy! We're here together!",
    "You're doing great! Keep going!",
    "Take a break, you deserve it!",
    "Dreams come true when you work hard!",
    "We boom the world! Fighting!",
    "You are my rainbow, so shine bright!",
    "The world is ours! Let's conquer it!",
    "Every day is a new adventure!",
    "You are the light in my world!"
  ];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(intervalRef.current);
              handleTimerEnd();
              return 0;
            }
            setMinutes(prevMinutes => prevMinutes - 1);
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes]);

  const handleTimerEnd = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(customBreakTime);
      setMode('break');
      setQuote(haechanQuotes[Math.floor(Math.random() * 5)]);
    } else {
      setMinutes(customWorkTime);
      setMode('work');
      setQuote(haechanQuotes[Math.floor(Math.random() * 5) + 5]);
    }
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && minutes === 0 && seconds === 0) {
      if (mode === 'work') {
        setMinutes(customWorkTime);
      } else {
        setMinutes(customBreakTime);
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(customWorkTime);
    } else {
      setMinutes(customBreakTime);
    }
    setSeconds(0);
    setQuote('');
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === 'work' ? customWorkTime : customBreakTime);
    setSeconds(0);
    setQuote('');
  };

  const saveSettings = () => {
    if (mode === 'work') {
      setMinutes(customWorkTime);
    } else {
      setMinutes(customBreakTime);
    }
    setShowSettings(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-[#FF0A54] mb-2">Pomodoro Haechan</h1>
            <p className="text-[#FF477E] mb-6">Teknik belajar efisien dengan timer</p>
            
            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-64 rounded-full border-8 border-[#FFB3C6] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#FF0A54]">
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="mt-2 text-lg text-[#FF477E]">
                    {mode === 'work' ? 'Fokus Belajar' : 'Istirahat'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button 
                onClick={toggleTimer}
                className={`px-6 py-3 rounded-full font-semibold ${
                  isActive 
                    ? 'bg-[#FF477E] hover:bg-[#FF0A54] text-white' 
                    : 'bg-[#FFB3C6] hover:bg-[#FF8FAB] text-[#FF0A54]'
                }`}
              >
                {isActive ? 'Jeda' : 'Mulai'}
              </button>
              <button 
                onClick={resetTimer}
                className="px-6 py-3 bg-white border-2 border-[#FF477E] rounded-full text-[#FF0A54] font-semibold hover:bg-[#FFF0F3]"
              >
                Reset
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="px-6 py-3 bg-[#FFE5EC] rounded-full text-[#FF0A54] font-semibold hover:bg-[#FFB3C6]"
              >
                Settings
              </button>
            </div>

            {showSettings && (
              <div className="mb-6 p-4 bg-[#FFF0F3] rounded-lg">
                <h3 className="text-lg font-semibold text-[#FF0A54] mb-3">Pengaturan Waktu</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#FF477E] mb-1">Waktu Belajar (menit)</label>
                    <input
                      type="number"
                      value={customWorkTime}
                      onChange={(e) => setCustomWorkTime(parseInt(e.target.value) || 25)}
                      className="w-full p-2 border border-[#FFB3C6] rounded"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-[#FF477E] mb-1">Waktu Istirahat (menit)</label>
                    <input
                      type="number"
                      value={customBreakTime}
                      onChange={(e) => setCustomBreakTime(parseInt(e.target.value) || 5)}
                      className="w-full p-2 border border-[#FFB3C6] rounded"
                      min="1"
                    />
                  </div>
                </div>
                <button
                  onClick={saveSettings}
                  className="mt-4 w-full bg-[#FF0A54] text-white py-2 rounded-full font-semibold hover:bg-[#FF477E]"
                >
                  Simpan
                </button>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => switchMode('work')}
                className={`px-4 py-2 rounded-full ${
                  mode === 'work' 
                    ? 'bg-[#FF0A54] text-white' 
                    : 'bg-[#FFE5EC] text-[#FF0A54]'
                }`}
              >
                Belajar ({customWorkTime}m)
              </button>
              <button 
                onClick={() => switchMode('break')}
                className={`px-4 py-2 rounded-full ${
                  mode === 'break' 
                    ? 'bg-[#FF0A54] text-white' 
                    : 'bg-[#FFE5EC] text-[#FF0A54]'
                }`}
              >
                Istirahat ({customBreakTime}m)
              </button>
            </div>

            {quote && (
              <div className="mt-8 p-4 bg-[#FFF0F3] rounded-lg border-l-4 border-[#FF0A54]">
                <p className="text-[#FF477E] italic">"{quote}" - Haechan</p>
              </div>
            )}
          </div>
          
          <div className="md:w-1/3 bg-gradient-to-b from-[#FFB3C6] to-[#FF8FAB] flex items-center justify-center p-8">
            <div className="text-center">
              <div className="bg-white rounded-full p-2 inline-block mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
              </div>
              <h2 className="text-2xl font-bold text-white">Haechan</h2>
              <p className="text-white">Study Buddy-mu!</p>
              <div className="mt-4 bg-white/20 rounded-full px-4 py-2 inline-block">
                <p className="text-white text-sm">NCT Dream</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}