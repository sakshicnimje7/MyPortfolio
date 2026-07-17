'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  tags: string[];
  note?: string;
}

const experiences: ExperienceItem[] = [
  {
    role: "SAP Full Stack Developer Intern",
    company: "VegaH LLC",
    duration: "Nov 2025 – Present",
    tags: ["SAP EWM", "ABAP Cloud", "RAP Model", "SAP BTP"],
    note: "Building enterprise EWM workflows and automation solutions",
  },
  {
    role: "Infosys Springboard Virtual Internship 6.0",
    company: "Infosys",
    duration: "Nov 2025 – Jan 2026",
    tags: ["Spring Boot", "REST APIs", "Hibernate/JPA"],
  },
  {
    role: "Internship Trainee",
    company: "Ordnance Factory Chanda",
    duration: "May 2025 – Jun 2025",
    tags: ["Linux", "Firewall", "Domain Config", "Enterprise Systems"],
  },
  {
    role: "B.Tech Computer Science (SAP)",
    company: "Parul University",
    duration: "2023 – 2027",
    tags: ["DSA", "DBMS", "SAP Specialisation"],
  },
];

function ExperienceCard({ item, index }: { item: ExperienceItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px 0px" });

  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className="flex flex-col sm:flex-row w-full items-center relative mb-12 sm:mb-16 last:mb-0"
    >
      {/* Center line dot (Desktop only, centered on the line) */}
      <div className="hidden sm:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-3.5 h-3.5 rounded-full bg-[#c4862a] border-4 border-[#eae8df] shadow-sm"
        />
      </div>

      {/* Mobile dot (placed on the left line) */}
      <div className="sm:hidden absolute left-3.5 top-6 z-10">
        <div className="w-3 h-3 rounded-full bg-[#c4862a] border-2 border-[#eae8df] shadow-sm" />
      </div>

      {/* Left Column (even cards render here, odd dates render here) */}
      <div className="w-full sm:w-1/2 pr-0 sm:pr-12 flex justify-end order-2 sm:order-1 pl-12 sm:pl-0">
        {isEven ? (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#f7f5ef] border border-[#d4d0c4] rounded-[4px] p-5 shadow-sm text-left relative hover:border-[#c4862a] transition-colors"
          >
            <span className="font-mono text-[11px] text-[var(--amber)] uppercase tracking-[0.12em] font-semibold block sm:hidden mb-2">
              {item.duration}
            </span>
            <h3 className="font-cormorant font-semibold text-xl text-[var(--forest)] leading-tight mb-1">
              {item.role}
            </h3>
            <h4 className="font-dm font-medium text-xs text-[var(--ink)]/70 mb-3 tracking-wide">
              {item.company}
            </h4>
            {item.note && (
              <p className="font-dm font-light text-xs text-[#5c7a5a] italic mb-3">
                &ldquo;{item.note}&rdquo;
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 bg-[var(--cream-2)] text-[var(--forest)] font-mono text-[9px] rounded-full uppercase tracking-[0.12em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="hidden sm:flex flex-col items-end justify-center w-full pr-4">
            <span className="font-dm font-medium text-sm text-[var(--amber)] uppercase tracking-[0.12em]">
              {item.duration}
            </span>
          </div>
        )}
      </div>

      {/* Right Column (odd cards render here, even dates render here) */}
      <div className="w-full sm:w-1/2 pl-12 pr-0 sm:pl-12 flex justify-start order-3 sm:order-2">
        {!isEven ? (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#f7f5ef] border border-[#d4d0c4] rounded-[4px] p-5 shadow-sm text-left relative hover:border-[#c4862a] transition-colors"
          >
            <span className="font-mono text-[11px] text-[var(--amber)] uppercase tracking-[0.12em] font-semibold block sm:hidden mb-2">
              {item.duration}
            </span>
            <h3 className="font-cormorant font-semibold text-xl text-[var(--forest)] leading-tight mb-1">
              {item.role}
            </h3>
            <h4 className="font-dm font-medium text-xs text-[var(--ink)]/70 mb-3 tracking-wide">
              {item.company}
            </h4>
            {item.note && (
              <p className="font-dm font-light text-xs text-[#5c7a5a] italic mb-3">
                &ldquo;{item.note}&rdquo;
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 bg-[var(--cream-2)] text-[var(--forest)] font-mono text-[9px] rounded-full uppercase tracking-[0.12em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="hidden sm:flex flex-col items-start justify-center w-full pl-4">
            <span className="font-dm font-medium text-sm text-[var(--amber)] uppercase tracking-[0.12em]">
              {item.duration}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLineInView = useInView(containerRef, { once: true, margin: "-100px 0px" });

  return (
    <section id="experience" className="relative z-20 py-24 bg-[#eae8df] border-t border-[#d4d0c4]/45">
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2.5 max-w-xl mx-auto text-center">
          <h2 className="font-cormorant font-semibold text-[36px] sm:text-[64px] text-[var(--forest)] leading-[1.0] sm:leading-[1.2]">
            Journey & Experience
          </h2>
          <p className="font-dm font-light text-base sm:text-lg text-[var(--sage)] leading-relaxed">
            A timeline of building enterprise backends, SAP integrations, and academic foundations.
          </p>
        </div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative w-full flex flex-col items-center">
          {/* Vertical Center Line (Desktop) */}
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#d4d0c4] transform -translate-x-1/2">
            <motion.div
              initial={{ height: 0 }}
              animate={isLineInView ? { height: '100%' } : { height: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="w-full bg-[#c4862a] origin-top"
            />
          </div>

          {/* Vertical Left Line (Mobile only) */}
          <div className="sm:hidden absolute left-5 top-0 bottom-0 w-[1px] bg-[#d4d0c4]" />

          {/* Timeline Cards */}
          <div className="w-full flex flex-col relative z-20">
            {experiences.map((exp, idx) => (
              <ExperienceCard key={idx} item={exp} index={idx} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
