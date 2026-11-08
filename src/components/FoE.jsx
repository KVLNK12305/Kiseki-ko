import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars -- used as <motion.*> JSX
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Cloud, Network, Radar, Waypoints } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import SectionHeader from './SectionHeader';
import { PROJECTS_BY_SLUG } from '../data/projects';

import tableauImg from './images/tableau-software (1).png';
import osintImg from './images/osint.png';
import ghidraImg from './images/Ghidra_Logo.png';
import wiresharkImg from './images/ws.png';
import matplotlibImg from './images/matplotlib-icon-iodufaod59i61pudzd92.png';

// ── Icons ─────────────────────────────────────────────────────
const ICON_CLASS = 'w-7 h-7 md:w-9 md:h-9 object-contain opacity-80 group-hover:opacity-100 transition-opacity';

const BrandIcon = ({ slug, title, provider = 'skill' }) => {
  const src = provider === 'skill'
    ? `https://skillicons.dev/icons?i=${slug}`
    : `https://cdn.simpleicons.org/${slug}/ffffff`;
  return (
    <img
      src={src}
      alt={title}
      width={36}
      height={36}
      loading="lazy"
      decoding="async"
      className={ICON_CLASS}
      onError={(e) => {
        if (provider === 'skill') e.currentTarget.src = `https://cdn.simpleicons.org/${slug}/ffffff`;
      }}
    />
  );
};
const ImgIcon = ({ src, alt, invert = false }) => (
  <img src={src} alt={alt} width={36} height={36} loading="lazy" decoding="async" className={`${ICON_CLASS} ${invert ? 'invert' : ''}`} />
);
const LucideIcon = (props) => {
  const { Icon } = props;
  return <Icon className="w-7 h-7 md:w-9 md:h-9 opacity-80" strokeWidth={1.5} />;
};

