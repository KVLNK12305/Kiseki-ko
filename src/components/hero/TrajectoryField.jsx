import React, { forwardRef } from 'react';

// ── Trajectory field (軌跡) ────────────────────────────────────
// Faint orbits around the portrait. Replaces the old diagonal
// "contour" stubs, which were 940-unit paths drawn with a 500-unit dash
// (so half of every line was a gap) inside a box clipped at the header
// and footer and mostly hidden behind the portrait.
//
// - viewBox + `slice` fills any aspect ratio; the orbit centre is placed
//   at the portrait's position on a 16:10 desktop layout.
// - A radial mask fades every orbit out long before it reaches an edge,
//   so nothing ever ends in a hard line; a second, horizontal mask keeps
//   them out from under the headline and body copy.
// - Each orbit uses pathLength="1", so the draw-in (stroke-dashoffset
//   1 → 0, run by the parent once the intro is done) is independent of
//   the real path length. After drawing it is static: no per-frame work.
const CX = 944;
const CY = 500;
const TILT = -14;
const ORBITS = [
    { rx: 330, ry: 128, opacity: 0.55 },
    { rx: 500, ry: 200, opacity: 0.42 },
    { rx: 690, ry: 285, opacity: 0.3 },
    { rx: 900, ry: 380, opacity: 0.2 },
    { rx: 1140, ry: 480, opacity: 0.13 },
];
// Small "bodies" sitting on two of the orbits (orbit index, angle in deg).
const BODIES = [
    { orbit: 1, angle: 208 },
    { orbit: 3, angle: 332 },
];

const TrajectoryField = forwardRef(({ overdrive }, ref) => {
    const stroke = overdrive ? '#EF4444' : '#FFD700';

    return (
        <svg
            ref={ref}
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 1600 1000"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="trajectory-fade" cx={CX / 1600} cy={CY / 1000} r="0.62">
                    <stop offset="0.25" stopColor="#fff" stopOpacity="1" />
                    <stop offset="0.75" stopColor="#fff" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                <mask id="trajectory-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000">
                    <rect width="1600" height="1000" fill="url(#trajectory-fade)" />
                </mask>
                {/* Keeps orbits out from under the headline/body copy column. */}
                <linearGradient id="trajectory-copy-fade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0.22" stopColor="#fff" stopOpacity="0.08" />
                    <stop offset="0.42" stopColor="#fff" stopOpacity="0.35" />
                    <stop offset="0.52" stopColor="#fff" stopOpacity="1" />
                </linearGradient>
                <mask id="trajectory-copy-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000">
                    <rect width="1600" height="1000" fill="url(#trajectory-copy-fade)" />
                </mask>
            </defs>

            <g mask="url(#trajectory-mask)">
                <g mask="url(#trajectory-copy-mask)">
                    <g transform={`rotate(${TILT} ${CX} ${CY})`} className="transition-[stroke] duration-700" stroke={stroke}>
                        {ORBITS.map(({ rx, ry, opacity }) => (
                            <ellipse
                                key={rx}
                                className="trajectory-orbit"
                                cx={CX}
                                cy={CY}
                                rx={rx}
                                ry={ry}
                                pathLength="1"
                                strokeDasharray="1"
                                strokeDashoffset="1"
                                strokeOpacity={opacity}
                                strokeWidth="1"
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}
                        {BODIES.map(({ orbit, angle }) => {
                            const { rx, ry } = ORBITS[orbit];
                            const t = (angle * Math.PI) / 180;
                            return (
                                <circle
                                    key={`${orbit}-${angle}`}
                                    className="trajectory-body"
                                    cx={CX + rx * Math.cos(t)}
                                    cy={CY + ry * Math.sin(t)}
                                    r="3.5"
                                    fill={stroke}
                                    stroke="none"
                                    opacity="0"
                                />
                            );
                        })}
                    </g>
                </g>
            </g>
        </svg>
    );
});

TrajectoryField.displayName = 'TrajectoryField';

export default TrajectoryField;
