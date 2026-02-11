import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, BookOpen, ExternalLink, ScrollText, X } from "lucide-react";
import CertCard from "./CertCard";

gsap.registerPlugin(ScrollTrigger);

const CERTIFICATES = [
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2024",
    id: "aws",
    description: "Validated overall understanding of the AWS Cloud platform, including basic security, architecture, pricing, and core services.",
    skills: ["Cloud Computing", "Security", "AWS Core Services"],
    link: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
  },
  {
    title: "Meta Front-End Dev",
    issuer: "Coursera / Meta",
    date: "2023",
    id: "meta",
    description: "Professional certification covering advanced React, version control, UX/UI principles, and web development fundamentals.",
    skills: ["React", "JavaScript", "UX/UI", "Figma"],
    link: "https://www.coursera.org/professional-certificates/meta-front-end-developer"
  },
  {
    title: "Postman API Fundamentals",
    issuer: "Postman",
    date: "2024",
    id: "postman",
    description: "Comprehensive training on API development lifecycle, testing, documentation, and automation using Postman.",
    skills: ["API Testing", "Documentation", "Automation"],
    link: "https://www.postman.com/student-program/student-expert/"
  },
  {
    title: "Rust Programming",
    issuer: "Rust Foundation",
    date: "2023",
    id: "rust",
    description: "Deep dive into Rust ownership model, borrowing, lifetimes, and systems programming concepts.",
    skills: ["Rust", "Systems Programming", "Memory Safety"],
    link: "https://www.rust-lang.org/learn"
  },
  {
    title: "Advanced React Patterns",
    issuer: "Frontend Masters",
    date: "2023",
    id: "react",
    description: "Mastery of compound components, render props, state reducers, and custom hooks for scalable applications.",
    skills: ["React Hooks", "Design Patterns", "Performance"],
    link: "https://frontendmasters.com/courses/advanced-react-patterns/"
  },
  {
    title: "Docker Essentials",
    issuer: "Docker Inc.",
    date: "2024",
    id: "docker",
    description: "Practical knowledge of containerization, Dockerfiles, image management, and multi-container orchestration.",
    skills: ["Docker", "Containers", "DevOps"],
    link: "https://www.docker.com/"
  },
];

const RESEARCH_ITEMS = [
  {
    title: "Conference Paper (ICSRF 2025)",
    topic: "Open Defecation in Rural Settlements",
    desc: '"Case Study About Open Defecation in Rural Settlement on Rameswaram Island, India."',
    status: "Published (Nov 2025)",
    icon: <BookOpen className="text-[#FFD700]" size={24} />,
    link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5726162"
  },
  {
    title: "Journal Manuscript",
    topic: "Children's Mental Health",
    desc: '"A Participatory Case Study on Children\'s Mental Health in a Rural Community of Rameswaram, Tamil Nadu."',
    status: "In Preparation",
    icon: <ScrollText className="text-[#A855F7]" size={24} />,
    link: "#"
  }

];



const Honors_n_certs = () => {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const [selectedCert, setSelectedCert] = useState(null);

  useGSAP(() => {
    // 1. Entrance Animation - robust visibility handling
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 95%", // Trigger almost immediately when section enters viewport
      }
    });

    tl.fromTo(".section-header",
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(".research-card",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          clearProps: "transform" // Clean up transform after animation to avoid blurriness
        },
        "-=0.4"
      );

    // 2. Marquee Animation
    const innerContent = marqueeInnerRef.current;
    if (innerContent) {
      const contentWidth = innerContent.scrollWidth / 2;

      gsap.to(innerContent, {
        x: -contentWidth,
        duration: 40,
        ease: "linear",
        repeat: -1
      });
    }

  }, { scope: containerRef });

  return (
    <section id="publications" ref={containerRef} className="py-24 relative bg-[#030305] overflow-hidden">
      {/* Background Decoration: Gold Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent"></div>

      <div className="container mx-auto max-w-6xl px-6 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header flex items-center gap-4 mb-16 opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            <span className="text-[#FFD700] font-mono mr-3">05.</span>
            Honors & Research
          </h2>
          <div className="h-px bg-white/10 flex-grow max-w-xs"></div>
        </div>

        {/* 1. RESEARCH GRID */}
        <div className="research-grid grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {RESEARCH_ITEMS.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="research-card block opacity-0 group relative p-8 bg-[#0A0A0E] rounded-xl border border-white/5 hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(255,215,0,0.1)]"
            >
              <div className="absolute top-6 right-6 text-slate-400 group-hover:text-[#FFD700] transition-colors">
                <ExternalLink size={20} />
              </div>

              <div className="mb-6 inline-block p-3 bg-white/5 rounded-lg border border-white/5">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors relative z-10">
                {item.title}
              </h3>
              <p className="text-sm font-mono text-[#FFD700] mb-4 relative z-10">
                {item.topic}
              </p>
              <p className="text-slate-300 mb-6 italic leading-relaxed border-l-2 border-[#FFD700]/20 pl-4 relative z-10">
                {item.desc}
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-[#4ade80] bg-[#4ade80]/10 px-3 py-1 rounded-full w-fit relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                {item.status}
              </div>
            </a>
          ))}
        </div>

        {/* 2. CERTIFICATIONS MARQUEE */}
        <div className="relative">
          <div className="section-header text-center mb-10 opacity-0">
            <h3 className="text-xl font-mono text-[#FFD700]/80 flex items-center justify-center gap-3 before:h-px before:w-12 before:bg-[#FFD700]/30 after:h-px after:w-12 after:bg-[#FFD700]/30">
              CERTIFICATIONS
            </h3>
          </div>

          {/* Gradient Masks for Marquee Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-r from-[#030305] to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-l from-[#030305] to-transparent pointer-events-none"></div>

          <div ref={marqueeRef} className="flex overflow-hidden relative w-full py-4">
            <div ref={marqueeInnerRef} className="flex w-max">
              {/* Render Twice for seamless loop */}
              {[...CERTIFICATES, ...CERTIFICATES].map((cert, i) => (
                <CertCard key={`${cert.id}-${i}`} cert={cert} onClick={setSelectedCert} />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CERTIFICATE POPUP MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-[#0A0A0E] border border-[#FFD700]/30 rounded-2xl w-full max-w-md p-6 relative shadow-[0_0_50px_rgba(255,215,0,0.15)] animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
              onClick={() => setSelectedCert(null)}
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/5 rounded-xl border border-[#FFD700]/20">
                <Award className="text-[#FFD700]" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCert.title}</h3>
                <p className="text-[#FFD700]/80 font-mono text-sm">{selectedCert.issuer}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedCert.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Skills Verified</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCert.skills.map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-[#FFD700]/10 text-[#FFD700] text-xs rounded border border-[#FFD700]/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs font-mono text-gray-500">Issued: {selectedCert.date}</span>
                <a
                  href={selectedCert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#FFD700] hover:underline flex items-center gap-1"
                >
                  VERIFY CREDENTIAL <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Honors_n_certs;