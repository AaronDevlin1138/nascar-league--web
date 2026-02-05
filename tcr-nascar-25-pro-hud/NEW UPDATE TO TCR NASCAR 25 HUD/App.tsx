
import React, { useState, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import Leaderboard from './components/leaderboard';
import TelemetryOverlay from './components/telemetryoverlay';
import ManagerDashboard from './components/managerdashboard';
import StreamGrid from './components/streamgrid';
import Login from './components/login';
import GlobalSportsTicker from './components/GlobalSportsTicker';
import BroadcastOverlay from './components/broadcastoverlay';
import TrackMap from './components/TrackMap';
import DriverPortal from './components/DriverPortal';
import MaintenancePage from './components/MaintenancePage';
import FanStandings from './components/fanstandings';
import AppTour from './components/AppTour';
import { Driver, RaceStats, User } from './types.ts';
import { TCR_PC_SCHEDULE, TRACK_THEMES } from './constants.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<'hub' | 'manager' | 'driver' | 'fan'>('hub');
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [showTour, setShowTour] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [isMuted, setIsMuted] = useState(true);
  
  const [raceStats, setRaceStats] = useState<RaceStats>({
    lap: 1, totalLaps: 100, flag: 'Green', trackTemp: '104°F', airTemp: '76°F', 
    sessionStatus: 'QUALIFYING', currentEvent: TCR_PC_SCHEDULE[1], isMaintenance: false
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) return;
        const text = await res.text();
        const trimmed = text.trim();
        if (!trimmed) return;
        const data = JSON.parse(trimmed);
        if (data && data.user && data.user.id) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Session fetch failed:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const newSocket = io() as any;
    setSocket(newSocket);

    newSocket.on('sync_race_state', (state: any) => {
      setRaceStats(prev => ({ 
        ...prev, 
        flag: state.flag, 
        isMaintenance: state.isMaintenance,
        lap: state.lap,
        totalLaps: state.totalLaps
      }));
    });

    newSocket.on('telemetry', (data: any) => {
      setDrivers(prev => {
        const existing = prev.find(d => d.number === data.car);
        if (existing) {
          return prev.map(d => d.number === data.car ? { ...d, telemetry: data.telemetry } : d);
        } else {
          return [...prev, {
            id: `driver-${data.car}`,
            name: data.driver,
            number: data.car,
            manufacturer: 'Chevy',
            color: '#ef4444',
            gap: `+${(Math.random() * 2).toFixed(3)}`,
            position: prev.length + 1,
            status: data.telemetry.pitStatus ? 'Pit' : 'Active',
            telemetry: data.telemetry
          } as Driver];
        }
      });
    });

    return () => { newSocket.disconnect(); };
  }, [user]);

  if (!user) return <Login onLogin={setUser} />;
  if (raceStats.isMaintenance && !user?.isManager) return <MaintenancePage />;

  const mainVideoId = raceStats.flag === 'Yellow' ? '7R5A0UIdXN0' : 'v8N9SOnX9Yk';
  const ytUrl = `https://www.youtube.com/embed/${mainVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${mainVideoId}&enablejsapi=1`;

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col overflow-hidden text-white font-sans">
      {showTour && <AppTour onComplete={() => setShowTour(false)} />}
      
      {/* HUD Header Bar */}
      <header className="relative z-50 h-14 px-6 border-b border-white/5 bg-black flex items-center justify-between shrink-0 shadow-2xl">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="bg-red-600 px-5 py-2 font-black italic tracking-tighter skew-x-[-15deg]">
                 <span className="block skew-x-[15deg] text-sm">TCR COMMAND</span>
              </div>
           </div>
           <nav className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
              {['hub', 'manager', 'driver', 'fan'].map((v) => (
                <button 
                  key={v}
                  onClick={() => setView(v as any)} 
                  className={`hover:text-white transition-all flex items-center gap-2 ${view === v ? 'text-red-600 border-b border-red-600 pb-1' : ''}`}
                >
                  {v}
                </button>
              ))}
           </nav>
        </div>

        <div className="flex items-center gap-6">
           <button 
             onClick={() => setIsMuted(!isMuted)}
             className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${isMuted ? 'bg-zinc-900 text-zinc-500' : 'bg-red-600/20 text-red-500 border border-red-600/30'}`}
           >
             {isMuted ? '🔇 Muted' : '🔊 Engine Audio'}
           </button>
           <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="text-right">
                <div className="text-[10px] font-black text-white italic">{user.username}</div>
                <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest cursor-pointer hover:text-red-500" onClick={() => window.location.href = '/logout'}>Sign Out</div>
              </div>
              <img src={user.avatar} className="w-9 h-9 rounded-full border border-white/10 shadow-lg" alt="" />
           </div>
        </div>
      </header>

      {/* Main Experience: Flex Row with Sidebar Pylon */}
      <main className="relative flex-1 flex overflow-hidden bg-black">
        {view === 'hub' ? (
          <>
            {/* The Vertical Pylon stays pinned left */}
            <Leaderboard drivers={drivers} selectedId={selectedDriverId} onSelect={setSelectedDriverId} raceStats={raceStats} />
            
            {/* Main Broadcast Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-zinc-950">
               <BroadcastOverlay raceStats={raceStats} />
               
               <div className="flex-1 relative bg-black">
                  <iframe 
                    className="w-full h-full pointer-events-none"
                    src={ytUrl}
                    title="Main Broadcast"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                  />
                  {/* Subtle Scanline Overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://media.giphy.com/media/oEI9uWU6EB_i8/giphy.gif')] mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
               </div>

               {/* Track Map Widget */}
               <div className="absolute bottom-8 left-8 w-[280px] z-40 transition-all hover:scale-105">
                  <TrackMap drivers={drivers} />
               </div>

               {/* Telemetry Widget */}
               {selectedDriverId && (
                 <div className="absolute bottom-8 right-8 z-40">
                    <TelemetryOverlay driver={drivers.find(d => d.id === selectedDriverId)!} />
                 </div>
               )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {view === 'manager' && (
              <ManagerDashboard 
                drivers={drivers} 
                onAddDriver={(d) => setDrivers([...drivers, d])} 
                onRemoveDriver={(id) => setDrivers(drivers.filter(d => d.id !== id))}
                onUpdateDriver={(dr) => setDrivers(drivers.map(p => p.id === dr.id ? dr : p))}
                onSetEvent={e => setRaceStats({...raceStats, currentEvent: e})}
                socket={socket}
                alerts={[]}
                raceStats={raceStats}
                updateFlag={(flag) => socket?.emit('update_flag', { flag })}
                toggleMaintenance={(val) => socket?.emit('toggle_maintenance', { value: val })}
              />
            )}
            {view === 'driver' && <DriverPortal user={user} driver={drivers.find(d => d.id === user.id)} onUpdateDriver={(dr) => setDrivers(drivers.map(p => p.id === dr.id ? dr : p))} />}
            {view === 'fan' && <FanStandings drivers={drivers} />}
          </div>
        )}
      </main>

      {/* Ticker Footer */}
      <footer className="relative z-50 h-12 bg-black flex items-center overflow-hidden border-t border-white/5 shrink-0">
         <GlobalSportsTicker />
         <div className="px-8 h-full flex items-center bg-red-600 shrink-0 skew-x-[-15deg] -mr-4 relative z-10">
            <span className="block skew-x-[15deg] font-black italic text-xs text-white">SYSTEMS UPLINK OK</span>
         </div>
      </footer>
    </div>
  );
};

export default App;