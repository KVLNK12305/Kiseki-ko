import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Network, Radar, Bug, Waypoints, LineChart } from 'lucide-react';

import tableauImg from './images/tableau-software (1).png';
import osintImg from './images/osint.png';
import socketIoImg from './images/SocketIo.png';
import ghidraImg from './images/Ghidra_Logo.png';
import wiresharkImg from './images/ws.png';
import matplotlibImg from './images/matplotlib-icon-iodufaod59i61pudzd92.png';

// --- HELPER COMPONENT FOR BRAND LOGOS ---
const BrandIcon = ({ slug, title, provider = "skill" }) => {
  // Map internal IDs to CDN specific slugs
  const slugMap = {
    python: "py",
    node: "nodejs",
    tail: "tailwind",
    js: "js",
    react: "react",
    docker: "docker",
    linux: "linux",
    rust: "rust",
    c: "c",
    java: "java",
    tableau: "tableau"
  };

  const finalSlug = slugMap[slug] || slug;
  
  // Use SkillIcons for core tech, fallback to SimpleIcons for specialized security tools
  const src = provider === "skill" 
    ? `https://skillicons.dev/icons?i=${finalSlug}`
    : `https://cdn.simpleicons.org/${finalSlug}/ffffff`;

  return (
    <img 
      src={src} 
      alt={title} 
      className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
      onError={(e) => {
        // Emergency Fallback if a slug is missing from SkillIcons
        if(provider === "skill") e.target.src = `https://cdn.simpleicons.org/${finalSlug}/ffffff`;
      }}
    />
  );
};

