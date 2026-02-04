
import React from 'react';
import { RaceStats } from '../types';

interface Props {
  raceStats: RaceStats;
}

const BroadcastOverlay: React.FC<Props> = ({ raceStats }) => {
  const flagInfo = {
    Green: { color: 'bg-green-500', text: 'text-black' },
    Yellow: { color: 'bg-yellow-500', text: 'text-black' },
    Red: { color: 'bg-red-500', text: 'text-white' },
    White: { color: 'bg-white', text: 'text-black' },
    Checkered: { color: 'bg-white', text: 'text-black' }
  }[raceStats.flag];

  return (
    <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none z-30 animate-in fade-in duration-1000">
      {/* Top Left: Race Progress */}
      <div className="flex flex-col gap-3">
        <div className="bg-black/90 backdrop-blur-xl border-l-4 border-red-600 p-5 shadow-2xl rounded-sm">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1.5">Race Progress</div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black italic text-white leading-none tabular-nums tracking-tighter">{raceStats.lap}</span>
            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">/ {raceStats.totalLaps} LAPS</span>
          </div>
        </div>
        
        <div className="flex gap-2">
           <div className={`px-6 py-2 font-black text-[11px] uppercase italic tracking-[0.2em] rounded-sm shadow-lg border border-white/5 ${flagInfo.color} ${flagInfo.text}`}>
             {raceStats.flag} FLAG CONDITIONS
           </div>
        </div>
      </div>

      {/* Top Center: Event Title */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 w-[400px]">
         <div className="bg-black/95 backdrop-blur-3xl border-t-4 border-red-600 px-6 py-3 flex flex-col items-center rounded-b-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
            <div className="text-[10px] font-black text-zinc-600 tracking-[0.5em] uppercase mb-1">Official Broadcast</div>
            <div className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">{raceStats.currentEvent?.name || 'TCR CUP SERIES'}</div>
            <div className="text-[9px] font-bold text-red-600 uppercase tracking-[0.3em] mt-2">Season 1 • Round {raceStats.currentEvent ? 1 : 0}</div>
         </div>
      </div>

      {/* Top Right: Track Conditions */}
      <div className="flex flex-col gap-3 items-end">
        <div className="flex gap-4">
           <div className="bg-black/90 backdrop-blur-xl px-6 py-4 border-r-4 border-blue-600 flex flex-col items-end rounded-sm shadow-xl">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Track Temp</span>
              <span className="text-3xl font-black italic text-white leading-none tabular-nums">{raceStats.trackTemp}</span>
           </div>
           <div className="bg-black/90 backdrop-blur-xl px-6 py-4 border-r-4 border-zinc-700 flex flex-col items-end rounded-sm shadow-xl">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Circuit</span>
              <span className="text-3xl font-black italic text-white leading-none uppercase tracking-tighter">{raceStats.currentEvent?.track || 'DAYTONA'}</span>
           </div>
        </div>
        
        <div className="bg-zinc-950/80 backdrop-blur-md border border-white/5 px-4 py-1.5 flex items-center gap-3 rounded-full">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-black italic text-zinc-400 uppercase tracking-[0.25em]">Session Link: TCR_PC_S1</span>
        </div>
      </div>
    </div>
  );
};

export default BroadcastOverlay;
