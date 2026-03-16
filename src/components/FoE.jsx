import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// We rely on lucide-react ONLY for abstract concepts that don't have official brand logos.
import { 
  Network, Radar, Bug, Waypoints, LineChart 
} from 'lucide-react';

// --- HELPER COMPONENT FOR BRAND LOGOS ---
// This safely fetches official logos directly from a CDN. No NPM packages to break.
const BrandIcon = ({ slug, title }) => (
  <img 
    src={`https://cdn.simpleicons.org/${slug}/ffffff`} 
    alt={title} 
    className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
  />
);

// --- CONFIGURATION ---
const TECH_NODES = [
  // THE BRIDGE: Languages 
  { id: 'rust', label: 'Rust', category: 'lang', x: 50, y: 15, icon: <BrandIcon slug="rust" title="Rust" />, description: 'Memory-safe systems & eBPF programming', stats: { Paradigm: 'Concurrent', Allocation: 'Manual', Safety: 'Strict' } },
  { id: 'c', label: 'C', category: 'lang', x: 65, y: 15, icon: <BrandIcon slug="c" title="C" />, description: 'Low-level hardware interfacing', stats: { Level: 'Low/Kernel', Speed: 'Bare-Metal', Paradigm: 'Procedural' } },
  { id: 'python', label: 'Python', category: 'lang', x: 35, y: 15, icon: <BrandIcon slug="python" title="Python" />, description: 'Automation, scripts & data analysis', stats: { Execution: 'Interpreted', Typing: 'Dynamic', Utility: 'High' } },
  { id: 'java', label: 'Java', category: 'lang', x: 50, y: 5, icon: <BrandIcon slug="java" title="Java" />, description: 'Enterprise architecture', stats: { Runtime: 'JVM', Typing: 'Static', Paradigm: 'OOP' } },
  { id: 'js', label: 'JavaScript', category: 'lang', x: 25, y: 20, icon: <BrandIcon slug="javascript" title="JavaScript" />, description: 'Client/Server dynamic behavior', stats: { Engine: 'V8', Concurrency: 'Event-Loop', Paradigm: 'Multi' } },

  // RIGHT WING: Systems & Security 
  { id: 'linux', label: 'Linux', category: 'sys-sec', x: 75, y: 35, icon: <BrandIcon slug="linux" title="Linux" />, description: 'OS kernel & environment routing', stats: { Kernel: 'Monolithic', Access: 'Root', Shell: 'Bash/Zsh' } },
  { id: 'docker', label: 'Docker', category: 'sys-sec', x: 65, y: 45, icon: <BrandIcon slug="docker" title="Docker" />, description: 'Containerized secure deployments', stats: { Isolation: 'High', Footprint: 'Light', Engine: 'Daemon' } },
  { id: 'network', label: 'Networking', category: 'sys-sec', x: 85, y: 45, icon: <Network className="w-7 h-7 md:w-9 md:h-9 opacity-80" />, description: 'SDN & Protocol routing', stats: { Layer: 'OSI 1-7', Topology: 'Mesh', State: 'Active' } },
  { id: 'nmap', label: 'Nmap', category: 'sys-sec', x: 75, y: 60, icon: <Radar className="w-7 h-7 md:w-9 md:h-9 opacity-80" />, description: 'Network discovery & auditing', stats: { Mode: 'Reconnaissance', Stealth: 'Variable', Target: 'Ports' } },
  { id: 'wireshark', label: 'Wireshark', category: 'sys-sec', x: 90, y: 65, icon: <BrandIcon slug="wireshark" title="Wireshark" />, description: 'Deep packet inspection', stats: { Mode: 'Capture', Filter: 'BPF/pcap', Analysis: 'Granular' } },
  { id: 'ghidra', label: 'Ghidra / RE', category: 'sys-sec', x: 80, y: 80, icon: <Bug className="w-7 h-7 md:w-9 md:h-9 opacity-80" />, description: 'Reverse engineering & SRE', stats: { Phase: 'Static Analysis', Arch: 'Multi', Type: 'Decompiler' } },

  // LEFT WING: Web 
  { id: 'node', label: 'Node.js', category: 'web', x: 35, y: 35, icon: <BrandIcon slug="nodedotjs" title="Node.js" />, description: 'Asynchronous backend runtime', stats: { Threading: 'Single', I_O: 'Non-blocking', Runtime: 'Backend' } },
  { id: 'react', label: 'React.js', category: 'web', x: 15, y: 35, icon: <BrandIcon slug="react" title="React" />, description: 'Component-based UI architecture', stats: { DOM: 'Virtual', Paradigm: 'Declarative', Render: 'CSR/SSR' } },
  { id: 'sockets', label: 'WebSockets', category: 'web', x: 25, y: 45, icon: <Waypoints className="w-7 h-7 md:w-9 md:h-9 opacity-80" />, description: 'Full-duplex TCP channels', stats: { Protocol: 'ws://', State: 'Stateful', Latency: 'Ultra-Low' } },
  { id: 'tail', label: 'Tailwind', category: 'web', x: 10, y: 50, icon: <BrandIcon slug="tailwindcss" title="Tailwind" />, description: 'Utility-first styling engine', stats: { Strategy: 'Utility', Compilation: 'JIT', Output: 'Optimized' } },

  // BOTTOM LEFT: Data & Visualization
  { id: 'tableau', label: 'Tableau', category: 'data', x: 20, y: 70, icon: <BrandIcon slug="tableau" title="Tableau" />, description: 'Business intelligence dashboards', stats: { Output: 'Visual', Querying: 'Drag-Drop', Scale: 'Enterprise' } },
  { id: 'plotly', label: 'Plotly', category: 'data', x: 35, y: 65, icon: <BrandIcon slug="plotly" title="Plotly" />, description: 'Interactive graphing libraries', stats: { Render: 'WebGL/SVG', Source: 'Py/JS', Interactivity: 'High' } },
  { id: 'matplotlib', label: 'Matplotlib', category: 'data', x: 45, y: 80, icon: <LineChart className="w-7 h-7 md:w-9 md:h-9 opacity-80" />, description: 'Statistical data plotting', stats: { Type: 'Static 2D', API: 'Pyplot', Complexity: 'Granular' } },
];

