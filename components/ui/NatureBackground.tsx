'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  swaySpeed: number;
  swayAmplitude: number;
  color: string;
  opacity: number;
  type: number; // 0: leaf, 1: petal, 2: small seed
}

export default function NatureBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 22;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const getColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        return [
          { r: 143, g: 166, b: 138 }, // Sage (#8fa68a)
          { r: 61, g: 94, b: 59 },    // Forest (#3d5e3b)
          { r: 196, g: 134, b: 42 }   // Amber (#c4862a)
        ];
      } else {
        return [
          { r: 143, g: 166, b: 138 }, // Sage (#8fa68a)
          { r: 196, g: 134, b: 42 },   // Amber (#c4862a)
          { r: 92, g: 122, b: 90 }    // Sage-mid (#5c7a5a)
        ];
      }
    };

    const createParticle = (initYAtTop = false): Particle => {
      const width = canvas.width || window.innerWidth;
      const height = canvas.height || window.innerHeight;
      const colors = getColors();
      const colorObj = colors[Math.floor(Math.random() * colors.length)];
      
      const isDark = document.documentElement.classList.contains('dark');
      const baseOpacity = isDark ? 0.025 : 0.045;
      
      return {
        x: Math.random() * width,
        y: initYAtTop ? -20 : Math.random() * height,
        size: 8 + Math.random() * 12,
        speedX: 0.15 + Math.random() * 0.35,
        speedY: 0.25 + Math.random() * 0.45,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        swaySpeed: 0.5 + Math.random() * 0.8,
        swayAmplitude: 0.4 + Math.random() * 0.8,
        color: `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, `,
        opacity: baseOpacity * (0.6 + Math.random() * 0.8),
        type: Math.floor(Math.random() * 3)
      };
    };

    const init = () => {
      resizeCanvas();
      particles = Array.from({ length: particleCount }, () => createParticle());
    };

    const drawLeaf = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, -size / 2);
      c.quadraticCurveTo(size / 3, -size / 8, size / 8, size / 2);
      c.quadraticCurveTo(-size / 3, size / 8, 0, -size / 2);
      c.closePath();
      c.fill();
      
      // Leaf center stem
      c.beginPath();
      c.moveTo(0, -size / 2);
      c.lineTo(0, size / 2);
      c.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      c.lineWidth = 1;
      c.stroke();
    };

    const drawPetal = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, -size / 2);
      c.bezierCurveTo(size * 0.4, -size * 0.4, size * 0.4, size * 0.4, 0, size / 2);
      c.bezierCurveTo(-size * 0.4, size * 0.4, -size * 0.4, -size * 0.4, 0, -size / 2);
      c.closePath();
      c.fill();
    };

    const drawSeed = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.arc(0, 0, size / 4, 0, Math.PI * 2);
      c.fill();
      
      // Small fluff lines
      for (let i = 0; i < 5; i++) {
        const angle = (i / 4) * Math.PI - Math.PI / 2;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(Math.cos(angle) * (size / 2), Math.sin(angle) * (size / 2));
        c.stroke();
      }
    };

    let lastTime = 0;
    const animate = (time: number) => {
      const delta = lastTime ? (time - lastTime) / 16.666 : 1;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        // Update positions
        p.y += p.speedY * delta;
        p.x += (p.speedX + Math.sin(time * 0.001 * p.swaySpeed) * p.swayAmplitude) * delta;
        p.rotation += p.rotationSpeed * delta;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.strokeStyle = p.color + (p.opacity * 0.5) + ')';

        if (p.type === 0) {
          drawLeaf(ctx, p.size);
        } else if (p.type === 1) {
          drawPetal(ctx, p.size);
        } else {
          drawSeed(ctx, p.size);
        }

        ctx.restore();

        // Recycle if out of bounds
        if (p.y > canvas.height + 20 || p.x > canvas.width + 20) {
          particles[idx] = createParticle(true);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    window.addEventListener('resize', resizeCanvas);
    animationFrameId = requestAnimationFrame(animate);

    // Watch for class changes on documentElement (theme toggle)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const colors = getColors();
          const isDark = document.documentElement.classList.contains('dark');
          const baseOpacity = isDark ? 0.025 : 0.045;
          
          particles.forEach(p => {
            const colorObj = colors[Math.floor(Math.random() * colors.length)];
            p.color = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, `;
            p.opacity = baseOpacity * (0.6 + Math.random() * 0.8);
          });
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
