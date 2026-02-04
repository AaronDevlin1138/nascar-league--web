
import React from 'react';
import { Driver } from '../types';

interface Props {
  driver: Driver;
}

const TelemetryOverlay: React.FC<Props> = ({ driver }) => {
  const telemetry = driver.telemetry;
  if (!telemetry) return null;

  const rpmPercent = Math.min((telemetry.rpm / 9500) * 100, 100);
  const throttleColor = telemetry.throttle > 90 ? 'bg-green-400' : 'bg-green-600';
  const brakeColor = telemetry.brake > 5 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-red-900';

  return (
    <div className="absolute bottom-12 right-12 w-[360px] bg-zinc-950/98 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)] transition-all duration-300 hover:scale-[1.01]">
      {/* Top Identity Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-black italic tracking-tighter text-black leading-none drop-shadow-sm">#{driver.number}</div>
          <div className="h-8 w-[2px] bg-black/10" />
          <div className="flex flex-col">
            <div className="text-[10px] font-black text-black/40 uppercase leading-none tracking-widest">Driver Focus</div>
            <div className="text-base font-black text-black uppercase tracking-tight leading-none mt-1">{driver.name}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <div className="text-[9px] font-black text-black/50 italic uppercase">{driver.manufacturer} Performance</div>
            <div className="flex gap-1 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
            </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Main Stats Row */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <div className="text-7xl font-black italic tracking-tighter text-white tabular-nums leading-none flex items-baseline">
              {Math.round(telemetry.speed)}
              <span className="text-[14px] font-black text-zinc-600 uppercase tracking-widest ml-2">MPH</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center pb-2 px-6 border-l border-white/10">
             <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gear</div>
             <div className="text-5xl font-black italic text-red-600 leading-none mt-1">{telemetry.gear}</div>
          </div>
        </div>

        {/* RPM Digidash Gauge */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <div className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em]">Revolution Counter</div>
            <div className={`text-sm font-black italic tabular-nums ${telemetry.rpm > 8500 ? 'text-red-500 animate-bounce' : 'text-zinc-300'}`}>
              {telemetry.rpm} <span className="text-[9px] uppercase not-italic">RPM</span>
            </div>
          </div>
          <div className="h-4 bg-white/5 rounded-md overflow-hidden flex gap-[2px] p-1 border border-white/5 shadow-inner">
            {[...Array(30)].map((_, i) => {
              const segmentPercent = (i / 30) * 100;
              const isActive = rpmPercent > segmentPercent;
              let colorClass = 'bg-white/5';
              if (isActive) {
                colorClass = i > 25 ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : i > 20 ? 'bg-yellow-500' : 'bg-green-500';
              }
              return (
                <div 
                  key={i} 
                  className={`flex-1 h-full transition-all duration-75 rounded-[1px] ${colorClass}`} 
                />
              );
            })}
          </div>
        </div>

        {/* Pedals & G-Force Meter */}
        <div className="grid grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                <span>Throttle</span>
                <span className="text-white tabular-nums">{Math.round(telemetry.throttle)}%</span>
              </div>
              <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-100 ${throttleColor}`} 
                  style={{ width: `${telemetry.throttle}%` }} 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                <span>Brake</span>
                <span className="text-white tabular-nums">{Math.round(telemetry.brake)}%</span>
              </div>
              <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-100 ${brakeColor}`} 
                  style={{ width: `${telemetry.brake}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Precision G-Load Meter */}
          <div className="flex flex-col items-center">
             <div className="text-[9px] font-black text-zinc-500 uppercase mb-3 tracking-[0.2em]">Lateral G-Load</div>
             <div className="relative w-20 h-20 border border-white/20 rounded-full bg-zinc-900/50 flex items-center justify-center shadow-inner">
                <div className="absolute w-[80%] h-[80%] border border-white/5 rounded-full" />
                <div className="absolute w-[1px] h-full bg-white/10" />
                <div className="absolute w-full h-[1px] bg-white/10" />
                {/* Dynamic Ball */}
                <div 
                  className="absolute w-3.5 h-3.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)] transition-all duration-100 ease-out"
                  style={{ 
                    top: `${50 + (telemetry.gForce?.long || 0) * 12}%`, 
                    left: `${50 + (telemetry.gForce?.lat || 0) * 12}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
             </div>
          </div>
        </div>

        {/* Tire Matrix */}
        <div className="mt-2 pt-5 border-t border-white/10">
          <div className="flex justify-between items-center mb-4">
             <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tire Thermal Map (°F)</div>
             <div className="px-2 py-0.5 bg-zinc-800 rounded text-[9px] font-black text-zinc-300">STAGE 2 READY</div>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-4 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-14 border-2 border-white/15 rounded-lg bg-zinc-950/80 shadow-lg" />
             
             {[
               { side: 'fl', val: telemetry.tires.fl },
               { side: 'fr', val: telemetry.tires.fr },
               { side: 'rl', val: telemetry.tires.rl },
               { side: 'rr', val: telemetry.tires.rr }
             ].map((t) => (
               <div key={t.side} className={`flex flex-col ${t.side.includes('l') ? 'items-end' : 'items-start'} group`}>
                  <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors tabular-nums">{Math.round(t.val)}°</span>
                  <div className="w-12 h-1.5 bg-zinc-900 rounded-full mt-1.5 border border-white/5">
                     <div 
                        className="h-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" 
                        style={{ width: `${Math.min((t.val / 260) * 100, 100)}%` }} 
                     />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
      
      {/* HUD Branding Footer */}
      <div className="bg-zinc-900/80 px-5 py-3 flex justify-between items-center border-t border-white/10">
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">NASCAR-MAX SIMULATOR LINK 1.4</span>
        <div className="flex gap-2">
           {[...Array(3)].map((_, i) => (
             <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-red-600 shadow-[0_0_5px_red]' : 'bg-white/10'}`} />
           ))}
        </div>
      </div>
    </div>
  );
};

export default TelemetryOverlay;
