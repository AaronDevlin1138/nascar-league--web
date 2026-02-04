
import React, { useState, useEffect } from 'react';
import { NBAScore } from '../types';

const NBATicker: React.FC = () => {
  const [scores, setScores] = useState<NBAScore[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
        const data = await response.json();
        
        const mappedScores: NBAScore[] = data.events.map((event: any) => {
          const comp = event.competitions[0];
          const home = comp.competitors.find((c: any) => c.homeAway === 'home');
          const away = comp.competitors.find((c: any) => c.homeAway === 'away');
          
          return {
            id: event.id,
            homeTeam: {
              name: home.team.displayName,
              short: home.team.abbreviation,
              score: home.score,
              logo: home.team.logo,
              record: home.records?.[0]?.summary || '--'
            },
            awayTeam: {
              name: away.team.displayName,
              short: away.team.abbreviation,
              score: away.score,
              logo: away.team.logo,
              record: away.records?.[0]?.summary || '--'
            },
            status: event.status.type.shortDetail,
            isLive: event.status.type.state === 'in'
          };
        });
        setScores(mappedScores);
      } catch (error) {
        console.error("NBA Score Fetch Error:", error);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full items-center overflow-hidden mask-fade-right select-none">
      <div className="flex animate-[nba-ticker-scroll_60s_linear_infinite] hover:pause whitespace-nowrap">
        {scores.map((game) => (
          <div key={game.id} className="flex items-center h-full border-r border-white/10 px-10 gap-10 transition-all hover:bg-white/5 cursor-default shrink-0 group">
            <div className="flex flex-col justify-center gap-1.5 py-2 min-w-[140px]">
              <div className="flex items-center gap-4">
                <img src={game.awayTeam.logo} className="w-6 h-6 object-contain group-hover:scale-125 transition-transform" alt="" />
                <span className="text-[11px] font-black uppercase text-zinc-400 w-10 tracking-tighter">{game.awayTeam.short}</span>
                {game.isLive ? (
                  <span className="text-xl font-black text-white tabular-nums leading-none">{game.awayTeam.score}</span>
                ) : (
                  <span className="text-[9px] font-bold text-zinc-600 tabular-nums uppercase tracking-widest">{game.awayTeam.record}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <img src={game.homeTeam.logo} className="w-6 h-6 object-contain group-hover:scale-125 transition-transform" alt="" />
                <span className="text-[11px] font-black uppercase text-zinc-400 w-10 tracking-tighter">{game.homeTeam.short}</span>
                {game.isLive ? (
                  <span className="text-xl font-black text-yellow-400 tabular-nums leading-none">{game.homeTeam.score}</span>
                ) : (
                  <span className="text-[9px] font-bold text-zinc-600 tabular-nums uppercase tracking-widest">{game.homeTeam.record}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-white/10 pl-8 h-10">
              <span className={`text-[10px] font-black uppercase italic tracking-[0.2em] ${game.isLive ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`}>
                {game.status}
              </span>
              {!game.isLive && (game.homeTeam.score !== "0" || game.awayTeam.score !== "0") && (
                <span className="text-[8px] font-bold text-zinc-700 uppercase mt-1 tracking-widest">FINAL</span>
              )}
            </div>
          </div>
        ))}
        {scores.length === 0 && (
          <div className="px-12 text-[10px] font-black uppercase text-zinc-600 italic tracking-[0.4em] animate-pulse">
            UPLINKING GLOBAL SPORTS DATA FEED...
          </div>
        )}
      </div>

      <style>{`
        @keyframes nba-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .pause:hover { animation-play-state: paused; }
        .mask-fade-right {
          mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
      `}</style>
    </div>
  );
};

export default NBATicker;
