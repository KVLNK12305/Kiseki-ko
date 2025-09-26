import React, { useEffect, useRef } from 'react';

const Arsenal = () => {
    const skillCategories = {
        "Programming Languages": ["Python", "Java", "C++", "Rust", "JavaScript", "C"],
        "Frontend": ["HTML", "CSS", "React.js", "Next.js", "Tailwind CSS"],
        "Backend & Frameworks": ["Node.js", "Express.js"],
        "Databases": ["MySQL", "MongoDB"],
        "Data & Analytics": ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Plotly", "Tableau"],
        "Developer Tools": ["Git", "GitHub", "VS Code", "Eclipse"],
        "Core CS Concepts": ["DSA", "OOP", "DBMS", "OS", "Computer Networks"],
    };

    const SkillConstellation = () => {
        const canvasRef = useRef(null);
        const mouse = useRef({ x: undefined, y: undefined });

        const stars = [
            { id: 1, x: 0.45, y: 0.15, label: "Frontend", connections: [3, 7], size: 10 }, // Castor
            { id: 2, x: 0.55, y: 0.2, label: "Backend", connections: [4, 7], size: 10 }, // Pollux
            { id: 3, x: 0.3, y: 0.4, label: "Languages", connections: [5], size: 8 },
            { id: 4, x: 0.68, y: 0.5, label: "Databases", connections: [6], size: 8 },
            { id: 5, x: 0.2, y: 0.75, label: "Dev Tools", connections: [], size: 7 },
            { id: 6, x: 0.75, y: 0.8, label: "Data & Analytics", connections: [], size: 7 },
            { id: 7, x: 0.5, y: 0.55, label: "Core CS", connections: [], size: 9 }, // Alhena
        ];

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let animationFrameId;

            const setCanvasSize = () => {
                const container = canvas.parentElement;
                if(container) {
                    canvas.width = container.offsetWidth;
                    canvas.height = 400;
                }
            };

            const handleMouseMove = (event) => {
                const rect = canvas.getBoundingClientRect();
                mouse.current.x = event.clientX - rect.left;
                mouse.current.y = event.clientY - rect.top;
            };

            canvas.addEventListener('mousemove', handleMouseMove);

            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
                ctx.lineWidth = 1;
                stars.forEach(star => {
                    star.connections.forEach(connId => {
                        const connectedStar = stars.find(s => s.id === connId);
                        if (connectedStar) {
                            ctx.beginPath();
                            ctx.moveTo(star.x * canvas.width, star.y * canvas.height);
                            ctx.lineTo(connectedStar.x * canvas.width, connectedStar.y * canvas.height);
                            ctx.stroke();
                        }
                    });
                });

                stars.forEach(star => {
                    const dx = (star.x * canvas.width) - mouse.current.x;
                    const dy = (star.y * canvas.height) - mouse.current.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    let radius = star.size;
                    let opacity = 0.7;
                    if (distance < 100) {
                        radius = star.size * 1.5;
                        opacity = 1;
                    }

                    ctx.beginPath();
                    ctx.arc(star.x * canvas.width, star.y * canvas.height, radius * 2.5, 0, Math.PI * 2, false);
                    const glowGradient = ctx.createRadialGradient(
                        star.x * canvas.width, star.y * canvas.height, radius,
                        star.x * canvas.width, star.y * canvas.height, radius * 2.5
                    );
                    glowGradient.addColorStop(0, `rgba(138, 43, 226, ${opacity * 0.4})`);
                    glowGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
                    ctx.fillStyle = glowGradient;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(star.x * canvas.width, star.y * canvas.height, radius, 0, Math.PI * 2, false);
                    ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
                    ctx.fill();

                    ctx.fillStyle = `rgba(204, 214, 246, ${opacity})`;
                    ctx.font = '14px Orbitron';
                    ctx.textAlign = 'center';
                    ctx.fillText(star.label, star.x * canvas.width, star.y * canvas.height - radius - 10);
                });

                animationFrameId = window.requestAnimationFrame(animate);
            };

            setCanvasSize();
            animate();
            
            window.addEventListener('resize', setCanvasSize);

            return () => {
                window.cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', setCanvasSize);
                if (canvas) {
                   canvas.removeEventListener('mousemove', handleMouseMove);
                }
            };
        }, []);

        return <canvas ref={canvasRef} className="w-full h-[400px]"></canvas>;
    };

    return (
        <section id="skills" className="py-24 px-6">
            <div className="container mx-auto max-w-4xl">
                <h2 className="section-title text-3xl font-bold text-light-slate mb-12">
                    <span className="text-gold font-mono mr-2">01.</span>
                    Technical Arsenal
                </h2>
                
                <div className="mb-16">
                     <SkillConstellation />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {Object.entries(skillCategories).map(([category, skills]) => (
                        <div key={category}>
                            <h3 className="text-gold font-bold mb-3">{category}</h3>
                            <ul className="text-slate font-mono text-sm space-y-2">
                                {skills.map(skill => (
                                    <li key={skill} className="before:content-['▹'] before:text-gold before:mr-2">{skill}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Arsenal;
