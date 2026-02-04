
import React from 'react';
import { User } from '../types';

// Define the interface for Login component props to fix Prop not found error
interface LoginProps {
  onLogin: (userData: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleDiscordLogin = () => {
    // In a real environment, this redirects to the backend login route
    // For preview/demo purposes, we call the onLogin prop to proceed to the app
    
    // Simulating a successful login for the preview environment
    onLogin({
      id: '123456789',
      username: 'NASCAR_DRIVER',
      avatar: '',
      discriminator: '0001'
    });
    
    // window.location.href = '/login';
  };

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Background Cinematic Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1532581133501-831498f3994e?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_10s_infinite]"
          alt="Race Track"
        />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-6">
        {/* Branding */}
        <div className="mb-12">
          <div className="bg-red-600 px-8 py-3 font-black text-4xl italic tracking-tighter skew-x-[-15deg] shadow-[0_0_50px_rgba(220,38,38,0.5)] inline-block mb-4">
            NASCAR 25
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            START YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-white">ENGINES</span>
          </h1>
          <p className="mt-6 text-zinc-400 font-bold uppercase tracking-[0.4em] text-sm">Official Broadcast Interface</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/40 backdrop-blur-3xl p-10 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
          <h2 className="text-xl font-black uppercase tracking-tight mb-8">Ready to Race?</h2>
          
          <button 
            onClick={handleDiscordLogin}
            className="w-full flex items-center justify-center gap-4 bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 py-4 px-6 rounded-xl font-black uppercase italic tracking-wider text-lg shadow-lg group"
          >
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
            <span className="group-hover:translate-x-1 transition-transform">Sign in with Discord</span>
          </button>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase text-zinc-500 tracking-widest italic">
            <span>Server: US-EAST-01</span>
            <div className="flex gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            </div>
          </div>
        </div>

        <p className="mt-12 text-zinc-600 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-loose">
          By logging in, you agree to the league rules and technical regulations of the iRacing NASCAR season.
        </p>
      </div>

      {/* Decorative HBO Max Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Login;
