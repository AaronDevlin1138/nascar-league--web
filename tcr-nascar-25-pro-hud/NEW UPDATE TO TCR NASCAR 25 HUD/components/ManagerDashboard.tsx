
import React, { useState } from 'react';
import { Driver, RaceEvent, RaceStats } from '../types.ts';
import { Socket } from 'socket.io-client';
import { TCR_PC_SCHEDULE } from '../constants.tsx';

interface ManagerDashboardProps {
  drivers: Driver[];
  onAddDriver: (driver: Driver) => void;
  onRemoveDriver: (id: string) => void;
  onUpdateDriver: (driver: Driver) => void;
  onSetEvent: (event: RaceEvent) => void;
  currentEvent?: RaceEvent;
  socket: Socket | null;
  alerts: any[];
  raceStats: RaceStats;
  updateFlag: (flag: 'Green' | 'Yellow') => void;
  toggleMaintenance: (val: boolean) => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  drivers, onAddDriver, onRemoveDriver, onUpdateDriver, onSetEvent, currentEvent, socket, alerts, raceStats, updateFlag, toggleMaintenance 
}) => {
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: '', number: '', color: '#FF0000', manufacturer: 'Custom', teamName: '', logoUrl: '', steamId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.number) return;
    const driver: Driver = {
      id: `driver-${Date.now()}`,
      name: newDriver.name!.toUpperCase(),
      number: newDriver.number!,
      manufacturer: (newDriver.manufacturer as any) || 'Custom',
      color: newDriver.color || '#FF0000',
      gap: '--',
      position: drivers.length + 1,
      status: 'Active',
      teamName: newDriver.teamName?.toUpperCase() || 'PRIVATEER ENTRY',
      telemetry: {
        rpm: 0, speed: 0, gear: 1, throttle: 0, brake: 0, fuel: 100, lastLap: '0:00.000',
        incidents: 0, lapDistPct: 0, pitStatus: false,
        gForce: { lat: 0, long: 0 },
        tires: { fl: 210, fr: 215, rl: 205, rr: 208 }
      }
    };
    onAddDriver(driver);
    setNewDriver({ name: '', number: '', color: '#FF0000', manufacturer: 'Custom', teamName: '', logoUrl: '', steamId: '' });
  };

  return (
    <div className="w-full h-full flex gap-10 p-12 overflow-hidden bg-black/40">
      {/* Control Pane */}
      <section className="w-[450px] shrink-0 flex flex-col gap-8">
        {/* Flag Control Card */}
        <div className="bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
           <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 text-zinc-400">RACE CONTROL</h2>
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => updateFlag('Green')}
                className={`py-6 rounded-2xl font-black italic tracking-widest text-lg transition-all border-4 ${raceStats.flag === 'Green' ? 'bg-green-600 border-green-400 shadow-[0_0_30px_rgba(22,163,74,0.4)]' : 'bg-green-950/40 border-transparent text-green-800'}`}
              >
                GREEN FLAG
              </button>
              <button 
                onClick={() => updateFlag('Yellow')}
                className={`py-6 rounded-2xl font-black italic tracking-widest text-lg transition-all border-4 ${raceStats.flag === 'Yellow' ? 'bg-yellow-500 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.4)] text-black' : 'bg-yellow-950/40 border-transparent text-yellow-800'}`}
              >
                CAUTION
              </button>
           </div>
           
           <div className="mt-6 pt-6 border-t border-white/5">
              <button 
                onClick={() => toggleMaintenance(!raceStats.isMaintenance)}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs border ${raceStats.isMaintenance ? 'bg-red-600 border-red-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
              >
                {raceStats.isMaintenance ? '🛠 MAINTENANCE ACTIVE' : '🛠 ENABLE MAINTENANCE MODE'}
              </button>
           </div>
        </div>

        <div className="bg-zinc-900/95 border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-red-600">GRID REGISTRY</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              type="text" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})}
              className="w-full bg-black/60 border border-white/10 p-4 text-xs font-black uppercase rounded-2xl outline-none" placeholder="DRIVER NAME"
            />
            <div className="flex gap-4">
              <input 
                type="text" value={newDriver.number} onChange={e => setNewDriver({...newDriver, number: e.target.value})}
                className="flex-1 bg-black/60 border border-white/10 p-4 text-xs font-black rounded-2xl outline-none" placeholder="CAR #"
              />
              <input 
                type="color" value={newDriver.color} onChange={e => setNewDriver({...newDriver, color: e.target.value})}
                className="w-16 h-[56px] bg-black/60 border border-white/10 p-2 rounded-2xl cursor-pointer"
              />
            </div>
            <button className="w-full bg-red-600 py-5 font-black uppercase italic tracking-[0.2em] rounded-2xl">REGISTER VEHICLE</button>
          </form>
        </div>
      </section>

      {/* Roster Pane */}
      <section className="flex-1 bg-zinc-900/95 border border-white/10 rounded-3xl p-12 flex flex-col overflow-hidden shadow-2xl">
        <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase mb-12">THE GRID</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.3em] border-b border-white/10">
                <th className="pb-8 px-6">Entry</th>
                <th className="pb-8 px-6">Driver</th>
                <th className="pb-8 px-6">Status</th>
                <th className="pb-8 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {drivers.map(d => (
                <tr key={d.id} className="group hover:bg-white/[0.03]">
                  <td className="py-6 px-6">
                    <div className="w-12 h-9 flex items-center justify-center font-black italic text-lg rounded-lg" style={{ backgroundColor: d.color, color: '#000' }}>{d.number}</div>
                  </td>
                  <td className="py-6 px-6 font-black uppercase italic text-lg text-white">{d.name}</td>
                  <td className="py-6 px-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${d.telemetry?.pitStatus ? 'text-blue-500' : 'text-green-500'}`}>
                       {d.telemetry?.pitStatus ? 'IN PITS' : 'ON TRACK'}
                    </span>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <button onClick={() => onRemoveDriver(d.id)} className="text-zinc-700 hover:text-red-500 font-black uppercase text-[10px] italic">SCRATCH</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ManagerDashboard;