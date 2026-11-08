import React, { useEffect, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { halfPolygon, halfTransform, signedDistance } from './slashGeometry';

// ── Burn band thresholds (in normalised burn-field units) ──────
const B_FADE = 0.018;  // afterglow just past the front, fading onto the revealed page
const B_GLOW = 0.035;  // white-hot → orange rim where the sheet is being consumed
const B_CHAR = 0.10;   // crimson → charred-black heat that precedes the rim

const BACKDROP = '#030305';

// ── Value noise (fbm) — computed once per ignition on a coarse grid
const hash = (x, y) => {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const smooth = (t) => t * t * (3 - 2 * t);
const valueNoise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const u = smooth(x - xi), v = smooth(y - yi);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x, y) => {
    let sum = 0, amp = 0.5, f = 1;
    for (let o = 0; o < 4; o++) { sum += valueNoise(x * f, y * f) * amp; f *= 2.03; amp *= 0.5; }
    return sum / 0.9375;
};

// Soft round glow sprite — replaces shadowBlur / CSS filters for particles.
const makeSprite = (r, g, b) => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d');
    const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(255,255,255,1)`);
    grad.addColorStop(0.18, `rgba(${r},${g},${b},0.9)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = grad;
    x.fillRect(0, 0, 64, 64);
    return c;
};

// Paint the intro backdrop exactly as the DOM draws it (see .pl-backdrop).
const paintBackdrop = (ctx, w, h) => {
    ctx.fillStyle = BACKDROP;
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h * 0.46, 0, w / 2, h * 0.46, Math.max(w, h) * 0.6);
    g.addColorStop(0, 'rgba(70,8,22,0.35)');
    g.addColorStop(0.45, 'rgba(24,6,30,0.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
};

