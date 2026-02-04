
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Leaderboard from './components/Leaderboard';
import TelemetryOverlay from './components/TelemetryOverlay';
import ManagerDashboard from './components/ManagerDashboard';
import CoachingPanel from './components/CoachingPanel';
import StreamGrid from './components/StreamGrid';
import Login from './components/Login';
import NBATicker from './components/NBATicker';
import BroadcastOverlay from './components/BroadcastOverlay';
import { Driver, RaceStats, User, PerformanceMetric, RaceEvent } from './types';
import { TCR_PC_SCHEDULE } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'hub' | 'manager' | 'user'>('hub');
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [coachingMetrics, setCoachingMetrics] = useState<PerformanceMetric[]>([]);
  const [autoFocusLeader, setAutoFocusLeader] = useState(true);
  
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('nascar_roster_v3');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const manualSelectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [raceStats, setRaceStats] = useState<RaceStats>(() => {
    const saved = localStorage.getItem('nascar_racestats');
    return saved ? JSON.parse(saved) : {
      lap: 1,
      totalLaps: 100,
      flag: 'Green',
      trackTemp: '102°F',
      airTemp: '78°F',
      sessionStatus: 'PRACTICE',
      currentEvent: TCR_PC_SCHEDULE[2] 
    };
  });

  useEffect(() => {
    localStorage.setItem('nascar_racestats', JSON.stringify(raceStats));
  }, [raceStats]);

  useEffect(() => {
    if (autoFocusLeader && drivers.length > 0) {
      const leader = [...drivers].sort((a, b) => a.position - b.position)[0];
      if (leader && leader.id !== selectedDriverId) {
        setSelectedDriverId(leader.id);
      }
    }
  }, [drivers, autoFocusLeader, selectedDriverId]);

  useEffect(() => {
    if (drivers.length < 2) return;
    const interval = setInterval(() => {
      setDrivers(prev => {
        const newDrivers = [...prev];
        const p1Index = newDrivers.findIndex(d => d.position === 1);
        const p2Index = newDrivers.findIndex(d => d.position === 2);
        if (p1Index !== -1 && p2Index !== -1) {
          newDrivers[p1Index].position = 2;
          newDrivers[p1Index].gap = `+${(Math.random() * 0.4 + 0.1).toFixed(3)}`;
          newDrivers[p2Index].position = 1;
          newDrivers[p2Index].gap = '--';
          setAlerts(prevAlerts => [{
            driver: newDrivers[p2Index].name,
            car: newDrivers[p2Index].number,
            type: 'LEAD_CHANGE',
            timestamp: Date.now()
          }, ...prevAlerts].slice(0, 5));
        }
        return newDrivers;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [drivers.length]);

  const selectedDriver = useMemo(() => 
    drivers.find(d => d.id === selectedDriverId) || drivers.find(d => d.position === 1) || drivers[0], 
    [drivers, selectedDriverId]
  );

  useEffect(() => {
    localStorage.setItem('nascar_roster_v3', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    const savedUser = localStorage.getItem('nascar_session_v3');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (!user) return;
    const newSocket: Socket = io();
    setSocket(newSocket);
    newSocket.on('telemetry', (data: any) => {
      setDrivers(prev => prev.map(d => {
        if (d.number !== data.car && d.name !== data.driver) return d;
        const newTelemetry = { ...d.telemetry!, ...data.telemetry };
        if (d.id === selectedDriverId && newTelemetry.throttle > 98 && newTelemetry.speed < 140) {
            const metric: PerformanceMetric = { type: 'WRONG', message: 'EXCESSIVE WHEELSPIN', timestamp: Date.now() };
            setCoachingMetrics(p => [metric, ...p].slice(0, 3));
        }
        return { ...d, telemetry: newTelemetry };
      }));
    });
    return () => { newSocket.disconnect(); };
  }, [user, selectedDriverId]);

  const handleDriverSelect = useCallback((id: string) => {
    setSelectedDriverId(id);
    setCoachingMetrics([]);
    setAutoFocusLeader(false);
    if (manualSelectionTimeoutRef.current) clearTimeout(manualSelectionTimeoutRef.current);
    manualSelectionTimeoutRef.current = setTimeout(() => {
      setAutoFocusLeader(true);
    }, 25000);
  }, []);

  const handleLoginSuccess = (userData: User) => {
    const enrichedUser = { ...userData, isManager: true };
    setUser(enrichedUser);
    localStorage.setItem('nascar_session_v3', JSON.stringify(enrichedUser));
  };

  const updateRaceEvent = (event: RaceEvent) => {
    setRaceStats(prev => ({ 
      ...prev, 
      currentEvent: event,
      sessionStatus: 'RACE LIVE'
    }));
  };

  const addDriver = (d: Driver) => setDrivers([...drivers, d]);
  const removeDriver = (id: string) => setDrivers(drivers.filter(d => d.id !== id));
  const updateDriver = (d: Driver) => setDrivers(drivers.map(prev => prev.id === d.id ? d : prev));

  if (!user) return <Login onLogin={handleLoginSuccess} />;

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col overflow-hidden text-white font-sans selection:bg-red-600">
      <div className="absolute inset-0 z-0 bg-[#050505] shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
      
      <header className="relative z-50 h-16 px-8 border-b border-white/5 bg-black/90 backdrop-blur-3xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-10">
           <div className="bg-red-600 px-6 py-2.5 font-black italic tracking-tighter skew-x-[-15deg] shadow-[0_0_40px_rgba(220,38,38,0.25)] select-none">
              <span className="block skew-x-[15deg]">TCR NASCAR 25 HUD</span>
           </div>
           <nav className="flex gap-10 text-[11px] font-black uppercase tracking-[0.25em] text-white/30 italic">
              <button onClick={() => setView('hub')} className={`hover:text-white transition-all py-1 border-b-2 ${view === 'hub' ? 'text-red-600 border-red-600' : 'border-transparent'}`}>Broadcast Hub</button>
              <button onClick={() => setView('user')} className={`hover:text-white transition-all py-1 border-b-2 ${view === 'user' ? 'text-red-600 border-red-600' : 'border-transparent'}`}>Driver Focus</button>
              <button onClick={() => setView('manager')} className={`hover:text-white transition-all py-1 border-b-2 ${view === 'manager' ? 'text-red-600 border-red-600' : 'border-transparent'}`}>Control Center</button>
           </nav>
        </div>

        <div className="flex items-center gap-8">
           <div className={`text-[9px] font-black uppercase italic transition-all flex items-center gap-2.5 px-4 py-1.5 rounded-full border ${autoFocusLeader ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-zinc-600 border-zinc-800'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${autoFocusLeader ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`} />
              {autoFocusLeader ? 'Auto-Director Active' : 'Manual Camera Selection'}
           </div>
           <div className="h-8 w-[1px] bg-white/10" />
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <div className="text-[10px] font-black text-white leading-none uppercase italic">{user.username}</div>
                 <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Uplink: Online</div>
              </div>
              <img src={user.avatar || `https://cdn.discordapp.com/embed/avatars/0.png`} className="w-9 h-9 rounded-full border-2 border-red-600/20 shadow-lg" alt="" />
           </div>
        </div>
      </header>

      <main className="relative flex-1 flex overflow-hidden z-10">
        {(view === 'hub' || view === 'user') && (
          <Leaderboard drivers={drivers} selectedId={selectedDriverId} onSelect={handleDriverSelect} isUserView={view === 'user'} raceStats={raceStats} />
        )}

        <div className="flex-1 flex flex-col relative overflow-hidden">
          {view === 'hub' || view === 'user' ? (
            <div className="flex-1 relative flex flex-col">
               <BroadcastOverlay raceStats={raceStats} />
               <StreamGrid drivers={drivers} selectedDriverId={selectedDriverId} />
               {selectedDriver && (
                 <div className="absolute bottom-8 right-8 w-[380px] pointer-events-none drop-shadow-[0_30px_60px_rgba(0,0,0,1)] animate-in slide-in-from-bottom duration-500">
                    <TelemetryOverlay driver={selectedDriver} />
                 </div>
               )}
               {view === 'user' && (
                 <div className="absolute top-32 right-8 pointer-events-none w-72">
                    <CoachingPanel metrics={coachingMetrics} />
                 </div>
               )}
            </div>
          ) : (
            <ManagerDashboard 
              drivers={drivers} 
              onAddDriver={addDriver} 
              onRemoveDriver={removeDriver}
              onUpdateDriver={updateDriver}
              onSetEvent={updateRaceEvent}
              currentEvent={raceStats.currentEvent}
              socket={socket} 
              alerts={alerts}
            />
          )}
        </div>
      </main>

      {/* Finalized Seamless Broadcast Ribbon */}
      <footer className="relative z-50 h-16 bg-black flex items-center px-0 overflow-hidden border-t-2 border-zinc-900 shrink-0 select-none">
         {/* Interlocking branding block */}
         <div className="relative bg-red-600 h-full flex items-center justify-center shrink-0 z-40 skew-x-[-15deg] -ml-8 px-16 shadow-[20px_0_40px_rgba(0,0,0,1)]">
            <div className="text-white font-black italic text-4xl tracking-tighter skew-x-[15deg] flex flex-col items-center">
              TCR
            </div>
         </div>
         
         <div className="flex-1 overflow-hidden h-full flex items-center bg-[#050505] relative z-30">
            <div className="flex-1 h-full ml-4">
               <NBATicker />
            </div>

            <div className="w-[500px] h-full flex items-center px-12 bg-zinc-900/60 relative z-20 overflow-hidden border-l border-white/5">
              <div className="flex gap-20 text-[12px] font-black uppercase tracking-[0.25em] whitespace-nowrap animate-[footer-ticker_35s_linear_infinite] text-zinc-300 italic">
                  <span className="text-yellow-500 font-black">NEXT EVENT: {TCR_PC_SCHEDULE[TCR_PC_SCHEDULE.findIndex(e => e.name === raceStats.currentEvent?.name) + 1]?.name.toUpperCase() || 'FINALE'} 🏁</span>
                  <span className="text-red-500">BROADCASTING LIVE FROM TCR PC CUP SERIES SEASON 1</span>
                  <span className="text-white/10">|</span>
                  <span>{raceStats.currentEvent?.name.toUpperCase()} NOW LIVE @ {raceStats.currentEvent?.track.toUpperCase()}</span>
                  <span className="text-white/10">|</span>
                  <span>STRICT STEWARDING & CLEAN RACING EXPECTATIONS IN EFFECT</span>
              </div>
            </div>
         </div>

         {/* Interlocking status block */}
         <div className="bg-[#0a0a0a] px-16 h-full flex flex-col justify-center items-center shrink-0 border-l border-zinc-800 relative z-40 skew-x-[15deg] -mr-8 shadow-[-20px_0_40px_rgba(0,0,0,1)]">
            <div className="skew-x-[-15deg] flex flex-col items-center">
               <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${raceStats.sessionStatus === 'RACE LIVE' ? 'bg-red-600 animate-pulse shadow-[0_0_15px_red]' : 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]'}`} />
                  <div className="text-white font-black italic text-xl tracking-tighter uppercase leading-none whitespace-nowrap">{raceStats.sessionStatus}</div>
               </div>
               <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1.5 whitespace-nowrap">HD DATA BROADCAST</div>
            </div>
         </div>
      </footer>

      <style>{`
        @keyframes footer-ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-350%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