// ── Stack ─────────────────────────────────────────────────────
// note      what I actually do with it, in my words
// projects  slugs from src/data/projects.js, strongest example first.
//           Each one was checked against that repo's manifest or source.
// x, y      position on the constellation map, in % of the map box
const TECH_NODES = [
  // Languages
  { id: 'rust', label: 'Rust', category: 'lang', x: 50, y: 22, icon: <BrandIcon slug="rust" title="Rust" />,
    note: 'My default when correctness matters: in-kernel eBPF with Aya, a Tokio defence daemon, a flight recorder for async stalls, and a crypto core called over FFI. Learned to design around ownership instead of fighting it.',
    projects: ['adg', 'ghostshell', 'everust', 'akira'] },
  { id: 'go', label: 'Go', category: 'lang', x: 80, y: 18, icon: <BrandIcon slug="go" title="Go" />,
    note: 'Single-binary tools with nothing to install. KlaudTrace is standard-library only, from CloudTrail parsing to the final report.',
    projects: ['klaudtrace', 'eeffoc'] },
  { id: 'python', label: 'Python', category: 'lang', x: 35, y: 15, icon: <BrandIcon slug="py" title="Python" />,
    note: 'Control planes and glue: an OpenFlow SDN controller, Azure detection workers, a Bluetooth headphone protocol, and data analysis.',
    projects: ['adg', 'cloudpulse', 'tunedeck', 'f1'] },
  { id: 'ts', label: 'TypeScript', category: 'lang', x: 12, y: 24, icon: <BrandIcon slug="ts" title="TypeScript" />,
    note: 'Typed front-ends and a Manifest V3 browser extension, tested with Vitest.',
    projects: ['continuelater', 'novasketch', 'cloudpulse'] },
  { id: 'js', label: 'JavaScript', category: 'lang', x: 25, y: 22, icon: <BrandIcon slug="js" title="JavaScript" />,
    note: 'Express back-ends with auth, rate limiting and real-time sync.',
    projects: ['akira', 'novasketch'] },
  { id: 'c', label: 'C', category: 'lang', x: 65, y: 15, icon: <BrandIcon slug="c" title="C" />,
    note: 'Low-level hardware interfacing.', projects: [] },
  { id: 'java', label: 'Java', category: 'lang', x: 50, y: 8, icon: <BrandIcon slug="java" title="Java" />,
    note: 'Enterprise architecture.', projects: [] },

  // Systems & security
  { id: 'ebpf', label: 'eBPF / XDP', category: 'sys-sec', x: 60, y: 33, icon: <LucideIcon Icon={Radar} />,
    note: 'Packet parsing at the NIC before the kernel network stack sees it, with maps pinned to bpffs and shared with userspace. Learned exactly how strict the verifier is.',
    projects: ['adg'] },
  { id: 'linux', label: 'Linux', category: 'sys-sec', x: 75, y: 36, icon: <BrandIcon slug="linux" title="Linux" />,
    note: 'Most of what I build only runs here: XDP on a network card, a daemon talking to the kernel through nix and libc, Bluetooth RFCOMM through BlueZ.',
    projects: ['adg', 'ghostshell', 'tunedeck'] },
  { id: 'cloud', label: 'Cloud', category: 'sys-sec', x: 55, y: 64, icon: <LucideIcon Icon={Cloud} />,
    note: 'Azure provisioned with Terraform for CloudPulse, then torn down to stop the bill. AWS incidents rebuilt from CloudTrail and STS sessions in KlaudTrace.',
    projects: ['cloudpulse', 'klaudtrace'] },
  { id: 'docker', label: 'Docker', category: 'sys-sec', x: 65, y: 48, icon: <BrandIcon slug="docker" title="Docker" />,
    note: "Containerised services: AKIRA's API and CloudPulse's detection worker on Azure Container Apps.",
    projects: ['akira', 'cloudpulse'] },
  { id: 'network', label: 'Networking', category: 'sys-sec', x: 86, y: 46, icon: <LucideIcon Icon={Network} />,
    note: 'OpenFlow rules on Open vSwitch over Mininet topologies, and a vendor Bluetooth protocol worked out from the wire.',
    projects: ['adg', 'tunedeck'] },
  { id: 'osint', label: 'OSINT', category: 'sys-sec', x: 75, y: 62, icon: <ImgIcon src={osintImg} alt="OSINT" invert />,
    note: 'Open-source intelligence gathering.', projects: [] },
  { id: 'wireshark', label: 'Wireshark', category: 'sys-sec', x: 90, y: 66, icon: <ImgIcon src={wiresharkImg} alt="Wireshark" />,
    note: 'Deep packet inspection.', projects: [] },
  { id: 'ghidra', label: 'Ghidra / RE', category: 'sys-sec', x: 80, y: 80, icon: <ImgIcon src={ghidraImg} alt="Ghidra" />,
    note: 'Reverse engineering and SRE.', projects: [] },

  // Web & apps
  { id: 'react', label: 'React', category: 'web', x: 15, y: 38, icon: <BrandIcon slug="react" title="React" />,
    note: 'Most of my interfaces, including this site. Learned to keep re-renders out of animation paths.',
    projects: ['akira', 'novasketch', 'continuelater', 'cloudpulse'] },
  { id: 'node', label: 'Node.js', category: 'web', x: 35, y: 36, icon: <BrandIcon slug="nodejs" title="Node.js" />,
    note: 'Express APIs hardened with helmet, rate limits, argon2 or bcrypt and JWT; Redis-backed presence for NovaSketch.',
    projects: ['akira', 'novasketch'] },
  { id: 'websockets', label: 'WebSockets', category: 'web', x: 25, y: 48, icon: <LucideIcon Icon={Waypoints} />,
    note: 'Live collaboration with Yjs CRDTs over y-websocket, so two people editing at once merge instead of overwrite.',
    projects: ['novasketch'] },
  { id: 'tail', label: 'Tailwind', category: 'web', x: 9, y: 52, icon: <BrandIcon slug="tailwind" title="Tailwind" />,
    note: 'Default styling for what I ship, including this site.',
    projects: ['akira', 'novasketch', 'everust'] },
  { id: 'flutter', label: 'Flutter', category: 'web', x: 14, y: 64, icon: <BrandIcon slug="flutter" title="Flutter" />,
    note: 'Riverpod state, an on-device Isar database, and Android MethodChannels for focus modes and home-screen widgets.',
    projects: ['kairo'] },

  // Data
  { id: 'matplotlib', label: 'Matplotlib', category: 'data', x: 45, y: 80, icon: <ImgIcon src={matplotlibImg} alt="Matplotlib" />,
    note: 'Era-by-era charts for the F1 regulation study.',
    projects: ['f1'] },
  { id: 'plotly', label: 'Plotly', category: 'data', x: 35, y: 66, icon: <BrandIcon slug="plotly" title="Plotly" provider="simple" />,
    note: 'Interactive graphing.', projects: [] },
  { id: 'tableau', label: 'Tableau', category: 'data', x: 24, y: 76, icon: <ImgIcon src={tableauImg} alt="Tableau" />,
    note: 'Business intelligence dashboards.', projects: [] },
];

