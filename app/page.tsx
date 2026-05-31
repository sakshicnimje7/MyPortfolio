'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically load the R3F Canvas component to prevent server rendering and hydration errors
const CatScene = dynamic(() => import('@/components/3d/CatScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center font-mono text-xs opacity-60">
      Loading 3D Cat...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-dm text-ink dark:text-cream bg-cream dark:bg-ink overflow-x-hidden">
      
      {/* Hero Section Container */}
      <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Side: Hero Text Content */}
        <div className="w-full md:w-[50vw] min-h-[50vh] md:min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-16 gap-8">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-sage-mid dark:text-sage-light">
              Creative Developer & Voxel Artist
            </span>
            <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl font-semibold text-forest dark:text-sage-light tracking-tight leading-[1.05]">
              Sakshi Nimje
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-ink/80 dark:text-cream/80 leading-relaxed font-light max-w-lg">
              Crafting premium interactive portfolios, 3D web experiences, and pixel-art designs with React, Three.js, and GSAP.
            </p>
          </div>

          {/* Color Palette Chips */}
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 bg-cream-2 dark:bg-cream-3/20 rounded-md border border-cream-3 dark:border-cream-3/30 font-mono text-xs">
              cream: #f7f5ef
            </span>
            <span className="px-3 py-1.5 bg-sage text-cream dark:text-ink rounded-md font-mono text-xs">
              sage: #8fa68a
            </span>
            <span className="px-3 py-1.5 bg-forest text-cream rounded-md font-mono text-xs">
              forest: #3d5e3b
            </span>
            <span className="px-3 py-1.5 bg-amber text-cream rounded-md font-mono text-xs">
              amber: #c4862a
            </span>
            <span className="px-3 py-1.5 bg-ink text-cream dark:bg-cream dark:text-ink rounded-md font-mono text-xs">
              ink: #1a1a16
            </span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 items-center mt-2">
            <a
              href="https://github.com/sakshicnimje7/MyPortfolio"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="magnetic"
              className="px-6 py-3 bg-forest hover:bg-sage-mid text-cream font-medium rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-forest/20 text-sm sm:text-base"
            >
              View Repository
            </a>
            
            <button
              onClick={() => {
                const doc = document.documentElement;
                if (doc.classList.contains('dark')) {
                  doc.classList.remove('dark');
                } else {
                  doc.classList.add('dark');
                }
              }}
              data-cursor="magnetic"
              className="px-6 py-3 border border-sage-mid dark:border-sage-light text-forest dark:text-sage-light hover:bg-sage-light/10 font-medium rounded-full transition-all duration-300 text-sm sm:text-base"
            >
              Toggle Theme
            </button>
          </div>

          {/* Interactive Cards for Custom Cursor Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-w-lg">
            <div 
              data-cursor="magnetic"
              className="p-5 rounded-2xl bg-cream-2/50 dark:bg-cream-3/5 border border-cream-3 dark:border-cream-3/10 flex flex-col gap-1 hover:border-amber transition-colors duration-300"
            >
              <h3 className="font-cormorant text-xl font-semibold text-forest dark:text-sage-light">
                Magnetic Hover
              </h3>
              <p className="text-xs opacity-75 font-light">
                Hover over me to expand the cursor into a warm amber ring.
              </p>
            </div>

            <div 
              data-cursor="text"
              className="p-5 rounded-2xl bg-cream-2/50 dark:bg-cream-3/5 border border-cream-3 dark:border-cream-3/10 flex flex-col gap-1 hover:border-sage transition-colors duration-300"
            >
              <h3 className="font-cormorant text-xl font-semibold text-forest dark:text-sage-light">
                Interactive Text
              </h3>
              <p className="text-xs opacity-75 font-light">
                Hover over me to expand the cursor and reveal the centered label &quot;VIEW&quot;.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: 3D Cat Scene Container */}
        <div className="hidden md:block md:w-[50vw] md:h-screen relative flex-shrink-0">
          <CatScene />
        </div>

        {/* Mobile 2D Fallback Cat Image (displayed under md breakpoint) */}
        <div className="block md:hidden w-full h-[40vh] flex items-center justify-center relative mt-4 pb-16">
          <div className="relative w-64 h-64 animate-float">
            <Image
              src="/cat.png"
              alt="Voxel Cat Mobile Fallback"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-cream-3/50 dark:border-cream-3/10 font-mono text-xs opacity-60 mt-auto">
        © 2026 Sakshi Portfolio. Designed with Next.js 14, Tailwind CSS, GSAP, & React Three Fiber.
      </footer>

    </div>
  );
}
