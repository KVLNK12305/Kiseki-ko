import akiraVideo from '../components/images/Screencast_20260331_001952.webm';
import f1Video from '../components/images/F1.mp4';

// ── Single source of truth for projects ───────────────────────
// Read by the Projects grid and by the Tech Arsenal ("used in" links),
// so a tech can only ever point at a project that is on the page.
//
// slug          stable id other sections reference
// repo          GitHub URL, or null if private
// contributors  GitHub logins, ordered by commit count. Copied from each
//               repo's contributor list so the page makes no API calls.
// issue         the one joke per card, rendered as a code comment
// featured      spans two columns on wide screens (cards with a video do too)
//
// Order is display order. The grid is three columns wide on desktop; keep
// singles + 2 × wide cards a multiple of 3 so the last row is full.
export const PROJECTS = [
    {
        slug: 'adg',
        title: 'Active Defense Gateway',
        description:
            'Network deception for software-defined infrastructure. An eBPF/XDP probe on the NIC feeds a Rust trust engine that scores every host 0–100; an OS-Ken SDN controller turns that score into ALLOW, MIRROR or DROP OpenFlow rules.',
        tags: ['Rust (Aya)', 'eBPF/XDP', 'OS-Ken', 'Open vSwitch', 'Mininet'],
        repo: 'https://github.com/KVLNK12305/Active_Defence_Gateway',
        contributors: ['KVLNK12305', 'a-anuj', 'ksskarthik18'],
        featured: true,
        issue: 'trust recovers in 2 seconds. so do pulsing attackers.',
    },
    {
        slug: 'cloudpulse',
        title: 'CloudPulse',
        description:
            'Azure FinOps and threat-surface triage. Correlates security signals with cost anomalies, has GPT-4o write the summary, and only remediates after a human approves, with ETag checks and rollback.',
        tags: ['Python', 'Azure', 'Terraform', 'React', 'Docker'],
        repo: 'https://github.com/KVLNK12305/CloudPulse',
        contributors: ['KVLNK12305', 'siddu28', 'Rishinathkurup'],
        issue: 'decommissioned the Azure estate to stop the bill. the FinOps tool worked.',
    },
    {
        slug: 'klaudtrace',
        title: 'KlaudTrace',
        description:
            'AWS incident reconstruction from raw CloudTrail. Follows STS sessions back to the real identity and reports what an attacker actually touched, not everything they theoretically could have.',
        tags: ['Go', 'AWS CloudTrail', 'STS', 'CLI'],
        repo: 'https://github.com/KVLNK12305/KlaudTrace',
        contributors: ['KVLNK12305'],
        issue: 'refuses to speculate. incident calls find this unsettling.',
    },
    {
        slug: 'ghostshell',
        title: 'GhostShell',
        description:
            'A quiet defensive daemon for Linux hosts. Watches for intrusions, crypto-miners and brute-force attempts, and streams structured telemetry from an async Tokio core.',
        tags: ['Rust', 'Tokio', 'nix / libc', 'ring'],
        repo: 'https://github.com/KVLNK12305/GhostShell',
        contributors: ['KVLNK12305'],
        issue: 'so quiet I forgot it was running.',
    },
    {
        slug: 'everust',
        title: 'Everust',
        description:
            'A flight recorder for async Rust services. Keeps a rolling in-memory buffer of runtime events so worker stalls, lock contention and starvation can be replayed after the fact in a Svelte workbench.',
        tags: ['Rust', 'Tokio', 'parking_lot', 'SvelteKit'],
        repo: 'https://github.com/KVLNK12305/Everust',
        contributors: ['KVLNK12305'],
        issue: 'the borrow checker won most arguments.',
    },
    {
        slug: 'akira',
        title: 'AKIRA',
        description:
            'API gateway and identity provider. A Rust native core (AES-GCM, SHA-2, zeroized keys) keeps auth logs tamper-evident behind an Express API with argon2, JWT and rate limiting.',
        tags: ['Express', 'Rust FFI', 'MongoDB', 'React', 'Docker'],
        repo: 'https://github.com/KVLNK12305/Akira',
        contributors: ['KVLNK12305'],
        video: akiraVideo,
        issue: 'none reported. that is what worries me.',
    },
    {
        slug: 'tunedeck',
        title: 'TuneDeck',
        description:
            'Terminal, desktop and CLI controller for JBL headphones. Speaks the Airoha RACE protocol over Bluetooth RFCOMM; noise control works on real hardware on Linux and Windows.',
        tags: ['Python', 'Bluetooth RFCOMM', 'Textual', 'PySide6'],
        repo: 'https://github.com/KVLNK12305/TuneDeck',
        contributors: ['KVLNK12305'],
        issue: 'EQ opcode unverified. my ears are the test suite.',
    },
    {
        slug: 'novasketch',
        title: 'NovaSketch',
        description:
            'Real-time collaborative whiteboard. Yjs CRDTs sync over WebSockets so concurrent edits merge instead of conflicting, with Redis-backed presence and Google sign-in.',
        tags: ['React', 'Yjs', 'WebSockets', 'Konva', 'MongoDB'],
        repo: 'https://github.com/Ateliers-io/NovaSketch',
        contributors: ['KVLNK12305', 'ksskarthik18', 'NarainBK', 'gjyoshitha26', 'LavishkaDhamija'],
        issue: 'two people still cannot agree on a line. by design.',
    },
    {
        slug: 'continuelater',
        title: 'ContinueLater',
        description:
            'Manifest V3 browser extension that remembers where you stopped: scroll position, video timestamp or PDF page. Fully local, no backend, with site-aware parsers for YouTube, GitHub and Substack.',
        tags: ['TypeScript', 'React', 'Manifest V3', 'Vitest'],
        repo: 'https://github.com/KVLNK12305/ContinueLater',
        contributors: ['KVLNK12305'],
        issue: 'I still have 20 tabs open.',
    },
    {
        slug: 'kairo',
        title: 'K.A.I.R.O.',
        description:
            'A personal life OS built around a 168-hour week. Flutter app with an on-device Isar database, Riverpod state, and Android MethodChannels for focus modes and widgets.',
        tags: ['Flutter', 'Dart', 'Isar', 'Riverpod'],
        repo: 'https://github.com/KVLNK12305/K.A.I.R.O',
        contributors: ['KVLNK12305'],
        issue: 'it knows exactly where my 168 hours went.',
    },
    {
        slug: 'eeffoc',
        title: 'EeffoC',
        description:
            'Event-driven task orchestration from Discord. Extracts intent from messages and routes the payload through Microsoft Graph.',
        tags: ['Go', 'n8n', 'MS Graph'],
        repo: 'https://github.com/KVLNK12305/EeffoC',
        contributors: ['KVLNK12305'],
        issue: 'coffee, backwards. so is my sleep schedule.',
    },
    {
        slug: 'f1',
        title: 'F1 Evolution',
        description:
            'How Formula 1 regulations changed each era: tyre allocation, circuit degradation, lap-time deviation and team dominance, from 2018–2024 telemetry.',
        tags: ['Python', 'Pandas', 'Matplotlib', 'Jupyter'],
        repo: 'https://github.com/KVLNK12305/F1_Case_Study',
        contributors: ['KVLNK12305'],
        video: f1Video,
        issue: 'no dataset explains Ferrari strategy.',
    },
];

export const PROJECTS_BY_SLUG = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));
