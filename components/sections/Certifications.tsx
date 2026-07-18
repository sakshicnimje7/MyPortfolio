'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  year?: string | null;
  category: string;
  certified: boolean;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/achievements')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCertifications(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch certifications:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center font-mono text-xs opacity-60 bg-[#f7f5ef] border-t border-[#d4d0c4]/45">
        Loading Certifications...
      </div>
    );
  }

  const sapCerts = certifications.filter(c => c.category.toUpperCase() === 'SAP');
  const sapCert = sapCerts.length > 0 ? sapCerts[0] : null;
  const otherCerts = sapCert 
    ? certifications.filter(c => c.id !== sapCert.id)
    : certifications;

  return (
    <section id="certifications" className="relative z-20 py-24 bg-[#f7f5ef]/80 dark:bg-[#111410]/85 backdrop-blur-[2px] border-t border-[#d4d0c4]/45">
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-16 items-center">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2.5 max-w-xl text-center">
          <h2 className="font-cormorant font-semibold text-[36px] sm:text-[64px] text-[var(--forest)] leading-[1.0] sm:leading-[1.2]">
            Certifications
          </h2>
          <p className="font-dm font-light text-base sm:text-lg text-[var(--sage)] leading-relaxed">
            Professional credentials validating my technical knowledge in enterprise development and algorithms.
          </p>
        </div>

        {/* Combined Certifications Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center items-center">
            
            {/* SAP Hero Certification */}
            {sapCert && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="col-span-1 sm:col-span-2 lg:col-span-2 w-full max-w-[480px] h-[280px] flex justify-center"
              >
                <div
                  data-cursor="magnetic"
                  className="w-full h-full rounded-lg border-[1.5px] border-[var(--amber)] bg-gradient-to-br from-[var(--amber-light)]/50 to-[var(--cream)] p-6 shadow-md hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group select-none"
                >
                  {/* Top Bar with Badge Tag */}
                  <div className="flex items-center justify-between w-full">
                    <span className="px-2.5 py-0.5 bg-[var(--forest)] text-[var(--cream)] font-mono text-[9px] uppercase tracking-[0.12em] rounded">
                      {sapCert.category}
                    </span>
                    {sapCert.certified && (
                      <span className="text-[10px] font-dm text-[var(--amber)] font-semibold uppercase tracking-[0.12em] flex items-center gap-0.5">
                        ★ SAP Certified
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div className="flex-1 flex items-center justify-center py-4">
                    <h3 className="font-dm font-semibold text-[15px] sm:text-[16px] text-[var(--ink)] text-center leading-relaxed group-hover:text-[var(--forest)] transition-colors px-1">
                      {sapCert.title}
                    </h3>
                  </div>

                  {/* Bottom Issuer details */}
                  <div className="border-t border-[var(--cream-3)]/45 pt-3.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[var(--sage-mid)] tracking-[0.12em]">
                      {sapCert.issuer}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--sage-mid)]">
                      {sapCert.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other Certifications */}
            {otherCerts.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                className="col-span-1 w-[180px] h-[180px] rounded-lg border border-[var(--cream-3)] bg-[var(--cream)]/80 dark:bg-[#181c17]/85 backdrop-blur-[2px] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[var(--amber)] hover:-translate-y-1 transition-all duration-300 select-none group"
              >
                {/* Colored Top Issuer logo area */}
                <div className="h-[44px] w-full bg-[var(--cream-2)] flex items-center justify-center border-b border-[var(--cream-3)]/30">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--forest)] font-semibold">
                    {cert.issuer}
                  </span>
                </div>

                {/* Title */}
                <div className="flex-1 flex items-center justify-center p-3">
                  <h4 className="font-dm font-medium text-[13px] text-[var(--ink)] text-center leading-snug">
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
