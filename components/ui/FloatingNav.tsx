'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  target: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Work', target: 'work', href: '#work' },
  { label: 'About', target: 'about', href: '#about' },
  { label: 'Blog', target: 'blog', href: '/blog' },
  { label: 'Contact', target: 'contact', href: '#contact' },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const lastScrollY = useRef(0);

  // 1. Hide on scroll down, show on scroll up. Also hide near top on home page.
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isHome) {
        const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        if (currentScrollY < heroHeight * 0.8) {
          setVisible(false);
        } else if (currentScrollY > lastScrollY.current) {
          // Scrolling down -> hide
          setVisible(false);
        } else {
          // Scrolling up -> show
          setVisible(true);
        }
      } else {
        // On sub-pages like /blog, show immediately at top, and hide/show on scroll
        if (currentScrollY < 50) {
          setVisible(true);
        } else if (currentScrollY > lastScrollY.current) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initially to set visibility status
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // 2. Track which section is in view on the homepage
  useEffect(() => {
    if (!isHome) {
      if (pathname.startsWith('/blog')) {
        setActiveSection('blog');
      } else {
        setActiveSection('');
      }
      return;
    }

    // IntersectionObserver to detect active section on landing page
    const sections = ['about', 'work', 'lab', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -55% 0px', // Detect items in the center viewport focus zone
      threshold: 0.05,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Reset highlighting if at the top (Hero)
    const handleHeroDetection = () => {
      if (window.scrollY < 250) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleHeroDetection, { passive: true });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      window.removeEventListener('scroll', handleHeroDetection);
    };
  }, [isHome, pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: -80, x: '-50%', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-6 left-1/2 z-50 pointer-events-auto"
        >
          <nav 
            className="flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-[rgba(247,245,239,0.85)] dark:bg-[rgba(24,28,23,0.85)] rounded-[100px] shadow-lg shadow-black/[0.03] dark:shadow-white/[0.01] backdrop-blur-[12px] select-none"
            style={{ border: '0.5px solid var(--cream-3)' }}
          >
            {navItems.map((item) => {
              const isLinkActive = activeSection === item.target;
              const resolvedHref = item.target === 'blog' ? '/blog' : (isHome ? item.href : `/${item.href}`);

              return (
                <Link
                  key={item.label}
                  href={resolvedHref}
                  data-cursor="magnetic"
                  className="relative px-3.5 py-1.5 sm:px-4 sm:py-2 text-[13px] font-dm tracking-wide font-medium transition-colors duration-300 outline-none rounded-full"
                  style={{
                    color: isLinkActive ? 'var(--ink)' : 'var(--sage-mid)',
                  }}
                >
                  {/* Sliding active highlight underline */}
                  {isLinkActive && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute bottom-1 left-2.5 right-2.5 h-[2px] bg-[var(--amber)] rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover effect text glow */}
                  <span className="relative z-10 hover:text-[var(--ink)] transition-colors">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
