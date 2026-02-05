
import React from 'react';
import { Driver } from '../types.ts';

interface TrackMapProps {
  drivers: Driver[];
}

const TrackMap: React.FC<TrackMapProps> = ({ drivers }) => {
  return (
    <div className="w-full h-full bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center group">
      <div className="absolute top-4 left-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest italic">Live Circuit: DAYTONA</div>
      
      <div className="relative w-48 h-32 mt-4">
        {/* NASCAR Oval Path */}
        <svg className="w-full h-full" viewBox="0 0 160 100">
          <path 
            d="M40,20 L120,20 C145,20 145,80 120,80 L40,80 C15,80 15,20 40,20 Z" 
            fill="none" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="12"
          />
          <path 
            d="M40,20 L120,20 C145,20 145,80 120,80 L40,80 C15,80 15,20 40,20 Z" 
            fill="none" 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="1"
            strokeDasharray="4,2"
          />
        </svg>

        {drivers.map(driver => {
          const progress = driver.telemetry?.lapDistPct || 0;
          
          // Parametric Daytona Oval Path logic
          let x = 0;
          let y = 0;
          
          if (progress < 0.3) { // Top Straight
            const p = progress / 0.3;
            x = 40 + (p * 80);
            y = 20;
          } else if (progress < 0.5) { // Right Turn
            const p = (progress - 0.3) / 0.2;
            const angle = -Math.PI/2 + (p * Math.PI);
            x = 120 + 20 * Math.cos(angle);
            y = 50 + 30 * Math.sin(angle);
          } else if (progress < 0.8) { // Bottom Straight
            const p = (progress - 0.5) / 0.3;
            x = 120 - (p * 80);
            y = 80;
          } else { // Left Turn
            const p = (progress - 0.8) / 0.2;
            const angle = Math.PI/2 + (p * Math.PI);
            x = 40 + 20 * Math.cos(angle);
            y = 50 + 30 * Math.sin(angle);
          }
          
          return (
            <div 
              key={driver.id}
              className="absolute w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-black border border-white shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-300 z-10"
              style={{ 
                left: `${(x/160) * 100}%`, 
                top: `${(y/100) * 100}%`, 
                backgroundColor: driver.color,
                transform: 'translate(-50%, -50%)' 
              }}
            >
              {driver.number}
            </div>
          );
        })}
      </div>
      
      <div className="absolute bottom-4 right-6 flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
         <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">POSITION MATRIX EST.</span>
      </div>
    </div>
  );
};

export default TrackMap;
