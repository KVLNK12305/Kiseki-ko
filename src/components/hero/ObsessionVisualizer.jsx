import React from 'react';

const ObsessionVisualizer = React.memo(({ visualType, accent }) => {
    if (visualType === 'identity') {
        return (
            <svg className="w-full h-full" viewBox="0 0 400 280" fill="none">
                {/* Central Root Identity Node */}
                <circle cx="200" cy="140" r="28" fill="#0A0A10" stroke={accent} strokeWidth="2" />
                <circle
                    cx="200"
                    cy="140"
                    r="38"
                    stroke={accent}
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    className="animate-spin"
                    style={{ transformOrigin: '200px 140px', animationDuration: '24s' }}
                />
                <text x="200" y="144" fill={accent} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    IAM::ROOT
                </text>

                {/* Satellite Trust Nodes */}
                {[
                    { x: 80, y: 60, label: 'AWS_ROLE_01', type: 'ADMIN' },
                    { x: 320, y: 60, label: 'SVC_ACCOUNT', type: 'DAEMON' },
                    { x: 70, y: 220, label: 'KMS_DECRYPT', type: 'TOKEN' },
                    { x: 330, y: 220, label: 'S3_BUCKET_VAULT', type: 'STORE' },
                ].map((node, i) => (
                    <g key={i}>
                        <line
                            x1="200"
                            y1="140"
                            x2={node.x}
                            y2={node.y}
                            stroke={accent}
                            strokeWidth="1"
                            strokeOpacity="0.3"
                            strokeDasharray="4 4"
                        />
                        <circle cx={node.x} cy={node.y} r="18" fill="#05050A" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
                        <circle cx={node.x} cy={node.y} r="4" fill={accent} />
                        <text x={node.x} y={node.y - 24} fill="#ffffff" opacity="0.75" fontSize="8" fontFamily="monospace" textAnchor="middle">
                            {node.label}
                        </text>
                        <text x={node.x} y={node.y + 28} fill={accent} opacity="0.6" fontSize="7" fontFamily="monospace" textAnchor="middle">
                            [{node.type}]
                        </text>
                    </g>
                ))}
            </svg>
        );
    }

    if (visualType === 'radar') {
        return (
            <svg className="w-full h-full" viewBox="0 0 400 280" fill="none">
                <circle cx="200" cy="140" r="110" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
                <circle cx="200" cy="140" r="75" stroke={accent} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="6 4" />
                <circle cx="200" cy="140" r="40" stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
                <circle cx="200" cy="140" r="5" fill={accent} />

                {/* Radar Crosshairs */}
                <line x1="60" y1="140" x2="340" y2="140" stroke={accent} strokeOpacity="0.15" strokeWidth="1" />
                <line x1="200" y1="20" x2="200" y2="260" stroke={accent} strokeOpacity="0.15" strokeWidth="1" />

                {/* Blast Points */}
                {[
                    { x: 155, y: 100, tag: '0x3F: ESCALATION_VECTOR' },
                    { x: 260, y: 95, tag: '0x8A: LATERAL_HOP' },
                    { x: 235, y: 195, tag: '0x9C: RESIDUAL_RISK' },
                ].map((pt, i) => (
                    <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="4" fill={accent} className="animate-ping" style={{ animationDuration: `${2.5 + i}s` }} />
                        <circle cx={pt.x} cy={pt.y} r="4" fill={accent} />
                        <rect x={pt.x + 8} y={pt.y - 8} width="125" height="15" rx="3" fill="#000000" fillOpacity="0.8" stroke={accent} strokeOpacity="0.4" />
                        <text x={pt.x + 14} y={pt.y + 3} fill="#ffffff" fontSize="7.5" fontFamily="monospace">
                            {pt.tag}
                        </text>
                    </g>
                ))}
            </svg>
        );
    }

    if (visualType === 'memory') {
        return (
            <svg className="w-full h-full" viewBox="0 0 400 280" fill="none">
                {/* Memory Register Stack */}
                {[0, 1, 2, 3, 4].map((row) => (
                    <g key={row} transform={`translate(70, ${40 + row * 44})`}>
                        <rect x="0" y="0" width="80" height="28" rx="4" fill="#080812" stroke="#ffffff" strokeOpacity="0.1" />
                        <text x="12" y="17" fill="#6B7280" fontSize="8" fontFamily="monospace">
                            {`0x7FFE0${row * 8}`}
                        </text>
                        <rect x="90" y="0" width="170" height="28" rx="4" fill="#04040A" stroke={accent} strokeOpacity={row === 2 ? '0.8' : '0.25'} />
                        <text x="105" y="17" fill={row === 2 ? accent : '#C8C8D4'} fontSize="9" fontFamily="monospace">
                            {row === 0
                                ? 'STACK_FRAME::MAIN'
                                : row === 1
                                ? 'REG_RSP -> PTR_ALLOC'
                                : row === 2
                                ? 'ZERO_COST_DETERMINISM'
                                : row === 3
                                ? 'ATOMIC_REF_COUNT'
                                : 'CACHE_LINE_64B'}
                        </text>
                    </g>
                ))}
            </svg>
        );
    }

    if (visualType === 'terminal') {
        return (
            <div className="w-full h-full p-4 flex flex-col justify-center font-mono text-[11px] text-white/80 select-none">
                <div className="p-4 rounded-xl bg-black/60 border border-purple-500/30 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[9px] text-white/40">
                        <span>eBPF_TRACE // ARCH_LINUX_6.12</span>
                        <span className="text-purple-400">PID: 4092</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                        <div className="text-emerald-400">→ sys_enter_connect(fd=4, addr=127.0.0.1:8443)</div>
                        <div className="text-[#FFD700]">⚡ socket.bind() :: namespace_ns0 ok</div>
                        <div className="text-purple-300">🔍 packet.inspect: payload_len=1420 tcp_syn=1</div>
                        <div className="text-white/50">✦ cgroups: cpu_shares=1024 mem_lim=unbound</div>
                        <div className="text-white/30 italic pt-1">2:41 AM · tracepoint attached. root confirmed.</div>
                    </div>
                </div>
            </div>
        );
    }

    if (visualType === 'mesh') {
        return (
            <svg className="w-full h-full" viewBox="0 0 400 280" fill="none">
                {/* Distributed Node Cluster */}
                {[
                    { x: 100, y: 90, id: 'NODE_ALPHA' },
                    { x: 300, y: 80, id: 'NODE_BETA' },
                    { x: 200, y: 160, id: 'MESH_ROUTER' },
                    { x: 120, y: 230, id: 'FALLBACK_QUEUE' },
                    { x: 280, y: 230, id: 'STATE_REPLICA' },
                ].map((node, i, arr) => (
                    <g key={i}>
                        {arr.map(
                            (other, j) =>
                                i < j && (
                                    <line
                                        key={j}
                                        x1={node.x}
                                        y1={node.y}
                                        x2={other.x}
                                        y2={other.y}
                                        stroke={accent}
                                        strokeWidth="1"
                                        strokeOpacity="0.25"
                                        strokeDasharray="4 6"
                                    />
                                )
                        )}
                        <circle cx={node.x} cy={node.y} r="16" fill="#0A0A12" stroke={accent} strokeWidth="1.5" />
                        <circle cx={node.x} cy={node.y} r="4" fill={accent} />
                        <text x={node.x} y={node.y - 20} fill="#ffffff" opacity="0.8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                            {node.id}
                        </text>
                    </g>
                ))}
            </svg>
        );
    }

    // Shield (Security)
    return (
        <svg className="w-full h-full" viewBox="0 0 400 280" fill="none">
            <path
                d="M200 40 L280 80 V150 C280 200 200 240 200 240 C200 240 120 200 120 150 V80 Z"
                fill="#0A0A10"
                stroke={accent}
                strokeWidth="2"
            />
            <path
                d="M200 65 L255 95 V145 C255 185 200 215 200 215 C200 215 145 185 145 145 V95 Z"
                stroke={accent}
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
            />
            <circle cx="200" cy="140" r="10" fill={accent} />
            <text x="200" y="165" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">
                WIRESHARK_PCAP
            </text>
            <text x="200" y="180" fill={accent} fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                GHIDRA_DECOMPILED
            </text>
        </svg>
    );
});

export default ObsessionVisualizer;
