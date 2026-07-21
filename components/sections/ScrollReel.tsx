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

  const sapPills = [
    'ABAP OO',
    'SAP HANA',
    'SAP Fiori',
    'AMDP',
    'BAPI / RFC',
    'SQL / OpenSQL',
    'Git for SAP',
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

      const indicatorsText = trackRef.current?.querySelectorAll('.reel-indicator-text');
      const indicatorDot = trackRef.current?.querySelector('#reel-indicator-dot');

      // 1. Set initial states for overlapping panels and their contents
      // Panel 2 starts fully revealed as the base panel, but its content is hidden
      gsap.set(p2, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        opacity: 1,
        pointerEvents: 'auto',
      });
      gsap.set(p2.querySelector('.panel-text-col'), { opacity: 0, y: 40 });
      gsap.set(p2.querySelectorAll('.panel-pill'), { opacity: 0, x: -15 });
      gsap.set(p2.querySelectorAll('.panel-bubble'), { opacity: 0, scale: 0.3 });

      // Indicators initial state
      gsap.set(indicatorDot, { y: 0 });
      if (indicatorsText && indicatorsText.length >= 3) {
        gsap.set(indicatorsText[0], { opacity: 1, fontWeight: 'bold' });
        gsap.set([indicatorsText[1], indicatorsText[2]], { opacity: 0.35, fontWeight: 'normal' });
      }

      gsap.set([p3, p4], {
        clipPath: 'inset(0% 5% 0% 5% round 0px)',
        opacity: 0,
        pointerEvents: 'none',
      });

      // Initial state of contents for Panels 3 & 4
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
            end: () => `+=${window.innerHeight * 4}`, // 3 transitions (SAP Entry, SAP to Java, Java to Stats)
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }

      // --- PANEL 2 ENTRY (SAP Stack Reveal) ---
      tl.to(p2.querySelector('.panel-text-col'), {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      })
      .to(p2.querySelectorAll('.panel-pill'), {
        opacity: 1,
        x: 0,
        stagger: 0.02,
        duration: 0.35,
        ease: 'power1.out',
      }, '-=0.25')
      .to(p2.querySelectorAll('.panel-bubble'), {
        opacity: 1,
        scale: 1,
        stagger: 0.03,
        duration: 0.5,
        ease: 'back.out(1.5)',
      }, '-=0.4')
      .to({}, { duration: 0.35 }); // Hold state for SAP Stack

      // --- PANEL 3 REVEAL (Java Stack Reveal) ---
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
      .to(indicatorDot, { y: 48, duration: 0.6, ease: 'power2.inOut' }, '-=0.6')
      .to(indicatorsText?.[0] || {}, { opacity: 0.35, fontWeight: 'normal', duration: 0.35 }, '-=0.6')
      .to(indicatorsText?.[1] || {}, { opacity: 1, fontWeight: 'bold', duration: 0.35 }, '-=0.6')
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

      // --- PANEL 4 REVEAL (Stats Reveal) ---
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
      .to(indicatorDot, { y: 96, duration: 0.6, ease: 'power2.inOut' }, '-=0.6')
      .to(indicatorsText?.[1] || {}, { opacity: 0.35, fontWeight: 'normal', duration: 0.35 }, '-=0.6')
      .to(indicatorsText?.[2] || {}, { opacity: 1, fontWeight: 'bold', duration: 0.35 }, '-=0.6')
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
      gsap.set(p2.querySelectorAll('.panel-pill'), { opacity: 0, x: -10 });
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
      .to(p2.querySelectorAll('.panel-pill'), { opacity: 1, x: 0, stagger: 0.02, duration: 0.35, ease: 'power1.out' }, '-=0.4')
      .to(p2.querySelectorAll('.panel-bubble'), { opacity: 1, scale: 1, stagger: 0.03, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.3');

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

  const scrollToPanel = (index: number) => {
    if (!trackRef.current) return;
    const triggers = ScrollTrigger.getAll();
    const trigger = triggers.find(t => t.vars.trigger === trackRef.current);
    if (trigger) {
      const start = trigger.start;
      const end = trigger.end;
      const totalDist = end - start;
      
      let targetScroll = start;
      if (index === 1) targetScroll = start + totalDist * 0.42;
      if (index === 2) targetScroll = start + totalDist * 0.85;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id="about" ref={trackRef} className="relative z-10 w-full sm:w-screen sm:left-1/2 sm:-translate-x-1/2 h-auto sm:h-screen sm:overflow-hidden">
      
      {/* Floating Stack Index Indicator (Desktop Only) */}
      <div className="fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col select-none font-mono">
        <div className="flex flex-col items-center gap-4 relative py-4">
          {/* The vertical tracking line */}
          <div className="w-[1px] h-[96px] bg-[#3d5e3b]/15 dark:bg-[#a8c4a2]/20 absolute left-[7px] top-[14px]" />
          
          {/* Active sliding indicator dot */}
          <div className="w-[15px] h-[15px] rounded-full border border-[#3d5e3b] dark:border-[#a8c4a2] bg-[#f7f5ef] dark:bg-[#111410] flex items-center justify-center absolute left-0 top-[14px] transition-all duration-300 pointer-events-none" id="reel-indicator-dot">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3d5e3b] dark:bg-[#a8c4a2]" />
          </div>

          {/* Indicator Items */}
          <button onClick={() => scrollToPanel(0)} className="group flex items-center gap-4 text-left focus:outline-none pl-6 h-4 py-2 relative" title="SAP Stack">
            <span className="text-[10px] tracking-wider transition-all duration-300 font-bold reel-indicator-text text-[#3d5e3b] dark:text-[#a8c4a2]">01</span>
            <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-14 font-medium text-[#3d5e3b] dark:text-[#a8c4a2] whitespace-nowrap bg-[#eae8df] dark:bg-[#181c17] px-2.5 py-1 rounded border border-[#3d5e3b]/15 dark:border-[#a8c4a2]/20 shadow-md">SAP Stack</span>
          </button>

          <button onClick={() => scrollToPanel(1)} className="group flex items-center gap-4 text-left focus:outline-none pl-6 h-4 py-2 relative" title="Java Stack">
            <span className="text-[10px] tracking-wider transition-all duration-300 font-bold reel-indicator-text text-[#3d5e3b] dark:text-[#a8c4a2]">02</span>
            <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-14 font-medium text-[#3d5e3b] dark:text-[#a8c4a2] whitespace-nowrap bg-[#eae8df] dark:bg-[#181c17] px-2.5 py-1 rounded border border-[#3d5e3b]/15 dark:border-[#a8c4a2]/20 shadow-md">Java Stack</span>
          </button>

          <button onClick={() => scrollToPanel(2)} className="group flex items-center gap-4 text-left focus:outline-none pl-6 h-4 py-2 relative" title="Overview">
            <span className="text-[10px] tracking-wider transition-all duration-300 font-bold reel-indicator-text text-[#3d5e3b] dark:text-[#a8c4a2]">03</span>
            <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-14 font-medium text-[#3d5e3b] dark:text-[#a8c4a2] whitespace-nowrap bg-[#eae8df] dark:bg-[#181c17] px-2.5 py-1 rounded border border-[#3d5e3b]/15 dark:border-[#a8c4a2]/20 shadow-md">Overview</span>
          </button>
        </div>
      </div>

      {/* Sticky Screen Viewport (Desktop: GSAP Pinned, Mobile: relative flow) */}
      <div ref={containerRef} className="w-full h-auto sm:h-full flex flex-col relative">

        {/* PANEL 2: SAP Universe */}
        <div
          ref={panel2Ref}
          className="w-full min-h-screen sm:h-full sm:absolute sm:inset-0 flex items-center justify-center bg-[#eae8df]/35 dark:bg-[#181c17]/45 backdrop-blur-[8px] z-20 py-16 sm:py-0"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col sm:flex-row w-full max-w-6xl px-6 sm:px-12 items-center gap-12 sm:gap-8 justify-between">
            
            {/* Column 1: Info */}
            <div className="w-full sm:w-[35%] flex flex-col gap-4 panel-text-col">
              <h2 className="font-cormorant font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#3d5e3b] dark:text-[#eae8df] leading-tight">
                SAP Stack
              </h2>
              <p className="font-dm font-normal text-sm sm:text-base text-[#5c7a5a] dark:text-[#a8c4a2]/90 leading-relaxed max-w-sm mb-2">
                Leveraging modular SAP structures, ABAP Cloud architectures, and BTP integrations to drive enterprise scalability.
              </p>
              {/* Pills row */}
              <div className="flex flex-wrap gap-2 max-w-sm mt-1">
                {sapPills.map(pill => (
                  <span
                    key={pill}
                    className="px-3 py-1 bg-[#eae8df] dark:bg-[#181c17]/85 text-[#3d5e3b] dark:text-[#a8c4a2] border border-[#3d5e3b]/15 dark:border-[#a8c4a2]/20 rounded-full font-mono text-[10px] sm:text-[11px] transition-colors duration-200 hover:border-[#3d5e3b] dark:hover:border-[#a8c4a2] panel-pill shadow-sm"
                  >
                    {pill}
                  </span>
                ))}
              </div>
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
                      aspect-square rounded-full flex flex-col items-center justify-center text-center transition-all duration-500 cursor-default select-none panel-bubble
                      relative sm:absolute ${bubble.animationClass}
                      
                      /* Bubble sizing */
                      ${isLarge ? 'w-32 h-32 sm:w-36 sm:h-36 px-2 text-sm sm:text-base font-semibold z-10' : isMedium ? 'w-24 h-24 sm:w-28 sm:h-28 text-xs font-medium' : 'w-20 h-20 sm:w-24 sm:h-24 text-[10px] sm:text-[11px]'}
                      
                      /* Glassmorphism theme colors & borders */
                      bg-gradient-to-br from-[#f2efe4]/85 to-[#dcd8cc]/85 
                      dark:from-[#2a3228]/85 dark:to-[#1d231b]/85
                      backdrop-blur-[12px]
                      
                      /* Border & Shadows */
                      border ${isLarge ? 'border-[#3d5e3b]/30 dark:border-[#a8c4a2]/35 shadow-[0_10px_35px_rgba(61,94,59,0.12)]' : 'border-[#3d5e3b]/15 dark:border-[#a8c4a2]/20 shadow-[0_6px_20px_rgba(61,94,59,0.06)]'}
                      dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                      
                      /* Interactive Hovers */
                      hover:scale-110 hover:z-30 hover:border-[#3d5e3b]/50 dark:hover:border-[#a8c4a2]/50
                      hover:shadow-[0_15px_40px_rgba(61,94,59,0.22)] dark:hover:shadow-[0_15px_40px_rgba(168,196,162,0.3)]
                      
                      /* Colors */
                      text-[#3d5e3b] dark:text-[#a8c4a2]
                      hover:text-[#f7f5ef] dark:hover:text-[#111410]
                      hover:bg-gradient-to-br hover:from-[#3d5e3b] hover:to-[#2e472d]
                      dark:hover:from-[#a8c4a2] dark:hover:to-[#91af8b]
                    `}
                    style={{
                      top: isDesktop ? bubble.position.top : 'auto',
                      left: isDesktop ? bubble.position.left : 'auto',
                      filter: hoveredSapIndex !== null && hoveredSapIndex !== idx ? 'blur(4px) opacity(0.45)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredSapIndex(idx)}
                    onMouseLeave={() => setHoveredSapIndex(null)}
                  >
                    {/* Ambient subtle glow ring and background blur behind large bubble */}
                    {isLarge && (
                      <div className="absolute -inset-[3px] rounded-full border border-dashed border-[#c4862a]/30 dark:border-[#c4862a]/40 animate-[spin_12s_linear_infinite] pointer-events-none" />
                    )}
                    {isLarge && (
                      <div className="absolute inset-0 rounded-full bg-[#3d5e3b]/5 dark:bg-[#a8c4a2]/5 blur-md -z-10 animate-pulse pointer-events-none" />
                    )}

                    <span className="font-mono tracking-wide uppercase leading-tight">{bubble.name}</span>
                    {bubble.certified && (
                      <span className="text-[9px] font-dm text-[#c4862a] dark:text-[#dca044] font-semibold mt-1 uppercase tracking-wider flex items-center gap-0.5">
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
          className="w-full min-h-screen sm:h-full sm:absolute sm:inset-0 flex items-center justify-center bg-[#f7f5ef]/30 dark:bg-[#111410]/45 backdrop-blur-[8px] z-30 py-16 sm:py-0"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col sm:flex-row w-full max-w-6xl px-6 sm:px-12 items-center gap-12 sm:gap-8 justify-between">
            
            {/* Column 1: Info */}
            <div className="w-full sm:w-[35%] flex flex-col gap-4 panel-text-col">
              <h2 className="font-cormorant font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#3d5e3b] dark:text-[#eae8df] leading-tight">
                Java Stack
              </h2>
              <p className="font-dm font-normal text-sm sm:text-base text-[#5c7a5a] dark:text-[#a8c4a2]/90 leading-relaxed max-w-sm mb-2">
                Designing REST APIs, securing backend layers, and containerizing services using Spring Boot and relational structures.
              </p>
              {/* Pills row */}
              <div className="flex flex-wrap gap-2 max-w-sm mt-1">
                {javaPills.map(pill => (
                  <span
                    key={pill}
                    className="px-3 py-1 bg-[#eae8df] dark:bg-[#181c17]/85 text-[#3d5e3b] dark:text-[#a8c4a2] border border-[#3d5e3b]/15 dark:border-[#a8c4a2]/20 rounded-full font-mono text-[10px] sm:text-[11px] transition-colors duration-200 hover:border-[#3d5e3b] dark:hover:border-[#a8c4a2] panel-pill shadow-sm"
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
                      aspect-square rounded-full flex flex-col items-center justify-center text-center transition-all duration-500 cursor-default select-none panel-bubble
                      relative sm:absolute ${bubble.animationClass}

                      /* Bubble sizing */
                      ${isLarge ? 'w-32 h-32 sm:w-36 sm:h-36 px-2 text-sm sm:text-base font-semibold z-10' : isMedium ? 'w-24 h-24 sm:w-28 sm:h-28 text-xs font-medium' : 'w-20 h-20 sm:w-24 sm:h-24 text-[10px] sm:text-[11px]'}
                      
                      /* Glassmorphism theme colors & borders */
                      bg-gradient-to-br from-[#f2efe4]/85 to-[#dcd8cc]/85 
                      dark:from-[#2a3228]/85 dark:to-[#1d231b]/85
                      backdrop-blur-[12px]
                      
                      /* Border & Shadows */
                      border ${isLarge ? 'border-[#3d5e3b]/30 dark:border-[#a8c4a2]/35 shadow-[0_10px_35px_rgba(61,94,59,0.12)]' : 'border-[#3d5e3b]/15 dark:border-[#a8c4a2]/20 shadow-[0_6px_20px_rgba(61,94,59,0.06)]'}
                      dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                      
                      /* Interactive Hovers */
                      hover:scale-110 hover:z-30 hover:border-[#3d5e3b]/50 dark:hover:border-[#a8c4a2]/50
                      hover:shadow-[0_15px_40px_rgba(61,94,59,0.22)] dark:hover:shadow-[0_15px_40px_rgba(168,196,162,0.3)]
                      
                      /* Colors */
                      text-[#3d5e3b] dark:text-[#a8c4a2]
                      hover:text-[#f7f5ef] dark:hover:text-[#111410]
                      hover:bg-gradient-to-br hover:from-[#3d5e3b] hover:to-[#2e472d]
                      dark:hover:from-[#a8c4a2] dark:hover:to-[#91af8b]
                    `}
                    style={{
                      top: isDesktop ? bubble.position.top : 'auto',
                      left: isDesktop ? bubble.position.left : 'auto',
                      filter: hoveredJavaIndex !== null && hoveredJavaIndex !== idx ? 'blur(4px) opacity(0.45)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredJavaIndex(idx)}
                    onMouseLeave={() => setHoveredJavaIndex(null)}
                  >
                    {/* Ambient subtle glow ring and background blur behind large bubble */}
                    {isLarge && (
                      <div className="absolute -inset-[3px] rounded-full border border-dashed border-[#c4862a]/30 dark:border-[#c4862a]/40 animate-[spin_12s_linear_infinite] pointer-events-none" />
                    )}
                    {isLarge && (
                      <div className="absolute inset-0 rounded-full bg-[#3d5e3b]/5 dark:bg-[#a8c4a2]/5 blur-md -z-10 animate-pulse pointer-events-none" />
                    )}

                    <span className="font-mono tracking-wide uppercase leading-tight">{bubble.name}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* PANEL 4: Stats & CTA */}
        <div
          ref={panel4Ref}
          className="w-full min-h-screen sm:h-full sm:absolute sm:inset-0 flex items-center justify-center bg-[#3d5e3b]/65 dark:bg-[#1c2a1c]/70 backdrop-blur-[8px] z-40 py-16 sm:py-0"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <div className="flex flex-col items-center text-center gap-10 px-6 max-w-4xl mx-auto">
            {/* Center Heading */}
            <h2 className="font-cormorant font-normal text-[#f7f5ef] leading-tight panel4-title" style={{ fontSize: 'clamp(28px, 3.5vw, 64px)' }}>
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
