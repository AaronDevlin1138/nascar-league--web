
import React, { useState } from 'react';
import { Driver } from '../types';

interface StreamGridProps {
  drivers: Driver[];
  selectedDriverId: string;
}

const StreamGrid: React.FC<StreamGridProps> = ({ drivers, selectedDriverId }) => {
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});

  const toggleMute = (id: string) => {
    setMutedStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Sort by position for the grid as well to stay organized
  const sortedDrivers = [...drivers].sort((a, b) => a.position - b.position);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 h-full overflow-y-auto custom-scrollbar bg-black/20">
      {sortedDrivers.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center text-zinc-700 space-y-8 h-full min-h-[500px]">
           <div className="relative">
             <div className="w-24 h-24 border-4 border-zinc-900 border-t-red-600 rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black italic">SYNC</div>
           </div>
           <div className="flex flex-col items-center gap-2">
             <p className="font-black uppercase tracking-[0.5em] italic text-2xl text-white/10">Grid Standby</p>
             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] bg-zinc-900/50 px-4 py-1 rounded-full">Register entries in Manager Dashboard to begin broadcast</p>
           </div>
        </div>
      ) : (
        sortedDrivers.map((driver) => {
          const isSelected = driver.id === selectedDriverId;
          const isMuted = mutedStates[driver.id] ?? true;

          return (
            <div 
              key={driver.id} 
              className={`
                relative aspect-video bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all duration-500 group shadow-2xl
                ${isSelected ? 'border-yellow-400 scale-[1.03] z-10 shadow-[0_30px_60px_rgba(0,0,0,1),0_0_40px_rgba(234,179,8,0.15)]' : 'border-white/5 hover:border-white/20'}
              `}
            >
              {/* Background Layer */}
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 overflow-hidden">
                {driver.streamUrl ? (
                  <>
                    <img 
                      src={`https://images.unsplash.com/photo-1532581133501-831498f3994e?auto=format&fit=crop&q=80&w=600&car=${driver.number}`} 
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 group-hover:scale-110"
                      alt="Stream Feed"
                    />
                    {!isMuted && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1.5 pb-4 px-6 opacity-60 pointer-events-none">
                        {[...Array(16)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1.5 bg-green-500 rounded-t-sm" 
                            style={{ 
                              height: `${15 + Math.random() * 85}%`,
                              animation: `pulse 0.2s infinite alternate`,
                              animationDelay: `${i * 0.05}s` 
                            }} 
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative flex flex-col items-center gap-4">
                    {driver.logoUrl ? (
                      <img src={driver.logoUrl} className="w-20 h-20 rounded-full object-cover border-4 border-white/5 shadow-2xl" alt="Logo" />
                    ) : (
                      <div className="text-[120px] font-black italic text-white/5 tracking-tighter leading-none select-none">#{driver.number}</div>
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
              </div>

              {/* HUD Content Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
                <div className="flex justify-between items-start">
                   <div className="flex gap-2">
                      <div 
                        className="px-3 py-1 text-xs font-black italic uppercase rounded-md shadow-2xl flex items-center gap-3"
                        style={{ backgroundColor: driver.color || '#333', color: '#000' }}
                      >
                        <span className="text-sm">#{driver.number}</span>
                        <div className="w-[1px] h-3 bg-black/20" />
                        <span className="text-[10px] tracking-widest">{driver.position}ST</span>
                      </div>
                      {driver.streamUrl && (
                        <div className="bg-red-600 px-3 py-1 text-[9px] font-black italic uppercase rounded-md shadow-2xl flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]" />
                          LIVE
                        </div>
                      )}
                   </div>
                   
                   <button 
                     onClick={(e) => { e.stopPropagation(); toggleMute(driver.id); }}
                     className={`
                       p-2.5 rounded-lg transition-all duration-300 pointer-events-auto backdrop-blur-md
                       ${!isMuted ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-black/40 text-white/40 hover:bg-black/60 hover:text-white border border-white/10'}
                     `}
                   >
                     {isMuted ? (
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                     ) : (
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                     )}
                   </button>
                </div>
                
                <div className="flex flex-col">
                   <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-1">{driver.teamName || 'Independent Participant'}</div>
                   <div className="text-lg font-black italic uppercase text-white tracking-tighter leading-none mb-4">{driver.name}</div>
                   
                   {/* Telemetry Row */}
                   <div className="flex gap-6 mt-2 border-t border-white/5 pt-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">Velocity</span>
                        <span className="text-xl font-black italic tabular-nums leading-none text-white">
                          {Math.round(driver.telemetry?.speed || 0)} 
                          <span className="text-[10px] not-italic ml-1 text-zinc-600">MPH</span>
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">Reserves</span>
                        <div className="flex items-center gap-2">
                           <span className="text-xl font-black italic tabular-nums leading-none text-white">{Math.round(driver.telemetry?.fuel || 0)}%</span>
                           <div className="w-10 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-blue-500" style={{ width: `${driver.telemetry?.fuel || 0}%` }} />
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Selection Border Glow */}
              {isSelected && (
                <div className="absolute inset-0 pointer-events-none border-4 border-yellow-400/20 animate-pulse" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default StreamGrid;
