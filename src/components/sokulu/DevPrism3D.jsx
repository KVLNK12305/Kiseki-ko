import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

/**
 * Procedural Fancy Developer 3D Prism / Core
 * Ultra-refined glassmorphism, chromatic dispersion, gold & violet reflections,
 * and kinetic orbital rings with smooth cursor damping.
 */
function KineticGeometry() {
  const meshRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    const pointer = state.pointer;
    
    // Smooth group tilt following cursor
    if (groupRef.current) {
      easing.dampE(
        groupRef.current.rotation,
        [pointer.y * 0.4, pointer.x * 0.6, 0],
        0.25,
        delta
      );
    }

    // Individual kinetic spin rates
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.35;
      meshRef.current.rotation.y += delta * 0.45;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.2;
      ring1Ref.current.rotation.x += delta * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.25;
      ring2Ref.current.rotation.z += delta * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.18;
      ring3Ref.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Floating Kinetic Rings */}
      <group ref={ring1Ref}>
        <Ring args={[2.3, 2.33, 64]}>
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </Ring>
      </group>

      <group ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <Ring args={[2.7, 2.73, 64]}>
          <meshBasicMaterial
            color="#A855F7"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </Ring>
      </group>

      <group ref={ring3Ref} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
        <Ring args={[3.1, 3.12, 64]}>
          <meshBasicMaterial
            color="#60A5FA"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </Ring>
      </group>

      {/* Center 3D Developer Crystal Polyhedron */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh ref={meshRef} scale={1.35}>
          <icosahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            resolution={512}
            transmission={0.92}
            roughness={0.12}
            thickness={0.85}
            ior={1.6}
            chromaticAberration={0.65}
            anisotropy={0.3}
            distortion={0.45}
            distortionScale={0.4}
            temporalDistortion={0.2}
            color="#E0D4FF"
            attenuationDistance={0.6}
            attenuationColor="#A855F7"
          />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh scale={0.48}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={2.5}
            wireframe
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Floating Particles in Orbital Field */}
      <ParticleCloud count={45} />
    </group>
  );
}

function ParticleCloud({ count = 40 }) {
  const pointsRef = useRef();

  const [positions] = React.useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  });

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#FFD700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function DevPrism3D({ className = "" }) {
  return (
    <div className={`relative w-full h-full pointer-events-none select-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFFFFF" />
        <pointLight position={[-6, -4, -3]} intensity={2.5} color="#A855F7" />
        <pointLight position={[6, 4, 3]} intensity={3} color="#FFD700" />
        
        <KineticGeometry />
      </Canvas>
    </div>
  );
}
