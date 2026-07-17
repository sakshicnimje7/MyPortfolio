'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth expo out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger updates
    lenis.on('scroll', ScrollTrigger.update);

    // Feed Lenis ticks into the GSAP ticker
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);

    // Disable lagSmoothing since Lenis coordinates custom ticks
    gsap.ticker.lagSmoothing(0);

    // Force ScrollTrigger to calculate initial positions
    ScrollTrigger.refresh();
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Handle hash anchor link smooth scrolls automatically
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const targetEl = document.querySelector(href);
          if (targetEl) {
            lenis.scrollTo(targetEl as HTMLElement, {
              offset: 0,
              immediate: false,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
            // Update URL hash without jumping
            window.history.pushState(null, '', href);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      // Cleanup
      lenis.destroy();
      gsap.ticker.remove(tick);
      clearTimeout(refreshTimeout);
      document.removeEventListener('click', handleAnchorClick);
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
