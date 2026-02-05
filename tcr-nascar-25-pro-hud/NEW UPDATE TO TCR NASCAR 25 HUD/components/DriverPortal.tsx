
import React, { useState } from 'react';
import { User, Driver } from '../types.ts';

interface DriverPortalProps {
  user: User;
  driver?: Driver;
  onUpdateDriver: (d: Driver) => void;
}

const DriverPortal: React.FC<DriverPortalProps> = ({ user, driver, onUpdateDriver }) => {
  const [streamUrl, setStreamUrl] = useState(driver?.streamUrl || '');
  const [bio, setBio] = useState(driver?.bio || '');

  const handleSave = () => {
    if (!driver) return;
    onUpdateDriver({ ...driver, streamUrl, bio });
    alert("Profile Updated! System syncing...");
  };

  return (
    <div className="w-full h-full p-20 flex flex-col items-center bg-black/20 overflow-y-auto">
      <div className="max-w-4xl w-full space-y-12">
        <header className="flex items-end gap-10 border-b border-white/10 pb-12">
           <img src={user.avatar} className="w-32 h-32 rounded-3xl border-4 border-red-600 shadow-2xl" alt="" />
           <div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase">{user.username}</h1>
              <p className="text-zinc-500 font-black uppercase tracking-widest mt-4">Driver ID: #{driver?.number || 'TBD'}</p>
           </div>
        </header>

        <section className="grid grid-cols-2 gap-12">
           <div className="bg-zinc-900/60 p-10 rounded-3xl border border-white/5 space-y-8">
              <h3 className="text-xl font-black uppercase italic text-red-600">Technical Config</h3>
              <div className="space-y-4">
                 <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest">Broadcast Stream Link (RTMP/Twitch)</label>
                 <input 
                   type="text" 
                   value={streamUrl} 
                   onChange={e => setStreamUrl(e.target.value)}
                   className="w-full bg-black border border-white/10 p-4 text-xs font-black rounded-xl outline-none focus:border-red-600"
                   placeholder="https://twitch.tv/..."
                 />
              </div>
              <div className="space-y-4">
                 <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest">Competitor Bio</label>
                 <textarea 
                   value={bio} 
                   onChange={e => setBio(e.target.value)}
                   className="w-full bg-black border border-white/10 p-4 text-xs font-black rounded-xl h-32 outline-none focus:border-red-600"
                   placeholder="Tell the broadcast crew about your racing history..."
                 />
              </div>
              <button onClick={handleSave} className="w-full bg-red-600 py-4 font-black uppercase rounded-xl hover:bg-red-500 transition-all">Update Grid Identity</button>
           </div>

           <div className="bg-zinc-900/60 p-10 rounded-3xl border border-white/5">
              <h3 className="text-xl font-black uppercase italic text-yellow-500 mb-8">Improvement Center</h3>
              <div className="space-y-6">
                 <div className="p-6 bg-black rounded-2xl border-l-4 border-blue-500">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-2">Cornering Efficiency</p>
                    <p className="text-sm font-bold">Try braking 10% earlier at Turn 3 to optimize exit velocity.</p>
                 </div>
                 <div className="p-6 bg-black rounded-2xl border-l-4 border-green-500">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-2">Fuel Management</p>
                    <p className="text-sm font-bold">Excellent short-shifting in the draft. You have +2 laps of range over P2.</p>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default DriverPortal;
