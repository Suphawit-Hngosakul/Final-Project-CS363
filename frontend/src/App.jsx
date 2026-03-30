import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-br from-indigo-500/30 to-purple-600/30 blur-[120px] rounded-full"></div>
        <div className="absolute top-[40%] left-[40%] w-[80%] h-[80%] bg-gradient-to-tl from-pink-500/20 to-rose-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-10 backdrop-blur-md bg-white/5 p-10 md:p-16 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium tracking-wide mb-4">
            🚀 CS363 Final Project
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm">
            Tailwind CSS
            <br />
            <span className="text-white">&</span> React
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          เริ่มต้นโปรเจกต์ของคุณด้วยดีไซน์ที่สวยงาม ทันสมัย และตอบสนองทุกหน้าจอ 
          ออกแบบด้วย Tailwind CSS เพื่อประสบการณ์ที่ยอดเยี่ยมที่สุด
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <button 
            onClick={() => setCount((c) => c + 1)}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg hover:from-indigo-400 hover:to-purple-400 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-indigo-500/50 active:scale-95 flex-1 max-w-[200px]"
          >
            นับจำนวน: {count}
          </button>
          <a 
            href="https://tailwindcss.com/docs" 
            target="_blank" 
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white font-semibold text-lg hover:bg-white/10 backdrop-blur-md transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 border border-white/10 shadow-lg hover:shadow-white/5 active:scale-95 flex-1 max-w-[200px]"
          >
            อ่านเอกสาร
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
