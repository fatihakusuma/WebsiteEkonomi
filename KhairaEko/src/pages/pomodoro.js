import HaechanPomodoro from '../components/pomodoro/HaechanPomodoro';

export default function PomodoroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF0A54] mb-4">Pomodoro Haechan</h1>
          <p className="text-lg text-[#FF477E]">Teknik belajar efisien dengan timer</p>
        </div>
        
        <HaechanPomodoro />
      </div>
    </div>
  );
}