import React, { useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { halfTransform } from './slashGeometry';

export const SLASH_TRAVEL = 0.13; // blade crosses the viewport in 130ms

const SVG_NS = 'http://www.w3.org/2000/svg';

// Point on the blade's quadratic arc at t ∈ [0, 1].
const arcPoint = (geo, bow, t) => {
    const mx = geo.cx + geo.nx * bow, my = geo.cy + geo.ny * bow;
    const u = 1 - t;
    return [
        u * u * geo.x0 + 2 * u * t * mx + t * t * geo.x1,
        u * u * geo.y0 + 2 * u * t * my + t * t * geo.y1,
    ];
};

// Closed crescent hugging the arc — thick in the middle, razor at the ends.
const crescentPath = (geo, bow, thickness) => {
    const N = 48, outer = [], inner = [];
    for (let i = 0; i <= N; i++) {
        const t = i / N;
        const [x, y] = arcPoint(geo, bow, t);
        const th = thickness * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.85)), 0.7);
        outer.push(`${(x + geo.nx * th).toFixed(1)},${(y + geo.ny * th).toFixed(1)}`);
        inner.push(`${(x - geo.nx * th * 0.25).toFixed(1)},${(y - geo.ny * th * 0.25).toFixed(1)}`);
    }
    return `M${outer.join('L')}L${inner.reverse().join('L')}Z`;
};

// Portion of the cut line (as distance s from centre) inside the viewport.
const visibleSpan = (geo) => {
    let min = Infinity, max = -Infinity;
    for (let s = -geo.L; s <= geo.L; s += 8) {
        const x = geo.cx + geo.dx * s, y = geo.cy + geo.dy * s;
        if (x >= 0 && x <= geo.w && y >= 0 && y <= geo.h) { min = Math.min(min, s); max = Math.max(max, s); }
    }
    return min <= max ? [min, max] : [-geo.L / 2, geo.L / 2];
};

const makePath = (d, className) => {
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('class', className);
    p.setAttribute('pathLength', '1');
    return p;
};