const NODES_BY_ID = Object.fromEntries(TECH_NODES.map((n) => [n.id, n]));

const CONNECTIONS = [
  ['java', 'rust'], ['java', 'python'], ['rust', 'c'], ['python', 'js'], ['js', 'ts'], ['c', 'go'],
  ['rust', 'ebpf'], ['ebpf', 'linux'], ['c', 'linux'], ['go', 'linux'], ['linux', 'docker'], ['linux', 'network'],
  ['docker', 'cloud'], ['go', 'cloud'], ['network', 'osint'], ['network', 'wireshark'], ['linux', 'ghidra'], ['osint', 'wireshark'],
  ['js', 'node'], ['ts', 'react'], ['node', 'websockets'], ['react', 'websockets'], ['react', 'tail'], ['tail', 'flutter'],
  ['python', 'plotly'], ['python', 'matplotlib'], ['plotly', 'tableau'], ['matplotlib', 'plotly'],
];

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'lang', label: 'LANGUAGES' },
  { id: 'sys-sec', label: 'SYSTEMS & SECURITY' },
  { id: 'web', label: 'WEB & APPS' },
  { id: 'data', label: 'DATA' },
];

// Scroll to a project card and pulse its border so the eye lands on it.
const useJumpToProject = (lenis) =>
  useCallback((slug) => {
    const card = document.getElementById(`project-${slug}`);
    if (!card) return;
    const flash = () => {
      card.classList.remove('project-card-flash');
      void card.offsetWidth; // restart the animation if it's already running
      card.classList.add('project-card-flash');
    };
    if (lenis) {
      lenis.scrollTo(card, { offset: -96, duration: 1.2, onComplete: flash });
    } else {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(flash, 600);
    }
  }, [lenis]);

