
import React from 'react';
import { Driver } from '../types.ts';

interface Props {
  driver: Driver;
}

const TelemetryOverlay: React.FC<Props> = ({ driver }) => {
  const telemetry = driver.telemetry;
  if (!telemetry) return null;

  const rpmPercent = Math.min((telemetry.rpm / 9500) * 100, 100);
  const latG = telemetry.gForce?.lat || 0;
  const longG = telemetry.gForce?.long || 0;

  return (
    <div className="w-[340px] bg-black/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-10 duration-500">
      {/* HUD Header */}
      <div className="bg-zinc-900/80 px-5 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 flex items-center justify-center font-black italic text-lg shadow-2xl skew-x-[-12deg]"
            style={{ backgroundColor: driver.color || '#333', color: '#000' }}
          >
            <span className="skew-x-[12deg]">{driver.number}</span>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-black text-white uppercase tracking-tight">{driver.name}</div>
            <div className="text-[9px] font-bold text-red-600 uppercase tracking-[0.2em] italic">Telemetry Uplink Active</div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Speed & G-Force Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-black italic text-white tabular-nums tracking-tighter leading-none">
                {Math.round(telemetry.speed)}
              </span>
              <span className="text-[10px] font-black text-zinc-500 uppercase italic">MPH</span>
            </div>
            <div className="text-lg font-black italic text-zinc-400 mt-2">
              GEAR <span className="text-red-600 text-3xl ml-2">{telemetry.gear}</span>
            </div>
          </div>

          {/* G-Force Circle */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">G-Force</div>
            <div className="w-16 h-16 rounded-full border border-white/10 relative flex items-center justify-center">
              <div className="absolute inset-0 border-t border-white/5 rounded-full" />
              <div className="absolute inset-0 border-l border-white/5 rounded-full" />
              {/* Force Ball */}
              <div 
                className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] transition-all duration-100"
                style={{ 
                  transform: `translate(${latG * 10}px, ${-longG * 10}px)` 
                }}
              />
              <div className="w-1 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* RPM Ribbon */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-black text-zinc-500 uppercase tracking-widest">
            <span>Engine RPM</span>
            <span className={telemetry.rpm > 8500 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}>
              {telemetry.rpm.toLocaleString()}
            </span>
          </div>
          <div className="h-3 bg-zinc-950 rounded-full border border-white/5 flex overflow-hidden p-0.5">
             <div 
              className={`h-full transition-all duration-75 rounded-full ${telemetry.rpm > 8800 ? 'bg-red-600' : telemetry.rpm > 8000 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${rpmPercent}%` }}
             />
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black text-zinc-500 uppercase">
              <span>Throttle</span>
              <span className="text-white italic">{Math.round(telemetry.throttle)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" style={{ width: `${telemetry.throttle}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black text-zinc-500 uppercase">
              <span>Brake</span>
              <span className="text-white italic">{Math.round(telemetry.brake)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]" style={{ width: `${telemetry.brake}%` }} />
            </div>
          </div>
        </div>

        {/* Tires Heatmap */}
        <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
           {[
             { label: 'FL', temp: telemetry.tires.fl },
             { label: 'FR', temp: telemetry.tires.fr },
             { label: 'RL', temp: telemetry.tires.rl },
             { label: 'RR', temp: telemetry.tires.rr }
           ].map((t, idx) => (
             <div key={idx} className="flex justify-between items-center bg-zinc-900/40 px-3 py-1.5 rounded-md border border-white/5">
                <span className="text-[9px] font-black text-zinc-600">{t.label}</span>
                <span className="text-xs font-black text-blue-400 italic tabular-nums">{Math.round(t.temp)}°F</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default TelemetryOverlay;