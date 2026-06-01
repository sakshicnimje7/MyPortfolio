'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Experiment {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  animationType: 'blob' | 'scan' | 'marquee' | 'grid' | 'spin';
}

const experiments: Experiment[] = [
  {
    title: "SVG Page Transitions",
    description: "Organic SVG mask transitions between routes using custom clipPaths.",
    tags: ["GSAP", "SVG"],
    githubUrl: "https://github.com/sakshicnimje7/svg-transitions",
    animationType: "blob",
  },
  {
    title: "LandingPage Reveal",
    description: "Scroll-triggered cinematic content reveal with clipping transitions.",
    tags: ["GSAP", "CSS"],
    githubUrl: "https://github.com/sakshicnimje7/landing-reveal",
    animationType: "scan",
  },
  {
    title: "Scroll Effect",
    description: "Horizontal scroll hijack and element pinning with GSAP ScrollTrigger.",
    tags: ["GSAP", "ScrollTrigger"],
    githubUrl: "https://github.com/sakshicnimje7/scroll-hijack",
    animationType: "marquee",
  },
  {
    title: "WebGL Shaders",
    description: "GLSL fragment shaders for organic image distortion on hover.",
    tags: ["Three.js", "GLSL"],
    githubUrl: "https://github.com/sakshicnimje7/webgl-distortion",
    animationType: "grid",
  },
  {
    title: "WebGL Slider",
    description: "3D image carousel using WebGL renderers and custom cylindrical geometry.",
    tags: ["Three.js", "WebGL"],
    githubUrl: "https://github.com/sakshicnimje7/webgl-carousel",
    animationType: "spin",
  },
];

function ExperimentCard({ exp, index }: { exp: Experiment; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const renderPreview = () => {
    switch (exp.animationType) {
      case 'blob':
        return (
          <div className="w-16 h-16 bg-[#3d5e3b] rounded-[60%_40%_30%_70%/_60%_30%_70%_40%] animate-blob" />
        );
      case 'scan':
        return (
          <div className="w-full h-12 border border-[#3d5e3b]/30 bg-[#1e231d] relative overflow-hidden flex items-center justify-center rounded">
            <div className="w-full h-[2px] bg-[#a8c4a2] absolute top-0 left-0 animate-scan shadow-[0_0_8px_#a8c4a2]" />
            <span className="text-[9px] font-mono opacity-20 uppercase tracking-widest text-[#f7f5ef]">Cinematic</span>
          </div>
        );
      case 'marquee':
        return (
          <div className="w-full h-12 bg-[#1e231d] border border-[#3d5e3b]/30 overflow-hidden flex items-center relative rounded">
            <div className="flex gap-4 absolute whitespace-nowrap animate-marquee">
              <span className="font-mono text-[10px] text-[#a8c4a2]/80 uppercase tracking-wider">
                SCROLL HORIZONTAL ✦ SCROLL HORIZONTAL ✦ SCROLL HORIZONTAL
              </span>
            </div>
          </div>
        );
      case 'grid':
        return (
          <div className="grid grid-cols-3 gap-1.5 w-12 h-12">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-[#3d5e3b] rounded-sm animate-pulse-grid"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );
      case 'spin':
        return (
          <div className="w-12 h-12 bg-[#1e231d] border border-[#3d5e3b]/30 relative flex items-center justify-center overflow-hidden rounded" style={{ perspective: '80px' }}>
            <div className="w-6 h-6 border border-dashed border-[#a8c4a2] animate-spin-3d" style={{ transformStyle: 'preserve-3d' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="bg-[#252c24] border border-[#3d5e3b]/45 rounded-lg overflow-hidden p-6 flex flex-col justify-between shadow-sm hover:border-[#a8c4a2]/80 transition-colors h-[320px] select-none group"
    >
      <style>{`
        @keyframes blob {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-grid {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.35); opacity: 1; background-color: #a8c4a2; }
        }
        @keyframes spin-3d {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        .animate-blob { animation: blob 6s ease-in-out infinite; }
        .animate-scan { animation: scan 3s ease-in-out infinite; }
        .animate-marquee { animation: marquee 10s linear infinite; }
        .animate-pulse-grid { animation: pulse-grid 2s ease-in-out infinite; }
        .animate-spin-3d { animation: spin-3d 6s linear infinite; }
      `}</style>

      {/* Card Preview Loop Area */}
      <div className="h-[120px] w-full bg-[#1c221b] border border-[#3d5e3b]/20 rounded flex items-center justify-center overflow-hidden mb-5">
        {renderPreview()}
      </div>

      {/* Body details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-cormorant font-semibold text-xl text-[#f7f5ef] leading-tight mb-2 group-hover:text-[#a8c4a2] transition-colors">
            {exp.title}
          </h3>
          <p className="font-dm font-light text-xs text-[#8fa68a] leading-relaxed mb-4">
            {exp.description}
          </p>
        </div>

        {/* Footer info & tags */}
        <div className="flex items-center justify-between pt-3 border-t border-[#3d5e3b]/20">
          <div className="flex flex-wrap gap-1.5">
            {exp.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#1c221b] text-[#a8c4a2] font-mono text-[9px] rounded uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* GitHub icon (magnetic cursor) */}
          <a
            href={exp.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="magnetic"
            className="text-[#8fa68a] hover:text-[#f7f5ef] transition-colors"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Lab() {
  return (
    <section id="lab" className="relative z-20 py-24 bg-[#1b201b] border-t border-[#3d5e3b]/30">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="font-cormorant font-semibold text-5xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#f7f5ef] to-[#a8c4a2] leading-tight">
            The Lab
          </h2>
          <p className="font-dm font-light text-base sm:text-lg text-[#8fa68a] leading-relaxed">
            Animation experiments. WebGL explorations. Things I built because I was curious.
          </p>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp, idx) => (
            <ExperimentCard key={idx} exp={exp} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
