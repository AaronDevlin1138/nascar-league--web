
import React from 'react';
import { Driver } from '../types.ts';

interface FanStandingsProps {
  drivers: Driver[];
}

const FanStandings: React.FC<FanStandingsProps> = ({ drivers }) => {
  const sortedDrivers = [...drivers].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="w-full h-full p-12 bg-black/40 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">Championship Standings</h1>
            <p className="text-zinc-500 font-black uppercase tracking-[0.4em] mt-4 italic">PC Cup Series • Season 1 Official Points</p>
          </div>
          <div className="bg-red-600 px-6 py-2 font-black italic text-sm skew-x-[-15deg]">
             <span className="block skew-x-[15deg]">LIVE POINTS UPDATED</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {sortedDrivers.map((driver, index) => (
            <div 
              key={driver.id} 
              className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:bg-zinc-800/80 transition-all"
            >
              <div className="flex items-center gap-8">
                <div className="text-4xl font-black italic text-zinc-800 w-16">P{index + 1}</div>
                <div className="w-14 h-10 rounded-lg flex items-center justify-center font-black italic text-lg shadow-xl" style={{ backgroundColor: driver.color, color: '#000' }}>
                  {driver.number}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-red-500 transition-colors">{driver.name}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{driver.teamName || 'Independent'}</span>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Points</span>
                  <span className="text-3xl font-black italic text-white tabular-nums">{Math.floor(1000 - index * 42)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Interval</span>
                  <span className="text-sm font-bold text-zinc-400 tabular-nums">{index === 0 ? '--' : `-${index * 12} PTS`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fix: Add default export to resolve "Module has no default export" error in App.tsx
export default FanStandings;
