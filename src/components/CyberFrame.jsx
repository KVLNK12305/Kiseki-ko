import React from 'react';

const CyberFrame = ({ imageUrl = "https://placehold.co/400x400/08080E/FFF" }) => {
  return (
    <div className="relative group max-w-md mx-auto select-none">
        {/* Vibe: Active Hardware Glow - Less spooky, more 'powered on' */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-gold/20 rounded-[20px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Main Terminal Chassis */}
        <div className="relative bg-[#0A0A0F] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
            
            {/* Terminal Header Bar */}
            <div className="h-8 bg-[#15151A] border-b border-slate-800 flex items-center justify-between px-3">
                <div className="flex items-center gap-1.5">
                    {/* Window Controls / Status Dots */}
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 animate-quick-pulse"></div>
                </div>
                {/* Technical Title */}
                <div className="text-[10px] font-mono text-cyan-500/70 tracking-widest">
                    usr://kushal.vln/secure-feed
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative p-2">
                {/* Background Tech Grid */}
                <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none"></div>

                {/* Image Container with 'Data Stream' overlay */}
                <div className="relative rounded-lg overflow-hidden border border-cyan-900/30 bg-[#08080E] aspect-square">
                    
                    {/* Vibe: Active Data Stream (Subtle vertical lines scrolling) */}
                    <div className="absolute inset-0 bg-data-stream opacity-10 animate-data-scroll pointer-events-none z-20 mix-blend-screen"></div>

                    {/* Actual Image - Clean but protected */}
                    <img 
                        src={imageUrl} 
                        alt="Operator" 
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full object-cover relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                    />

                    {/* Corner Overlays (Camera/Feed style) */}
                    <div className="absolute top-2 right-2 z-30">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono text-green-400 border border-green-900/50">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            LIVE FEED
                        </div>
                    </div>
                </div>

                {/* Footer Diagnostic Bar */}
                <div className="mt-2 grid grid-cols-3 gap-2 text-[9px] font-mono uppercase tracking-wider">
                    <div className="bg-[#111116] border border-slate-800 rounded px-2 py-1 text-slate-400">
                        <span className="text-violet-400">UPLINK:</span> ESTABLISHED
                    </div>
                    <div className="bg-[#111116] border border-slate-800 rounded px-2 py-1 text-slate-400 text-center">
                        <span className="text-gold">PING:</span> 14ms
                    </div>
                     <div className="bg-[#111116] border border-cyan-900/50 rounded px-2 py-1 text-cyan-400 text-right flex justify-between items-center">
                        <span>SEC:</span> 
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default CyberFrame;