// ── "Used in" list ────────────────────────────────────────────
const UsedIn = ({ slugs, onJump, compact = false }) => {
  if (!slugs.length) {
    return <p className="font-mono text-[12px] text-white/35">No public project yet.</p>;
  }
  return (
    <ul className={compact ? 'flex flex-wrap gap-1.5' : 'space-y-1.5'}>
      {slugs.map((slug) => {
        const project = PROJECTS_BY_SLUG[slug];
        if (!project) return null;
        return (
          <li key={slug} className={compact ? '' : 'flex items-center gap-2'}>
            <button
              type="button"
              onClick={() => onJump(slug)}
              className={
                compact
                  ? 'rounded-md border border-white/10 px-2 py-1 font-mono text-[12px] text-white/75 transition-colors hover:border-[#FFD700]/40 hover:text-[#FFD700]'
                  : 'flex-1 truncate rounded-md px-2 py-1.5 -mx-2 text-left font-mono text-[13px] text-white/80 transition-colors hover:bg-white/[0.04] hover:text-[#FFD700]'
              }
            >
              {project.title}
            </button>
            {!compact && project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} on GitHub`}
                className="shrink-0 p-1 text-white/35 transition-colors hover:text-[#FFD700]"
              >
                <ArrowUpRight size={14} />
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
};

// ── Detail panel (desktop) ────────────────────────────────────
const DetailPanel = ({ node, pinned, onJump, onUnpin }) => (
  <aside className="relative flex min-h-[320px] flex-col rounded-2xl border border-white/[0.07] bg-[#0B0B10] p-6" aria-live="polite">
    <AnimatePresence mode="wait" initial={false}>
      {node ? (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="flex flex-1 flex-col"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#FFD700]/70">
              {CATEGORIES.find((c) => c.id === node.category)?.label}
            </span>
            {pinned && (
              <button type="button" onClick={onUnpin} className="font-mono text-[12px] text-white/40 transition-colors hover:text-white">
                unpin · esc
              </button>
            )}
          </div>

          <h3 className="mb-4 flex items-center gap-3 font-body-ui text-2xl font-bold text-[#F0EDE8] [&_img]:h-8 [&_img]:w-8 [&_svg]:h-8 [&_svg]:w-8">
            {node.icon} {node.label}
          </h3>

          <p className="mb-6 border-l-2 border-[#FFD700]/40 pl-3 font-body-ui text-[14px] leading-relaxed text-[#B4B4C6]">
            {node.note}
          </p>

          <div className="mt-auto">
            <div className="mb-2 font-mono text-[12px] uppercase tracking-[0.2em] text-white/40">
              Used in{node.projects.length > 0 && ` · ${node.projects.length}`}
            </div>
            <UsedIn slugs={node.projects} onJump={onJump} />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-1 flex-col justify-center"
        >
          <p className="font-body-ui text-[15px] leading-relaxed text-[#B4B4C6]">
            Hover a node to see what I&apos;ve built with it.
          </p>
          <p className="mt-2 font-mono text-[12px] text-white/40">click to pin · links jump to the project</p>
        </motion.div>
      )}
    </AnimatePresence>
  </aside>
);

// ── Section ───────────────────────────────────────────────────
const Arsenal = ({ lenis }) => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedId, setPinnedId] = useState(null);
  const [scanComplete, setScanComplete] = useState(false);
  const jumpToProject = useJumpToProject(lenis);

  const isNodeActive = (node) => activeCategory === 'all' || node.category === activeCategory;
  const shownNode = NODES_BY_ID[hoveredId] ?? NODES_BY_ID[pinnedId] ?? null;
  const linkedCount = TECH_NODES.filter((n) => n.projects.length > 0).length;

  // Esc releases a pinned node.
  useEffect(() => {
    if (!pinnedId) return;
    const onKey = (e) => e.key === 'Escape' && setPinnedId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinnedId]);

  const selectCategory = (id) => {
    setActiveCategory(id);
    if (pinnedId && id !== 'all' && NODES_BY_ID[pinnedId].category !== id) setPinnedId(null);
  };

  return (
    <section id="arsenal" className="relative w-full md:min-h-[120vh] md:pl-16 bg-[#030305] text-white overflow-hidden font-mono">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-20 h-full flex flex-col">
        <div className="mb-8 md:mb-12">
          <SectionHeader
            eyebrow="TECH ARSENAL"
            status={`${linkedCount} / ${TECH_NODES.length} BACKED BY CODE`}
            statusClassName={scanComplete || isMobile ? 'text-emerald-400 font-bold' : 'text-[#FFD700]'}
            title="Tech Arsenal"
            description="Every tool links to the projects where I actually used it."
          />

          <div className="snap-rail md:flex-wrap gap-2 mt-6 md:mt-8 -mx-5 px-5 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`shrink-0 px-3.5 md:px-4 py-2 text-[12px] tracking-wider border transition-colors duration-200 ${
                  activeCategory === cat.id
                    ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/10'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* MOBILE: cards */}
        {isMobile && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {TECH_NODES.filter(isNodeActive).map((node) => (
              <div key={node.id} className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center text-gray-400 [&_img]:w-6 [&_img]:h-6 [&_svg]:w-6 [&_svg]:h-6">
                    {node.icon}
                  </div>
                  <span className="text-[14px] font-bold text-white leading-tight">{node.label}</span>
                </div>
                <p className="text-[13px] leading-snug text-gray-400 font-body-ui">{node.note}</p>
                <UsedIn slugs={node.projects} onJump={jumpToProject} compact />
              </div>
            ))}
          </div>
        )}

        {/* DESKTOP: constellation + detail column */}
        {!isMobile && (
          <div className="grid flex-1 grid-cols-[1fr_320px] gap-5">
            <div
              className="relative min-h-[760px] border border-white/5 rounded-3xl bg-black/40 overflow-hidden"
              onClick={(e) => e.target === e.currentTarget && setPinnedId(null)}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                whileInView={{ scale: 3.2, opacity: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                onAnimationComplete={() => setScanComplete(true)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-[#FFD700]/40 pointer-events-none z-0"
                style={{
                  boxShadow: '0 0 60px rgba(255,215,0,0.2), inset 0 0 40px rgba(168,85,247,0.15)',
                  background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)',
                }}
              />

              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {CONNECTIONS.map(([startId, endId], i) => {
                  const a = NODES_BY_ID[startId];
                  const b = NODES_BY_ID[endId];
                  if (!a || !b || !isNodeActive(a) || !isNodeActive(b)) return null;
                  const lit = shownNode && (shownNode.id === startId || shownNode.id === endId);
                  return (
                    <motion.line
                      key={i}
                      x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: lit ? 0.9 : 0.12 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4 + i * 0.03, ease: 'easeOut' }}
                      stroke={lit ? '#FFD700' : '#ffffff'}
                      strokeWidth={lit ? 1.75 : 0.6}
                      strokeDasharray={lit ? '6 10' : undefined}
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 z-10 pointer-events-none">
                {TECH_NODES.map((node) => {
                  const active = isNodeActive(node);
                  const isShown = shownNode?.id === node.id;
                  const isPinned = pinnedId === node.id;
                  const entranceDelay = 0.2 + (Math.hypot(node.x - 50, node.y - 50) / 50) * 0.5;

                  return (
                    <motion.button
                      type="button"
                      key={node.id}
                      aria-label={`${node.label}${node.projects.length ? `, used in ${node.projects.length} projects` : ''}`}
                      aria-pressed={isPinned}
                      className={`group absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto ${
                        active ? '' : 'opacity-10 grayscale pointer-events-none'
                      }`}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ delay: entranceDelay, type: 'spring', damping: 16, stiffness: 120 }}
                      onMouseEnter={() => setHoveredId(node.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(node.id)}
                      onBlur={() => setHoveredId(null)}
                      onClick={() => setPinnedId((id) => (id === node.id ? null : node.id))}
                    >
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-[#050505] border transition-[border-color,box-shadow,transform] duration-200 ${
                            isPinned
                              ? 'border-[#FFD700] shadow-[0_0_0_3px_rgba(255,215,0,0.15)] scale-110'
                              : isShown
                                ? 'border-[#FFD700]/70 scale-110'
                                : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          {node.icon}
                          {node.projects.length > 0 && (
                            <span className="absolute -bottom-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#0B0B10] border border-[#FFD700]/40 font-mono text-[11px] leading-[18px] text-[#FFD700]">
                              {node.projects.length}
                            </span>
                          )}
                        </div>
                        <div
                          className={`absolute top-full mt-3 whitespace-nowrap text-[12px] tracking-widest transition-opacity duration-200 bg-black/80 px-2 py-1 rounded border border-white/10 text-[#FFD700] ${
                            isShown ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          {node.label}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="sticky top-24 self-start">
              <DetailPanel
                node={shownNode}
                pinned={Boolean(pinnedId) && shownNode?.id === pinnedId}
                onJump={jumpToProject}
                onUnpin={() => setPinnedId(null)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Arsenal;
