import React, { useRef, useEffect } from 'react';

// ── Subtle Celestial Sparkle Engine ───────────────────────────
const CelestialField = React.memo(({ overdrive }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, animationFrame;
        const particles = [];
        const MAX_P = overdrive ? 45 : 24;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        class Spark {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * (w || window.innerWidth);
                this.y = Math.random() * (h || window.innerHeight);
                this.vx = (Math.random() - 0.5) * (overdrive ? 0.35 : 0.18);
                this.vy = (Math.random() - 0.5) * (overdrive ? 0.35 : 0.18);
                this.size = Math.random() * (overdrive ? 1.6 : 1.1) + 0.3;
                this.life = 0;
                this.maxLife = Math.random() * 140 + 70;
                this.isGold = Math.random() > 0.4;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;
                if (this.life > this.maxLife) this.reset();
            }
            draw() {
                const prog = this.life / this.maxLife;
                const alpha = prog < 0.5 ? (prog / 0.5) * 0.55 : ((1 - prog) / 0.5) * 0.55;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.isGold ? `rgba(255, 215, 0, ${alpha})` : `rgba(168, 85, 247, ${alpha * 0.8})`;
                ctx.fill();
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < MAX_P; i++) {
                const p = new Spark();
                p.life = Math.floor(Math.random() * p.maxLife);
                particles.push(p);
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            animationFrame = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [overdrive]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
});

export default CelestialField;
