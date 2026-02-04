
import React from 'react';
import { PerformanceMetric } from '../types';

interface CoachingPanelProps {
  metrics: PerformanceMetric[];
}

const CoachingPanel: React.FC<CoachingPanelProps> = ({ metrics }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-h-[160px] overflow-hidden">
      <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-1">Performance Coach</div>
      <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2">
        {metrics.length === 0 && (
          <div className="text-[11px] font-black uppercase text-zinc-600 italic">Analyzing line and inputs...</div>
        )}
        {metrics.map((m, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-3 p-3 rounded-sm border-l-4 backdrop-blur-md animate-in slide-in-from-right duration-300 ${
              m.type === 'CORRECT' 
                ? 'bg-green-500/10 border-green-500 text-green-400' 
                : m.type === 'WRONG' 
                ? 'bg-red-500/10 border-red-500 text-red-400' 
                : 'bg-blue-500/10 border-blue-500 text-blue-400'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${m.type === 'CORRECT' ? 'bg-green-500' : m.type === 'WRONG' ? 'bg-red-500' : 'bg-blue-500'}`} />
            <span className="text-[11px] font-black uppercase italic tracking-tighter">{m.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachingPanel;
