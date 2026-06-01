'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  tags: string; // Comma-separated list
  category: string;
  liveUrl: string;
  githubUrl: string | null;
  featured: boolean;
  order: number;
}

interface ProjectsProps {
  initialProjects: Project[];
}

// -------------------------------------------------------------
// WebGL Canvas Header Component
// -------------------------------------------------------------
interface CanvasHeaderProps {
  color: string;
  isHovered: boolean;
}

function CanvasHeader({ color, isHovered }: CanvasHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(Math.random() * 100); // Random offset so waves look organic

  // Initialize Three.js Scene
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const width = currentContainer.clientWidth || 300;
    const height = currentContainer.clientHeight || 160;

    // Create Scene, Camera, Renderer
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

    // Create Plane Geometry (highly subdivided for smooth waves)
    const geometry = new THREE.PlaneGeometry(3.2, 2.0, 48, 48);
    geometryRef.current = geometry;

    // Custom Vertex & Fragment Shaders for sin-wave displacement
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
          // Apply organic wave displacement on vertex z-axis
          float elevation = sin(pos.x * 5.0 + uTime * 2.5) * 0.14 * cos(pos.y * 5.0 + uTime * 1.8);
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
          // Adjust color based on displacement height to simulate light/shadow depth
          vec3 color = uColor + vec3(vElevation * 0.22);
          
          // Subtle radial vignette to soften edges
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

    // Resize Handler
    const handleResize = () => {
      if (!currentContainer || !renderer || !camera) return;
      const w = currentContainer.clientWidth;
      const h = currentContainer.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Initial render
    renderer.render(scene, camera);

    return () => {
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      if (currentContainer && renderer) {
        try {
          currentContainer.removeChild(renderer.domElement);
        } catch {
          // ignore
        }
      }
      renderer.dispose();
    };
  }, [color]);

  // Handle Play/Pause animation loop on Hover State changes
  useEffect(() => {
    let animationFrameId: number | null = null;

    const tick = () => {
      if (
        materialRef.current &&
        rendererRef.current &&
        sceneRef.current &&
        cameraRef.current
      ) {
        timeRef.current += 0.025; // Wave speed multiplier
        materialRef.current.uniforms.uTime.value = timeRef.current;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    if (isHovered) {
      animationFrameId = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Re-render once to keep static frame visible
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHovered]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// -------------------------------------------------------------
// Single Project Card Component with Intersection Observer
// -------------------------------------------------------------
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Stagger reveal on intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getCategoryColor = (cat: string) => {
    switch (cat.toUpperCase()) {
      case 'SAP':
        return '#d4d0c4';
      case 'JAVA':
        return '#eae8df';
      case 'AI':
        return '#f0d4a8'; // amber light
      case 'FRONTEND':
        return '#a8c4a2';
      default:
        return '#d4d0c4';
    }
  };

  const headerColor = getCategoryColor(project.category);
  const tagsList = project.tags.split(',').map(tag => tag.trim());

  return (
    <div
      ref={cardRef}
      data-cursor="text"
      className="bg-[#f7f5ef] border border-[#d4d0c4] rounded-[4px] overflow-hidden flex flex-col justify-between transition-all duration-700 ease-out shadow-sm select-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Coloured Header Bar (height 160px) with canvas overlay */}
        <div 
          className="h-[160px] relative w-full overflow-hidden flex items-center justify-center text-center p-6 border-b border-[#d4d0c4]/45"
          style={{ backgroundColor: headerColor }}
        >
          <CanvasHeader color={headerColor} isHovered={isHovered} />
          
          <h3 className="font-cormorant font-semibold text-2xl sm:text-3xl text-[#1a1a16] z-10 select-none pointer-events-none px-4 drop-shadow-sm">
            {project.title}
          </h3>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-4">
          <p className="font-dm text-sm font-light text-[#5c7a5a] leading-relaxed">
            {project.shortDesc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tagsList.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-[#eae8df] text-[#3d5e3b] font-mono text-[10px] rounded-full uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-[#d4d0c4]/30 flex items-center justify-between">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm text-[13px] font-medium text-[#c4862a] hover:text-[#3d5e3b] transition-colors"
          >
            GitHub repo
          </a>
        ) : (
          <span className="text-[11px] font-dm text-[#5c7a5a]/50 italic">
            Private codebase
          </span>
        )}

        <a
          href={project.liveUrl}
          className="font-dm text-[13px] font-medium text-[#c4862a] hover:text-[#3d5e3b] transition-colors flex items-center gap-1"
        >
          View project →
        </a>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Primary Section Component
// -------------------------------------------------------------
export default function Projects({ initialProjects }: ProjectsProps) {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'SAP' | 'Java' | 'AI' | 'Frontend'>('All');
  const filters: ('All' | 'SAP' | 'Java' | 'AI' | 'Frontend')[] = ['All', 'SAP', 'Java', 'AI', 'Frontend'];

  // Filter projects client-side
  const filteredProjects = initialProjects.filter(project => {
    if (selectedFilter === 'All') return true;
    return project.category.toUpperCase() === selectedFilter.toUpperCase();
  });

  return (
    <section id="work" className="relative z-20 py-24 bg-[#f7f5ef] border-t border-[#d4d0c4]/45">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2.5 max-w-2xl">
          <h2 className="font-cormorant font-semibold text-5xl sm:text-6xl text-[#3d5e3b] leading-tight">
            Selected Work
          </h2>
          <p className="font-dm font-light text-base sm:text-lg text-[#8fa68a] leading-relaxed">
            Built with Java, SAP ABAP, React, and a lot of coffee.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2.5">
          {filters.map(filter => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-2 rounded-full font-dm text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-[#3d5e3b] text-[#f7f5ef] shadow-sm'
                    : 'bg-[#eae8df] text-[#5c7a5a] hover:bg-[#d4d0c4]/60'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Grid Container */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-[#d4d0c4] rounded-lg">
            <p className="font-dm text-[#5c7a5a] italic text-sm">
              No projects found in this category.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