// Re-draw a DOM text node onto the sheet so the words burn with the paper.
const paintText = (ctx, el, stopAt) => {
    const text = el.textContent;
    if (!text) return;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    let alpha = 1;
    for (let n = el; n && n !== stopAt; n = n.parentElement) alpha *= parseFloat(getComputedStyle(n).opacity) || 0;
    if (alpha <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.fillStyle = cs.color;
    ctx.textBaseline = 'middle';
    const ls = parseFloat(cs.letterSpacing) || 0;
    const widths = [...text].map((ch) => ctx.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + ls * widths.length;
    let x = r.left + (r.width - total) / 2;
    const y = r.top + r.height / 2;
    [...text].forEach((ch, i) => { ctx.fillText(ch, x, y); x += widths[i] + ls; });
    ctx.restore();
};

function createBurnEngine(canvas, { isMobile, splitRef }) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
    const sprites = {
        hot:    makeSprite(255, 190, 120),
        ember:  makeSprite(255, 96, 24),
        crimson: makeSprite(230, 20, 50),
        gold:   makeSprite(255, 215, 0),
        violet: makeSprite(168, 85, 247),
    };
    const MAX = isMobile ? 160 : 360;
    const particles = [];
    const motes = [];
    const fx = { moteAlpha: 1, t: -1 };
    let w = 0, h = 0, veil = null, time = 0;

    const resize = () => {
        if (veil) return; // geometry is frozen once the sheet is cut
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        motes.length = 0;
        const n = isMobile ? 18 : 42;
        for (let i = 0; i < n; i++) {
            motes.push({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 6, vy: -4 - Math.random() * 8,
                s: 3 + Math.random() * 5, ph: Math.random() * 6.28,
                sprite: Math.random() < 0.55 ? sprites.violet : sprites.gold,
            });
        }
    };
    resize();

    const add = (p) => { if (particles.length < MAX) particles.push(p); };

    // ── Ignition: photograph the intro into a sheet + build burn field
    const ignite = (geo, uiRoot) => {
        const sheet = document.createElement('canvas');
        sheet.width = canvas.width;
        sheet.height = canvas.height;
        const sctx = sheet.getContext('2d');
        if (!sctx) return false;
        sctx.scale(dpr, dpr);
        paintBackdrop(sctx, w, h);
        uiRoot?.querySelectorAll('[data-burn-text]').forEach((el) => paintText(sctx, el, uiRoot.parentElement));

        // Residual energy where the core was split.
        const g = sctx.createRadialGradient(geo.cx, geo.cy, 0, geo.cx, geo.cy, 70);
        g.addColorStop(0, 'rgba(255,90,60,0.55)');
        g.addColorStop(1, 'rgba(255,20,50,0)');
        sctx.fillStyle = g;
        sctx.fillRect(geo.cx - 70, geo.cy - 70, 140, 140);

        const gw = Math.max(90, Math.min(480, Math.round(w / (isMobile ? 3 : 3.5))));
        const gh = Math.max(2, Math.round(gw * h / w));
        const cw = w / gw, ch = h / gh;
        const field = new Float32Array(gw * gh);
        const side = new Int8Array(gw * gh);
        let maxD = 1;
        for (let y = 0, i = 0; y < gh; y++) {
            for (let x = 0; x < gw; x++, i++) {
                const sd = signedDistance(geo, (x + 0.5) * cw, (y + 0.5) * ch);
                side[i] = sd >= 0 ? 1 : -1;
                field[i] = Math.abs(sd);
                if (field[i] > maxD) maxD = field[i];
            }
        }
        let lo = Infinity, hi = -Infinity;
        for (let y = 0, i = 0; y < gh; y++) {
            for (let x = 0; x < gw; x++, i++) {
                const n = fbm((x * cw) / 150, (y * ch) / 150);
                const v = 0.6 * (field[i] / maxD) + 0.4 * n;
                field[i] = v;
                if (v < lo) lo = v;
                if (v > hi) hi = v;
            }
        }
        for (let i = 0; i < field.length; i++) field[i] = (field[i] - lo) / (hi - lo || 1);

        const mk = (cw2, ch2) => {
            const c = document.createElement('canvas');
            c.width = cw2; c.height = ch2;
            return c;
        };
        const maskC = mk(gw, gh), heatC = mk(gw, gh);
        const bloomC = mk(Math.max(8, gw >> 2), Math.max(8, gh >> 2));
        veil = {
            geo, sheet, gw, gh, cw, ch, field, side,
            maskC, heatC, bloomC,
            maskCtx: maskC.getContext('2d'), heatCtx: heatC.getContext('2d'), bloomCtx: bloomC.getContext('2d'),
            maskImg: new ImageData(gw, gh), heatImg: new ImageData(gw, gh),
            band: new Int32Array(gw * gh), char: new Int32Array(gw * gh),
            lastT: NaN,
        };
        fx.t = -B_CHAR - 0.02;
        gsap.to(fx, { moteAlpha: 0, duration: 0.25, ease: 'power1.out' });
        return true;
    };

    // ── Rebuild the coarse burn mask + heat map for the current t
    const updateField = (dt) => {
        const v = veil, t = fx.t;
        if (t === v.lastT) return;
        v.lastT = t;
        const m = v.maskImg.data, hd = v.heatImg.data;
        let nb = 0, nc = 0;
        for (let i = 0, j = 0; i < v.field.length; i++, j += 4) {
            const d = v.field[i] - t;
            if (d < -B_FADE) {
                m[j + 3] = 0; hd[j + 3] = 0;
            } else if (d < 0) {
                // Soft ramp so the burning front never steps cell-to-cell.
                const f = 1 + d / B_FADE;
                m[j + 3] = 0;
                hd[j] = 255; hd[j + 1] = 225; hd[j + 2] = 170;
                hd[j + 3] = 200 * f * f;
            } else if (d < B_GLOW) {
                const f = d / B_GLOW;
                m[j] = m[j + 1] = m[j + 2] = 255;
                m[j + 3] = f * f * 255;
                hd[j] = 255; hd[j + 1] = 235 - f * 120; hd[j + 2] = 190 - f * 175;
                hd[j + 3] = 255 * (1 - f * 0.25);
                v.band[nb++] = i;
            } else if (d < B_CHAR) {
                const f = (d - B_GLOW) / (B_CHAR - B_GLOW);
                m[j] = m[j + 1] = m[j + 2] = 255; m[j + 3] = 255;
                hd[j] = 255 - f * 200; hd[j + 1] = 70 - f * 64; hd[j + 2] = 18 - f * 8;
                hd[j + 3] = 235 * (1 - f) * (1 - f * 0.4);
                v.char[nc++] = i;
            } else {
                m[j] = m[j + 1] = m[j + 2] = 255; m[j + 3] = 255; hd[j + 3] = 0;
            }
        }
        v.maskCtx.putImageData(v.maskImg, 0, 0);
        v.heatCtx.putImageData(v.heatImg, 0, 0);
        if (!isMobile) {
            v.bloomCtx.clearRect(0, 0, v.bloomC.width, v.bloomC.height);
            v.bloomCtx.drawImage(v.heatC, 0, 0, v.bloomC.width, v.bloomC.height);
        }

        // Embers peel off the burning rim; ash lifts from the charred zone.
        if (t <= 0) return;
        const split = splitRef.current.p;
        const shed = (list, count, rate, make) => {
            for (let k = Math.min(count, Math.round(rate * dt)); k > 0; k--) {
                const i = list[(Math.random() * count) | 0];
                const s = v.side[i];
                const { tx, ty } = halfTransform(v.geo, s, split);
                make(((i % v.gw) + Math.random()) * v.cw + tx, (((i / v.gw) | 0) + Math.random()) * v.ch + ty, s);
            }
        };
        shed(v.band, nb, isMobile ? 120 : 300, (x, y, s) => add({
            kind: 'ember', x, y,
            vx: v.geo.nx * s * (20 + Math.random() * 60) + (Math.random() - 0.5) * 40,
            vy: v.geo.ny * s * (20 + Math.random() * 60) - 30 - Math.random() * 70,
            life: 0.6 + Math.random() * 0.9, max: 1.5, size: 5 + Math.random() * 9, seed: Math.random() * 6.28,
        }));
        shed(v.char, nc, isMobile ? 18 : 45, (x, y) => add({
            kind: 'ash', x, y,
            vx: (Math.random() - 0.5) * 30, vy: -20 - Math.random() * 40,
            life: 0.9 + Math.random() * 0.8, max: 1.7, size: 1.2 + Math.random() * 2.6,
            rot: Math.random() * 6.28, spin: (Math.random() - 0.5) * 8, seed: Math.random() * 6.28,
        }));
    };

    const drawVeil = () => {
        const v = veil, geo = v.geo, p = splitRef.current.p;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        for (const side of [1, -1]) {
            const { tx, ty, rot } = halfTransform(geo, side, p);
            ctx.save();
            ctx.translate(geo.cx + tx, geo.cy + ty);
            ctx.rotate(rot);
            ctx.translate(-geo.cx, -geo.cy);
            ctx.beginPath();
            halfPolygon(geo, side).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(v.sheet, 0, 0, w, h);
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(v.maskC, 0, 0, w, h);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(v.heatC, 0, 0, w, h);
            ctx.restore();
        }
        if (!isMobile && fx.t > -B_CHAR) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.6;
            ctx.drawImage(v.bloomC, 0, 0, w, h);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
        }
    };

    const drawParticles = (dt) => {
        ctx.globalCompositeOperation = 'lighter';
        if (fx.moteAlpha > 0.01) {
            for (const m of motes) {
                m.x += m.vx * dt; m.y += m.vy * dt;
                if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
                ctx.globalAlpha = fx.moteAlpha * (0.25 + 0.25 * Math.sin(time * 1.7 + m.ph));
                ctx.drawImage(m.sprite, m.x - m.s, m.y - m.s, m.s * 2, m.s * 2);
            }
        }
        ctx.lineCap = 'round';
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= dt;
            if (p.life <= 0 || p.y > h + 40 || p.y < -60) { particles[i] = particles[particles.length - 1]; particles.pop(); continue; }
            const k = p.life / p.max;
            if (p.kind === 'spark') {
                p.vy += 1100 * dt;
                p.vx *= 1 - 2.2 * dt; p.vy *= 1 - 1.2 * dt;
                p.x += p.vx * dt; p.y += p.vy * dt;
                ctx.globalAlpha = Math.min(1, k * 1.6);
                ctx.strokeStyle = k > 0.6 ? '#fff4e0' : k > 0.3 ? '#ffb347' : '#ff4a1c';
                ctx.lineWidth = p.size;
                ctx.beginPath();
                ctx.moveTo(p.x - p.vx * 0.028, p.y - p.vy * 0.028);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            } else if (p.kind === 'ember') {
                p.vy -= 60 * dt;
                p.vx += Math.sin(time * 4 + p.seed) * 50 * dt;
                p.vx *= 1 - 1.5 * dt; p.vy *= 1 - 1.1 * dt;
                p.x += p.vx * dt; p.y += p.vy * dt;
                const s = p.size * (0.4 + 0.6 * k);
                ctx.globalAlpha = Math.min(1, k * 1.8) * (0.75 + 0.25 * Math.sin(time * 20 + p.seed));
                ctx.drawImage(k > 0.55 ? sprites.hot : k > 0.25 ? sprites.ember : sprites.crimson, p.x - s, p.y - s, s * 2, s * 2);
            } else {
                // ash — drawn normally so it reads as dark flakes against the glow
                ctx.globalCompositeOperation = 'source-over';
                p.vy += (k < 0.5 ? 25 : -10) * dt;
                p.vx += Math.sin(time * 2 + p.seed) * 30 * dt;
                p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.spin * dt;
                ctx.globalAlpha = Math.min(1, k * 1.5) * 0.7;
                ctx.fillStyle = k > 0.7 ? '#5a2a1e' : '#2a2626';
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillRect(-p.size, -p.size * 0.45, p.size * 2, p.size * 0.9);
                ctx.restore();
                ctx.globalCompositeOperation = 'lighter';
            }
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    };

    const tick = (_t, deltaMs) => {
        const dt = Math.min(deltaMs / 1000, 0.05);
        time += dt;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        if (veil) { updateField(dt); drawVeil(); }
        drawParticles(dt);
    };
    gsap.ticker.add(tick);
    window.addEventListener('resize', resize);

    return {
        ignite,
        // Spray sparks from a point, thrown perpendicular to the blade.
        sparks(x, y, geo, count) {
            for (let i = 0; i < count; i++) {
                const s = Math.random() < 0.5 ? 1 : -1;
                const sp = 300 + Math.random() * 700;
                add({
                    kind: 'spark', x, y,
                    vx: (geo.nx * s * 0.8 + geo.dx * (0.2 + Math.random() * 0.8)) * sp,
                    vy: (geo.ny * s * 0.8 + geo.dy * (0.2 + Math.random() * 0.8)) * sp,
                    life: 0.25 + Math.random() * 0.45, max: 0.7, size: 0.8 + Math.random() * 1.4,
                });
            }
        },
        burn(duration) {
            return gsap.to(fx, { t: 1 + B_CHAR, duration, ease: 'power1.in' });
        },
        destroy() {
            gsap.ticker.remove(tick);
            window.removeEventListener('resize', resize);
            gsap.killTweensOf(fx);
            particles.length = 0;
            veil = null;
        },
    };
}

// ── Burn layer: split sheet, dissolve, embers, sparks, ash ─────
const BurnTransition = ({ ref, isMobile, splitRef }) => {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
        engineRef.current = createBurnEngine(canvasRef.current, { isMobile, splitRef });
        return () => {
            engineRef.current?.destroy();
            engineRef.current = null;
        };
    }, [isMobile, splitRef]);

    useImperativeHandle(ref, () => ({
        ignite: (geo, uiRoot) => {
            try { return !!engineRef.current?.ignite(geo, uiRoot); } catch { return false; }
        },
        sparks: (x, y, geo, count) => engineRef.current?.sparks(x, y, geo, count),
        burn: (duration) => engineRef.current?.burn(duration) ?? gsap.timeline(),
    }), []);

    return <canvas ref={canvasRef} className="pl-burn" aria-hidden="true" />;
};

export default BurnTransition;
