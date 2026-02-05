
import React, { useState } from 'react';

interface AppTourProps {
  onComplete: () => void;
}

const AppTour: React.FC<AppTourProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to TCR NASCAR 25",
      content: "This HUD is your professional command center for iRacing. Let's walk through the core features to get you started.",
      target: "Hub"
    },
    {
      title: "The Data Tower",
      content: "On the left is the Leaderboard Tower. It tracks positions, intervals, and car numbers in real-time. Click any driver to focus.",
      target: "Leaderboard"
    },
    {
      title: "Live Telemetry Suite",
      content: "When a driver is selected, their full telemetry suite appears in the bottom right. Monitor speed, RPM, gear, and G-loads.",
      target: "Telemetry"
    },
    {
      title: "Interactive Track Map",
      content: "Keep an eye on the pack with the interactive track map. Dots represent live driver positions as they navigate the oval.",
      target: "Map"
    },
    {
      title: "Global Sports Ticker",
      content: "Stay updated with real-world sports news. The bottom ticker cycles through NBA, NCAA, and NFL breaking news.",
      target: "Ticker"
    },
    {
      title: "Race Control Center",
      content: "Managers can use the Control tab to register drivers, change events, and manage the official race roster.",
      target: "Manager"
    },
    {
      title: "Driver Portal",
      content: "Drivers can access their portal to update stream links, write a bio, and receive real-time performance coaching.",
      target: "Driver"
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-zinc-900 border border-red-600/30 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
        
        <div className="flex justify-between items-start mb-8">
          <div className="text-[10px] font-black uppercase text-red-600 tracking-[0.3em]">
            Step {step + 1} of {steps.length}
          </div>
          <button onClick={onComplete} className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
          {steps[step].title}
        </h2>
        
        <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-10">
          {steps[step].content}
        </p>

        <div className="flex items-center justify-between">
          <button 
            onClick={onComplete}
            className="text-[10px] font-black uppercase text-zinc-600 hover:text-zinc-400 tracking-widest transition-colors"
          >
            Skip Tour
          </button>
          
          <button 
            onClick={nextStep}
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black uppercase italic text-xs tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)] active:scale-95"
          >
            {step === steps.length - 1 ? "Finish Tour" : "Next Step"}
          </button>
        </div>

        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/10 blur-3xl rounded-full" />
      </div>
    </div>
  );
};

export default AppTour;
