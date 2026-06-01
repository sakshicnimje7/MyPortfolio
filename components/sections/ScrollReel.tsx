'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface BubbleSkill {
  name: string;
  size: 'large' | 'medium' | 'small';
  certified?: boolean;
  position: {
    top: string;
    left: string;
  };
  animationClass: string;
}

export default function ScrollReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const panel4Ref = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [hoveredSapIndex, setHoveredSapIndex] = useState<number | null>(null);
  const [hoveredJavaIndex, setHoveredJavaIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sapBubbles: BubbleSkill[] = [
    { name: 'ABAP Cloud', size: 'large', certified: true, position: { top: '32%', left: '32%' }, animationClass: 'animate-bubble-1' },
    { name: 'SAP BTP', size: 'medium', position: { top: '8%', left: '10%' }, animationClass: 'animate-bubble-2' },
    { name: 'CDS Views', size: 'medium', position: { top: '12%', left: '65%' }, animationClass: 'animate-bubble-3' },
    { name: 'RAP Model', size: 'medium', position: { top: '60%', left: '12%' }, animationClass: 'animate-bubble-3' },
    { name: 'OData Services', size: 'medium', position: { top: '55%', left: '62%' }, animationClass: 'animate-bubble-2' },
    { name: 'SAP UI5', size: 'medium', position: { top: '6%', left: '38%' }, animationClass: 'animate-bubble-1' },
    { name: 'SAP EWM', size: 'medium', position: { top: '70%', left: '36%' }, animationClass: 'animate-bubble-3' },
    { name: 'Cloud Connector', size: 'small', position: { top: '36%', left: '4%' }, animationClass: 'animate-bubble-1' },
    { name: 'SAP BAS', size: 'small', position: { top: '34%', left: '80%' }, animationClass: 'animate-bubble-2' },
    { name: 'Eclipse ADT', size: 'small', position: { top: '72%', left: '20%' }, animationClass: 'animate-bubble-1' },
  ];

  const javaBubbles: BubbleSkill[] = [
    { name: 'Spring Boot', size: 'large', position: { top: '32%', left: '32%' }, animationClass: 'animate-bubble-2' },
    { name: 'REST APIs', size: 'medium', position: { top: '8%', left: '10%' }, animationClass: 'animate-bubble-1' },
    { name: 'Hibernate/JPA', size: 'medium', position: { top: '12%', left: '65%' }, animationClass: 'animate-bubble-3' },
    { name: 'MySQL', size: 'medium', position: { top: '60%', left: '12%' }, animationClass: 'animate-bubble-3' },
    { name: 'Docker', size: 'medium', position: { top: '55%', left: '62%' }, animationClass: 'animate-bubble-2' },
    { name: 'JWT Auth', size: 'medium', position: { top: '6%', left: '38%' }, animationClass: 'animate-bubble-3' },
    { name: 'Maven', size: 'small', position: { top: '36%', left: '4%' }, animationClass: 'animate-bubble-2' },
    { name: 'React.js', size: 'small', position: { top: '34%', left: '80%' }, animationClass: 'animate-bubble-1' },
    { name: 'JSP/Servlets', size: 'small', position: { top: '72%', left: '20%' }, animationClass: 'animate-bubble-2' },
  ];

  const javaPills = [
    'Spring Security',
    'Spring Data JPA',
    'JUnit 5',
    'Mockito',
    'Liquibase',
    'Redis Cache',
    'Git / GitHub',
  ];

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Only apply scroll-driven clip-path reveals on desktop viewports (>= 768px)
    mm.add('(min-width: 768px)', () => {
      // 1. Set initial states for overlapping panels
      gsap.set([panel2Ref.current, panel3Ref.current, panel4Ref.current], {
        clipPath: 'inset(6% 5% 6% 5% round 20px)',
        opacity: 0,
        pointerEvents: 'none',
      });

      // 2. Create ScrollTrigger Timeline scrubbing through the track with native GSAP pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 4}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // --- PANEL 2 REVEAL ---
      tl.to(panel2Ref.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.05,
      })
      .to(panel2Ref.current, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 0.6,
      })
      .to({}, { duration: 0.35 }); // Hold state

      // --- PANEL 3 REVEAL ---
      tl.to(panel3Ref.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.05,
      })
      .to(panel3Ref.current, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 0.6,
      })
      .to({}, { duration: 0.35 }); // Hold state

      // --- PANEL 4 REVEAL ---
      tl.to(panel4Ref.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.05,
      })
      .to(panel4Ref.current, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 0.6,
      })
      .to({}, { duration: 0.35 }); // Hold state
    });

    // Cleanup is handled automatically by matchMedia!
  }, { scope: trackRef });

  return (
    <div ref={trackRef} className="relative w-full h-auto md:h-screen md:overflow-hidden">
      
      {/* Sticky Screen Viewport (Desktop: GSAP Pinned, Mobile: relative flow) */}
      <div ref={containerRef} className="w-full h-auto md:h-full flex flex-col relative">
        
        {/* PANEL 1: Bio */}
        <div
          ref={panel1Ref}
          className="w-full min-h-screen md:h-full md:absolute md:inset-0 flex items-center justify-center bg-[#f7f5ef] z-10 py-16 md:py-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl px-6 md:px-12 items-center gap-12 md:gap-24">
            <div className="flex flex-col gap-2">
              <span className="font-cormorant font-light text-4xl sm:text-5xl text-[#3d5e3b]">Hello, I&apos;m</span>
              <h2 className="font-cormorant font-semibold text-7xl sm:text-8xl text-[#3d5e3b] leading-none">Sakshi</h2>
            </div>
            <div className="max-w-md">
              <p className="font-dm font-light text-lg sm:text-xl text-[#5c7a5a] leading-relaxed">
                Backend engineer. SAP specialist. Creative technologist. I build systems that scale and interfaces that stay with you.
              </p>
            </div>
          </div>
        </div>

        {/* PANEL 2: SAP Universe */}
        <div
          ref={panel2Ref}
          className="w-full min-h-screen md:h-full md:absolute md:inset-0 flex items-center justify-center bg-[#eae8df] z-20 py-16 md:py-0"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col md:flex-row w-full max-w-6xl px-6 md:px-12 items-center gap-12 md:gap-8 justify-between">
            
            {/* Column 1: Info */}
            <div className="w-full md:w-[35%] flex flex-col gap-4">
              <h2 className="font-cormorant font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#3d5e3b] leading-tight">
                SAP Stack
              </h2>
              <p className="font-dm font-light text-sm sm:text-base text-[#5c7a5a] leading-relaxed max-w-sm">
                Leveraging modular SAP structures, ABAP Cloud architectures, and BTP integrations to drive enterprise scalability.
              </p>
            </div>

            {/* Column 2: Bubbles cluster */}
            <div className="w-full md:w-[65%] relative h-auto md:h-[480px] flex flex-wrap md:block gap-3 justify-center items-center px-4">
              {sapBubbles.map((bubble, idx) => {
                const isLarge = bubble.size === 'large';
                const isMedium = bubble.size === 'medium';
                
                return (
                  <div
                    key={bubble.name}
                    className={`
                      aspect-square rounded-full flex flex-col items-center justify-center text-center border border-[#3d5e3b]/10 bg-[#d4d0c4] text-[#3d5e3b] transition-all duration-300 cursor-default select-none shadow-sm
                      hover:bg-[#3d5e3b] hover:text-[#f7f5ef] hover:scale-105 hover:shadow-md
                      ${isLarge ? 'w-32 h-32 md:w-36 md:h-36 px-2' : isMedium ? 'w-24 h-24 md:w-28 md:h-28 text-xs' : 'w-20 h-20 md:w-24 md:h-24 text-[11px]'}
                      relative md:absolute ${bubble.animationClass}
                    `}
                    style={{
                      top: isDesktop ? bubble.position.top : 'auto',
                      left: isDesktop ? bubble.position.left : 'auto',
                      filter: hoveredSapIndex !== null && hoveredSapIndex !== idx ? 'blur(3px) opacity(0.5)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredSapIndex(idx)}
                    onMouseLeave={() => setHoveredSapIndex(null)}
                  >
                    <span className="font-mono font-medium leading-tight">{bubble.name}</span>
                    {bubble.certified && (
                      <span className="text-[9px] font-dm text-[#c4862a] font-semibold mt-1 uppercase tracking-wider">
                        ★ Certified
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* PANEL 3: Java Universe */}
        <div
          ref={panel3Ref}
          className="w-full min-h-screen md:h-full md:absolute md:inset-0 flex items-center justify-center bg-[#f7f5ef] z-30 py-16 md:py-0"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col md:flex-row w-full max-w-6xl px-6 md:px-12 items-center gap-12 md:gap-8 justify-between">
            
            {/* Column 1: Info */}
            <div className="w-full md:w-[35%] flex flex-col gap-4">
              <h2 className="font-cormorant font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#3d5e3b] leading-tight">
                Java Stack
              </h2>
              <p className="font-dm font-light text-sm sm:text-base text-[#5c7a5a] leading-relaxed max-w-sm mb-2">
                Designing REST APIs, securing backend layers, and containerizing services using Spring Boot and relational structures.
              </p>
              {/* Pills row */}
              <div className="flex flex-wrap gap-2 max-w-sm mt-1">
                {javaPills.map(pill => (
                  <span
                    key={pill}
                    className="px-3 py-1 bg-[#eae8df] text-[#3d5e3b] border border-[#3d5e3b]/10 rounded-full font-mono text-[10px] sm:text-[11px]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 2: Bubbles cluster */}
            <div className="w-full md:w-[65%] relative h-auto md:h-[480px] flex flex-wrap md:block gap-3 justify-center items-center px-4">
              {javaBubbles.map((bubble, idx) => {
                const isLarge = bubble.size === 'large';
                const isMedium = bubble.size === 'medium';

                return (
                  <div
                    key={bubble.name}
                    className={`
                      aspect-square rounded-full flex flex-col items-center justify-center text-center border border-[#3d5e3b]/10 bg-[#d4d0c4] text-[#3d5e3b] transition-all duration-300 cursor-default select-none shadow-sm
                      hover:bg-[#3d5e3b] hover:text-[#f7f5ef] hover:scale-105 hover:shadow-md
                      ${isLarge ? 'w-32 h-32 md:w-36 md:h-36 px-2' : isMedium ? 'w-24 h-24 md:w-28 md:h-28 text-xs' : 'w-20 h-20 md:w-24 md:h-24 text-[11px]'}
                      relative md:absolute ${bubble.animationClass}
                    `}
                    style={{
                      top: isDesktop ? bubble.position.top : 'auto',
                      left: isDesktop ? bubble.position.left : 'auto',
                      filter: hoveredJavaIndex !== null && hoveredJavaIndex !== idx ? 'blur(3px) opacity(0.5)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredJavaIndex(idx)}
                    onMouseLeave={() => setHoveredJavaIndex(null)}
                  >
                    <span className="font-mono font-medium leading-tight">{bubble.name}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* PANEL 4: Stats & CTA */}
        <div
          ref={panel4Ref}
          className="w-full min-h-screen md:h-full md:absolute md:inset-0 flex items-center justify-center bg-[#3d5e3b] z-40 py-16 md:py-0 relative"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col items-center text-center gap-10 px-6 max-w-4xl mx-auto">
            {/* Center Heading */}
            <h2 className="font-cormorant font-light text-[#f7f5ef] leading-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 64px)' }}>
              11 projects. 2 internships.<br />1 SAP certification. And counting.
            </h2>
            
            {/* CTA Button */}
            <a
              href="#work"
              data-cursor="magnetic"
              className="px-8 py-3.5 border border-[#a8c4a2] text-[#f7f5ef] hover:bg-[#8fa68a] hover:text-[#1a1a16] hover:border-transparent font-dm text-[15px] font-medium rounded-[2px] transition-all duration-300 select-none min-w-[180px] tracking-wide"
            >
              See the work →
            </a>
          </div>

          {/* Bottom-right Corner Ambient Text */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-right font-mono text-[10px] sm:text-[11px] text-[#f7f5ef]/55 select-none leading-relaxed">
            June 2026<br />
            Building at VegaH LLC
          </div>
        </div>

      </div>
    </div>
  );
}
