
import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface ProfileResultProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ProfileResult: React.FC<ProfileResultProps> = ({ result, onReset }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const DiscBar = ({ label, value, color, desc }: { label: string, value: number, color: string, desc: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xl font-black text-[#323d5a]">{label}</span>
          <span className="text-[10px] text-gray-400 font-bold ml-2 uppercase tracking-tighter">{desc}</span>
        </div>
        <span className="text-sm font-black text-[#323d5a]">{value}%</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade mt-12 mb-32 space-y-12">
      {/* 01. Elemzés és DISC */}
      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/40 shadow-2xl">
        <div className="hub-gradient-bg p-12 text-white relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <span className="bg-white/20 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-6 inline-block">Intelligence Report</span>
            <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight italic">Profil & Pszichológia</h2>
            <p className="text-blue-50 text-xl leading-relaxed font-medium opacity-90 max-w-3xl">
              {result.profileSummary}
            </p>
          </div>
        </div>
        
        <div className="p-8 md:p-14 space-y-16">
          <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-10 flex items-center gap-4">
              <span className="w-8 h-px bg-blue-100"></span>
              DISC Dinamika Vizualizáció
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <DiscBar label="D" value={result.discAnalysis.d} color="bg-rose-500" desc="Domináns / Eredmény" />
              <DiscBar label="I" value={result.discAnalysis.i} color="bg-amber-400" desc="Influensz / Kapcsolat" />
              <DiscBar label="S" value={result.discAnalysis.s} color="bg-emerald-500" desc="Stabil / Támogató" />
              <DiscBar label="C" value={result.discAnalysis.c} color="bg-sky-500" desc="Korrekt / Elemző" />
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-6">Motivációs Pillérek</h3>
              <div className="flex flex-wrap gap-2">
                {result.motivations.map((m, i) => (
                  <span key={i} className="px-4 py-2 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-xl border border-blue-100">{m}</span>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-6">Stratégiai Tippek</h3>
              <ul className="space-y-3">
                {result.approachTips.map((t, i) => (
                  <li key={i} className="text-sm text-gray-600 font-semibold flex gap-3 italic">
                    <span className="text-blue-500 font-black">•</span> {t}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* 02. Copywriting */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black text-[#323d5a] tracking-tight">LEADERSHIP MESSAGING</h3>
          <p className="text-gray-500 font-medium">Személyre szabott, magas konverziójú megkeresések</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {result.openingMessages.map((msg, idx) => (
            <div key={idx} className="group glass-card rounded-[2.5rem] p-8 md:p-10 border border-gray-100 hover:border-blue-200 transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                  msg.type === 'product' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {msg.type === 'product' ? 'Megoldás Fókusz' : 'Lehetőség Fókusz'}
                </span>
                <span className="text-gray-200 font-black text-3xl">0{idx + 1}</span>
              </div>
              
              <h4 className="text-lg font-black text-[#323d5a] mb-6">{msg.title}</h4>
              
              <div className="bg-white border border-gray-50 rounded-3xl p-6 mb-6 shadow-inner">
                <p className="text-gray-800 text-sm leading-relaxed font-medium">"{msg.text}"</p>
              </div>

              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border-l-4 border-blue-500">
                <p className="text-[11px] text-gray-500 font-bold italic leading-relaxed">
                  <span className="text-blue-600 not-italic mr-2 underline">STRATÉGIA:</span>
                  {msg.psychology}
                </p>
              </div>

              <button 
                onClick={() => handleCopy(msg.text, idx)}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  copiedIndex === idx 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-[#323d5a] text-white hover:bg-blue-600'
                }`}
              >
                {copiedIndex === idx ? 'Másolva!' : 'Szöveg másolása'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 03. Kifogáskezelés */}
      <div className="glass-card rounded-[3rem] p-10 md:p-14 border-t-8 border-t-blue-500 shadow-xl">
        <h3 className="text-2xl font-black text-[#323d5a] mb-10 flex items-center gap-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Gördülékeny Kifogáskezelés
        </h3>
        <div className="space-y-8">
          {result.objections.map((obj, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Potenciális kifogás:</span>
                <p className="text-sm font-bold text-[#323d5a]">"{obj.objection}"</p>
              </div>
              <div className="border-l-0 md:border-l border-gray-200 pl-0 md:pl-8">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Leaders Hub válasz:</span>
                <p className="text-sm font-semibold text-gray-600 italic">"{obj.rebuttal}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 text-center">
        <button
          onClick={onReset}
          className="px-12 py-5 border-2 border-dashed border-gray-200 text-gray-400 font-black rounded-3xl hover:border-blue-500 hover:text-blue-500 transition-all uppercase tracking-[0.3em] text-[10px]"
        >
          Új elemzés indítása
        </button>
      </div>
    </div>
  );
};

export default ProfileResult;
