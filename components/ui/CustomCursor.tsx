'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [cursorType, setCursorType] = useState<'default' | 'magnetic' | 'text'>('default');

  const blobRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // GSAP quickTo functions
  const xBlobTo = useRef<((value: number) => void) | null>(null);
  const yBlobTo = useRef<((value: number) => void) | null>(null);
  const xDotTo = useRef<((value: number) => void) | null>(null);
  const yDotTo = useRef<((value: number) => void) | null>(null);

  // Detect touch devices
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      setIsMobile(hasTouch);
    };
    checkTouch();
  }, []);

  // Hide default OS cursor
  useEffect(() => {
    if (isMobile === true || isMobile === null) return;

    document.body.style.cursor = 'none';
    
    // Fallback: add class to hide cursor if needed
    const style = document.createElement('style');
    style.innerHTML = `
      body, button, a, [role="button"], input, select, textarea {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = 'auto';
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [isMobile]);

  // Set up GSAP quickTo positions
  useGSAP(() => {
    if (isMobile || !blobRef.current || !dotRef.current) return;

    // Center elements on mouse using GSAP properties
    gsap.set(blobRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(dotRef.current, { xPercent: -50, yPercent: -50 });

    // Initialize quickTo for trailing blob
    xBlobTo.current = gsap.quickTo(blobRef.current, "x", { duration: 0.4, ease: "power3" });
    yBlobTo.current = gsap.quickTo(blobRef.current, "y", { duration: 0.4, ease: "power3" });

    // Initialize quickTo for trailing dot
    xDotTo.current = gsap.quickTo(dotRef.current, "x", { duration: 0.15, ease: "power3" });
    yDotTo.current = gsap.quickTo(dotRef.current, "y", { duration: 0.15, ease: "power3" });
  }, { scope: blobRef, dependencies: [isMobile] });

  // Mouse move listener
  useEffect(() => {
    if (isMobile === true || isMobile === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (xBlobTo.current) xBlobTo.current(e.clientX);
      if (yBlobTo.current) yBlobTo.current(e.clientY);
      if (xDotTo.current) xDotTo.current(e.clientX);
      if (yDotTo.current) yDotTo.current(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  // Hover states detection using event delegation
  useEffect(() => {
    if (isMobile === true || isMobile === null) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('[data-cursor]');
      if (interactiveEl) {
        const type = interactiveEl.getAttribute('data-cursor');
        if (type === 'magnetic') {
          setCursorType('magnetic');
        } else if (type === 'text') {
          setCursorType('text');
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('[data-cursor]');
      if (interactiveEl) {
        setCursorType('default');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isMobile]);

  // Animate cursor state transitions using GSAP
  useGSAP(() => {
    if (isMobile === true || isMobile === null || !blobRef.current || !dotRef.current || !textRef.current) return;

    if (cursorType === 'magnetic') {
      // Outer Blob state transition
      gsap.to(blobRef.current, {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(196, 134, 42, 0.15)', // Amber tint
        borderColor: '#c4862a', // Amber border
        duration: 0.3,
        overwrite: 'auto',
      });
      // Dot state transition (fade out/shrink)
      gsap.to(dotRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        overwrite: 'auto',
      });
      // Text transition (fade out)
      gsap.to(textRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        overwrite: 'auto',
      });
    } else if (cursorType === 'text') {
      // Outer Blob state transition
      gsap.to(blobRef.current, {
        width: 120,
        height: 120,
        backgroundColor: 'transparent',
        borderColor: '#5c7a5a', // Sage-mid border
        duration: 0.3,
        overwrite: 'auto',
      });
      // Dot state transition (fade out/shrink)
      gsap.to(dotRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        overwrite: 'auto',
      });
      // Text transition (fade in)
      gsap.to(textRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        overwrite: 'auto',
      });
    } else {
      // Default State
      gsap.to(blobRef.current, {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        borderColor: '#5c7a5a', // Sage-mid border
        duration: 0.3,
        overwrite: 'auto',
      });
      // Dot state transition (fade in/normal scale)
      gsap.to(dotRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        overwrite: 'auto',
      });
      // Text transition (fade out)
      gsap.to(textRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        overwrite: 'auto',
      });
    }
  }, { dependencies: [cursorType, isMobile] });

  // Don't render anything if mobile or checking is active
  if (isMobile === true || isMobile === null) return null;

  return (
    <>
      {/* Outer Blob */}
      <div
        ref={blobRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-[1.5px] flex items-center justify-center"
        style={{
          width: '40px',
          height: '40px',
          borderColor: '#5c7a5a',
          backgroundColor: 'transparent',
          willChange: 'transform, width, height, background-color, border-color',
        }}
      >
        <span
          ref={textRef}
          className="font-dm text-[11px] font-medium uppercase tracking-wider text-ink dark:text-cream select-none opacity-0"
        >
          VIEW
        </span>
      </div>

      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full"
        style={{
          backgroundColor: '#5c7a5a',
          willChange: 'transform, opacity, scale',
        }}
      />
    </>
  );
}
