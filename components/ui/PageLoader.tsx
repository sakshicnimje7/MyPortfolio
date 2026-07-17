'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<SVGSVGElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Only play loader on cold load
    const played = sessionStorage.getItem('portfolio-loader-played');
    if (!played) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  useGSAP(() => {
    if (!isVisible || !containerRef.current || !leafRef.current || !nameRef.current) return;

    // Create GSAP timeline for reveal
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('portfolio-loader-played', 'true');
        setIsVisible(false);
      }
    });

    // Slide up (translateY -100%) over 1.2s, ease: expo.inOut
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.inOut',
      delay: 0.2,
    });

    // Fade out leaf and name in the last 0.3s of the timeline slide-up
    tl.to([leafRef.current, nameRef.current], {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
    }, '-=0.3');
  }, { scope: containerRef, dependencies: [isVisible] });

  if (!isVisible) return null;

  return (
    <>
      {/* Loader Overlay */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: '#f7f5ef', // cream
          willChange: 'transform',
        }}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Botanical SVG Leaf */}
          <svg
            ref={leafRef}
            width="120"
            height="200"
            viewBox="0 0 120 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 1 }}
          >
            {/* Symmetrical Elongated Leaf */}
            <path
              d="M60 0C60 0 120 80 120 130C120 180 93.1371 200 60 200C26.8629 200 0 180 0 130C0 80 60 0 60 0Z"
              fill="#3d5e3b"
            />
            {/* Elegant inner veins */}
            <path
              d="M60 190V20M60 160L85 135M60 135L35 110M60 110L85 85M60 85L35 60M60 60L85 35"
              stroke="#f7f5ef"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            />
          </svg>

          {/* Name Text */}
          <h2
            ref={nameRef}
            className="font-cormorant text-[18px] tracking-[0.3em] font-light uppercase select-none"
            style={{ color: '#8fa68a', opacity: 1 }}
          >
            sakshi nimje
          </h2>
        </div>
      </div>
    </>
  );
}