// Logical groupings forming the visual "web"
const CONNECTIONS = [
  ['java', 'rust'], ['java', 'python'], ['rust', 'c'], ['python', 'js'], 
  ['rust', 'linux'], ['c', 'linux'], ['linux', 'docker'], ['linux', 'network'],
  ['network', 'nmap'], ['network', 'wireshark'], ['linux', 'ghidra'], ['nmap', 'wireshark'],
  ['js', 'node'], ['js', 'react'], ['node', 'sockets'], ['react', 'sockets'], ['react', 'tail'],
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isNodeActive = (node) => {
    if (activeCategory === 'all') return true;
    return node.category === activeCategory;
  };

  return (
    <section id="arsenal" className="relative w-full min-h-screen bg-[#030305] text-white overflow-hidden font-mono selection:bg-[#FFD700]/30">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none" />

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
        <div className="flex-1 relative min-h-[600px] border border-white/5 rounded-3xl bg-black/40 backdrop-blur-md overflow-hidden">
          
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
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                  {hoveredNode.icon} {hoveredNode.label}
                </h3>
                <div className="text-[10px] text-gray-500 font-mono mb-4 bg-white/5 inline-block px-2 py-0.5 rounded">
                  MOD_ID: 0x{(hoveredNode.id.length * 1024).toString(16).toUpperCase()}
                </div>
                
                <p className="text-xs text-gray-300 leading-relaxed border-l-2 border-[#FFD700]/50 pl-3 mb-5">
                  {hoveredNode.description}
                </p>

                {/* Data-Driven Stats Output */}
                <div className="space-y-2 mb-5">
                  {Object.entries(hoveredNode.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-end border-b border-white/5 pb-1">
                      <span className="text-[10px] text-gray-500 tracking-wider">{key.toUpperCase()}</span>
                      <span className="text-xs text-[#FFD700]">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Signal Visualizer */}
                <div className="flex items-end gap-1 h-6 w-full opacity-80">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '30%', '80%', '10%'] }}
                      transition={{ 
                        duration: 1.5 + Math.random(), 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: i * 0.1 
                      }}
                      className="flex-1 bg-gradient-to-t from-[#FFD700]/20 to-[#FFD700] rounded-t-sm"
                    />
                  ))}
                </div>
                <div className="text-[9px] text-center mt-2 text-gray-600 tracking-widest">
                  LIVE_TELEMETRY_STREAM
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG CONNECTIONS */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {CONNECTIONS.map(([startId, endId], i) => {
              const startNode = TECH_NODES.find(n => n.id === startId);
              const endNode = TECH_NODES.find(n => n.id === endId);
              if (!startNode || !endNode) return null;

              const isHighlighted = hoveredNode && (hoveredNode.id === startId || hoveredNode.id === endId);
              const isActive = isNodeActive(startNode) && isNodeActive(endNode);

              if (!isActive) return null;

              return (
                <motion.line
                  key={i}
                  x1={`${startNode.x}%`}
                  y1={`${startNode.y}%`}
                  x2={`${endNode.x}%`}
                  y2={`${endNode.y}%`}
                  stroke={isHighlighted ? '#FFD700' : '#ffffff'}
                  strokeWidth={isHighlighted ? 1.5 : 0.5}
                  strokeOpacity={isHighlighted ? 0.8 : 0.1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                />
              );
            })}
          </svg>

          {/* RENDER NODES */}
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
                    y: [`${node.y}%`, `${node.y - 1.5}%`, `${node.y}%`],
                  }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="relative group flex flex-col items-center">
                    
                    {/* Node Interface */}
                    <div className={`
                      relative w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center 
                      bg-[#050505] border transition-all duration-300 z-10
                      ${isHovered 
                        ? 'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-110 text-[#FFD700]' 
                        : 'border-white/10 text-gray-500 hover:border-white/30'}
                    `}>
                      {node.icon}
                    </div>

                    {/* Minimalist Label */}
                    <div className={`
                      absolute top-full mt-3 whitespace-nowrap text-[10px] tracking-widest font-semibold transition-all duration-300 bg-black/80 px-2 py-1 rounded backdrop-blur-md border border-white/10
                      ${isHovered ? 'text-[#FFD700] translate-y-0 opacity-100' : 'text-gray-600 -translate-y-2 opacity-0'}
                    `}>
                      {node.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="absolute bottom-4 left-4 text-[10px] text-gray-600 font-mono">
            SYS_COORD: {mousePos.x.toFixed(2)}, {mousePos.y.toFixed(2)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arsenal;