
import React, { useState, useEffect, useMemo } from 'react';
import { getOptimalCheckout } from './engine';
import { DEFAULT_PREFS } from './constants';
import { FinishResult, UserPreferences } from './types';
import { PathVisualizer } from './components/PathVisualizer';

const App: React.FC = () => {
  const [score, setScore] = useState<number>(170);
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  
  const result = useMemo(() => {
    try {
      return getOptimalCheckout(score, prefs);
    } catch (e) {
      console.error("Engine calculation failed:", e);
      return null;
    }
  }, [score, prefs]);

  const handleScoreChange = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num)) {
      if (num > 170) setScore(170);
      else if (num < 2) setScore(2);
      else setScore(num);
    } else if (val === '') {
      setScore(0);
    }
  };

  const toggleDoublePref = (label: string) => {
    setPrefs(prev => {
      const exists = prev.favoriteDoubles.includes(label);
      return {
        ...prev,
        favoriteDoubles: exists 
          ? prev.favoriteDoubles.filter(d => d !== label)
          : [...prev.favoriteDoubles, label]
      };
    });
  };

  const toggleTriplePref = (label: string) => {
    setPrefs(prev => {
      const exists = prev.favoriteTriples.includes(label);
      return {
        ...prev,
        favoriteTriples: exists 
          ? prev.favoriteTriples.filter(t => t !== label)
          : [...prev.favoriteTriples, label]
      };
    });
  };

  const allDoubles = Array.from({ length: 20 }, (_, i) => 20 - i).map(n => `D${n}`);
  const allTriples = Array.from({ length: 20 }, (_, i) => 20 - i).map(n => `T${n}`);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 lg:p-8 font-sans selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Professional Header - Immer ganz oben */}
        <header className="lg:col-span-12 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-2 gap-4 order-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-white">
              DART FINISH <span className="text-red-600">PRO</span>
            </h1>
            <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Local Engine
            </div>
          </div>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] hidden sm:block">Tactical Analyzer v2.6</p>
        </header>

        {/* LINKER BEREICH: Eingabe & Präferenzen */}
        <div className="contents lg:block lg:col-span-4 lg:space-y-6">
          
          {/* 1. Eingabe Punktestand */}
          <section className="order-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Eingabe Punktestand</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setScore(s => Math.max(2, s - 1))} 
                className="flex-none w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-lg font-bold transition-all active:scale-90"
              >-</button>
              <div className="flex-1 min-w-0">
                <input 
                  type="number" 
                  value={score === 0 ? '' : score} 
                  onChange={(e) => handleScoreChange(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-950 text-center text-3xl font-black text-white py-2 rounded-xl border-2 border-slate-800 focus:border-red-600 focus:outline-none transition-all placeholder:text-slate-800"
                />
              </div>
              <button 
                onClick={() => setScore(s => Math.min(170, s + 1))} 
                className="flex-none w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-lg font-bold transition-all active:scale-90"
              >+</button>
            </div>
            <div className="mt-5 px-1">
              <input 
                type="range" min="2" max="170" value={score} 
                onChange={(e) => setScore(parseInt(e.target.value))} 
                className="w-full accent-red-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              />
            </div>
          </section>

          {/* 4. Lieblings-Doubles und Lieblings-Triples */}
          <section className="order-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="mb-6">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Lieblings-Doubles</span>
                <span className="text-[9px] text-slate-600 font-bold uppercase">{prefs.favoriteDoubles.length}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {allDoubles.map(d => (
                  <button key={d} onClick={() => toggleDoublePref(d)}
                    className={`h-8 flex items-center justify-center rounded-md text-[10px] font-bold border transition-all ${
                      prefs.favoriteDoubles.includes(d) ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                    }`}
                  >{d}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Lieblings-Triples</span>
                <span className="text-[9px] text-slate-600 font-bold uppercase">{prefs.favoriteTriples.length}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {allTriples.map(t => (
                  <button key={t} onClick={() => toggleTriplePref(t)}
                    className={`h-8 flex items-center justify-center rounded-md text-[10px] font-bold border transition-all ${
                      prefs.favoriteTriples.includes(t) ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* RECHTER BEREICH: Empfohlener Weg & Plan B */}
        <div className="contents lg:block lg:col-span-8 lg:space-y-6">
          
          {/* 2. Empfohlener Weg und Analyse */}
          <section className="order-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[450px] flex flex-col">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[80px] pointer-events-none -mr-10 -mt-10"></div>
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-black text-white tracking-widest uppercase border-l-4 border-red-600 pl-3">Empfohlener Weg</h2>
                {result && !result.isImpossible && (
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-900/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Optimal
                  </div>
                )}
              </div>

              {(!result || result.isImpossible) ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
                    <span className="text-4xl opacity-50">🎯</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-200 mb-2 tracking-tight">Kein Checkout möglich</h3>
                  <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
                    {result?.explanation || "Dieser Score kann nicht mit drei Darts auf ein Doppel beendet werden."}
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="py-4">
                    <PathVisualizer path={result.path} />
                  </div>
                  <div className="mt-auto">
                    <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 shadow-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-red-600/10 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-600"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-widest text-white/80">Analyse</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed italic border-l border-slate-800 pl-4 whitespace-pre-line">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 3. Plan B: Bei Fehlwurf */}
          {result && result.missScenarios && result.missScenarios.length > 0 && (
            <section className="order-3 bg-slate-900/40 border border-slate-800 border-l-4 border-l-amber-600 rounded-r-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-1.5 bg-amber-600/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Plan B: Bei Fehlwurf</h3>
              </div>
              {result.missScenarios.map((scenario, idx) => (
                <div key={idx} className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 shadow-inner">
                  <p className="text-slate-400 text-[13px] mb-5 leading-relaxed whitespace-pre-line italic">
                    {scenario.description}
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {scenario.remainingPath.map((step, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <div className={`px-4 py-1.5 rounded-lg border font-black text-xs ${step.type === 'Double' ? 'border-emerald-900 bg-emerald-950/40 text-emerald-400' : 'border-slate-800 bg-slate-900 text-slate-300'}`}>
                          {step.label}
                        </div>
                        {sIdx < scenario.remainingPath.length - 1 && <span className="text-slate-800 font-black">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="lg:col-span-12 text-center pt-6 opacity-30 order-5">
          <p className="text-slate-600 text-[9px] uppercase font-black tracking-[0.4em]">Dart Finish Pro Engine • Local Edition</p>
        </footer>
        
      </div>
    </div>
  );
};

export default App;
