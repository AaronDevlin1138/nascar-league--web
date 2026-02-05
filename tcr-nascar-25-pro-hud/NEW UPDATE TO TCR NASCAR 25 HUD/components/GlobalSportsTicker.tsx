
import React, { useState, useEffect } from 'react';

const GlobalSportsTicker: React.FC = () => {
  const [tickerItems] = useState<string[]>([
    "NBA DRAFT WATCH: Victor Wembanyama generational impact projected as Lottery approaches.",
    "NFL TRADE ALERT: Miami Dolphins secure Jalen Ramsey in blockbuster defensive overhaul.",
    "NCAA TOP 25: Kansas edges out Houston 78-76 in Big 12 championship thriller.",
    "TCR PC SERIES: Daytona qualifying sessions officially open; record speeds anticipated.",
    "MLB NEWS: Shohei Ohtani continues record-breaking dual-threat season performance.",
    "NFL BREAKING: Aaron Rodgers hints at future plans in latest broadcast interview.",
    "NBA UPDATES: Lakers climbing Western Conference standings behind dominant paint performance.",
  ]);

  return (
    <div className="flex-1 bg-zinc-950/80 h-full flex items-center overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-24">
        {tickerItems.concat(tickerItems).map((item, i) => (
          <div key={i} className="flex items-center gap-6 group">
            <div className="bg-red-600 px-3 py-1 text-[9px] font-black uppercase italic skew-x-[-15deg]">
               <span className="block skew-x-[15deg]">NEWS FLASH</span>
            </div>
            <span className="text-[13px] font-black uppercase tracking-[0.1em] italic text-zinc-100 group-hover:text-red-500 transition-colors">
              {item}
            </span>
            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
      
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default GlobalSportsTicker;
