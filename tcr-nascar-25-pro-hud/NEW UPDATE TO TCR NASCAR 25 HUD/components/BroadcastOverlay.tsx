
import React from 'react';
import { RaceStats } from '../types.ts';

interface Props {
  raceStats: RaceStats;
}

const BroadcastOverlay: React.FC<Props> = ({ raceStats }) => {
  const getFlagDetails = () => {
    switch(raceStats.flag) {
      case 'Yellow': return { bg: 'bg-yellow-500', text: 'text-black', label: 'CAUTION' };
      case 'Red': return { bg: 'bg-red-600', text: 'text-white', label: 'RED FLAG' };
      case 'White': return { bg: 'bg-white', text: 'text-black', label: 'LAST LAP' };
      case 'Checkered': return { bg: 'bg-zinc-100', text: 'text-black', label: 'FINAL' };
      default: return { bg: 'bg-green-600', text: 'text-white', label: 'GREEN FLAG' };
    }
  };

  const flag = getFlagDetails();

  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-30 flex items-stretch">
      {/* Background Header Extension */}
      <div className="flex-1 bg-gradient-to-b from-black/80 to-transparent flex items-center px-10">
        <div className="flex items-center gap-12">
          {/* Progress Section */}
          <div className="flex items-baseline gap-3">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic">Laps</span>
             <span className="text-3xl font-black italic text-white leading-none tabular-nums tracking-tighter">
                {raceStats.lap}<span className="text-zinc-700 text-lg not-italic">/{raceStats.totalLaps}</span>
             </span>
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] h-8 bg-white/10" />

          {/* Event Info */}
          <div className="flex flex-col">
             <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Official Event</div>
             <div className="text-sm font-black italic text-white uppercase tracking-tight leading-none">
               {raceStats.currentEvent?.name || 'TCR CUP SERIES PREMIER'}
             </div>
          </div>
        </div>

        {/* Center Logo Area */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
           <div className="bg-red-600 px-8 py-3 rounded-b-xl shadow-2xl flex flex-col items-center">
              <div className="text-xl font-black italic tracking-tighter text-white leading-none">TCR <span className="text-black">TV</span></div>
              <div className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1">Live Broadcast</div>
           </div>
        </div>

        {/* Right Status Section */}
        <div className="ml-auto flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Track Condition</span>
              <span className="text-sm font-black italic text-white leading-none">{raceStats.trackTemp} TRACK</span>
           </div>
           <div className={`${flag.bg} ${flag.text} px-6 py-2 rounded-sm font-black italic tracking-widest text-[11px] shadow-lg skew-x-[-15deg]`}>
              <span className="block skew-x-[15deg]">{flag.label}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastOverlay;