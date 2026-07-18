'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  tags: string; // Comma-separated
  category: string;
  liveUrl: string;
  githubUrl: string | null;
  featured: boolean;
  order: number;
}

interface ProjectsProps {
  initialProjects: Project[];
  active?: boolean;
  progress?: number;
}

// -------------------------------------------------------------
// WebGL Canvas Overlay for 3D Card Columns
// -------------------------------------------------------------
function CanvasHeader({ color, isHovered }: { color: string; isHovered: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  
  const timeRef = useRef<number>(Math.random() * 100);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const width = currentContainer.clientWidth || 300;
    const height = currentContainer.clientHeight || 160;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.z = 2.0;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
    currentContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const threeColor = new THREE.Color(color);
    const geometry = new THREE.PlaneGeometry(3.2, 2.0, 32, 32);
    geometryRef.current = geometry;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: timeRef.current },
        uColor: { value: threeColor },
      },
      vertexShader: `
        uniform float uTime;
        varying float vElevation;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float elevation = sin(pos.x * 4.0 + uTime * 2.0) * 0.12 * cos(pos.y * 4.0 + uTime * 1.5);
          pos.z += elevation;
          vElevation = elevation;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vElevation;
        varying vec2 vUv;
        void main() {
          vec3 color = uColor + vec3(vElevation * 0.25);
          float vignette = vUv.x * (1.0 - vUv.x) * vUv.y * (1.0 - vUv.y) * 16.0;
          color *= mix(0.85, 1.0, vignette);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    const handleResize = () => {
      if (!currentContainer || !renderer || !camera) return;
      const w = currentContainer.clientWidth;
      const h = currentContainer.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    renderer.render(scene, camera);

    return () => {
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      if (currentContainer && renderer) {
        try {
          currentContainer.removeChild(renderer.domElement);
        } catch {}
      }
      renderer.dispose();
    };
  }, [color]);

  useEffect(() => {
    let animationFrameId: number | null = null;
    const tick = () => {
      if (materialRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
        timeRef.current += 0.02;
        materialRef.current.uniforms.uTime.value = timeRef.current;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    if (isHovered) {
      animationFrameId = requestAnimationFrame(tick);
    } else {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// -------------------------------------------------------------
// Card Item Component
// -------------------------------------------------------------
function StickyCard({ 
  project, 
  index, 
  placeholderImage 
}: { 
  project: Project; 
  index: number;
  placeholderImage: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getCategoryColor = (cat: string) => {
    switch (cat.toUpperCase()) {
      case 'SAP': return '#253d23'; // Deep Forest Green matching --forest
      case 'JAVA': return '#705423'; // Warm Earthy Ochre/Amber
      case 'AI': return '#303c2e'; // Sophisticated Dark Slate/Olive
      case 'FRONTEND': return '#4e614a'; // Soft Sage Green matching --sage
      default: return '#5c7a5a'; // Mid Sage Green
    }
  };

  const cardBg = getCategoryColor(project.category);
  const tagsList = project.tags.split(',').map(t => t.trim());

  return (
    <div
      ref={cardRef}
      id={`card-${index}`}
      className="card shadow-2xl border border-cream-3/20 bg-cover relative select-none"
      style={{ 
        backgroundColor: cardBg,
        zIndex: 20 - index
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wave Background Overlay */}
      <CanvasHeader color={cardBg} isHovered={isHovered} />

      {/* Columns */}
      <div className="col flex flex-col justify-between p-4 sm:p-8 z-10">
        <div className="flex flex-col gap-2 sm:gap-4">
          <p className="font-mono text-xs sm:text-sm tracking-widest text-[#f7f5ef]/80">
            {project.category} · PROJECT {index + 1}
          </p>
          <h2 className="font-cormorant font-semibold text-3xl sm:text-5xl text-[#f7f5ef] leading-tight">
            {project.title}
          </h2>
          <p className="font-dm font-normal text-sm sm:text-base text-[#f7f5ef]/90 leading-relaxed max-w-md normal-case">
            {project.shortDesc}
          </p>
        </div>

        {/* Tags & Action Links */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-wrap gap-2">
            {tagsList.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-[#f7f5ef]/10 text-[#f7f5ef] font-mono text-[9px] sm:text-[10px] rounded-full uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-2 pt-4 border-t border-[#f7f5ef]/20">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-dm text-xs sm:text-sm font-medium text-[#f7f5ef] hover:underline"
              >
                GitHub
              </a>
            )}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-dm text-xs sm:text-sm font-medium text-[#f7f5ef] hover:underline"
            >
              Live Site
            </a>
          </div>
        </div>
      </div>

      {/* Image Column */}
      <div className="col hidden sm:block relative rounded-xl overflow-hidden shadow-inner border border-[#f7f5ef]/10">
        <Image
          src={placeholderImage}
          alt={project.title}
          fill
          sizes="(max-width: 1000px) 100vw, 35vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Primary Section Component
// -------------------------------------------------------------
export default function Projects({ initialProjects, active, progress = 0 }: ProjectsProps) {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'SAP' | 'Java' | 'AI' | 'Frontend'>('All');
  const filters: ('All' | 'SAP' | 'Java' | 'AI' | 'Frontend')[] = ['All', 'SAP', 'Java', 'AI', 'Frontend'];
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter projects client-side (featured only to fit stack beautifully)
  const filteredProjects = initialProjects
    .filter(project => {
      if (selectedFilter === 'All') return true;
      return project.category.toUpperCase() === selectedFilter.toUpperCase();
    })
    .slice(0, 4); // Clamp to max 4 items for the stack

  const placeholderImages = [
    '/card-img-1.jpg',
    '/card-img-2.jpg',
    '/card-img-3.jpg',
    '/card-img-4.jpg'
  ];

  // Drive sticky card stack layout transforms using the slide progress or internal ScrollTrigger
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.card');
    if (!cards || cards.length === 0) return;

    const totalCards = cards.length;
    const segmentSize = 1 / totalCards;
    const cardYOffset = 6;
    const cardScaleStep = 0.075;

    let scrollTriggerInstance: ScrollTrigger | null = null;

    const updateStack = (prog: number) => {
      cards.forEach((card, i) => {
        const activeIndex = Math.min(Math.floor(prog / segmentSize), totalCards - 1);
        const segProgress = (prog - activeIndex * segmentSize) / segmentSize;

        if (i < activeIndex) {
          // Card is swiped out upward (repo config)
          gsap.set(card, {
            xPercent: -50,
            yPercent: -250,
            rotationX: 35,
            opacity: 0,
          });
        } else if (i === activeIndex) {
          // Card is currently active/swiping (repo config)
          gsap.set(card, {
            xPercent: -50,
            yPercent: gsap.utils.interpolate(-50, -200, segProgress),
            rotationX: gsap.utils.interpolate(0, 35, segProgress),
            scale: 1,
            opacity: 1,
          });
        } else {
          // Card is stacked behind (repo config)
          const behindIndex = i - activeIndex;
          const currentYOffset = (behindIndex - segProgress) * cardYOffset;
          const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;

          gsap.set(card, {
            xPercent: -50,
            yPercent: -50 + currentYOffset,
            rotationX: 0,
            scale: currentScale,
            opacity: 1,
          });
        }
      });
    };

    if (progress !== undefined && active !== undefined) {
      if (!active) {
        // Reset to initial stacked state
        cards.forEach((card, i) => {
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50 + i * cardYOffset,
            scale: 1 - i * cardScaleStep,
            rotationX: 0,
            opacity: 1,
          });
        });
      } else {
        updateStack(progress);
      }
    } else {
      // Create internal ScrollTrigger to pin and scrub projects stack during page scroll
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%', // Pin for 1.5 screen heights of scroll
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          updateStack(self.progress);
        },
      });
    }

    return () => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, [progress, active, filteredProjects.length]);

  return (
    <section 
      ref={containerRef}
      id="work" 
      className="relative w-full min-h-screen flex flex-col justify-between py-12 px-6 sm:px-12 bg-[#eae8df]/35 dark:bg-[#111410]/45 backdrop-blur-[3px] overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20">
        <div>
          <h2 className="font-cormorant font-semibold text-3xl sm:text-5xl text-[var(--forest)] dark:text-[#eae8df] leading-none">
            Selected Work
          </h2>
          <p className="font-dm font-normal text-xs sm:text-sm text-[var(--sage)] dark:text-[#8fa68a] mt-1.5">
            Enterprise backends, SAP UI5 utilities, and web animations.
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 rounded-full font-dm text-xs font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-[var(--forest)] text-[var(--cream)] shadow-sm'
                  : 'bg-[var(--cream-2)] text-[var(--sage-mid)] hover:bg-[var(--cream-3)]/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Sticky Cards Stack Area */}
      <div className="flex-1 w-full relative flex items-center justify-center py-8">
        <div className="sticky-cards w-full h-full relative flex items-center justify-center">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, idx) => (
              <StickyCard
                key={project.id}
                project={project}
                index={idx}
                placeholderImage={placeholderImages[idx % placeholderImages.length]}
              />
            ))
          ) : (
            <div className="py-16 text-center border border-dashed border-[#d4d0c4] rounded-lg w-full max-w-lg z-10 bg-[#f7f5ef]/80">
              <p className="font-dm text-[#5c7a5a] italic text-xs sm:text-sm">
                No featured projects found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
