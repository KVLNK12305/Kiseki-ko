import React, { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { PROJECTS } from '../data/projects';

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
                        onError={(e) => {
                            e.currentTarget.style.visibility = 'hidden';
                        }}
                    />
                </a>
            ))}
        </div>
        <span className="font-mono text-[12px] text-white/40">
            {logins.length === 1 ? 'solo' : `${logins.length} contributors`}
        </span>
    </div>
);

const ProjectCard = ({ project, number }) => (
    <article
        id={`project-${project.slug}`}
        className={`project-card-target group flex scroll-mt-24 flex-col rounded-xl border border-white/[0.07] bg-[#0B0B10] p-6 transition-colors duration-200 hover:border-[#FFD700]/30 ${
            project.video || project.featured ? 'lg:col-span-2' : ''
        }`}
    >
        <div className="mb-4 flex items-baseline justify-between gap-4">
            <h3 className="font-body-ui text-2xl font-bold tracking-tight text-[#F0EDE8]">
                {project.title}
            </h3>
            <span className="font-mono text-[13px] text-white/30">{number}</span>
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

            {project.repo ? (
                <a
                    href={project.repo}
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
                status={`${PROJECTS.length} BUILDS`}
                title="Things I built"
                description="…and then tried to break. Each one ships with its known issues listed."
                className="mb-10 md:mb-14"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {PROJECTS.map((project, i) => (
                    <ProjectCard key={project.slug} project={project} number={String(i + 1).padStart(2, '0')} />
                ))}
            </div>
        </div>
    </section>
);

export default Projects;
