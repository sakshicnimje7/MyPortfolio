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

interface ScrollReelProps {
  active?: boolean;
  progress?: number;
}

export default function ScrollReel({ active, progress }: ScrollReelProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const panel4Ref = useRef<HTMLDivElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [hoveredSapIndex, setHoveredSapIndex] = useState<number | null>(null);
  const [hoveredJavaIndex, setHoveredJavaIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scrub the timeline when progress changes (for sliding layout integration)
  useEffect(() => {
    if (tlRef.current && progress !== undefined && active) {
      tlRef.current.progress(progress);
    }
  }, [progress, active]);

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

    // Only apply scroll-driven clip-path reveals on desktop viewports (>= 640px)
    mm.add('(min-width: 640px)', () => {
      const p2 = panel2Ref.current;
      const p3 = panel3Ref.current;
      const p4 = panel4Ref.current;
      if (!p2 || !p3 || !p4) return;

      // 1. Set initial states for overlapping panels and their contents
      gsap.set([p2, p3, p4], {
        clipPath: 'inset(6% 5% 6% 5% round 20px)',
        opacity: 0,
        pointerEvents: 'none',
      });

      // Initial state of contents
      gsap.set(p2.querySelector('.panel-text-col'), { opacity: 0, y: 40 });
      gsap.set(p2.querySelectorAll('.panel-bubble'), { opacity: 0, scale: 0.3 });

      gsap.set(p3.querySelector('.panel-text-col'), { opacity: 0, y: 40 });
      gsap.set(p3.querySelectorAll('.panel-pill'), { opacity: 0, x: -15 });
      gsap.set(p3.querySelectorAll('.panel-bubble'), { opacity: 0, scale: 0.3 });

      gsap.set(p4.querySelector('.panel4-title'), { opacity: 0, y: 50 });
      gsap.set(p4.querySelector('.panel4-btn'), { opacity: 0, scale: 0.8 });

      // 2. Create ScrollTrigger Timeline scrubbing through the track with native GSAP pinning (or manual progress scrub)
      let tl: gsap.core.Timeline;
      if (progress !== undefined) {
        tl = gsap.timeline({ paused: true });
        tlRef.current = tl;
      } else {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 4}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }

      // --- PANEL 2 REVEAL ---
      tl.to(p2, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.05,
      })
      .to(p2, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 0.6,
        ease: 'power2.inOut',
      })
      .to(panel1Ref.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, '-=0.6')
      .to(p2.querySelector('.panel-text-col'), {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      }, '-=0.45')
      .to(p2.querySelectorAll('.panel-bubble'), {
        opacity: 1,
        scale: 1,
        stagger: 0.03,
        duration: 0.5,
        ease: 'back.out(1.5)',
      }, '-=0.35')
      .to({}, { duration: 0.35 }); // Hold state

      // --- PANEL 3 REVEAL ---
      tl.to(p3, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.05,
      })
      .to(p3, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 0.6,
        ease: 'power2.inOut',
      })
      .to(p2, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, '-=0.6')
      .to(p3.querySelector('.panel-text-col'), {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      }, '-=0.45')
      .to(p3.querySelectorAll('.panel-pill'), {
        opacity: 1,
        x: 0,
        stagger: 0.02,
        duration: 0.35,
        ease: 'power1.out',
      }, '-=0.25')
      .to(p3.querySelectorAll('.panel-bubble'), {
        opacity: 1,
        scale: 1,
        stagger: 0.03,
        duration: 0.5,
        ease: 'back.out(1.5)',
      }, '-=0.4')
      .to({}, { duration: 0.35 }); // Hold state

      // --- PANEL 4 REVEAL ---
      tl.to(p4, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.05,
      })
      .to(p4, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 0.6,
        ease: 'power2.inOut',
      })
      .to(p3, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, '-=0.6')
      .to(p4.querySelector('.panel4-title'), {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      }, '-=0.45')
      .to(p4.querySelector('.panel4-btn'), {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'back.out(1.8)',
      }, '-=0.25')
      .to({}, { duration: 0.35 }); // Hold state
    });

    // Mobile scroll-triggered entry reveals (< 640px)
    mm.add('(max-width: 639px)', () => {
      const p2 = panel2Ref.current;
      const p3 = panel3Ref.current;
      const p4 = panel4Ref.current;
      if (!p2 || !p3 || !p4) return;

      // Initial state of contents for mobile
      gsap.set(p2.querySelector('.panel-text-col'), { opacity: 0, y: 30 });
      gsap.set(p2.querySelectorAll('.panel-bubble'), { opacity: 0, scale: 0.8 });

      gsap.set(p3.querySelector('.panel-text-col'), { opacity: 0, y: 30 });
      gsap.set(p3.querySelectorAll('.panel-pill'), { opacity: 0, x: -10 });
      gsap.set(p3.querySelectorAll('.panel-bubble'), { opacity: 0, scale: 0.8 });

      gsap.set(p4.querySelector('.panel4-title'), { opacity: 0, y: 30 });
      gsap.set(p4.querySelector('.panel4-btn'), { opacity: 0, scale: 0.9 });

      // Panel 2 ScrollTrigger
      gsap.timeline({
        scrollTrigger: {
          trigger: p2,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      })
      .to(p2.querySelector('.panel-text-col'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(p2.querySelectorAll('.panel-bubble'), { opacity: 1, scale: 1, stagger: 0.03, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.4');

      // Panel 3 ScrollTrigger
      gsap.timeline({
        scrollTrigger: {
          trigger: p3,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      })
      .to(p3.querySelector('.panel-text-col'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(p3.querySelectorAll('.panel-pill'), { opacity: 1, x: 0, stagger: 0.02, duration: 0.35, ease: 'power1.out' }, '-=0.4')
      .to(p3.querySelectorAll('.panel-bubble'), { opacity: 1, scale: 1, stagger: 0.03, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.3');

      // Panel 4 ScrollTrigger
      gsap.timeline({
        scrollTrigger: {
          trigger: p4,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      })
      .to(p4.querySelector('.panel4-title'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(p4.querySelector('.panel4-btn'), { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.4');
    });

    // Cleanup is handled automatically by matchMedia!
  }, { scope: trackRef });

  return (
    <div id="about" ref={trackRef} className="relative z-10 w-full h-auto sm:h-screen sm:overflow-hidden">
      
      {/* Sticky Screen Viewport (Desktop: GSAP Pinned, Mobile: relative flow) */}
      <div ref={containerRef} className="w-full h-auto sm:h-full flex flex-col relative">
        
        {/* PANEL 1: Bio */}
        <div
          ref={panel1Ref}
          className="w-full min-h-screen sm:h-full sm:absolute sm:inset-0 flex items-center justify-center bg-[#f7f5ef]/30 dark:bg-[#111410]/45 backdrop-blur-[0.5px] z-10 py-16 sm:py-0"
        >
          <div className="flex flex-col w-full max-w-6xl px-6 sm:px-12 gap-8 sm:gap-12">
            
            {/* Header: Title and Bio */}
            <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-6 md:gap-12">
              <div className="md:col-span-5 flex flex-col gap-1.5">
                <span className="font-dm text-[10px] tracking-[0.15em] text-[#c4862a] uppercase font-bold">
                  About Me
                </span>
                <h2 className="font-cormorant font-semibold text-5xl sm:text-7xl text-[#3d5e3b] dark:text-[#8fa68a] leading-[0.95]">
                  Sakshi Nimje
                </h2>
                <span className="font-dm text-xs text-[#5c7a5a] dark:text-[#a8c4a2] mt-1.5">
                  SAP Certified ABAP Cloud Developer · Java Full Stack Developer
                </span>
              </div>
              <div className="md:col-span-7 max-w-2xl">
                <p className="font-dm font-light text-base sm:text-lg text-[#5c7a5a] dark:text-[#a8c4a2] leading-relaxed">
                  I bridge the gap between enterprise-grade backend stability and high-fidelity frontend motion. As an SAP-certified engineer, I design scalable microservices and build beautiful, interactive web experiences. Currently developing enterprise SAP applications at <strong>VegaH LLC</strong>.
                </p>
              </div>
            </div>

            {/* Structured Resume Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">
              
              {/* Card 1: Enterprise SAP */}
              <div className="backdrop-blur-md bg-[#eae8df]/40 dark:bg-[#181c17]/40 border border-[#3d5e3b]/10 dark:border-[#8fa68a]/10 rounded-lg p-5 shadow-sm transition-all hover:translate-y-[-2px] hover:border-[#c4862a] duration-300">
                <div className="text-[18px] text-[#3d5e3b] dark:text-[#8fa68a] mb-2">⚡</div>
                <h3 className="font-cormorant font-bold text-lg text-[#3d5e3b] dark:text-[#8fa68a] mb-2">
                  SAP & Cloud Ecosystem
                </h3>
                <p className="font-dm font-light text-xs text-[#5c7a5a] dark:text-[#a8c4a2] leading-relaxed">
                  Expertise in SAP BTP, ABAP Cloud, RAP, and CDS Views. Configuring Cloud Connectors and building business logic dashboards with SAP UI5 interfaces.
                </p>
              </div>

              {/* Card 2: Java Full Stack */}
              <div className="backdrop-blur-md bg-[#eae8df]/40 dark:bg-[#181c17]/40 border border-[#3d5e3b]/10 dark:border-[#8fa68a]/10 rounded-lg p-5 shadow-sm transition-all hover:translate-y-[-2px] hover:border-[#c4862a] duration-300">
                <div className="text-[18px] text-[#3d5e3b] dark:text-[#8fa68a] mb-2">⚙️</div>
                <h3 className="font-cormorant font-bold text-lg text-[#3d5e3b] dark:text-[#8fa68a] mb-2">
                  Backend Architecture
                </h3>
                <p className="font-dm font-light text-xs text-[#5c7a5a] dark:text-[#a8c4a2] leading-relaxed">
                  Designing robust Spring Boot microservices and secure REST APIs with JWT & RBAC. Managing Hibernate/JPA mapping and relational MySQL databases.
                </p>
              </div>

              {/* Card 3: Creative Frontend */}
              <div className="backdrop-blur-md bg-[#eae8df]/40 dark:bg-[#181c17]/40 border border-[#3d5e3b]/10 dark:border-[#8fa68a]/10 rounded-lg p-5 shadow-sm transition-all hover:translate-y-[-2px] hover:border-[#c4862a] duration-300">
                <div className="text-[18px] text-[#3d5e3b] dark:text-[#8fa68a] mb-2">✨</div>
                <h3 className="font-cormorant font-bold text-lg text-[#3d5e3b] dark:text-[#8fa68a] mb-2">
                  Fluid Interactive Web
                </h3>
                <p className="font-dm font-light text-xs text-[#5c7a5a] dark:text-[#a8c4a2] leading-relaxed">
                  Structuring responsive grids and implementing smooth animations with GSAP and Lenis, coupled with React Three Fiber 3D interactive models.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* PANEL 2: SAP Universe */}
        <div
          ref={panel2Ref}
          className="w-full min-h-screen sm:h-full sm:absolute sm:inset-0 flex items-center justify-center bg-[#eae8df]/35 dark:bg-[#181c17]/45 backdrop-blur-[0.5px] z-20 py-16 sm:py-0"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col sm:flex-row w-full max-w-6xl px-6 sm:px-12 items-center gap-12 sm:gap-8 justify-between">
            
            {/* Column 1: Info */}
            <div className="w-full sm:w-[35%] flex flex-col gap-4 panel-text-col">
              <h2 className="font-cormorant font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#3d5e3b] leading-tight">
                SAP Stack
              </h2>
              <p className="font-dm font-light text-sm sm:text-base text-[#5c7a5a] leading-relaxed max-w-sm">
                Leveraging modular SAP structures, ABAP Cloud architectures, and BTP integrations to drive enterprise scalability.
              </p>
            </div>

            {/* Column 2: Bubbles cluster */}
            <div className="w-full sm:w-[65%] relative h-auto sm:h-[480px] flex flex-wrap sm:block gap-3 justify-center items-center px-4">
              {sapBubbles.map((bubble, idx) => {
                const isLarge = bubble.size === 'large';
                const isMedium = bubble.size === 'medium';
                
                return (
                  <div
                    key={bubble.name}
                    className={`
                      aspect-square rounded-full flex flex-col items-center justify-center text-center border border-[#3d5e3b]/10 bg-[#d4d0c4] text-[#3d5e3b] transition-all duration-300 cursor-default select-none shadow-sm panel-bubble
                      hover:bg-[#3d5e3b] hover:text-[#f7f5ef] hover:scale-105 hover:shadow-md
                      ${isLarge ? 'w-32 h-32 sm:w-36 sm:h-36 px-2' : isMedium ? 'w-24 h-24 sm:w-28 sm:h-28 text-xs' : 'w-20 h-20 sm:w-24 sm:h-24 text-[11px]'}
                      relative sm:absolute ${bubble.animationClass}
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
          className="w-full min-h-screen sm:h-full sm:absolute sm:inset-0 flex items-center justify-center bg-[#f7f5ef]/30 dark:bg-[#111410]/45 backdrop-blur-[0.5px] z-30 py-16 sm:py-0"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col sm:flex-row w-full max-w-6xl px-6 sm:px-12 items-center gap-12 sm:gap-8 justify-between">
            
            {/* Column 1: Info */}
            <div className="w-full sm:w-[35%] flex flex-col gap-4 panel-text-col">
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
                    className="px-3 py-1 bg-[#eae8df] text-[#3d5e3b] border border-[#3d5e3b]/10 rounded-full font-mono text-[10px] sm:text-[11px] panel-pill"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 2: Bubbles cluster */}
            <div className="w-full sm:w-[65%] relative h-auto sm:h-[480px] flex flex-wrap sm:block gap-3 justify-center items-center px-4">
              {javaBubbles.map((bubble, idx) => {
                const isLarge = bubble.size === 'large';
                const isMedium = bubble.size === 'medium';

                return (
                  <div
                    key={bubble.name}
                    className={`
                      aspect-square rounded-full flex flex-col items-center justify-center text-center border border-[#3d5e3b]/10 bg-[#d4d0c4] text-[#3d5e3b] transition-all duration-300 cursor-default select-none shadow-sm panel-bubble
                      hover:bg-[#3d5e3b] hover:text-[#f7f5ef] hover:scale-105 hover:shadow-md
                      ${isLarge ? 'w-32 h-32 sm:w-36 sm:h-36 px-2' : isMedium ? 'w-24 h-24 sm:w-28 sm:h-28 text-xs' : 'w-20 h-20 sm:w-24 sm:h-24 text-[11px]'}
                      relative sm:absolute ${bubble.animationClass}
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
          className="w-full min-h-screen sm:h-full sm:absolute sm:inset-0 flex items-center justify-center bg-[#3d5e3b]/65 dark:bg-[#1c2a1c]/70 backdrop-blur-[1px] z-40 py-16 sm:py-0"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col items-center text-center gap-10 px-6 max-w-4xl mx-auto">
            {/* Center Heading */}
            <h2 className="font-cormorant font-light text-[#f7f5ef] leading-tight panel4-title" style={{ fontSize: 'clamp(28px, 3.5vw, 64px)' }}>
              11 projects. 2 internships.<br />1 SAP certification. And counting.
            </h2>
            
            {/* CTA Button */}
            <a
              href="#work"
              data-cursor="magnetic"
              className="px-8 py-3.5 border border-[#a8c4a2] text-[#f7f5ef] hover:bg-[#8fa68a] hover:text-[#1a1a16] hover:border-transparent font-dm text-[15px] font-medium rounded-[2px] transition-all duration-300 select-none min-w-[180px] tracking-wide panel4-btn"
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
