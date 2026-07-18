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

  const [zoomProgress, setZoomProgress] = useState(0);
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

  // Pin and zoom the hero section on initial scroll
  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: '.hero-pin-container',
      start: 'top top',
      end: '+=100%', // Pin for 1 full viewport height scroll
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        setZoomProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Overall page scroll progress and ScrollSpy for page indicators
  useGSAP(() => {
    const spyTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        
        // Update active slide based on vertical scroll spy detection
        const height = window.innerHeight;
        const targetIds = ['.hero-pin-container', '#about', '#experience', '#work', '#certifications', '#contact'];
        let currentIdx = 0;
        
        targetIds.forEach((id, idx) => {
          const el = document.querySelector(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= height * 0.4 && rect.bottom > height * 0.4) {
              currentIdx = idx;
            }
          }
        });
        setActiveSlide(currentIdx);
      }
    });

    return () => {
      spyTrigger.kill();
    };
  }, []);

  // Handle navbar clicks to smoothly scroll to target sections
  const handleNavClick = (index: number) => {
    const targetSelectors = ['.hero-pin-container', '#about', '#experience', '#work', '#certifications', '#contact'];
    const selector = targetSelectors[index];
    const target = document.querySelector(selector);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = index === 0 ? 0 : rect.top + scrollTop;

    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 1.2,
      ease: 'power3.out',
    });
  };

  // Calculate dynamic dimensions for Slide 0 to match AwwwardsNav background box
  const heroProgress = zoomProgress;
  const contentOpacity = heroProgress >= 0.8 ? Math.max(0, (1 - heroProgress) / 0.2) : 1;
  const aboutOpacity = heroProgress >= 0.8 ? (heroProgress - 0.8) / 0.2 : 0;
  const isDesktop = viewportSize.w >= 720;
  let currentWidth = viewportSize.w;
  let currentHeight = viewportSize.h;

  if (isDesktop) {
    const initialWidth = Math.max(viewportSize.w * 0.5, 720);
    const initialHeight = initialWidth * (9 / 16);
    currentWidth = gsap.utils.interpolate(initialWidth, viewportSize.w, heroProgress);
    currentHeight = gsap.utils.interpolate(initialHeight, viewportSize.h, heroProgress);
  }

  // Dynamic typography & spacing sizes to prevent overlapping/clashes when frame is collapsed
  const headingFontSize = isDesktop 
    ? `${28 + 48 * heroProgress}px` 
    : '32px';
  const gapSize = isDesktop 
    ? `${10 + 18 * heroProgress}px` 
    : '1.25rem';
  const descFontSize = isDesktop 
    ? `${13 + 3 * heroProgress}px` 
    : '0.85rem';
  const btnPaddingY = isDesktop 
    ? `${6 + 5 * heroProgress}px` 
    : '8px';
  const btnPaddingX = isDesktop 
    ? `${16 + 10 * heroProgress}px` 
    : '20px';
  const btnFontSize = isDesktop 
    ? `${11 + 2 * heroProgress}px` 
    : '12px';

  const slide0Style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `${currentWidth}px`,
    height: `${currentHeight}px`,
    overflow: 'hidden',
    zIndex: 5,
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
      
      {/* 1. Pinned Scroll Container for Zooming Hero Section */}
      <div className="hero-pin-container w-full h-screen overflow-hidden relative">
        {/* Backdrop trigger for AwwwardsNav */}
        <div className="navbar-backdrop-trigger absolute top-0 left-0 w-full h-[100vh] pointer-events-none" />

        {/* Interactive expanding navigation backdrop */}
        <AwwwardsNav onNavClick={handleNavClick} progress={zoomProgress} />

        {/* Faint nature background animation */}
        <NatureBackground />

        {/* Navigation Indicator (Right side) */}
        <div className="slider-indicator hidden md:flex">
          <div className="slider-indices">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isActive = activeSlide === idx;
              const indexNum = (idx + 1).toString().padStart(2, '0');
              const targetNames = ['HOME', 'ABOUT', 'EXPERIENCE', 'WORK', 'CERTS', 'CONTACT'];
              return (
                <p
                  key={idx}
                  onClick={() => handleNavClick(idx)}
                  className="group cursor-pointer"
                >
                  <span
                    className="marker"
                    style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] mr-2 text-[var(--sage)]">
                    {targetNames[idx]}
                  </span>
                  <span
                    className="index font-medium transition-all"
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

        {/* Slide 0 (Hero Content) constrained inside the expanding frame */}
        <div style={slide0Style}>
          {/* Main Hero Content (fades out) */}
          <main 
            style={{ opacity: contentOpacity, pointerEvents: contentOpacity > 0.1 ? 'auto' : 'none' }}
            className="w-full h-full flex flex-col md:flex-row items-center justify-center relative py-6 md:py-0 transition-opacity duration-150"
          >
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
            <div className="w-full md:w-1/2 h-[55%] md:h-full flex flex-col justify-center px-6 md:px-12 py-4 md:py-0 z-10" style={{ gap: gapSize }}>
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-dm text-[9px] sm:text-xs tracking-[0.12em] text-[var(--sage)] uppercase font-semibold"
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
                    style={{ fontSize: headingFontSize }}
                    className="font-cormorant font-semibold text-[var(--ink)] leading-[0.9]"
                  >
                    Sakshi
                  </motion.h1>
                </div>
                <div className="overflow-hidden pb-2 relative">
                  <motion.h1
                    variants={wordVariants}
                    style={{ fontSize: headingFontSize }}
                    className="font-cormorant font-semibold text-[var(--ink)] leading-[0.9] inline-block relative pr-2"
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
                style={{ fontSize: descFontSize }}
                className="font-dm font-normal text-[var(--sage-mid)] max-w-[340px] leading-relaxed"
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
                  onClick={() => handleNavClick(3)} // Jump to Work (Work Section)
                  data-cursor="magnetic"
                  style={{ 
                    padding: `${btnPaddingY} ${btnPaddingX}`,
                    fontSize: btnFontSize
                  }}
                  className="bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--sage-mid)] font-dm font-medium rounded-[2px] transition-colors duration-300 select-none text-center w-full sm:w-auto"
                >
                  See my work
                </button>

                <button
                  onClick={() => handleNavClick(5)} // Jump to Contact (Contact Section)
                  data-cursor="magnetic"
                  style={{ 
                    padding: `${btnPaddingY} ${btnPaddingX}`,
                    fontSize: btnFontSize
                  }}
                  className="border border-[var(--amber)] text-[var(--amber)] hover:bg-[var(--amber-light)]/20 font-dm font-medium rounded-[2px] transition-colors duration-300 select-none text-center w-full sm:w-auto"
                >
                  Get in touch
                </button>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
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

          {/* About Me Content morphs inside the card frame */}
          <div 
            style={{ opacity: aboutOpacity, pointerEvents: aboutOpacity > 0.1 ? 'auto' : 'none' }}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#f7f5ef]/30 dark:bg-[#111410]/45 backdrop-blur-[3px] py-16 sm:py-0 transition-opacity duration-150"
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
                  <span className="font-dm text-xs text-[#5c7a5a] dark:text-[#a8c4a2] mt-1.5 font-semibold">
                    SAP Certified ABAP Cloud Developer · Java Full Stack Developer
                  </span>
                </div>
                <div className="md:col-span-7 max-w-2xl">
                  <p className="font-dm font-normal text-base sm:text-lg text-[#5c7a5a] dark:text-[#a8c4a2] leading-relaxed">
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
                  <p className="font-dm font-normal text-xs text-[#5c7a5a] dark:text-[#a8c4a2] leading-relaxed">
                    Expertise in SAP BTP, ABAP Cloud, RAP, and CDS Views. Configuring Cloud Connectors and building business logic dashboards with SAP UI5 interfaces.
                  </p>
                </div>

                {/* Card 2: Java Full Stack */}
                <div className="backdrop-blur-md bg-[#eae8df]/40 dark:bg-[#181c17]/40 border border-[#3d5e3b]/10 dark:border-[#8fa68a]/10 rounded-lg p-5 shadow-sm transition-all hover:translate-y-[-2px] hover:border-[#c4862a] duration-300">
                  <div className="text-[18px] text-[#3d5e3b] dark:text-[#8fa68a] mb-2">⚙️</div>
                  <h3 className="font-cormorant font-bold text-lg text-[#3d5e3b] dark:text-[#8fa68a] mb-2">
                    Backend Architecture
                  </h3>
                  <p className="font-dm font-normal text-xs text-[#5c7a5a] dark:text-[#a8c4a2] leading-relaxed">
                    Designing robust Spring Boot microservices and secure REST APIs with JWT & RBAC. Managing Hibernate/JPA mapping and relational MySQL databases.
                  </p>
                </div>

                {/* Card 3: Creative Frontend */}
                <div className="backdrop-blur-md bg-[#eae8df]/40 dark:bg-[#181c17]/40 border border-[#3d5e3b]/10 dark:border-[#8fa68a]/10 rounded-lg p-5 shadow-sm transition-all hover:translate-y-[-2px] hover:border-[#c4862a] duration-300">
                  <div className="text-[18px] text-[#3d5e3b] dark:text-[#8fa68a] mb-2">✨</div>
                  <h3 className="font-cormorant font-bold text-lg text-[#3d5e3b] dark:text-[#8fa68a] mb-2">
                    Fluid Interactive Web
                  </h3>
                  <p className="font-dm font-normal text-xs text-[#5c7a5a] dark:text-[#a8c4a2] leading-relaxed">
                    Structuring responsive grids and implementing smooth animations with GSAP and Lenis, coupled with React Three Fiber 3D interactive models.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 2. Static Single-Page Sections (Scroll naturally after Hero zoom-in finishes) */}
      <div 
        className="relative w-full z-20 border-t border-[#d4d0c4]/45 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/sections-bg.jpg')" }}
      >
        <div id="about" className="relative w-full min-h-screen">
          <ScrollReel />
        </div>
        <div id="experience" className="relative w-full min-h-screen">
          <Experience />
        </div>
        <div id="work" className="relative w-full min-h-screen">
          {loading ? (
            <div className="w-full min-h-screen flex items-center justify-center font-mono text-xs opacity-60">
              Loading Selected Work...
            </div>
          ) : (
            <Projects initialProjects={projects} />
          )}
        </div>
        <div id="certifications" className="relative w-full min-h-screen">
          <Certifications />
        </div>
        <div id="contact" className="relative w-full min-h-screen flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center">
            <Contact />
          </div>
          <footer className="p-6 text-center border-t border-cream-3/30 dark:border-cream-3/10 font-mono text-xs opacity-60 bg-[#eae8df]/20 dark:bg-[#181c17]/20 w-full">
            © 2026 Sakshi Portfolio. Designed with Next.js 14, Tailwind CSS, GSAP, & React Three Fiber.
          </footer>
        </div>
      </div>
    </div>
  );
}