// --- CONFIGURATION ---
const TECH_NODES = [
  { id: 'rust', label: 'Rust', category: 'lang', x: 50, y: 20, icon: <BrandIcon slug="rust" title="Rust" />, description: 'Memory-safe systems & eBPF programming', stats: { Paradigm: 'Concurrent', Safety: 'Strict' } },
  { id: 'c', label: 'C', category: 'lang', x: 65, y: 15, icon: <BrandIcon slug="c" title="C" />, description: 'Low-level hardware interfacing', stats: { Level: 'Low/Kernel', Speed: 'Bare-Metal' } },
  { id: 'python', label: 'Python', category: 'lang', x: 35, y: 15, icon: <BrandIcon slug="python" title="Python" />, description: 'Automation, scripts & data analysis', stats: { Utility: 'High', Typing: 'Dynamic' } },
  { id: 'java', label: 'Java', category: 'lang', x: 50, y: 8, icon: <BrandIcon slug="java" title="Java" />, description: 'Enterprise architecture', stats: { Runtime: 'JVM', Paradigm: 'OOP' } },
  { id: 'js', label: 'JavaScript', category: 'lang', x: 25, y: 20, icon: <BrandIcon slug="js" title="JavaScript" />, description: 'Client/Server dynamic behavior', stats: { Engine: 'V8', Concurrency: 'Event-Loop' } },

  { id: 'linux', label: 'Linux', category: 'sys-sec', x: 75, y: 35, icon: <BrandIcon slug="linux" title="Linux" />, description: 'OS kernel & environment routing', stats: { Kernel: 'Monolithic', Shell: 'Zsh' } },
  { id: 'docker', label: 'Docker', category: 'sys-sec', x: 65, y: 45, icon: <BrandIcon slug="docker" title="Docker" />, description: 'Containerized secure deployments', stats: { Isolation: 'High', Engine: 'Daemon' } },
  { id: 'network', label: 'Networking', category: 'sys-sec', x: 85, y: 45, icon: <Network className="w-7 h-7 md:w-9 md:h-9 opacity-80" />, description: 'SDN & Protocol routing', stats: { Layer: 'OSI 1-7', Topology: 'Mesh' } },
  { id: 'osint', label: 'OSINT', category: 'sys-sec', x: 75, y: 60, icon: <img src={osintImg} alt="OSINT" className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity invert" />, description: 'Open-source intelligence gathering', stats: { Mode: 'Recon', Target: 'Intel' } },
  { id: 'wireshark', label: 'Wireshark', category: 'sys-sec', x: 90, y: 65, icon: <img src={wiresharkImg} alt="Wireshark" className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />, description: 'Deep packet inspection', stats: { Filter: 'BPF/pcap', Analysis: 'Granular' } },
  { id: 'ghidra', label: 'Ghidra / RE', category: 'sys-sec', x: 80, y: 80, icon: <img src={ghidraImg} alt="Ghidra" className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />, description: 'Reverse engineering & SRE', stats: { Phase: 'Static', Type: 'Decompiler' } },

  { id: 'node', label: 'Node.js', category: 'web', x: 35, y: 35, icon: <BrandIcon slug="node" title="Node.js" />, description: 'Asynchronous backend runtime', stats: { Threading: 'Single', Runtime: 'Backend' } },
  { id: 'react', label: 'React.js', category: 'web', x: 15, y: 35, icon: <BrandIcon slug="react" title="React" />, description: 'Component-based UI architecture', stats: { DOM: 'Virtual', Render: 'CSR/SSR' } },
  { id: 'socketio', label: 'Socket.IO', category: 'web', x: 25, y: 45, icon: <img src={socketIoImg} alt="Socket.IO" className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity invert" />, description: 'Bidirectional real-time communication', stats: { Latency: 'Ultra-Low', Fallback: 'Polling' } },
  { id: 'tail', label: 'Tailwind', category: 'web', x: 10, y: 50, icon: <BrandIcon slug="tail" title="Tailwind" />, description: 'Utility-first styling engine', stats: { Strategy: 'Utility', Compilation: 'JIT' } },

  { id: 'tableau', label: 'Tableau', category: 'data', x: 20, y: 70, icon: <img src={tableauImg} alt="Tableau" className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />, description: 'Business intelligence dashboards', stats: { Output: 'Visual', Scale: 'Enterprise' } },
  { id: 'plotly', label: 'Plotly', category: 'data', x: 35, y: 65, icon: <BrandIcon slug="plotly" title="Plotly" provider="simple" />, description: 'Interactive graphing libraries', stats: { Render: 'WebGL', Interactivity: 'High' } },
  { id: 'matplotlib', label: 'Matplotlib', category: 'data', x: 45, y: 80, icon: <img src={matplotlibImg} alt="Matplotlib" className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />, description: 'Statistical data plotting', stats: { Type: 'Static 2D', API: 'Pyplot' } },
];

const CONNECTIONS = [
  ['java', 'rust'], ['java', 'python'], ['rust', 'c'], ['python', 'js'], 
  ['rust', 'linux'], ['c', 'linux'], ['linux', 'docker'], ['linux', 'network'],
  ['network', 'osint'], ['network', 'wireshark'], ['linux', 'ghidra'], ['osint', 'wireshark'],
  ['js', 'node'], ['js', 'react'], ['node', 'socketio'], ['react', 'socketio'], ['react', 'tail'],
  ['python', 'plotly'], ['python', 'matplotlib'], ['plotly', 'tableau'], ['matplotlib', 'plotly']
];

const CATEGORIES = [
  { id: 'all', label: 'ALL_SYSTEMS' },
  { id: 'lang', label: 'LANGUAGES' },
  { id: 'sys-sec', label: 'SYSTEMS & SECURITY' },
  { id: 'web', label: 'WEB_PROTOCOLS' },
  { id: 'data', label: 'DATA_TELEMETRY' },
];

const Arsenal = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredNode, setHoveredNode] = useState(null);

  // OPTIMIZATION: Use MotionValues to avoid "Maximum update depth" re-render loops
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Coordinate display strings (calculated without re-rendering the whole component)
  const displayX = useTransform(mouseX, (val) => val.toFixed(2));
  const displayY = useTransform(mouseY, (val) => val.toFixed(2));

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Direct MotionValue updates do not trigger React renders
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const isNodeActive = (node) => activeCategory === 'all' || node.category === activeCategory;

  return (
    <section id="arsenal" className="relative w-full min-h-[120vh] bg-[#030305] text-white overflow-hidden font-mono selection:bg-[#FFD700]/30">
      
      {/* FIXED NOISE OVERLAY (Base64 avoid 403 Forbidden) */}
      <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.03] bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAAD9tt+fAAAAElBMVEUAAAD8/Pz09PT4+PjMzMz////09TU9AAAAAXRSTlMAQObYZgAAADRJREFUeF5jYGRgYBBgYmBghGInBgYmBnYmRih2YmBgYmBnYmRiZwSJOzGwM7EzsTMyMDAAAGYQAwXpU9mXAAAAAElFTkSuQmCC')] bg-repeat" />

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      <div className="relative z-10 container mx-auto px-4 py-20 h-full flex flex-col">
        
        {/* HEADER */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-2 text-[#FFD700] text-xs tracking-[0.2em] opacity-80">
            <span>// SYSTEM_INVENTORY</span>
            <span className="w-12 h-[1px] bg-[#FFD700]/50" />
            <span>STATUS: ACTIVE</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            TECH ARSENAL
          </h2>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-4 py-2 text-xs tracking-wider border transition-all duration-300 relative group overflow-hidden
                  ${activeCategory === cat.id 
                    ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_15px_rgba(255,215,0,0.15)]' 
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}
                `}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {activeCategory === cat.id && <span className="w-1 h-1 bg-[#FFD700] rounded-full animate-pulse" />}
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CONSTELLATION MAP */}
        <div className="flex-1 relative min-h-[800px] border border-white/5 rounded-3xl bg-black/40 backdrop-blur-md overflow-hidden">
          
          {/* ADVANCED TELEMETRY HUD */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                className="absolute top-8 right-8 z-30 w-72 bg-[#0a0a0c]/90 border border-[#FFD700]/40 p-5 rounded-lg backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#FFD700]/20">
                  <span className="text-[10px] text-[#FFD700] tracking-widest">DIAGNOSTIC_PANEL</span>
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                  {hoveredNode.icon} {hoveredNode.label}
                </h3>
                
                <p className="text-xs text-gray-300 leading-relaxed border-l-2 border-[#FFD700]/50 pl-3 my-4">
                  {hoveredNode.description}
                </p>

                <div className="space-y-2 mb-5">
                  {Object.entries(hoveredNode.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-end border-b border-white/5 pb-1">
                      <span className="text-[10px] text-gray-500 tracking-wider">{key.toUpperCase()}</span>
                      <span className="text-xs text-[#FFD700]">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Signal Visualizer */}
                <div className="flex items-end gap-1 h-6 w-full opacity-80">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '40%'] }}
                      transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "linear", delay: i * 0.05 }}
                      className="flex-1 bg-[#FFD700] rounded-t-sm"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG CONNECTIONS */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {CONNECTIONS.map(([startId, endId], i) => {
              const startNode = TECH_NODES.find(n => n.id === startId);
              const endNode = TECH_NODES.find(n => n.id === endId);
              if (!startNode || !endNode || !isNodeActive(startNode) || !isNodeActive(endNode)) return null;

              const isHighlighted = hoveredNode && (hoveredNode.id === startId || hoveredNode.id === endId);

              return (
                <motion.line
                  key={i}
                  x1={`${startNode.x}%`} y1={`${startNode.y}%`}
                  x2={`${endNode.x}%`} y2={`${endNode.y}%`}
                  stroke={isHighlighted ? '#FFD700' : '#ffffff'}
                  strokeWidth={isHighlighted ? 1.5 : 0.5}
                  strokeOpacity={isHighlighted ? 0.8 : 0.1}
                />
              );
            })}
          </svg>

          {/* NODES */}
          <div className="absolute inset-0 z-10">
            {TECH_NODES.map((node) => {
              const isActive = isNodeActive(node);
              const isHovered = hoveredNode?.id === node.id;

              return (
                <motion.div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair
                    ${!isActive ? 'opacity-10 grayscale pointer-events-none' : 'opacity-100'}
                  `}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  animate={{
                    y: isHovered ? [`${node.y}%`] : [`${node.y}%`, `${node.y - 1}%`, `${node.y}%`],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="relative group flex flex-col items-center">
                    <div className={`
                      relative w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center 
                      bg-[#050505] border transition-all duration-300 z-10
                      ${isHovered 
                        ? 'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-110' 
                        : 'border-white/10 text-gray-500 hover:border-white/30'}
                    `}>
                      {node.icon}
                    </div>
                    <div className={`
                      absolute top-full mt-3 whitespace-nowrap text-[10px] tracking-widest transition-all duration-300 bg-black/80 px-2 py-1 rounded border border-white/10
                      ${isHovered ? 'text-[#FFD700] opacity-100' : 'opacity-0'}
                    `}>
                      {node.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* ZERO-RE-RENDER TELEMETRY */}
          <div className="absolute bottom-4 left-4 text-[10px] text-gray-600 font-mono flex gap-4">
            <div>SYS_X: <motion.span className="text-[#FFD700]">{displayX}</motion.span></div>
            <div>SYS_Y: <motion.span className="text-[#FFD700]">{displayY}</motion.span></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arsenal;