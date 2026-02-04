
import React, { useState } from 'react';
import { Driver, RaceEvent } from '../types';
import { Socket } from 'socket.io-client';
import { TCR_PC_SCHEDULE } from '../constants';

interface ManagerDashboardProps {
  drivers: Driver[];
  onAddDriver: (driver: Driver) => void;
  onRemoveDriver: (id: string) => void;
  onUpdateDriver: (driver: Driver) => void;
  onSetEvent: (event: RaceEvent) => void;
  currentEvent?: RaceEvent;
  socket: Socket | null;
  alerts: any[];
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  drivers, onAddDriver, onRemoveDriver, onUpdateDriver, onSetEvent, currentEvent, socket, alerts 
}) => {
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: '',
    number: '',
    color: '#FF0000',
    manufacturer: 'Custom',
    teamName: '',
    logoUrl: '',
    steamId: ''
  });

  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.number) return;
    
    const driver: Driver = {
      id: `driver-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newDriver.name!.toUpperCase(),
      number: newDriver.number!,
      manufacturer: (newDriver.manufacturer as any) || 'Custom',
      color: newDriver.color || '#FF0000',
      gap: drivers.length === 0 ? '--' : `+${(drivers.length * 0.422).toFixed(3)}`,
      position: drivers.length + 1,
      status: 'Active',
      teamName: newDriver.teamName?.toUpperCase() || 'PRIVATEER ENTRY',
      logoUrl: newDriver.logoUrl,
      steamId: newDriver.steamId,
      telemetry: {
        rpm: 0, speed: 0, gear: 1, throttle: 0, brake: 0, fuel: 100, lastLap: '0:00.000',
        incidents: 0, lapDistPct: 0, gForce: { lat: 0, long: 0 },
        tires: { fl: 210, fr: 215, rl: 205, rr: 208 }
      }
    };
    onAddDriver(driver);
    setLastAction(`REGISTERED: ${driver.name} (#${driver.number})`);
    setTimeout(() => setLastAction(null), 3000);
    setNewDriver({ name: '', number: '', color: '#FF0000', manufacturer: 'Custom', teamName: '', logoUrl: '', steamId: '' });
  };

  return (
    <div className="w-full h-full flex gap-10 p-12 overflow-hidden animate-in fade-in duration-1000 bg-black/40">
      {/* Control Pane */}
      <section className="w-[450px] shrink-0 flex flex-col gap-8">
        <div className="bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full" />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-10 text-red-600 flex items-center gap-5">
            <div className="w-2.5 h-8 bg-red-600 skew-x-[-15deg] shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
            GRID REGISTRY
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.25em] ml-1">Driver Name</label>
              <input 
                type="text" 
                value={newDriver.name} 
                onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                className="w-full bg-black/60 border border-white/10 p-4 text-xs font-black uppercase italic tracking-widest outline-none focus:border-red-600 rounded-2xl"
                placeholder="Ex: KYLE BUSCH"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.25em] ml-1">Car #</label>
                <input 
                  type="text" 
                  value={newDriver.number} 
                  onChange={e => setNewDriver({...newDriver, number: e.target.value})}
                  className="w-full bg-black/60 border border-white/10 p-4 text-xs font-black uppercase italic tracking-widest outline-none focus:border-red-600 rounded-2xl"
                  placeholder="00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.25em] ml-1">Livery</label>
                <input 
                  type="color" 
                  value={newDriver.color} 
                  onChange={e => setNewDriver({...newDriver, color: e.target.value})}
                  className="w-16 h-[56px] bg-black/60 border border-white/10 p-2 cursor-pointer rounded-2xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.25em] ml-1">Team / Sponsor</label>
              <input 
                type="text" 
                value={newDriver.teamName} 
                onChange={e => setNewDriver({...newDriver, teamName: e.target.value})}
                className="w-full bg-black/60 border border-white/10 p-4 text-xs font-black uppercase italic tracking-widest outline-none focus:border-red-600 rounded-2xl"
                placeholder="Ex: JOE GIBBS RACING"
              />
            </div>
            <button className="w-full bg-red-600 hover:bg-red-500 py-5 font-black uppercase italic tracking-[0.2em] text-base shadow-[0_20px_40px_rgba(220,38,38,0.2)] mt-4 rounded-2xl active:scale-[0.98] transition-all">
              REGISTER VEHICLE
            </button>
          </form>

          {lastAction && (
            <div className="absolute inset-x-0 bottom-0 bg-green-600 py-2 text-center text-[10px] font-black uppercase italic tracking-[0.2em] animate-in slide-in-from-bottom duration-300">
              {lastAction}
            </div>
          )}
        </div>

        {/* Schedule Ticker / Quick Autofill */}
        <div className="bg-zinc-950/60 p-8 border border-white/5 rounded-3xl flex-1 flex flex-col overflow-hidden">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 italic mb-6">PC SEASON 1 SCHEDULE</h3>
           <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
              {TCR_PC_SCHEDULE.map((event, idx) => (
                <button 
                  key={idx}
                  onClick={() => onSetEvent(event)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between group transition-all border ${
                    currentEvent?.name === event.name 
                      ? 'bg-red-600/20 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.1)]' 
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className={`text-[11px] font-black italic uppercase tracking-tight ${currentEvent?.name === event.name ? 'text-red-500' : 'text-zinc-200'}`}>
                      {event.name}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{event.track}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-zinc-500 group-hover:text-white transition-colors">{event.date}</span>
                  </div>
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* Roster Pane */}
      <section className="flex-1 bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-12 flex flex-col overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
        <div className="flex justify-between items-end mb-12 pb-8 border-b border-white/10">
           <div>
              <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/20 italic mb-3">OFFICIAL RACE ROSTER</h2>
              <div className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">THE GRID</div>
           </div>
           <div className="flex flex-col items-end">
              <div className="text-[11px] font-black uppercase text-zinc-500 tracking-widest mb-2">Verified Entries</div>
              <div className="text-4xl font-black italic text-red-600 tabular-nums">{drivers.length}<span className="text-zinc-800 text-lg not-italic font-bold ml-3 uppercase">Cars</span></div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.3em] italic border-b border-white/10">
                <th className="pb-8 px-6">Pos</th>
                <th className="pb-8 px-6">Entry</th>
                <th className="pb-8 px-6">Competitor Details</th>
                <th className="pb-8 px-6">Team Affiliation</th>
                <th className="pb-8 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {drivers.sort((a,b) => a.position - b.position).map(d => (
                <tr key={d.id} className="group hover:bg-white/[0.03] transition-all">
                  <td className="py-6 px-6">
                    <div className={`text-2xl font-black italic ${d.position === 1 ? 'text-yellow-400' : 'text-zinc-700'}`}>P{d.position}</div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="w-14 h-11 flex items-center justify-center font-black italic text-xl rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.4)] border border-white/5" style={{ backgroundColor: d.color, color: '#000' }}>
                      {d.number}
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-6">
                      <div className="w-11 h-11 rounded-full bg-zinc-950 flex items-center justify-center text-[10px] font-black text-zinc-700 border border-white/10">ENTRY</div>
                      <div className="flex flex-col">
                        <span className="font-black uppercase italic tracking-tighter text-xl text-white leading-none group-hover:text-red-500 transition-colors">{d.name}</span>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> ACTIVE BROADCAST
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="text-[12px] font-black uppercase text-zinc-400 tracking-[0.2em] italic">{d.teamName}</span>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <button 
                      onClick={() => onRemoveDriver(d.id)}
                      className="text-zinc-700 hover:text-red-500 transition-all font-black uppercase text-[11px] italic underline tracking-[0.3em] px-5 py-2.5 rounded-2xl"
                    >
                      SCRATCH
                    </button>
                  </td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-48 text-center">
                    <div className="flex flex-col items-center gap-8 group">
                       <div className="text-[120px] font-black italic tracking-tighter text-white/[0.03] select-none transition-all group-hover:text-white/5 group-hover:scale-105 duration-700">VACANT</div>
                       <div className="flex flex-col items-center gap-3 text-center">
                          <p className="text-base font-black uppercase tracking-[0.8em] text-zinc-800 italic">Grid Registration Required</p>
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest max-w-xs leading-relaxed">System awaiting official competitor technical data.</p>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ManagerDashboard;
