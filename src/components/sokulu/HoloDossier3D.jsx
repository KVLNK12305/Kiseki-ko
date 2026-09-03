import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Cpu, Code2, Sparkles, Activity, Layers, Terminal, Radio } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

export default function HoloDossier3D({ imageUrl }) {
  const isMobile = useIsMobile();
  const cardRef = useRef(null);
  const [activeTab, setActiveTab] = useState('portrait'); // 'portrait' | 'specs' | 'holo'
  const [isHovered, setIsHovered] = useState(false);

  // Mouse physics for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end luxury feel
  const springConfig = { damping: 22, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

  // Hologram glare highlight position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  // Parallax layers
  const imageTranslateZ = isHovered ? 45 : 0;
  const badgeTranslateZ = isHovered ? 65 : 0;

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="relative w-full max-w-[440px] select-none"
      style={{ perspective: isMobile ? 'none' : '1200px' }}
    >
      {/* Ambient background energy aura */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#A855F7]/25 via-[#FFD700]/15 to-[#3B82F6]/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: isMobile ? 'flat' : 'preserve-3d',
        }}
        className="relative bg-[#07070B]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_70px_-10px_rgba(168,85,247,0.3)]"
      >
        {/* Iridescent rim border effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.25) 0%, rgba(168,85,247,0.25) 50%, rgba(59,130,246,0.1) 100%)',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Dynamic Light Specular Flare */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 z-40 mix-blend-overlay"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle 280px at ${gx} ${gy}, rgba(255,255,255,0.4), transparent 80%)`
              ),
            }}
          />
        )}

        {/* ── Header Bar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-2 py-2 mb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD700]" />
            </span>
            <span className="font-mono text-[11px] font-semibold text-white/90 tracking-wider uppercase">
              KUSHAL.DEV // IDENTITY
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-[10px] font-mono">
            <button
              onClick={() => setActiveTab('portrait')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'portrait'
                  ? 'bg-[#A855F7] text-white font-bold shadow'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              ARCHITECT
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'specs'
                  ? 'bg-[#FFD700] text-black font-bold shadow'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              SPECS
            </button>
            <button
              onClick={() => setActiveTab('holo')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'holo'
                  ? 'bg-[#3B82F6] text-white font-bold shadow'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              DOMAIN
            </button>
          </div>
        </div>

        {/* ── Main Display Viewport ────────────────────────────── */}
        <div className="relative rounded-xl overflow-hidden bg-black/60 border border-white/10 aspect-[4/4.5] sm:aspect-square flex items-center justify-center">
          {/* Subtle Grid Canvas */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* TAB 1: ARCHITECT / PORTRAIT VIEW */}
          {activeTab === 'portrait' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
              style={{
                transform: isMobile ? 'none' : `translateZ(${imageTranslateZ}px)`,
                transition: 'transform 0.25s ease-out',
              }}
            >
              <img
                src={imageUrl}
                alt="Kushal Kurapati"
                draggable="false"
                className="w-full h-full object-cover object-top filter contrast-[1.04] brightness-[1.02] transition-transform duration-700 group-hover:scale-105"
              />

              {/* High-end vignette & subtle violet highlight */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070B] via-transparent to-black/20" />

              {/* Floating Status Card */}
              <motion.div
                style={{
                  transform: isMobile ? 'none' : `translateZ(${badgeTranslateZ}px)`,
                }}
                className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#A855F7]">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 leading-none mb-0.5">CLEARANCE</div>
                    <div className="text-xs font-mono font-bold text-white tracking-wide">SYSTEMS & DEFENSE</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#FFD700] font-semibold flex items-center gap-1">
                    <Sparkles size={11} /> 100% VERIFIED
                  </div>
                  <div className="text-[9px] font-mono text-white/40">NODE: AP-SOUTH-1</div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* TAB 2: SPECS TELEMETRY VIEW */}
          {activeTab === 'specs' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full p-4 flex flex-col justify-between text-left font-mono"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#FFD700] pb-2 border-b border-white/10 mb-3">
                  <span className="flex items-center gap-1.5"><Cpu size={14} /> ARCHITECTURE SPEC</span>
                  <span className="text-[10px] text-white/40">v2.4.0-RUST</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/60">Core Runtime:</span>
                    <span className="text-white font-bold">Rust / Async Tokio / eBPF</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/60">Execution Latency:</span>
                    <span className="text-emerald-400 font-bold">&lt; 1.2μs (Bare-Metal)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/60">Distributed Mesh:</span>
                    <span className="text-[#A855F7] font-bold">Zero-Trust Active Defense</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/60">Memory Safety:</span>
                    <span className="text-[#FFD700] font-bold">Strict Invariant (Ownership)</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#A855F7]/10 border border-[#A855F7]/20 p-2.5 rounded-lg flex items-center gap-2">
                <Terminal size={14} className="text-[#A855F7]" />
                <span className="text-[10px] text-white/80">
                  Ready to deploy high-concurrency systems & security pipelines.
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 3: DOMAIN EXPANSION / HOLOGRAM VIEW */}
          {activeTab === 'holo' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center overflow-hidden"
            >
              {/* Scanline Sweep Animation */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168,85,247,0.4) 3px, transparent 4px)',
                }}
              />

              {/* Kanji Seal */}
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#A855F7] opacity-85 select-none mb-2 font-serif">
                領域展開
              </div>

              <div className="font-mono text-sm font-bold text-white tracking-widest uppercase mb-1">
                DOMAIN EXPANSION: KISEKI
              </div>
              <div className="font-mono text-[11px] text-white/50 max-w-[240px]">
                "Surpassing limits. Where mathematical precision meets relentless force."
              </div>

              {/* Simulated Frequency Visualizer */}
              <div className="flex items-end justify-center gap-1 h-8 mt-4">
                {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 50, 70, 85, 30].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.5}%`] }}
                    transition={{
                      duration: 0.8 + (i % 3) * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.05,
                    }}
                    className="w-1 bg-[#FFD700] rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Footer Telemetry Bar ─────────────────────────────── */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-[9px] font-mono tracking-wider">
          <div className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white/60 flex items-center gap-1.5">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
            <span>SYNC: 100%</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white/60 text-center">
            <span className="text-[#FFD700] font-semibold">FPS:</span> 60.0
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white/60 text-right">
            <span className="text-[#A855F7] font-semibold">STABLE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
