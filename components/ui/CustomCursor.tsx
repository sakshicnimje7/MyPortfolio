'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [cursorType, setCursorType] = useState<'default' | 'magnetic' | 'text'>('default');
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);

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

    // Fallback: add style tag to hide cursor universally
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

    // Initialize quickTo for trailing blob (higher duration for a smoother lag trail)
    xBlobTo.current = gsap.quickTo(blobRef.current, "x", { duration: 0.35, ease: "power3.out" });
    yBlobTo.current = gsap.quickTo(blobRef.current, "y", { duration: 0.35, ease: "power3.out" });

    // Initialize quickTo for trailing dot (snappy and tight)
    xDotTo.current = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power2.out" });
    yDotTo.current = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power2.out" });
  }, { scope: blobRef, dependencies: [isMobile] });

  // Mouse move listener: tracks mouse and updates element positions / magnetic pull
  useEffect(() => {
    if (isMobile === true || isMobile === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Inner dot always tracks cursor position
      if (xDotTo.current) xDotTo.current(e.clientX);
      if (yDotTo.current) yDotTo.current(e.clientY);

      // Outer blob locks onto the button center if magnetic, otherwise follows mouse
      if (cursorType === 'magnetic' && hoveredEl) {
        const currentX = (gsap.getProperty(hoveredEl, "x") as number) || 0;
        const currentY = (gsap.getProperty(hoveredEl, "y") as number) || 0;

        const rect = hoveredEl.getBoundingClientRect();
        const originalCenterX = rect.left + rect.width / 2 - currentX;
        const originalCenterY = rect.top + rect.height / 2 - currentY;
        
        if (xBlobTo.current) xBlobTo.current(rect.left + rect.width / 2);
        if (yBlobTo.current) yBlobTo.current(rect.top + rect.height / 2);

        // Apply physical magnetic pull on the target button element relative to original center
        const offsetX = e.clientX - originalCenterX;
        const offsetY = e.clientY - originalCenterY;
        
        // Clamp magnetic pull to a maximum of 16px to prevent button drifting away from hover bounds
        const maxPull = 16;
        const pullX = Math.max(-maxPull, Math.min(maxPull, offsetX * 0.28));
        const pullY = Math.max(-maxPull, Math.min(maxPull, offsetY * 0.28));
        
        gsap.to(hoveredEl, {
          x: pullX,
          y: pullY,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        if (xBlobTo.current) xBlobTo.current(e.clientX);
        if (yBlobTo.current) yBlobTo.current(e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, cursorType, hoveredEl]);

  // Hover states detection using event delegation
  useEffect(() => {
    if (isMobile === true || isMobile === null) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('[data-cursor]') as HTMLElement;
      const related = e.relatedTarget as HTMLElement;
      
      if (interactiveEl) {
        // Prevent re-initialization if moving inside the same magnetic container
        if (related && interactiveEl.contains(related)) return;
        
        const type = interactiveEl.getAttribute('data-cursor');
        if (type === 'magnetic') {
          setCursorType('magnetic');
          setHoveredEl(interactiveEl);
          
          // Initial quickTo snap to center instantly on enter
          const rect = interactiveEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          if (xBlobTo.current) xBlobTo.current(centerX);
          if (yBlobTo.current) yBlobTo.current(centerY);
        } else if (type === 'text') {
          setCursorType('text');
          const customText = interactiveEl.getAttribute('data-cursor-text');
          if (textRef.current) {
            textRef.current.innerText = customText || 'VIEW';
          }
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('[data-cursor]') as HTMLElement;
      const related = e.relatedTarget as HTMLElement;
      
      if (interactiveEl) {
        // Prevent release reset if moving inside the same magnetic container
        if (related && interactiveEl.contains(related)) return;
        
        setCursorType('default');
        setHoveredEl(null);

        // Soft spring release for magnetic translation reset
        if (interactiveEl.getAttribute('data-cursor') === 'magnetic') {
          gsap.to(interactiveEl, {
            x: 0,
            y: 0,
            scale: 1.0,
            duration: 0.6,
            ease: "elastic.out(1.1, 0.6)",
            overwrite: "auto",
          });
        }

        if (textRef.current) {
          textRef.current.innerText = 'VIEW';
        }
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('[data-cursor]') as HTMLElement;
      if (interactiveEl) {
        const type = interactiveEl.getAttribute('data-cursor');
        if (type === 'text') {
          // Wait briefly for react state updates in source components
          setTimeout(() => {
            const customText = interactiveEl.getAttribute('data-cursor-text');
            if (textRef.current && customText) {
              textRef.current.innerText = customText;
            }
          }, 30);
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [isMobile]);

  // Animate cursor state transitions using GSAP
  useGSAP(() => {
    if (isMobile === true || isMobile === null || !blobRef.current || !dotRef.current || !textRef.current) return;

    if (cursorType === 'magnetic' && hoveredEl) {
      const rect = hoveredEl.getBoundingClientRect();
      const style = window.getComputedStyle(hoveredEl);
      const radius = style.borderRadius || '2px';
      
      // Stretch border outline to encapsulate target button element
      const padX = 14;
      const padY = 8;

      gsap.to(blobRef.current, {
        width: rect.width + padX,
        height: rect.height + padY,
        borderRadius: radius,
        backgroundColor: 'rgba(61, 94, 59, 0.06)', // soft forest green tint
        borderColor: '#3d5e3b', // forest green outline
        boxShadow: '0 0 16px rgba(61, 94, 59, 0.1)',
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      // Shrink and dim the central pointer dot
      gsap.to(dotRef.current, {
        scale: 0.4,
        opacity: 0.4,
        duration: 0.25,
        overwrite: 'auto',
      });
      // Hide cursor text
      gsap.to(textRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        overwrite: 'auto',
      });
    } else if (cursorType === 'text') {
      // Outer Blob expands to frame text
      gsap.to(blobRef.current, {
        width: 110,
        height: 110,
        borderRadius: '50%',
        backgroundColor: 'rgba(247, 245, 239, 0.85)', // light cream backdrop
        borderColor: '#5c7a5a', // Sage border
        boxShadow: '0 8px 24px rgba(92, 122, 90, 0.12)',
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      // Fade out pointer dot
      gsap.to(dotRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        overwrite: 'auto',
      });
      // Fade in cursor text label
      gsap.to(textRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        overwrite: 'auto',
      });
    } else {
      // Default state: clean sage-green outer ring and inner dot
      gsap.to(blobRef.current, {
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: 'transparent',
        borderColor: '#5c7a5a', // Sage border
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      // Restore central pointer dot
      gsap.to(dotRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        overwrite: 'auto',
      });
      // Hide text
      gsap.to(textRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        overwrite: 'auto',
      });
    }
  }, { dependencies: [cursorType, hoveredEl, isMobile] });

  // Don't render anything if mobile or checking is active
  if (isMobile === true || isMobile === null) return null;

  return (
    <>
      {/* Outer Blob Frame / Capsule */}
      <div
        ref={blobRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-[1.5px] flex items-center justify-center"
        style={{
          width: '32px',
          height: '32px',
          borderColor: '#5c7a5a',
          backgroundColor: 'transparent',
          willChange: 'transform, width, height, background-color, border-color, border-radius, box-shadow',
        }}
      >
        <span
          ref={textRef}
          className="font-dm text-[10px] font-semibold uppercase tracking-wider text-[#3d5e3b] dark:text-[#eae8df] select-none opacity-0"
        >
          VIEW
        </span>
      </div>

      {/* Inner Dot with Soft Glow */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full shadow-[0_0_8px_rgba(92,122,90,0.4)]"
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: '#3d5e3b',
          willChange: 'transform, opacity, scale',
        }}
      />
    </>
  );
}
