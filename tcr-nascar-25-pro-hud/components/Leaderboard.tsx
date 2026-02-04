
import React from 'react';
import { Driver, RaceStats } from '../types';

interface LeaderboardProps {
  drivers: Driver[];
  selectedId: string;
  onSelect: (id: string) => void;
  isUserView?: boolean;
  raceStats?: RaceStats;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ drivers, selectedId, onSelect, isUserView, raceStats }) => {
  return (
    <div className={`flex flex-col bg-zinc-950/98 h-full border-r border-white/10 overflow-hidden transition-all duration-500 ${isUserView ? 'w-64' : 'w-72'} z-40`}>
      {/* Sponsor/Logo Area (Top of Tower) */}
      <div className="bg-white p-5 flex flex-col items-center justify-center border-b-4 border-red-600 shrink-0">
         <div className="text-black font-black italic text-3xl tracking-tighter leading-none">TCR</div>
         <div className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em] mt-2">Official Data Tower</div>
      </div>

      {/* Header Info */}
      <div className="bg-zinc-900/90 px-5 py-3 flex justify-between items-center shrink-0 border-b border-white/5">
         <div className="text-[9px] font-black uppercase text-zinc-500 tracking-widest italic">Live Feed</div>
         <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter animate-pulse">Sync Active</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
         </div>
      </div>
      
      <div className="bg-zinc-800/80 px-5 py-4 flex flex-col gap-1 shrink-0">
         <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Current Event</div>
         <div className="text-[13px] font-black text-white italic uppercase truncate tracking-tighter">
            {raceStats?.currentEvent?.name || 'TCR CUP SEASON 1'}
         </div>
         <div className="flex justify-between items-end mt-2">
            <span className="text-[10px] font-black text-zinc-500 uppercase italic tracking-widest">LAP</span>
            <span className="font-black text-white italic text-xl tabular-nums leading-none">
              {raceStats?.lap || 1} <span className="text-zinc-600 text-[10px] not-italic ml-1">/ {raceStats?.totalLaps || 100}</span>
            </span>
         </div>
      </div>

      {/* Driver List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/40">
        {drivers.sort((a,b) => a.position - b.position).map((driver) => {
          const isSelected = driver.id === selectedId;
          
          return (
            <div
              key={driver.id}
              onClick={() => onSelect(driver.id)}
              className={`
                group relative flex items-center h-12 px-3 cursor-pointer transition-all border-b border-white/[0.03]
                ${isSelected ? 'bg-zinc-800 shadow-[inset_4px_0_0_#ef4444]' : 'hover:bg-zinc-900/50'}
              `}
            >
              {/* Position */}
              <div className="w-6 text-xs font-black text-zinc-600 italic pr-1">{driver.position}</div>

              {/* Car Number Badge */}
              <div 
                className="w-10 h-7 flex items-center justify-center font-black text-xs italic tracking-tighter shadow-xl mr-3 rounded-md border border-white/10"
                style={{ backgroundColor: driver.color || '#333', color: '#000' }}
              >
                {driver.number}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-black uppercase italic tracking-tighter truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {driver.name}
                </div>
              </div>

              {/* Gap/Time */}
              <div className={`text-[10px] font-black tabular-nums italic ${isSelected ? 'text-red-500' : 'text-zinc-600'}`}>
                {driver.gap === '--' ? 'LDR' : driver.gap}
              </div>
            </div>
          );
        })}
        {drivers.length === 0 && (
          <div className="p-10 text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] italic leading-loose opacity-30">
            Awaiting Grid Sync...
          </div>
        )}
      </div>

      {/* Broadcast Info Area (Bottom of Tower) */}
      <div className="bg-zinc-900/90 p-5 border-t border-white/5 shrink-0">
         <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">Broadcast Source</div>
         <div className="text-[11px] font-black uppercase italic tracking-tighter text-white">TCR PC Series S1</div>
         <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_5px_red]" />
            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Live Uplink Est.</div>
         </div>
      </div>
    </div>
  );
};

export default Leaderboard;
