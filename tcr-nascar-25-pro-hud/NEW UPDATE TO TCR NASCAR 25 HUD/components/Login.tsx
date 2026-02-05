
import React, { useState, useRef } from 'react';
import { User } from '../types.ts';

interface LoginProps {
  onLogin: (userData: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [engineStarted, setEngineStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Background NASCAR video (Classic Daytona 500 Highlights for maximum impact)
  const videoId = "v8N9SOnX9Yk";
  // Added enablejsapi=1 to control via postMessage
  const ytUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&enablejsapi=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1`;

  const handleStartEngines = () => {
    setEngineStarted(true);
    setIsMuted(false);
    
    // Attempt to unmute the existing iframe using YouTube IFrame API's message interface
    if (iframeRef.current) {
      const command = JSON.stringify({
        event: 'command',
        func: 'unMute'
      });
      iframeRef.current.contentWindow?.postMessage(command, '*');
      
      const playCommand = JSON.stringify({
        event: 'command',
        func: 'playVideo'
      });
      iframeRef.current.contentWindow?.postMessage(playCommand, '*');
    }
  };

  const handleDiscordLogin = () => {
    window.location.href = '/login/discord';
  };

  const handleGoogleLogin = () => {
    alert("Google Authentication Uplink Initializing... (Technical Preview Only)");
  };

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden font-sans">
      {/* Background Video Theater - High Performance Fill */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={`absolute inset-0 bg-black/50 z-10 transition-opacity duration-1000 ${engineStarted ? 'opacity-80' : 'opacity-40'}`} />
        <iframe
          ref={iframeRef}
          className="absolute top-1/2 left-1/2 w-[115vw] h-[115vh] -translate-x-1/2 -translate-y-1/2 scale-110 object-cover pointer-events-none"
          src={ytUrl}
          title="NASCAR Background Loop"
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Main UI Overlay - Centered semi-transparent box */}
      <div className="relative z-20 flex flex-col items-center w-full px-4 text-center">
        {!engineStarted ? (
          <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center max-w-2xl">
            <div className="bg-red-600 px-12 py-5 font-black text-6xl md:text-8xl italic tracking-tighter skew-x-[-15deg] shadow-[0_0_100px_rgba(220,38,38,0.7)] mb-16 select-none">
              <span className="block skew-x-[15deg]">TCR 25</span>
            </div>
            
            <button 
              onClick={handleStartEngines}
              className="group relative px-20 py-10 bg-white text-black font-black text-3xl md:text-4xl uppercase italic tracking-widest rounded-full hover:bg-red-600 hover:text-white transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_0_60px_rgba(255,255,255,0.4)] border-none cursor-pointer"
            >
              <div className="absolute inset-0 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />
              START ENGINES
            </button>
            <p className="mt-12 text-zinc-300 font-black uppercase tracking-[0.6em] text-sm animate-pulse italic">Awaiting Ignition Command...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000 flex flex-col items-center w-full max-w-lg">
            {/* Header Branding */}
            <div className="mb-14 text-center">
              <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter italic leading-none text-white drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
                TCR <span className="text-red-600">HUB</span>
              </h1>
              <p className="mt-6 text-zinc-100 font-black uppercase tracking-[0.4em] text-xs italic bg-black/60 px-4 py-1 rounded-full backdrop-blur-md">GRID ENTRY PROTOCOL ACTIVE</p>
            </div>

            {/* Centered Login UI Box */}
            <div className="bg-black/40 backdrop-blur-3xl p-14 rounded-[2rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] w-full border-t-8 border-t-red-600 transform transition-all">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-12 text-white italic">Driver Authentication</h2>
              
              <div className="space-y-6">
                <button 
                  onClick={handleDiscordLogin}
                  className="w-full flex items-center justify-center gap-5 bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 py-6 px-10 rounded-2xl font-black uppercase italic tracking-widest text-2xl shadow-xl group border-none cursor-pointer text-white"
                >
                  <svg className="w-8 h-8 fill-white group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                  </svg>
                  Discord Authorize
                </button>

                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-5 bg-white hover:bg-zinc-100 transition-all duration-300 py-6 px-10 rounded-2xl font-black uppercase italic tracking-widest text-2xl text-black shadow-xl group border-none cursor-pointer"
                >
                  <svg className="w-8 h-8" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083L43.611,20.083L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  Google Account
                </button>
              </div>

              <div className="mt-12 pt-12 border-t border-white/10 flex flex-col items-center gap-5">
                <div className="flex items-center gap-5 text-xs font-black uppercase text-zinc-500 tracking-[0.4em] italic">
                   <span>DAYTONA SATLINK</span>
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse" />
                </div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                  SYSTEM READY. ALL CHANNELS OPERATIONAL. <br />
                  PLEASE AUTHENTICATE TO ACCESS TELEMETRY CORE.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Retro Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[url('https://media.giphy.com/media/oEI9uWU6EB_i8/giphy.gif')] mix-blend-screen" />
    </div>
  );
};

export default Login;