'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

// Dynamically load the AwwwardsNav component to prevent SSR window reference and hydration issues
const AwwwardsNav = dynamic(() => import('@/components/ui/AwwwardsNav'), {
  ssr: false,
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);

// Dynamically load the CatScene component to prevent document/window check errors during SSR
const CatScene = dynamic(() => import('@/components/3d/CatScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center font-mono text-xs opacity-60">
      Loading Cat...
    </div>
  ),
});

// Dynamically load the NatureBackground component to prevent SSR window reference issues
const NatureBackground = dynamic(() => import('@/components/ui/NatureBackground'), {
  ssr: false,
});

// Dynamically load the ScrollReel component to prevent SSR window reference issues
const ScrollReel = dynamic(() => import('@/components/sections/ScrollReel'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex items-center justify-center font-mono text-xs opacity-60 bg-[#f7f5ef]">
      Loading Bio & Skills...
    </div>
  ),
});

// Dynamically load the Projects component to prevent SSR window reference issues
const Projects = dynamic(() => import('@/components/sections/Projects'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex items-center justify-center font-mono text-xs opacity-60 bg-[#f7f5ef] border-t border-[#d4d0c4]/45">
      Loading Selected Work...
    </div>
  ),
});

// Dynamically load the Experience component to prevent SSR window reference issues
const Experience = dynamic(() => import('@/components/sections/Experience'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex items-center justify-center font-mono text-xs opacity-60 bg-[#eae8df] border-t border-[#d4d0c4]/45">
      Loading Experience...
    </div>
  ),
});

// Dynamically load the Certifications component to prevent SSR window reference issues
const Certifications = dynamic(() => import('@/components/sections/Certifications'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex items-center justify-center font-mono text-xs opacity-60 bg-[#f7f5ef] border-t border-[#d4d0c4]/45">
      Loading Certifications...
    </div>
  ),
});

