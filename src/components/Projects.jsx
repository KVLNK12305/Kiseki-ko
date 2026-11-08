import React, { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import SectionHeader from './SectionHeader';
import akiraVideo from './images/Screencast_20260331_001952.webm';
import f1Video from './images/F1.mp4';

// `contributors` are GitHub logins, ordered by commit count. Hard-coded
// (from the repos' contributor lists) so the page makes no API calls.
// `issue` is the one joke per card: a dry "known issue" line, styled like
// a code comment. Static text, so it costs nothing to render.
const projects = [
    {
        id: '01',
        title: 'ADG-Polymorph',
        description: 'Security-aware SDN deception framework with kernel-level eBPF/XDP networking. Reduces detection latency to sub-μs using entropy anomaly detection.',
        tags: ['Rust (Aya)', 'eBPF/XDP', 'Open vSwitch', 'Mininet'],
        link: null,
        issue: 'attackers keep falling for it.',
    },
    {
        id: '02',
        title: 'GhostShell',
        description: 'Rust TUI combining a decoy terminal with a hidden real-time observability dashboard. Async telemetry pipeline streaming structured logs.',
        tags: ['Rust', 'Tokio', 'LLM APIs', 'TUI'],
        link: 'https://github.com/KVLNK12305/GhostShell',
        contributors: ['KVLNK12305'],
        issue: 'the fake shell is friendlier than the real one.',
    },
    {
        id: '03',
        title: 'EeffoC',
        description: 'Event-driven task orchestration capturing real-time Discord events. Extracts intent and routes payloads through Microsoft Graph.',
        tags: ['Go', 'n8n', 'MS Graph', 'Automation'],
        link: 'https://github.com/KVLNK12305/EeffoC',
        contributors: ['KVLNK12305'],
        issue: 'coffee, backwards. so is my sleep schedule.',
    },
    {
        id: '04',
        title: 'Everust',
        description: 'Modular platform for experimenting with async execution and ownership. Benchmarks system behaviour across concurrency models.',
        tags: ['Rust', 'Axum', 'Tokio', 'Async'],
        link: 'https://github.com/KVLNK12305/Everust',
        contributors: ['KVLNK12305'],
        issue: 'the borrow checker won most arguments.',
    },
    {
        id: '05',
        title: 'AKIRA',
        description: 'High-throughput API gateway and cryptographic identity provider. A Rust key vault, called through Bun FFI, keeps auth logs tamper-evident.',
        tags: ['Bun', 'Express', 'React', 'Rust Crypto'],
        link: 'https://github.com/KVLNK12305/Akira',
        contributors: ['KVLNK12305'],
        video: akiraVideo,
        issue: 'none reported. that is what worries me.',
    },
    {
        id: '06',
        title: 'NovaSketch',
        description: 'Real-time collaborative whiteboard over WebSockets. Fine-grained access control prevents concurrent edit conflicts.',
        tags: ['React', 'WebSockets', 'MongoDB', 'OAuth'],
        link: 'https://github.com/Ateliers-io/NovaSketch',
        contributors: ['KVLNK12305', 'ksskarthik18', 'NarainBK', 'gjyoshitha26', 'LavishkaDhamija'],
        issue: 'two people still cannot agree on a line. by design.',
    },
    {
        id: '07',
        title: 'F1 Evolution',
        description: 'Data analysis of how Formula 1 regulations changed each era: performance dynamics, lap-time deviation and team dominance.',
        tags: ['Pandas', 'Seaborn', 'Plotly'],
        link: 'https://github.com/KVLNK12305/F1_Case_Study',
        contributors: ['KVLNK12305'],
        video: f1Video,
        issue: 'no dataset explains Ferrari strategy.',
    },
];

// The video element is only created after a click, so nothing is
// downloaded or decoded until someone actually asks to watch.
const DemoVideo = ({ src, title }) => {
    const [playing, setPlaying] = useState(false);

    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#07070B]">
            {playing ? (
                <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="group/play absolute inset-0 flex items-center justify-center gap-3 font-mono text-[13px] text-white/70 transition-colors hover:text-[#FFD700]"
                    aria-label={`Play ${title} demo`}
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors group-hover/play:border-[#FFD700]/60">
                        <Play size={16} className="ml-0.5" />
                    </span>
                    play demo
                </button>
            )}
        </div>
    );
};

// Overlapping avatar stack. Plain lazy <img>s at a fixed 28px, so
// they never shift layout and only load when the card is near view.
const Contributors = ({ logins }) => (
    <div className="flex items-center gap-2.5">
        <div className="flex -space-x-2">
            {logins.map((login) => (
                <a
                    key={login}
                    href={`https://github.com/${login}`}
                    target="_blank"
                    rel="noreferrer"
                    title={login}
                    className="relative rounded-full ring-2 ring-[#0B0B10] transition-transform duration-150 hover:z-10 hover:-translate-y-0.5"
                >
                    <img
                        src={`https://github.com/${login}.png?size=56`}
                        alt={login}
                        width={28}
                        height={28}
                        loading="lazy"
                        decoding="async"
                        className="h-7 w-7 rounded-full bg-white/10"
                    />
                </a>
            ))}
        </div>
        <span className="font-mono text-[12px] text-white/40">
            {logins.length === 1 ? 'solo' : `${logins.length} contributors`}
        </span>
    </div>
);

const ProjectCard = ({ project }) => (
    <article
        className={`group flex flex-col rounded-xl border border-white/[0.07] bg-[#0B0B10] p-6 transition-colors duration-200 hover:border-[#FFD700]/30 ${
            project.video ? 'lg:col-span-2' : ''
        }`}
    >
        <div className="mb-4 flex items-baseline justify-between gap-4">
            <h3 className="font-body-ui text-2xl font-bold tracking-tight text-[#F0EDE8]">
                {project.title}
            </h3>
            <span className="font-mono text-[13px] text-white/30">{project.id}</span>
        </div>

        {project.video && (
            <div className="mb-5">
                <DemoVideo src={project.video} title={project.title} />
            </div>
        )}

        <p className="mb-5 text-[15px] leading-relaxed text-[#B4B4C6]">{project.description}</p>

        <ul className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
                <li
                    key={tag}
                    className="rounded-md border border-white/10 px-2.5 py-1 font-mono text-[12px] text-white/70"
                >
                    {tag}
                </li>
            ))}
        </ul>

        {project.contributors && (
            <div className="mb-5">
                <Contributors logins={project.contributors} />
            </div>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-white/[0.06] pt-4">
            <p className="font-mono text-[13px] text-white/45">
                <span className="text-[#FFD700]/70">// known issue:</span> {project.issue}
                <span className="project-caret" aria-hidden="true" />
            </p>

            {project.link ? (
                <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[13px] text-white/75 transition-colors hover:text-[#FFD700]"
                >
                    source <ArrowUpRight size={14} />
                </a>
            ) : (
                <span className="font-mono text-[13px] text-white/35">private repo</span>
            )}
        </div>
    </article>
);

const Projects = () => (
    <section id="projects" className="relative bg-[#030305] px-5 py-16 sm:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
            <SectionHeader
                eyebrow="PROJECTS"
                status={`${projects.length} BUILDS`}
                title="Things I built"
                description="…and then tried to break. Each one ships with its known issues listed."
                className="mb-10 md:mb-14"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    </section>
);

export default Projects;
