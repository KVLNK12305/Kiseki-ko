import { useRef, useState, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, Text } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

/**
 * FINAL HARDENED LANYARD COMPONENT
 * Resolves:
 * 1. BufferGeometry "size too small" errors by using native <line>
 * 2. Proper integration of gravity and transparency props from Hero.jsx
 */
export default function Lanyard({ 
    position = [0, 0, 20], 
    fov = 55, 
    gravity = [0, -40, 0], 
    transparent = true 
}) {
  return (
    <div className="relative z-0 w-full h-full flex justify-center items-center overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
        className="pointer-events-auto"
      >
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        <Rig gravity={gravity} transparent={transparent} />

        <Environment blur={0.75}>
          <Lightformer intensity={2} color="#fff" position={[0, -1, 5]} form="ring" scale={[10, 5]} />
          <Lightformer intensity={0.4} color="#A855F7" position={[-1, -1, 1]} form="circle" scale={[10, 5]} />
          <Lightformer intensity={5} color="#FFD700" position={[1, 10, -2]} form="ring" scale={[10, 5]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Rig({ gravity, transparent }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  // Initialize the curve for the lanyard strap
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ]));

  const { width, height } = useThree((state) => state.size);

  useFrame((state, delta) => {
    // Mouse following interaction
    const x = (state.pointer.x * width) / 2.5;
    const y = (state.pointer.y * height) / 2.5;

    if (fixed.current) {
      // Smoothly move the anchor point
      easing.damp3(fixed.current.position, [x, y, 0], 0.2, delta);

      // Follow-the-leader physics chain
      easing.damp3(j1.current.position, fixed.current.position, 0.1, delta);
      easing.damp3(j2.current.position, j1.current.position, 0.3, delta);
      easing.damp3(j3.current.position, j2.current.position, 0.1, delta);

      // Apply Gravity prop effect
      j1.current.position.y += gravity[1] * 0.01 * delta;
      j2.current.position.y += gravity[1] * 0.02 * delta;

      // Card tilt and positioning
      const rotX = (j3.current.position.x - j2.current.position.x) * 2;
      const rotY = (j3.current.position.y - j2.current.position.y) * 2;
      easing.dampE(card.current.rotation, [rotY, -rotX, 0], 0.2, delta);
      card.current.position.copy(j3.current.position);
    }

    // Update geometry points - Fixed approach to avoid Buffer errors
    if (band.current) {
      curve.points[0].copy(j3.current.position);
      curve.points[1].copy(j2.current.position);
      curve.points[2].copy(j1.current.position);
      curve.points[3].copy(fixed.current.position);
      
      const points = curve.getPoints(32);
      band.current.geometry.setFromPoints(points);
    }
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <mesh ref={fixed} />
        <mesh ref={j1} />
        <mesh ref={j2} />
        <mesh ref={j3} />
      </group>

      {/* Standard line is better for dynamic updates than Drei/Line component */}
      <line ref={band}>
        <bufferGeometry />
        <lineBasicMaterial color="white" transparent={transparent} opacity={0.5} />
      </line>

      <group ref={card}>
        <CardContent />
      </group>
    </>
  );
}

function CardContent() {
  return (
    <group scale={2.5} position={[0, -1.2, 0]}>
      {/* Identity Card Base */}
      <mesh>
        <boxGeometry args={[0.6, 0.9, 0.04]} />
        <meshPhysicalMaterial
          color="#050505"
          roughness={0.15}
          metalness={0.9}
          clearcoat={1}
        />
      </mesh>

      {/* Signature Gold Border */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.63, 0.93, 0.03]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.3} />
      </mesh>

      {/* Card Details */}
      <group position={[0, 0.1, 0.021]}>
        <Text 
            fontSize={0.07} 
            color="white" 
            anchorX="center"
            anchorY="middle"
        >
          KUSHAL
        </Text>
        <Text 
            position={[0, -0.1, 0]} 
            fontSize={0.04} 
            color="#A855F7" 
            opacity={0.8}
            anchorX="center"
            anchorY="middle"
        >
          SURPASSING_LIMITS
        </Text>
      </group>

      {/* Decorative scanner bar */}
      <mesh position={[0, -0.3, 0.021]}>
        <planeGeometry args={[0.4, 0.03]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}