// Dynamically load the Contact component to prevent SSR window reference issues
const Contact = dynamic(() => import('@/components/sections/Contact'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex items-center justify-center font-mono text-xs opacity-60 bg-[#3d5e3b] text-[#f7f5ef]">
      Loading Contact...
    </div>
  ),
});

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  tags: string;
  category: string;
  liveUrl: string;
  githubUrl: string | null;
  featured: boolean;
  order: number;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch projects from the backend database
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch projects:', err);
        setLoading(false);
      });
  }, []);

  // Initialize the master Fullscreen Slider pinning ScrollTrigger
  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: '.master-slider-container',
      start: 'top top',
      end: '+=600%', // Pinned for 6 fullscreen slides worth of scrolling
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        const slide = Math.min(Math.floor(self.progress * 6 + 0.05), 5);
        setActiveSlide(slide);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Handle navbar clicks to smoothly scroll to the selected slide
  const handleNavClick = (index: number) => {
    gsap.to(window, {
      scrollTo: index * window.innerHeight,
      duration: 1.2,
      ease: 'power3.out',
    });
  };

  // Maps total progress down to a [0, 1] sub-progress segment for each slide
  const getSlideProgress = (index: number) => {
    const start = index / 6;
    const end = (index + 1) / 6;
    if (scrollProgress < start) return 0;
    if (scrollProgress > end) return 1;
    return (scrollProgress - start) / (end - start);
  };

  const slideStyle = (index: number) => ({
    opacity: activeSlide === index ? 1 : 0,
    pointerEvents: activeSlide === index ? ('auto' as const) : ('none' as const),
    transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: activeSlide === index ? 'translateY(0)' : activeSlide > index ? 'translateY(-20px)' : 'translateY(20px)',
  });

  const [viewportSize, setViewportSize] = useState({ w: 1200, h: 800 });

  // Track window resizing for responsive dimensions calculation
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate dynamic dimensions for Slide 0 to match AwwwardsNav background box
  const heroProgress = getSlideProgress(0);
  const isDesktop = viewportSize.w >= 720;
  let currentWidth = viewportSize.w;
  let currentHeight = viewportSize.h;

  if (isDesktop) {
    const initialWidth = Math.max(viewportSize.w * 0.5, 720);
    const initialHeight = initialWidth * (9 / 16);
    currentWidth = gsap.utils.interpolate(initialWidth, viewportSize.w, heroProgress);
    currentHeight = gsap.utils.interpolate(initialHeight, viewportSize.h, heroProgress);
  }

  const slide0Style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `${currentWidth}px`,
    height: `${currentHeight}px`,
    overflow: 'hidden',
    opacity: activeSlide === 0 ? 1 : 0,
    pointerEvents: activeSlide === 0 ? ('auto' as const) : ('none' as const),
    transition: 'opacity 0.5s ease',
  };

  // Stagger Container for Name slideUp animations
  const nameContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="w-full bg-[#f7f5ef] dark:bg-[#111410] relative">
      <div className="master-slider-container w-full h-screen overflow-hidden relative">
      {/* 1. Backdrop trigger for AwwwardsNav (keeps scroll area matches trigger dimensions) */}
      <div className="navbar-backdrop-trigger absolute top-0 left-0 w-full h-[100vh] pointer-events-none" />

      {/* 2. Interactive expanding navigation */}
      <AwwwardsNav onNavClick={handleNavClick} progress={getSlideProgress(0)} />

      {/* 3. Faint nature background animation */}
      <NatureBackground />

      {/* 3.5. Fullscreen Navigation Indicator (Configured from Fullscreen-slider repo) */}
      <div className="slider-indicator hidden md:flex">
        <div className="slider-indices">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isActive = activeSlide === idx;
            const indexNum = (idx + 1).toString().padStart(2, '0');
            return (
              <p
                key={idx}
                onClick={() => handleNavClick(idx)}
                className="group"
              >
                <span
                  className="marker"
                  style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                />
                <span
                  className="index"
                  style={{ opacity: isActive ? 1 : 0.35 }}
                >
                  {indexNum}
                </span>
              </p>
            );
          })}
        </div>

        <div className="slider-progress-bar">
          <div
            className="slider-progress"
            style={{ transform: `scaleY(${scrollProgress})` }}
          />
        </div>
      </div>

      {/* 4. Slides Viewports */}
      <div className="relative w-full h-full z-10">
        
        {/* SLIDE 0: Hero / Mascot */}
        <div style={slide0Style}>
          <main className="w-full h-full flex flex-col md:flex-row items-center justify-center relative py-6 md:py-0">
            {/* Left Column: Cat Scene */}
            <div className="w-full md:w-1/2 h-[45%] md:h-full relative flex items-center justify-center pt-4 md:pt-0">
              <div className="hidden md:block w-full h-full">
                <CatScene />
              </div>
              <div className="block md:hidden w-36 h-36 relative animate-float">
                <Image
                  src="/cat.png"
                  alt="Voxel Cat Mobile Fallback"
                  fill
                  sizes="(max-width: 768px) 144px, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Text Content */}
            <div className="w-full md:w-1/2 h-[55%] md:h-full flex flex-col justify-center px-6 md:px-12 py-4 md:py-0 gap-4 md:gap-6 z-10">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-dm text-[10px] sm:text-xs tracking-[0.12em] text-[var(--sage)] uppercase font-medium"
              >
                SAP Certified · Full Stack · Open to Work
              </motion.span>

              <motion.div
                variants={nameContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col"
              >
                <div className="overflow-hidden pb-1 mb-1">
                  <motion.h1
                    variants={wordVariants}
                    className="font-cormorant font-semibold text-[var(--ink)] leading-none text-[clamp(44px,6vw,96px)]"
                  >
                    Sakshi
                  </motion.h1>
                </div>
                <div className="overflow-hidden pb-4 relative">
                  <motion.h1
                    variants={wordVariants}
                    className="font-cormorant font-semibold text-[var(--ink)] leading-none inline-block relative pr-2 text-[clamp(44px,6vw,96px)]"
                  >
                    Nimje
                    <div className="absolute left-0 bottom-[4%] w-full h-[6px] sm:h-[8px] bg-[var(--amber)]/70 rounded-full -z-10" />
                  </motion.h1>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="font-dm font-light text-[0.9rem] sm:text-[1.1rem] text-[var(--sage-mid)] max-w-[340px] leading-relaxed"
              >
                I engineer enterprise backends and animate the web.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 mt-1"
              >
                <button
                  onClick={() => handleNavClick(3)} // Jump to Work (Slide 3)
                  data-cursor="magnetic"
                  className="px-6 py-2.5 bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--sage-mid)] font-dm text-[13px] font-medium rounded-[2px] transition-colors duration-300 select-none text-center w-full sm:w-auto sm:min-w-[120px]"
                >
                  See my work
                </button>

                <button
                  onClick={() => handleNavClick(5)} // Jump to Contact (Slide 5)
                  data-cursor="magnetic"
                  className="px-6 py-2.5 border border-[var(--amber)] text-[var(--amber)] hover:bg-[var(--amber-light)]/20 font-dm text-[13px] font-medium rounded-[2px] transition-colors duration-300 select-none text-center w-full sm:w-auto sm:min-w-[120px]"
                >
                  Get in touch
                </button>
              </motion.div>
            </div>

            {/* Scroll Indicator (Anchored inside expanding box) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10">
              <span className="font-dm text-[9px] tracking-[0.15em] text-[#8fa68a] uppercase select-none">
                scroll to explore
              </span>
              <div className="w-[1.5px] h-8 bg-[#8fa68a]/20 relative overflow-hidden rounded-full">
                <motion.div
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-[#8fa68a]"
                />
              </div>
            </div>
          </main>
        </div>

        {/* SLIDE 1: About / ScrollReel */}
        <div className="absolute inset-0 w-full h-full" style={slideStyle(1)}>
          <ScrollReel active={activeSlide === 1} progress={getSlideProgress(1)} />
        </div>

        {/* SLIDE 2: Experience timeline */}
        <div className="absolute inset-0 w-full h-full overflow-y-auto py-12" style={slideStyle(2)}>
          <Experience />
        </div>

        {/* SLIDE 3: Projects (3D Sticky Cards stack) */}
        <div className="absolute inset-0 w-full h-full" style={slideStyle(3)}>
          {loading ? (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs opacity-60">
              Loading Selected Work...
            </div>
          ) : (
            <Projects 
              initialProjects={projects} 
              active={activeSlide === 3} 
              progress={getSlideProgress(3)} 
            />
          )}
        </div>

        {/* SLIDE 4: Certifications */}
        <div className="absolute inset-0 w-full h-full overflow-y-auto py-12" style={slideStyle(4)}>
          <Certifications />
        </div>

        {/* SLIDE 5: Contact Footer */}
        <div className="absolute inset-0 w-full h-full overflow-y-auto flex flex-col justify-between" style={slideStyle(5)}>
          <div className="flex-1 flex items-center justify-center">
            <Contact />
          </div>
          <footer className="p-6 text-center border-t border-cream-3/30 dark:border-cream-3/10 font-mono text-xs opacity-60 bg-[#eae8df]/20 dark:bg-[#181c17]/20">
            © 2026 Sakshi Portfolio. Designed with Next.js 14, Tailwind CSS, GSAP, & React Three Fiber.
          </footer>
        </div>

      </div>
    </div>
  </div>
  );
}
