import Link from 'next/link';

export default function Dashboard() {
  const features = [
    { 
      id: 'calculators', 
      title: 'Kalkulator', 
      description: 'Scientific, Financial, Matrix & Statistik',
      bgColor: 'bg-[#FFB3C6] hover:bg-[#FF8FAB]'
    },
    { 
      id: 'unitconverter', 
      title: 'Konversi & Data', 
      description: 'Unit Converter & Data Makroekonomi',
      bgColor: 'bg-[#FFC2D1] hover:bg-[#FF8FAB]'
    },
    { 
      id: 'learn', 
      title: 'Belajar & Kuis', 
      description: 'Materi ekonomi dan kuis interaktif',
      bgColor: 'bg-[#FFB3C6] hover:bg-[#FF8FAB]'
    },
    { 
      id: 'pomodoro', 
      title: 'Pomodoro Haechan', 
      description: 'Teknik belajar dengan timer',
      bgColor: 'bg-[#FFC2D1] hover:bg-[#FF8FAB]'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#FF0A54] mb-4">KhairaEko</h1>
        <p className="text-lg text-[#FF477E]">Alat belajar ekonomi untuk calon mahasiswa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Link key={feature.id} href={`/${feature.id}`}>
            <div className={`${feature.bgColor} rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 h-full flex flex-col`}>
              <h2 className="text-2xl font-bold text-white mb-3">{feature.title}</h2>
              <p className="text-white flex-grow">{feature.description}</p>
              <div className="mt-4 text-right text-white text-lg">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}