
import React from 'react';
import { Driver, RaceStats } from '../types.ts';

interface LeaderboardProps {
  drivers: Driver[];
  selectedId: string;
  onSelect: (id: string) => void;
  raceStats?: RaceStats;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ drivers, selectedId, onSelect, raceStats }) => {
  const sortedDrivers = [...drivers].sort((a, b) => a.position - b.position);

  const getManufacturerBadge = (m: string) => {
    const colors: Record<string, string> = {
      'Chevy': 'bg-yellow-600',
      'Ford': 'bg-blue-600',
      'Toyota': 'bg-red-600',
      'Custom': 'bg-zinc-700'
    };
    return (
      <div className={`text-[7px] font-black px-1 rounded-sm uppercase ${colors[m] || colors.Custom} text-white`}>
        {m.substring(0, 3)}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-zinc-950 h-full w-[240px] shrink-0 border-r border-white/5 z-40 relative shadow-[20px_0_50px_rgba(0,0,0,0.8)]">
      {/* Branding Header */}
      <div className="bg-black pt-10 pb-6 px-4 flex flex-col items-center border-b-2 border-red-600 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600" />
         <div className="text-white font-black italic text-2xl tracking-tighter">NASCAR <span className="text-red-600">TCR</span></div>
         <div className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-1">Live Scoring System</div>
      </div>

      {/* Race Progress Bar */}
      <div className="bg-zinc-900/50 px-5 py-3 border-b border-white/5 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-zinc-600 uppercase">Lap</span>
          <span className="text-xl font-black italic tabular-nums leading-none">
            {raceStats?.lap || 1}<span className="text-zinc-700 text-xs not-italic ml-1">/ {raceStats?.totalLaps || 100}</span>
          </span>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-black uppercase italic ${raceStats?.flag === 'Yellow' ? 'bg-yellow-500 text-black' : 'bg-green-600 text-white'}`}>
          {raceStats?.flag || 'GREEN'}
        </div>
      </div>

      {/* Scoring List */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-black/40">
        {sortedDrivers.map((driver) => {
          const isSelected = driver.id === selectedId;
          const isPit = driver.telemetry?.pitStatus;
          
          return (
            <div
              key={driver.id}
              onClick={() => onSelect(driver.id)}
              className={`
                group relative flex items-center h-16 px-3 cursor-pointer transition-all border-b border-white/5
                ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
              `}
            >
              {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 shadow-[2px_0_10px_rgba(220,38,38,0.5)]" />}
              
              {/* Position */}
              <div className="w-8 text-[11px] font-black text-zinc-500 italic text-center">
                {driver.position}
              </div>

              {/* Number Badge */}
              <div 
                className="w-10 h-10 flex items-center justify-center font-black text-base italic tracking-tighter shadow-xl rounded-sm mr-3 skew-x-[-10deg]"
                style={{ backgroundColor: driver.color || '#333', color: '#000' }}
              >
                <span className="skew-x-[10deg]">{driver.number}</span>
              </div>

              {/* Driver Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className={`text-[13px] font-black uppercase italic tracking-tighter truncate ${isPit ? 'text-blue-400' : 'text-white'}`}>
                    {driver.name.split(' ').pop()}
                  </div>
                  {getManufacturerBadge(driver.manufacturer)}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${isPit ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
                   <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                     {isPit ? 'IN PITS' : 'ON TRACK'}
                   </span>
                </div>
              </div>

              {/* Gap */}
              <div className={`text-[10px] font-black tabular-nums italic pr-1 ${driver.position === 1 ? 'text-yellow-400' : 'text-zinc-500'}`}>
                {driver.position === 1 ? 'LEADER' : driver.gap}
              </div>
            </div>
          );
        })}

        {drivers.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-red-600 rounded-full animate-spin" />
            <div className="text-zinc-700 text-[10px] font-black uppercase tracking-widest italic animate-pulse">Syncing Grid...</div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Leaderboard;