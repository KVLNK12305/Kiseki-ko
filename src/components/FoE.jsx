import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Globe, Database, Cloud, Code, Terminal, 
  Layers, Command, Wifi, Box, Shield, Zap
} from 'lucide-react';

// --- CONFIGURATION ---

// The Gemini Constellation Mapping
// We map tech skills to specific x/y percentage coordinates to mimic the star sign.
const TECH_NODES = [
  // LEFT TWIN (Frontend/Interface - "Castor")
  { id: 'react', label: 'React', category: 'frontend', x: 25, y: 15, icon: <Code />, description: 'Component Architecture' },
  { id: 'next', label: 'Next.js', category: 'frontend', x: 20, y: 30, icon: <Globe />, description: 'Server Side Rendering' },
  { id: 'ts', label: 'TypeScript', category: 'lang', x: 30, y: 30, icon: <Terminal />, description: 'Type Safety & Logic' },
  { id: 'tail', label: 'Tailwind', category: 'frontend', x: 15, y: 50, icon: <Layers />, description: 'Rapid UI Styling' },
  { id: 'three', label: 'Three.js', category: 'frontend', x: 35, y: 50, icon: <Box />, description: '3D Web Experiences' },
  
  // RIGHT TWIN (Backend/Systems - "Pollux")
  { id: 'rust', label: 'Rust', category: 'core', x: 75, y: 15, icon: <Shield />, description: 'Memory Safety & Speed' },
  { id: 'node', label: 'Node.js', category: 'backend', x: 70, y: 35, icon: <Cpu />, description: 'Async Event Driven' },
  { id: 'cpp', label: 'C++', category: 'core', x: 80, y: 35, icon: <Command />, description: 'Low Level Control' },
  { id: 'docker', label: 'Docker', category: 'devops', x: 65, y: 55, icon: <Box />, description: 'Containerization' },
  { id: 'aws', label: 'AWS', category: 'cloud', x: 85, y: 55, icon: <Cloud />, description: 'Cloud Infrastructure' },

  // THE BRIDGE (Shared/Tools/Data)
  { id: 'sql', label: 'Postgres', category: 'db', x: 50, y: 40, icon: <Database />, description: 'Relational Data' },
  { id: 'git', label: 'Git', category: 'tools', x: 50, y: 70, icon: <Wifi />, description: 'Version Control' },
  { id: 'python', label: 'Python', category: 'lang', x: 50, y: 20, icon: <Zap />, description: 'AI & Scripting' },
];

// Define connections (constellation lines)
const CONNECTIONS = [
  ['react', 'next'], ['react', 'ts'], ['next', 'tail'], ['ts', 'three'], // Left Twin Body
  ['rust', 'cpp'], ['rust', 'node'], ['node', 'docker'], ['cpp', 'aws'], // Right Twin Body
  ['ts', 'node'], // The "Handshake" between twins
  ['python', 'react'], ['python', 'rust'], // Python bridging both heads
  ['sql', 'node'], ['sql', 'next'], // Database grounding
  ['git', 'tail'], ['git', 'docker'], // Tools connecting the feet
];

const CATEGORIES = [
  { id: 'all', label: 'ALL MODULES' },
  { id: 'core', label: 'CORE / LANG' },
  { id: 'frontend', label: 'FRONTEND' },
  { id: 'backend', label: 'BACKEND & DB' },
  { id: 'cloud', label: 'CLOUD & DEVOPS' },
];

