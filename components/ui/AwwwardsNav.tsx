'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface AwwwardsNavProps {
  onNavClick: (index: number) => void;
  progress: number;
}

export default function AwwwardsNav({ onNavClick, progress }: AwwwardsNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const linksLeftRef = useRef<HTMLDivElement>(null);
  const linksRightRef = useRef<HTMLDivElement>(null);

  const dimensionsRef = useRef<{
    initialWidth: number;
    initialHeight: number;
    initialLeftWidth: number;
    initialRightWidth: number;
  } | null>(null);

  useGSAP(() => {
    const navbarBg = bgRef.current;
    const navbarItems = itemsRef.current;
    const linkLeft = linksLeftRef.current;
    const linkRight = linksRightRef.current;

    if (!navbarBg || !navbarItems || !linkLeft || !linkRight) return;

    const isDesktop = window.innerWidth >= 720;
    if (!isDesktop) {
      gsap.set([navbarBg, navbarItems], { width: '100%', height: '100vh' });
      return;
    }

    // Store initial dimensions for interpolation
    dimensionsRef.current = {
      initialWidth: navbarBg.offsetWidth,
      initialHeight: navbarBg.offsetHeight,
      initialLeftWidth: linkLeft.offsetWidth,
      initialRightWidth: linkRight.offsetWidth,
    };
  }, { scope: containerRef });

  // Update layout styles dynamically based on the passed progress prop
  useEffect(() => {
    const navbarBg = bgRef.current;
    const navbarItems = itemsRef.current;
    const linkLeft = linksLeftRef.current;
    const linkRight = linksRightRef.current;
    const dims = dimensionsRef.current;

    if (!navbarBg || !navbarItems || !linkLeft || !linkRight || !dims) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Scale background and container size to fill viewport
    gsap.set([navbarBg, navbarItems], {
      width: gsap.utils.interpolate(dims.initialWidth, viewportWidth, progress),
      height: gsap.utils.interpolate(dims.initialHeight, viewportHeight, progress),
    });

    // Retain initial spacing/widths for links as container grows
    gsap.set(linkLeft, {
      width: gsap.utils.interpolate(linkLeft.offsetWidth, dims.initialLeftWidth, progress),
    });
    gsap.set(linkRight, {
      width: gsap.utils.interpolate(linkRight.offsetWidth, dims.initialRightWidth, progress),
    });
  }, [progress]);

  return (
    <div ref={containerRef} className="relative w-full pointer-events-none">
      {/* 1. Backdrop layer: fixed full viewport */}
      <div ref={backdropRef} className="navbar-backdrop">
        <div className="navbar-img relative w-full h-full">
          {/* Looped Background Video for Hero Section */}
          <video
            src="/Duration_-_seconds_loopab.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
            style={{ 
              opacity: (1 - progress) * 0.85,
            }}
          />
          {/* Static Background Image for Subsequent Sections */}
          <Image
            src="/sections-bg.jpg"
            alt="Scenic Background"
            fill
            sizes="100vw"
            className="object-cover transition-opacity duration-300 pointer-events-none"
            style={{ 
              opacity: progress * 0.85,
            }}
            priority
          />
        </div>
        <div ref={bgRef} className="navbar-background shadow-lg" />
      </div>

      {/* 2. Interactive navigation items overlay */}
      <div ref={itemsRef} className="navbar-items">
        {/* Left Side Links */}
        <div ref={linksLeftRef} className="navbar-links">
          <button 
            onClick={() => onNavClick(1)} // Slide 1: About/Bio
            className="pointer-events-auto font-dm font-medium text-[13px] uppercase tracking-widest text-[#3d5e3b] dark:text-[#f7f5ef] hover:text-[#c4862a] transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => onNavClick(2)} // Slide 2: Experience
            className="pointer-events-auto font-dm font-medium text-[13px] uppercase tracking-widest text-[#3d5e3b] dark:text-[#f7f5ef] hover:text-[#c4862a] transition-colors"
          >
            Experience
          </button>
        </div>

        {/* Right Side Links */}
        <div ref={linksRightRef} className="navbar-links">
          <button 
            onClick={() => onNavClick(3)} // Slide 3: Projects (Work)
            className="pointer-events-auto font-dm font-medium text-[13px] uppercase tracking-widest text-[#3d5e3b] dark:text-[#f7f5ef] hover:text-[#c4862a] transition-colors"
          >
            Work
          </button>
          <button 
            onClick={() => onNavClick(5)} // Slide 5: Contact
            className="pointer-events-auto font-dm font-medium text-[13px] uppercase tracking-widest text-[#3d5e3b] dark:text-[#f7f5ef] hover:text-[#c4862a] transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}
