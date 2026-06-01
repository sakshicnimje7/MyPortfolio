'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Certification {
  title: string;
  issuer: string;
  year?: string;
  category: 'SAP' | 'Infosys';
  certifiedTag?: boolean;
}

const certifications: Certification[] = [
  {
    title: "SAP Certified Associate — Back-End Developer — ABAP Cloud",
    issuer: "SAP",
    year: "2025",
    category: "SAP",
    certifiedTag: true,
  },
  {
    title: "DSA Using Java",
    issuer: "Infosys",
    category: "Infosys",
  },
  {
    title: "Java Foundation Certification",
    issuer: "Infosys",
    category: "Infosys",
  },
  {
    title: "Database Management Systems",
    issuer: "Infosys",
    category: "Infosys",
  },
  {
    title: "Agile Scrum in Practice",
    issuer: "Infosys",
    category: "Infosys",
  },
];

export default function Certifications() {
  const sapCert = certifications[0];
  const otherCerts = certifications.slice(1);

  return (
    <section id="certifications" className="relative z-20 py-24 bg-[#f7f5ef] border-t border-[#d4d0c4]/45">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-16 items-center">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2.5 max-w-xl text-center">
          <h2 className="font-cormorant font-semibold text-5xl sm:text-6xl text-[#3d5e3b] leading-tight">
            Certifications
          </h2>
          <p className="font-dm font-light text-base sm:text-lg text-[#8fa68a] leading-relaxed">
            Professional credentials validating my technical knowledge in enterprise development and algorithms.
          </p>
        </div>

        {/* SAP Hero Certification */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex justify-center w-full"
        >
          <div
            data-cursor="magnetic"
            className="w-[240px] h-[280px] rounded-lg border-[1.5px] border-[#c4862a] bg-gradient-to-br from-[#f0d4a8]/50 to-[#f7f5ef] p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group select-none hover:-translate-y-1.5"
          >
            {/* Top Bar with Badge Tag */}
            <div className="flex items-center justify-between w-full">
              <span className="px-2 py-0.5 bg-[#3d5e3b] text-[#f7f5ef] font-mono text-[9px] uppercase tracking-wider rounded">
                SAP
              </span>
              <span className="text-[10px] font-dm text-[#c4862a] font-semibold uppercase tracking-widest flex items-center gap-0.5">
                ★ Certified
              </span>
            </div>

            {/* Title */}
            <div className="flex-1 flex items-center justify-center py-4">
              <h3 className="font-dm font-semibold text-[13px] text-[#1a1a16] text-center leading-relaxed group-hover:text-[#3d5e3b] transition-colors px-1">
                {sapCert.title}
              </h3>
            </div>

            {/* Bottom Issuer details */}
            <div className="border-t border-[#d4d0c4]/45 pt-3.5 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-[#5c7a5a]">
                SAP SE
              </span>
              <span className="font-mono text-[10px] text-[#5c7a5a]">
                {sapCert.year}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Other Certifications Grid */}
        <div className="w-full mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {otherCerts.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                className="w-[180px] h-[180px] rounded-lg border border-[#d4d0c4] bg-[#f7f5ef] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#c4862a] hover:-translate-y-1 transition-all duration-300 select-none group"
              >
                {/* Colored Top Issuer logo area */}
                <div className="h-[44px] w-full bg-[#eae8df] flex items-center justify-center border-b border-[#d4d0c4]/30">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#3d5e3b] font-semibold">
                    {cert.issuer}
                  </span>
                </div>

                {/* Title */}
                <div className="flex-1 flex items-center justify-center p-3">
                  <h4 className="font-dm font-medium text-[13px] text-[#1a1a16] text-center leading-snug">
                    {cert.title}
                  </h4>
                </div>

                {/* Bottom spacer */}
                <div className="h-[12px] w-full" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
