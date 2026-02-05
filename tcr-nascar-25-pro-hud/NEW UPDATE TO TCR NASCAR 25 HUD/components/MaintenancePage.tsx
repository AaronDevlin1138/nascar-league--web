
import React from 'react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-center p-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-600/5" />
      <div className="relative z-10 space-y-10">
        <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
           <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <h1 className="text-7xl font-black uppercase italic tracking-tighter">System Maintenance</h1>
        <p className="text-zinc-500 font-black uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">System offline for grid sync and performance tuning. Expect uplink restoration within 30 minutes.</p>
        <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest border border-red-600/20 px-6 py-2 rounded-full inline-block">Estimated Uptime: 14:00 EST</div>
      </div>
    </div>
  );
};

export default MaintenancePage;
