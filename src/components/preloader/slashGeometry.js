// ── Slash geometry shared by SlashEffect and BurnTransition ────
// The cut runs from upper-right to lower-left through (cx, cy).
// d = unit direction of travel, n = unit normal pointing to the
// upper-left half ("side A", side = 1). Side B is side = -1.

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export function computeSlashGeometry(w, h, cx = w / 2, cy = h / 2) {
    const theta = clamp(Math.atan2(h, w) * 0.92, 0.36, 0.95);
    const dx = -Math.cos(theta);
    const dy = Math.sin(theta);
    const nx = -dy;
    const ny = dx;
    const L = Math.hypot(w, h) * 0.75;

    return {
        w, h, cx, cy, dx, dy, nx, ny, L,
        x0: cx - dx * L, y0: cy - dy * L,
        x1: cx + dx * L, y1: cy + dy * L,
        gap:  clamp(w * 0.011, 6, 18),
        slip: clamp(w * 0.018, 8, 32),
    };
}

// Signed distance from the cut line (positive on side A).
export const signedDistance = (geo, x, y) => (x - geo.cx) * geo.nx + (y - geo.cy) * geo.ny;

// Offset of each half at split progress p (0 → 1). Side A drifts away
// along +n and slides down the cut; side B recoils less.
export function halfTransform(geo, side, p) {
    const gap  = geo.gap * p * (side > 0 ? 1 : 0.7);
    const slip = geo.slip * p * (side > 0 ? 1 : -0.45);
    return {
        tx: geo.nx * gap * side + geo.dx * slip,
        ty: geo.ny * gap * side + geo.dy * slip,
        rot: (side > 0 ? -0.0065 : 0.0045) * p,
    };
}

// Quad covering one side of the cut (extends far past the viewport).
export function halfPolygon(geo, side) {
    const big = geo.L * 2;
    const ox = geo.nx * big * side;
    const oy = geo.ny * big * side;
    return [
        [geo.x0, geo.y0],
        [geo.x1, geo.y1],
        [geo.x1 + ox, geo.y1 + oy],
        [geo.x0 + ox, geo.y0 + oy],
    ];
}