const Arsenal = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle global mouse move for parallax effect
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

  // Filter logic
  const isNodeActive = (node) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'backend' && (node.category === 'db' || node.category === 'backend')) return true;
    if (activeCategory === 'core' && (node.category === 'lang' || node.category === 'core')) return true;
    if (activeCategory === 'cloud' && (node.category === 'devops' || node.category === 'cloud')) return true;
    return node.category === activeCategory;
  };

  return (
    <section className="relative w-full min-h-screen bg-[#050505] text-white overflow-hidden font-mono selection:bg-cyan-500/30">
      
      {/* BACKGROUND GRID & DECORATION */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-20 h-full flex flex-col">
        
        {/* HEADER SECTION */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs tracking-[0.2em] opacity-80">
            <span>// SYSTEM_INVENTORY</span>
            <span className="w-12 h-[1px] bg-cyan-400/50" />
            <span>V.2.0.26 [OPTIMIZED]</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            TECH ARSENAL
          </h2>
          
          {/* CATEGORY TABS */}
          <div className="flex flex-wrap gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-4 py-2 text-xs tracking-wider border transition-all duration-300 relative group overflow-hidden
                  ${activeCategory === cat.id 
                    ? 'border-cyan-500 text-cyan-500 bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}
                `}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {activeCategory === cat.id && <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />}
                  {cat.label}
                </span>
                {activeCategory === cat.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-500" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONSTELLATION AREA */}
        <div className="flex-1 relative min-h-[600px] border border-white/5 rounded-3xl bg-black/20 backdrop-blur-sm overflow-hidden">
          
          {/* INFO HUD (Top Right) */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-8 right-8 z-30 w-64 bg-black/80 border border-cyan-500/30 p-4 rounded-xl backdrop-blur-md shadow-2xl"
              >
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                  <span className="text-xs text-cyan-400 tracking-widest">INFO_PANEL</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{hoveredNode.label}</h3>
                <div className="text-xs text-gray-400 font-mono mb-3">ID: {hoveredNode.id.toUpperCase()}_MOD</div>
                <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-cyan-500/50 pl-3">
                  {hoveredNode.description}
                </p>
                <div className="mt-4 flex gap-2">
                  <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: '100%' }} 
                      className="h-full bg-cyan-500"
                    />
                  </div>
                </div>
                <div className="text-[10px] text-right mt-1 text-cyan-500/70">MASTERY LEVEL: SYNCHRONIZED</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CANVAS LAYER (Lines) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {CONNECTIONS.map(([startId, endId], i) => {
              const startNode = TECH_NODES.find(n => n.id === startId);
              const endNode = TECH_NODES.find(n => n.id === endId);
              
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
                  stroke={isHighlighted ? '#06b6d4' : '#ffffff'}
                  strokeWidth={isHighlighted ? 2 : 0.5}
                  strokeOpacity={isHighlighted ? 0.8 : 0.15}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                />
              );
            })}
          </svg>

          {/* NODES LAYER */}
          <div className="absolute inset-0 z-10">
            {TECH_NODES.map((node) => {
              const isActive = isNodeActive(node);
              const isHovered = hoveredNode?.id === node.id;
              
              return (
                <motion.div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                    ${!isActive ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}
                  `}
                  style={{ 
                    left: `${node.x}%`, 
                    top: `${node.y}%`,
                  }}
                  animate={{
                    // Floating animation
                    y: [`${node.y}%`, `${node.y - 2}%`, `${node.y}%`],
                    x: [`${node.x}%`, `${node.x + (Math.random() - 0.5)}%`, `${node.x}%`]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="relative group">
                    {/* Glowing Ring Effect */}
                    {isHovered && (
                      <motion.div 
                        layoutId="glow"
                        className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    
                    {/* The Node Icon */}
                    <div className={`
                      relative w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center 
                      bg-[#0a0a0a] border transition-all duration-300
                      ${isHovered 
                        ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-110 text-cyan-400' 
                        : 'border-white/10 text-gray-400 hover:border-white/40'}
                    `}>
                      <div className="w-6 h-6 md:w-8 md:h-8">
                        {node.icon}
                      </div>
                    </div>

                    {/* Label (Always visible or on hover) */}
                    <div className={`
                      absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap
                      text-[10px] tracking-widest font-semibold transition-all duration-300
                      ${isHovered ? 'text-cyan-400 translate-y-0 opacity-100' : 'text-gray-500 translate-y-2 opacity-0 group-hover:opacity-100'}
                    `}>
                      {node.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* DECORATIVE BACKGROUND ELEMENTS */}
          <div className="absolute bottom-4 left-4 text-[10px] text-gray-600 font-mono">
            COORDS: {mousePos.x.toFixed(2)}, {mousePos.y.toFixed(2)}
          </div>
           <div className="absolute bottom-4 right-4 text-[10px] text-gray-600 font-mono flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500/50 rounded-full animate-pulse"></span>
            NETWORK_STATUS: ONLINE
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arsenal;