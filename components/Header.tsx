
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-baseline font-black tracking-tighter text-2xl">
            <span className="text-[#323d5a]">LEADERS</span>
            <span className="ml-1 bg-[#3b82f6] text-white px-2 py-0.5 rounded-md">HUB</span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-4 hidden sm:block"></div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-extrabold text-[#323d5a] tracking-tight leading-none uppercase">Jelölt Profilozó</h1>
            <p className="text-[9px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-1">AI Strategy Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 bg-gray-100/50 px-4 py-2 rounded-full border border-gray-200/50 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Intelligence Active
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
