'use client';

import React, { useState } from 'react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sakshinimje7@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      id="contact" 
      className="relative z-20 min-h-screen flex flex-col justify-between bg-[#3d5e3b]/65 dark:bg-[#1c2a1c]/70 backdrop-blur-[3px] text-[#f7f5ef] py-16 px-6 sm:px-12 md:px-24"
    >
      {/* Top spacer for layout alignment */}
      <div className="h-10" />

      {/* Main Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div className="flex flex-col select-none">
          <h2 
            className="font-cormorant font-normal text-[#f7f5ef] leading-none"
            style={{ fontSize: 'clamp(44px, 7vw, 112px)' }}
          >
            Let&apos;s build
          </h2>
          <h2 
            className="font-cormorant font-semibold text-[#f0d4a8] leading-none mt-2"
            style={{ fontSize: 'clamp(44px, 7vw, 112px)' }}
          >
            something.
          </h2>
        </div>

        {/* Click-to-copy Email */}
        <div className="flex flex-col items-center gap-2 mt-8">
          <button
            onClick={handleCopyEmail}
            data-cursor="text"
            data-cursor-text={copied ? "COPIED ✓" : "COPY"}
            className="font-mono text-base sm:text-lg text-[#a8c4a2] hover:text-[#f0d4a8] transition-colors duration-300 bg-transparent border-none outline-none select-none flex items-center gap-3 cursor-pointer"
          >
            sakshinimje7@gmail.com
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="opacity-70"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          </button>
          
          {/* Subtle Success Message Indicator */}
          <div className="h-6 relative overflow-hidden w-full flex justify-center">
            <span 
              className={`font-dm text-xs text-[#a8c4a2]/70 uppercase tracking-widest absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                copied ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              Address copied to clipboard!
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div className="w-full max-w-6xl mx-auto border-t border-[#8fa68a]/25 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-dm text-[13px] text-[#8fa68a]">
        
        {/* Social Links & Domain */}
        <div className="flex items-center gap-6">
          {/* LinkedIn Icon */}
          <a
            href="https://linkedin.com/in/sakshinimje"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f7f5ef] transition-colors flex items-center gap-1.5"
            data-cursor="magnetic"
          >
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>

          <span className="opacity-30">·</span>

          {/* GitHub Icon */}
          <a
            href="https://github.com/sakshinimje"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f7f5ef] transition-colors flex items-center gap-1.5"
            data-cursor="magnetic"
          >
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            GitHub
          </a>
        </div>

        {/* Domain name */}
        <div className="select-none font-mono">
          sakshinimje.in
        </div>
      </div>
    </section>
  );
}
