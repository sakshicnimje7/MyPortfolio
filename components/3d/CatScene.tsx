'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';

function VoxelCat() {
  const catGroupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Group>(null);

  // Linear interpolation for smooth mouse look-at tracking
  const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouse = state.mouse;

    // 1. Gentle floating animation on Y axis
    if (catGroupRef.current) {
      catGroupRef.current.position.y = Math.sin(time * 0.8) * 0.08;
    }

    // 2. Subtle breathing animation scaling Y axis
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 1.2) * 0.015;
    }

    // 3. Mouse look-at tracking (lerp, max ±15 degrees)
    if (headRef.current) {
      headRef.current.rotation.y = lerp(headRef.current.rotation.y, mouse.x * 0.3, 0.05);
      headRef.current.rotation.x = lerp(headRef.current.rotation.x, -mouse.y * 0.15, 0.05);
    }
  });

  return (
    <group ref={catGroupRef} scale={0.9} position={[0, -0.4, 0]}>
      {/* Body: box 1.2 × 1.0 × 0.8 */}
      <mesh ref={bodyRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.0, 0.8]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Head Group: positioned above the body */}
      <group ref={headRef} position={[0, 0.9, 0]}>
        {/* Head Box: 1.0 × 1.0 × 0.8 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 1.0, 0.8]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.85} metalness={0.1} />
        </mesh>

        {/* Left Ear Outer: box 0.3 × 0.4 × 0.1 */}
        <mesh position={[-0.35, 0.6, 0]} rotation={[0, 0, 15 * (Math.PI / 180)]}>
          <boxGeometry args={[0.3, 0.4, 0.1]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.9} />
        </mesh>
        {/* Left Ear Inner: box 0.18 × 0.25 × 0.12 */}
        <mesh position={[-0.35, 0.6, 0.02]} rotation={[0, 0, 15 * (Math.PI / 180)]}>
          <boxGeometry args={[0.18, 0.25, 0.12]} />
          <meshStandardMaterial color="#d4862a" roughness={0.4} />
        </mesh>

        {/* Right Ear Outer: box 0.3 × 0.4 × 0.1 */}
        <mesh position={[0.35, 0.6, 0]} rotation={[0, 0, -15 * (Math.PI / 180)]}>
          <boxGeometry args={[0.3, 0.4, 0.1]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.9} />
        </mesh>
        {/* Right Ear Inner: box 0.18 × 0.25 × 0.12 */}
        <mesh position={[0.35, 0.6, 0.02]} rotation={[0, 0, -15 * (Math.PI / 180)]}>
          <boxGeometry args={[0.18, 0.25, 0.12]} />
          <meshStandardMaterial color="#d4862a" roughness={0.4} />
        </mesh>

        {/* Left Eye: box 0.22 × 0.08 × 0.05, rotated -5deg (droopy) */}
        <mesh position={[-0.22, 0.05, 0.401]} rotation={[0, 0, -5 * (Math.PI / 180)]}>
          <boxGeometry args={[0.22, 0.08, 0.05]} />
          <meshStandardMaterial color="#d4862a" emissive="#d4862a" emissiveIntensity={1.2} />
        </mesh>

        {/* Right Eye: box 0.22 × 0.08 × 0.05, rotated 5deg (droopy) */}
        <mesh position={[0.22, 0.05, 0.401]} rotation={[0, 0, 5 * (Math.PI / 180)]}>
          <boxGeometry args={[0.22, 0.08, 0.05]} />
          <meshStandardMaterial color="#d4862a" emissive="#d4862a" emissiveIntensity={1.2} />
        </mesh>

        {/* Nose: box 0.08 × 0.06 × 0.05 */}
        <mesh position={[0, -0.05, 0.401]}>
          <boxGeometry args={[0.08, 0.06, 0.05]} />
          <meshStandardMaterial color="#c4703a" roughness={0.7} />
        </mesh>

        {/* Whiskers (Left Side) */}
        <mesh position={[-0.32, -0.05, 0.402]} rotation={[0, 0.1, Math.PI / 2 + 0.08]}>
          <cylinderGeometry args={[0.008, 0.008, 0.35, 8]} />
          <meshStandardMaterial color="#888888" roughness={0.6} />
        </mesh>
        <mesh position={[-0.32, -0.11, 0.402]} rotation={[0, 0.1, Math.PI / 2 - 0.08]}>
          <cylinderGeometry args={[0.008, 0.008, 0.35, 8]} />
          <meshStandardMaterial color="#888888" roughness={0.6} />
        </mesh>

        {/* Whiskers (Right Side) */}
        <mesh position={[0.32, -0.05, 0.402]} rotation={[0, -0.1, Math.PI / 2 - 0.08]}>
          <cylinderGeometry args={[0.008, 0.008, 0.35, 8]} />
          <meshStandardMaterial color="#888888" roughness={0.6} />
        </mesh>
        <mesh position={[0.32, -0.11, 0.402]} rotation={[0, -0.1, Math.PI / 2 + 0.08]}>
          <cylinderGeometry args={[0.008, 0.008, 0.35, 8]} />
          <meshStandardMaterial color="#888888" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export default function CatScene() {
  return (
    <div className="w-full h-full select-none pointer-events-none">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        {/* Lights setup */}
        <ambientLight intensity={0.6} color="#f7f5ef" />
        
        {/* Warm amber main point light */}
        <pointLight position={[2, 3, 2]} intensity={1.2} color="#f0d4a8" />
        
        {/* Sage fill point light */}
        <pointLight position={[-2, 1, -1]} intensity={0.4} color="#a8c4a2" />

        {/* Voxel Cat Mesh Group */}
        <VoxelCat />
      </Canvas>
    </div>
  );
}
