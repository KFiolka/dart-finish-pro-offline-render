import React from 'react';
import { DartPathStep } from '../types';

interface Props {
  path: DartPathStep[];
  dartsThrownCount?: number;
}

const DartCard: React.FC<{ step: DartPathStep; index: number; isThrown: boolean; isCurrent: boolean }> = ({ step, index, isThrown, isCurrent }) => {
  if (!step) return null;

  let borderColor = "border-slate-700";
  let textColor = "text-slate-100";
  let bgColor = "bg-slate-900";
  let accentColor = "text-slate-500";
  let opacity = "opacity-100";
  let ring = "";

  if (isThrown) {
    opacity = "opacity-40 grayscale";
  } else if (isCurrent) {
    ring = "ring-2 ring-red-500 ring-offset-4 ring-offset-slate-950";
  }

  if (step.type === 'Triple') {
    borderColor = "border-blue-500/50";
    textColor = "text-blue-400";
    bgColor = "bg-blue-950/20";
    accentColor = "text-blue-600";
  } else if (step.type === 'Double') {
    borderColor = "border-emerald-500/50";
    textColor = "text-emerald-400";
    bgColor = "bg-emerald-950/20";
    accentColor = "text-emerald-600";
  } else if (step.type === 'Bull' || step.type === 'SingleBull') {
    borderColor = "border-red-500/50";
    textColor = "text-red-500";
    bgColor = "bg-red-950/20";
    accentColor = "text-red-700";
  } else if (step.type === 'Miss') {
    borderColor = "border-slate-800";
    textColor = "text-slate-500";
    bgColor = "bg-slate-950";
    accentColor = "text-slate-700";
  }

  return (
    <div className={`relative flex flex-col items-center justify-center w-24 h-32 md:w-28 md:h-36 border-2 rounded-xl ${borderColor} ${bgColor} ${opacity} ${ring} transition-all shadow-lg shadow-black/40`}>
      <span className={`absolute top-2 left-3 text-[10px] uppercase font-black tracking-widest ${accentColor}`}>
        Pfeil {index + 1}
      </span>
      <span className={`text-3xl md:text-4xl font-black tracking-tighter ${textColor}`}>
        {step.label}
      </span>
      <div className="absolute bottom-2 right-3 text-right">
        <span className="block text-[10px] text-slate-500 uppercase font-bold leading-none mb-0.5">Rest</span>
        <span className="text-base md:text-lg font-mono text-slate-300 font-bold leading-none">{step.remaining}</span>
      </div>
    </div>
  );
};

export const PathVisualizer: React.FC<Props> = ({ path, dartsThrownCount = 0 }) => {
  if (!path || path.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 my-6">
      {path.map((step, idx) => (
        <React.Fragment key={idx}>
          <DartCard 
            step={step} 
            index={idx} 
            isThrown={idx < dartsThrownCount} 
            isCurrent={idx === dartsThrownCount}
          />
          {idx < path.length - 1 && (
            <div className="text-slate-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-7 md:h-7 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
