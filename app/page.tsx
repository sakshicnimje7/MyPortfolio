'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Dynamically load the CatScene component to prevent document/window check errors during SSR
const CatScene = dynamic(() => import('@/components/3d/CatScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center font-mono text-xs opacity-60">
      Loading Cat...
    </div>
  ),
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

export default function Home() {
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
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Smooth out-expo easing
      },
    },
  };

  return (
    <div className="hero-bg flex flex-col min-h-screen overflow-x-hidden relative">
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center w-full min-h-screen relative">
        
        {/* Left Column: Cat Scene */}
        {/* Desktop: 50vw wide, 100vh tall, vertically centered. Mobile: stacked on top, 40vh height */}
        <div className="w-full md:w-[50vw] h-[45vh] md:h-screen relative flex items-center justify-center pt-12 md:pt-0">
          
          {/* 3D Cat Scene (Desktop only) */}
          <div className="hidden md:block w-full h-full">
            <CatScene />
          </div>

          {/* 2D Floating Image Fallback (Mobile only) */}
          <div className="block md:hidden w-56 h-56 relative animate-float">
            <Image
              src="/cat.png"
              alt="Voxel Cat Mobile Fallback"
              fill
              className="object-contain"
              priority
            />
          </div>

        </div>

        {/* Right Column: Text Content */}
        {/* Desktop: 50vw wide, 100vh tall, vertically centered. Mobile: bottom stacked */}
        <div className="w-full md:w-[50vw] min-h-[55vh] md:min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-8 md:py-0 gap-6 md:gap-8 z-10">
          
          {/* 1. Small Label: fadeUp entry, delay 0.2s */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-dm text-xs tracking-[0.12em] text-[#8fa68a] uppercase font-medium"
          >
            SAP Certified · Full Stack · Open to Work
          </motion.span>

          {/* 2. Name: Sakshi Nimje on two lines, slides up stagger 0.15s */}
          <motion.div
            variants={nameContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Sakshi line - removed hardcoded height to prevent letter clipping */}
            <div className="overflow-hidden pb-1 mb-1">
              <motion.h1
                variants={wordVariants}
                className="font-cormorant font-semibold text-[#1a1a16] leading-none"
                style={{ fontSize: 'clamp(56px, 9vw, 120px)' }}
              >
                Sakshi
              </motion.h1>
            </div>
            
            {/* Nimje line - added padding bottom to clear serif metrics & underline */}
            <div className="overflow-hidden pb-4 relative">
              <motion.h1
                variants={wordVariants}
                className="font-cormorant font-semibold text-[#1a1a16] leading-none inline-block relative pr-2"
                style={{ fontSize: 'clamp(56px, 9vw, 120px)' }}
              >
                Nimje
                {/* Posited amber underline decoration */}
                <div 
                  className="absolute left-0 bottom-[4%] w-full h-[6px] sm:h-[8px] bg-[#c4862a]/70 rounded-full -z-10"
                />
              </motion.h1>
            </div>
          </motion.div>

          {/* 3. One-liner: fadeIn entry, delay 0.6s */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-dm font-light text-[1.2rem] text-[#5c7a5a] max-w-[380px] leading-relaxed"
          >
            I engineer enterprise backends and animate the web.
          </motion.p>

          {/* 4. Two buttons: magnetic hovers, delay 0.8s */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4 mt-2"
          >
            <a
              href="#work"
              data-cursor="magnetic"
              className="px-7 py-3 bg-[#3d5e3b] text-[#f7f5ef] hover:bg-[#5c7a5a] font-dm text-[14px] font-medium rounded-[2px] transition-colors duration-300 select-none text-center min-w-[140px]"
            >
              See my work
            </a>
            
            <a
              href="#contact"
              data-cursor="magnetic"
              className="px-7 py-3 border border-[#c4862a] text-[#c4862a] hover:bg-[#f0d4a8]/20 font-dm text-[14px] font-medium rounded-[2px] transition-all duration-300 select-none text-center min-w-[140px]"
            >
              Get in touch
            </a>
          </motion.div>

        </div>

        {/* 5. Scroll Indicator: delay 1.2s (nested inside relative main to align with hero viewport) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 md:left-auto md:right-16 transform -translate-x-1/2 md:translate-x-0 flex flex-col items-center gap-3 z-10"
        >
          <span className="font-dm text-[11px] tracking-[0.15em] text-[#8fa68a] uppercase select-none">
            scroll to explore
          </span>
          <div className="w-[1.5px] h-10 bg-[#8fa68a]/20 relative overflow-hidden rounded-full">
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
        </motion.div>

      </main>

      {/* ScrollReel Section */}
      <ScrollReel />

      {/* Placeholder Work Section for Scroll Capability */}
      <section id="work" className="min-h-screen flex flex-col items-center justify-center bg-cream-2/40 border-t border-cream-3/45 py-24">
        <div className="max-w-xl text-center px-6 flex flex-col gap-4">
          <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold text-[#1a1a16] leading-tight">
            Featured Projects
          </h2>
          <p className="font-dm text-sm text-[#5c7a5a] leading-relaxed">
            A showcase of enterprise backend systems, SAP integrations, and modular architecture. Coming in the next stages.
          </p>
        </div>
      </section>

      {/* Placeholder Contact Section for Scroll Capability */}
      <section id="contact" className="min-h-screen flex flex-col items-center justify-center bg-cream-3/15 border-t border-cream-3/45 py-24">
        <div className="max-w-xl text-center px-6 flex flex-col gap-4">
          <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold text-[#1a1a16] leading-tight">
            Get In Touch
          </h2>
          <p className="font-dm text-sm text-[#5c7a5a] leading-relaxed">
            Have a project in mind, open roles, or want to collaborate? I am open to discussing full-stack opportunities.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-cream-3/50 dark:border-cream-3/10 font-mono text-xs opacity-60">
        © 2026 Sakshi Portfolio. Designed with Next.js 14, Tailwind CSS, GSAP, & React Three Fiber.
      </footer>

    </div>
  );
}
