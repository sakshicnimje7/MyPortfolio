'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload the GLB model to speed up rendering
useGLTF.preload('/Hitem3d-1781678649454.glb');

function LowPolyCatModel() {
  const { scene } = useGLTF('/Hitem3d-1781678649454.glb');
  
  const rootRef = useRef<THREE.Group>(null);
  
  // Animation Uniforms held in ref for stable references
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uBlink: { value: 0 },
    uLeftEarTwitch: { value: 0 },
    uRightEarTwitch: { value: 0 },
    uTailSway: { value: 0 },
  });

  // Timing states for randomized animations
  const blinkTimer = useRef(3 + Math.random() * 4);
  const blinkProgress = useRef(-1);
  const twitchTimer = useRef(4 + Math.random() * 6);
  const twitchProgress = useRef(-1);

  // Mouse interpolation lag states
  const mouseInterpolated = useRef(new THREE.Vector2(0, 0));
  
  // Track mouse position globally across window to bypass pointer-events blocker
  const windowMouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      windowMouse.current.set(x, y);
    };
    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!scene) return;

    // Configure materials for matte low-poly aesthetic and custom shader logic
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        
        if (mat) {
          mat.roughness = 0.55;
          mat.metalness = 0.25;
          mat.flatShading = true;
          
          mat.onBeforeCompile = (shader) => {
            // Bind our uniforms
            shader.uniforms.uTime = uniformsRef.current.uTime;
            shader.uniforms.uMouse = uniformsRef.current.uMouse;
            shader.uniforms.uBlink = uniformsRef.current.uBlink;
            shader.uniforms.uLeftEarTwitch = uniformsRef.current.uLeftEarTwitch;
            shader.uniforms.uRightEarTwitch = uniformsRef.current.uRightEarTwitch;
            shader.uniforms.uTailSway = uniformsRef.current.uTailSway;
            
            // Inject uniforms and varyings in vertex shader
            shader.vertexShader = `
              uniform float uTime;
              uniform vec2 uMouse;
              uniform float uBlink;
              uniform float uLeftEarTwitch;
              uniform float uRightEarTwitch;
              uniform float uTailSway;
              varying vec3 vLocalPosition;
              varying vec2 vLocalUv;
            ` + shader.vertexShader;
            
            // Pass the original undeformed position and uv coordinates
            shader.vertexShader = shader.vertexShader.replace(
              'void main() {',
              `
              void main() {
                vLocalPosition = position;
                vLocalUv = uv;
              `
            );
            
            // Apply vertex deformations
            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `
              #include <begin_vertex>
              
              vec3 pos = transformed;
              
              // 1. Body Breathing (Y < 0.30)
              if (pos.y < 0.30) {
                float breathe = sin(uTime * 1.25) * 0.018;
                pos.x *= (1.0 + breathe);
                pos.z *= (1.0 + breathe);
              }
              
              // 2. Head Rotation (Y >= 0.30)
              if (pos.y >= 0.30) {
                // Pivot center for head rotation (aligned to neck joint of GLB model)
                vec3 headPivot = vec3(-0.09, 0.30, 0.05);
                vec3 rel = pos - headPivot;
                
                // Rotations: horizontal ±15° (0.26 rad), vertical ±8° (0.14 rad)
                float angleY = uMouse.x * 0.26;
                float angleX = -uMouse.y * 0.14;
                
                // Yaw (Y-axis) rotation matrix
                float cosY = cos(angleY);
                float sinY = sin(angleY);
                mat3 rotY = mat3(
                  cosY, 0.0, sinY,
                  0.0, 1.0, 0.0,
                  -sinY, 0.0, cosY
                );
                
                // Pitch (X-axis) rotation matrix
                float cosX = cos(angleX);
                float sinX = sin(angleX);
                mat3 rotX = mat3(
                  1.0, 0.0, 0.0,
                  0.0, cosX, -sinX,
                  0.0, sinX, cosX
                );
                
                rel = rotY * rotX * rel;
                pos = rel + headPivot;
              }
              
              // 3. Left Ear twitch (Y >= 0.70, X < -0.09)
              if (pos.y >= 0.70 && pos.x < -0.09) {
                vec3 earPivot = vec3(-0.28, 0.70, 0.15);
                vec3 rel = pos - earPivot;
                float twitchAngle = uLeftEarTwitch * 0.25;
                float cosT = cos(twitchAngle);
                float sinT = sin(twitchAngle);
                mat3 rotZ = mat3(
                  cosT, -sinT, 0.0,
                  sinT, cosT, 0.0,
                  0.0, 0.0, 1.0
                );
                pos = rotZ * rel + earPivot;
              }
              
              // 4. Right Ear twitch (Y >= 0.70, X > -0.09)
              if (pos.y >= 0.70 && pos.x > -0.09) {
                vec3 earPivot = vec3(0.10, 0.70, 0.15);
                vec3 rel = pos - earPivot;
                float twitchAngle = uRightEarTwitch * 0.25;
                float cosT = cos(twitchAngle);
                float sinT = sin(twitchAngle);
                mat3 rotZ = mat3(
                  cosT, -sinT, 0.0,
                  sinT, cosT, 0.0,
                  0.0, 0.0, 1.0
                );
                pos = rotZ * rel + earPivot;
              }
              
              // 5. Tail sway (Z < -0.15, Y < 0.1)
              if (pos.z < -0.15 && pos.y < 0.1) {
                vec3 tailPivot = vec3(0.0, -0.4, -0.15);
                vec3 rel = pos - tailPivot;
                float dist = length(rel.z);
                float swayAngle = sin(uTime * 1.5 + dist * 4.0) * 0.15 + uTailSway * 0.1;
                
                float cosS = cos(swayAngle);
                float sinS = sin(swayAngle);
                mat3 rotY = mat3(
                  cosS, 0.0, sinS,
                  0.0, 1.0, 0.0,
                  -sinS, 0.0, cosS
                );
                pos = rotY * rel + tailPivot;
              }
              
              transformed = pos;
              `
            );
            
            // Inject uniforms and varyings in fragment shader
            shader.fragmentShader = `
              uniform float uBlink;
              varying vec3 vLocalPosition;
              varying vec2 vLocalUv;
            ` + shader.fragmentShader;
            
            // Custom segment coloring inside fragment shader
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `
              #include <map_fragment>
              
              float gray = diffuseColor.r;
              
              // Target colors:
              // Fur: Optimized warm charcoal, Eyes: Warm glowing golden amber, Nose: terracotta, Mouth: terracotta/rose, Ear Inner: warm peach
              vec3 furCol = vec3(0.18, 0.18, 0.19);
              vec3 shadowCol = vec3(0.07, 0.07, 0.08);
              vec3 eyeCol = vec3(0.95, 0.65, 0.18);
              vec3 noseCol = vec3(0.76863, 0.43922, 0.22745);
              vec3 mouthCol = vec3(0.25, 0.10, 0.10);
              vec3 earInnerCol = vec3(0.85, 0.58, 0.4);
              
              // Detect eyes by precise 3D spatial coordinate ranges in vLocalPosition space
              bool isLeftEye = (vLocalPosition.x >= -0.21 && vLocalPosition.x <= -0.13 && 
                                vLocalPosition.y >= 0.58 && vLocalPosition.y <= 0.72 && 
                                vLocalPosition.z >= 0.45 && vLocalPosition.z <= 0.52);
                                
              bool isRightEye = (vLocalPosition.x >= -0.01 && vLocalPosition.x <= 0.07 && 
                                 vLocalPosition.y >= 0.58 && vLocalPosition.y <= 0.72 && 
                                 vLocalPosition.z >= 0.44 && vLocalPosition.z <= 0.51);
                                 
              // Detect nose by precise 3D spatial coordinate ranges
              bool isNose = (vLocalPosition.x >= -0.12 && vLocalPosition.x <= -0.06 && 
                             vLocalPosition.y >= 0.42 && vLocalPosition.y <= 0.47 && 
                             vLocalPosition.z >= 0.48 && vLocalPosition.z <= 0.52);
                             
              // Detect mouth by precise 3D spatial coordinate ranges
              bool isMouth = (vLocalPosition.x >= -0.13 && vLocalPosition.x <= -0.03 && 
                              vLocalPosition.y >= 0.36 && vLocalPosition.y <= 0.42 && 
                              vLocalPosition.z >= 0.46 && vLocalPosition.z <= 0.52);
                              
              // Detect inner ears by spatial bounding boxes
              bool isLeftEarInner = (vLocalPosition.y >= 0.65 && vLocalPosition.x < -0.12 && vLocalPosition.x > -0.32 && 
                                     vLocalPosition.z >= 0.04 && vLocalPosition.z <= 0.22 && 
                                     gray > 0.4); // use grayscale check to isolate the inner ear recess
                                     
              bool isRightEarInner = (vLocalPosition.y >= 0.65 && vLocalPosition.x > 0.02 && vLocalPosition.x < 0.22 && 
                                      vLocalPosition.z >= 0.04 && vLocalPosition.z <= 0.22 && 
                                      gray > 0.4);
              
              vec3 baseCol = furCol;
              
              if (isLeftEye) {
                float centerV = 0.65;
                float halfH = 0.07;
                float dist = abs(vLocalPosition.y - centerV);
                float sleepyLimit = centerV + halfH * 0.15;
                
                if (vLocalPosition.y > sleepyLimit || dist > (halfH * (1.0 - uBlink))) {
                  baseCol = mix(furCol, shadowCol, step(gray, 0.5));
                } else {
                  baseCol = eyeCol;
                }
              } else if (isRightEye) {
                float centerV = 0.65;
                float halfH = 0.07;
                float dist = abs(vLocalPosition.y - centerV);
                float sleepyLimit = centerV + halfH * 0.15;
                
                if (vLocalPosition.y > sleepyLimit || dist > (halfH * (1.0 - uBlink))) {
                  baseCol = mix(furCol, shadowCol, step(gray, 0.5));
                } else {
                  baseCol = eyeCol;
                }
              } else if (isNose) {
                baseCol = noseCol;
              } else if (isMouth) {
                baseCol = mouthCol;
              } else if (isLeftEarInner || isRightEarInner) {
                baseCol = earInnerCol;
              } else {
                // Render fur and shadow planes using grayscale texture to drive blending
                baseCol = mix(shadowCol, furCol, smoothstep(0.15, 0.75, gray));
              }
              
              diffuseColor = vec4(baseCol, opacity);
              `
            );
          };
          
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!rootRef.current) return;

    // Update time uniform
    uniformsRef.current.uTime.value = time;

    // 1. Mouse coordinates tracking (horizontal ±15 deg, vertical ±8 deg) using global window listener
    const targetX = windowMouse.current.x; // [-1, 1]
    const targetY = windowMouse.current.y; // [-1, 1]
    
    // Smooth damping interpolation (lag speed coefficient ~0.08)
    mouseInterpolated.current.x += (targetX - mouseInterpolated.current.x) * 0.08;
    mouseInterpolated.current.y += (targetY - mouseInterpolated.current.y) * 0.08;
    
    uniformsRef.current.uMouse.value.copy(mouseInterpolated.current);

    // 2. Random Blinking (lasts 160ms, triggers every 3-7s)
    if (blinkProgress.current === -1) {
      blinkTimer.current -= 0.016;
      if (blinkTimer.current <= 0) {
        blinkProgress.current = 0;
      }
    } else {
      blinkProgress.current += 0.016 / 0.16;
      if (blinkProgress.current >= 1) {
        blinkProgress.current = -1;
        blinkTimer.current = 3 + Math.random() * 4;
      }
    }

    let blinkVal = 0;
    if (blinkProgress.current !== -1) {
      blinkVal = Math.sin(blinkProgress.current * Math.PI);
    }
    uniformsRef.current.uBlink.value = blinkVal;

    // 3. Random Ear Twitching (lasts 350ms, triggers every 4-10s)
    if (twitchProgress.current === -1) {
      twitchTimer.current -= 0.016;
      if (twitchTimer.current <= 0) {
        twitchProgress.current = 0;
      }
    } else {
      twitchProgress.current += 0.016 / 0.35;
      if (twitchProgress.current >= 1) {
        twitchProgress.current = -1;
        twitchTimer.current = 4 + Math.random() * 6;
      }
    }

    let leftTwitch = 0;
    let rightTwitch = 0;
    if (twitchProgress.current !== -1) {
      const shake = Math.sin(twitchProgress.current * Math.PI * 6);
      if (Math.random() > 0.5) {
        leftTwitch = shake;
      } else {
        rightTwitch = shake;
      }
    }
    uniformsRef.current.uLeftEarTwitch.value = leftTwitch;
    uniformsRef.current.uRightEarTwitch.value = rightTwitch;

    // 4. Tail sway uniform update (oscillating)
    uniformsRef.current.uTailSway.value = Math.sin(time * 0.5);

    // 5. Idle floating & sways (applied to root group)
    rootRef.current.position.y = -0.35 + Math.sin(time * 0.7) * 0.03;
    rootRef.current.rotation.z = Math.sin(time * 0.35) * 0.008;
    rootRef.current.rotation.y = Math.cos(time * 0.25) * 0.008;
  });

  return (
    <group ref={rootRef} scale={1.2} position={[0, -0.35, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// Fallback skeleton loader while the GLB model downloads
function CatPlaceholder() {
  return (
    <mesh position={[0, 0, 0]}>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial color="#0d0d0d" roughness={0.8} flatShading />
    </mesh>
  );
}

export default function CatScene() {
  return (
    <div className="w-full h-full select-none pointer-events-none">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.15, 3.8], fov: 42 }}
        style={{ background: 'transparent' }}
      >
        {/* Soft Warm Ambient Light */}
        <ambientLight intensity={0.85} color="#fffdf5" />
        
        {/* Warm Studio Key Light */}
        <directionalLight
          position={[4, 5, 4]}
          intensity={2.6}
          color="#ffeacc"
        />

        {/* Warm Studio Fill Light */}
        <directionalLight
          position={[-4, 3, 2]}
          intensity={1.6}
          color="#ffd4a8"
        />

        {/* Backlight / Rim Light for silhouette edge highlight */}
        <directionalLight
          position={[0, 4, -5]}
          intensity={2.6}
          color="#ffffff"
        />

        <Suspense fallback={<CatPlaceholder />}>
          <LowPolyCatModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