const SlashEffect = ({ ref, isMobile, onTip }) => {
    const svgRef    = useRef(null);
    const maskRef   = useRef(null);
    const layerRefs = useRef([]);
    const tipRef    = useRef(null);
    const crackRef  = useRef(null);
    const sideARef  = useRef(null);
    const sideBRef  = useRef(null);
    const flashRef  = useRef(null);
    const tintRef   = useRef(null);
    const geoRef    = useRef(null);

    useImperativeHandle(ref, () => ({
        play(geo) {
            geoRef.current = geo;
            const svg = svgRef.current;
            const bow = geo.L * 0.03;
            svg.setAttribute('viewBox', `0 0 ${geo.w} ${geo.h}`);

            // Blade layers: wide crimson aura → hot red body → white edge.
            [36, 11, 2.6].forEach((th, i) => layerRefs.current[i].setAttribute('d', crescentPath(geo, bow, th)));
            const [mx, my] = [geo.cx + geo.nx * bow, geo.cy + geo.ny * bow];
            maskRef.current.setAttribute('d', `M${geo.x0},${geo.y0}Q${mx},${my} ${geo.x1},${geo.y1}`);

            // Fracture: jagged seam along the cut + branching cracks per side.
            const [s0, s1] = visibleSpan(geo);
            const seam = [];
            for (let s = s0 - 30, k = 0; s <= s1 + 30; s += 24, k++) {
                const j = (k % 2 ? 1 : -1) * (0.6 + Math.random() * 1.4);
                seam.push(`${(geo.cx + geo.dx * s + geo.nx * j).toFixed(1)},${(geo.cy + geo.dy * s + geo.ny * j).toFixed(1)}`);
            }
            const seamD = `M${seam.join('L')}`;
            crackRef.current.replaceChildren(makePath(seamD, 'pl-seam-glow'), makePath(seamD, 'pl-seam'));

            const branches = { 1: [], [-1]: [] };
            const count = isMobile ? 7 : 14;
            for (let i = 0; i < count; i++) {
                const side = i % 2 ? 1 : -1;
                const s = s0 + Math.random() * (s1 - s0);
                let x = geo.cx + geo.dx * s, y = geo.cy + geo.dy * s;
                const along = Math.random() < 0.5 ? 1 : -1;
                let a = (0.45 + Math.random() * 0.75);
                const len = 18 + Math.random() * (isMobile ? 45 : 75);
                const pts = [`${x.toFixed(1)},${y.toFixed(1)}`];
                for (let k = 0; k < 3; k++) {
                    a += (Math.random() - 0.5) * 0.5;
                    const seg = len / 3;
                    x += (geo.dx * Math.cos(a) * along + geo.nx * Math.sin(a) * side) * seg;
                    y += (geo.dy * Math.cos(a) * along + geo.ny * Math.sin(a) * side) * seg;
                    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
                }
                branches[side].push(makePath(`M${pts.join('L')}`, 'pl-crack'));
            }
            sideARef.current.replaceChildren(...branches[1]);
            sideBRef.current.replaceChildren(...branches[-1]);
            this.syncSplit(0);

            const cracks = svg.querySelectorAll('.pl-seam, .pl-seam-glow, .pl-crack');
            const tip = tipRef.current;
            const blade = { p: 0 };

            return gsap.timeline()
                .set(svg, { autoAlpha: 1 })
                .set(tip, { opacity: 1 })
                .fromTo(blade, { p: 0 }, {
                    p: 1,
                    duration: SLASH_TRAVEL,
                    ease: 'power3.in',
                    onUpdate: () => {
                        maskRef.current.style.strokeDashoffset = 1 - blade.p;
                        const [x, y] = arcPoint(geo, bow, blade.p);
                        tip.setAttribute('cx', x.toFixed(1));
                        tip.setAttribute('cy', y.toFixed(1));
                        onTip?.(x, y, geo);
                    },
                }, 0)
                .to(tip, { opacity: 0, duration: 0.1, ease: 'power1.out' }, SLASH_TRAVEL)
                // Trail retracts tail-first into the exit point.
                .to(blade, {
                    p: 2,
                    duration: 0.34,
                    ease: 'power2.in',
                    onUpdate: () => { maskRef.current.style.strokeDashoffset = 1 - blade.p; },
                }, SLASH_TRAVEL + 0.03)
                .fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.92, duration: 0.035, ease: 'none' }, SLASH_TRAVEL - 0.015)
                .to(flashRef.current, { opacity: 0, duration: 0.32, ease: 'power2.out' })
                .fromTo(tintRef.current, { opacity: 0 }, { opacity: 0.4, duration: 0.05, ease: 'none' }, SLASH_TRAVEL)
                .to(tintRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' })
                .fromTo(cracks, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.2, stagger: 0.01, ease: 'power2.out' }, SLASH_TRAVEL)
                .to(crackRef.current.parentNode, { opacity: 0, duration: 0.3, ease: 'power1.in' }, SLASH_TRAVEL + 0.25);
        },

        // Keep branch cracks glued to the separating halves.
        syncSplit(p) {
            const geo = geoRef.current;
            if (!geo) return;
            [[sideARef, 1], [sideBRef, -1]].forEach(([r, side]) => {
                const { tx, ty, rot } = halfTransform(geo, side, p);
                r.current?.setAttribute(
                    'transform',
                    `translate(${(geo.cx + tx).toFixed(2)} ${(geo.cy + ty).toFixed(2)}) rotate(${(rot * 180 / Math.PI).toFixed(3)}) translate(${-geo.cx} ${-geo.cy})`
                );
            });
        },
    }), [isMobile, onTip]);

    return (
        <>
            <svg ref={svgRef} className="pl-slash" aria-hidden="true" preserveAspectRatio="none">
                <defs>
                    <radialGradient id="pl-tip-grad">
                        <stop offset="0%"   stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="35%"  stopColor="#ffd6d6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ff1f3d" stopOpacity="0" />
                    </radialGradient>
                    <mask id="pl-blade-mask" maskUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
                        <path ref={maskRef} className="pl-blade-reveal" pathLength="1" />
                    </mask>
                </defs>
                <g className="pl-fracture">
                    <g ref={sideARef} />
                    <g ref={sideBRef} />
                    <g ref={crackRef} />
                </g>
                <g mask="url(#pl-blade-mask)">
                    <path ref={(el) => { layerRefs.current[0] = el; }} className="pl-blade-aura" />
                    <path ref={(el) => { layerRefs.current[1] = el; }} className="pl-blade-body" />
                    <path ref={(el) => { layerRefs.current[2] = el; }} className="pl-blade-edge" />
                </g>
                <circle ref={tipRef} className="pl-blade-tip" r="34" fill="url(#pl-tip-grad)" />
            </svg>
            <div ref={tintRef}  className="pl-tint"  aria-hidden="true" />
            <div ref={flashRef} className="pl-flash" aria-hidden="true" />
        </>
    );
};

export default SlashEffect;
