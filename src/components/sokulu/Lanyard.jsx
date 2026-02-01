/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

export default function Lanyard({ position = [0, 0, 30], fov = 20, transparent = true }) {
  return (
    <div className="relative z-0 w-full h-full flex justify-center items-center bg-[#050505] overflow-hidden">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        
        {/* Simulation Rig */}
        <Rig />
        
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} form="ring" scale={[10, 5]} target={[0, 0, 0]} />
          <Lightformer intensity={0.4} color="white" position={[-1, -1, 1]} form="circle" scale={[10, 5]} target={[0, 0, 0]} />
          <Lightformer intensity={10} color="white" position={[1, 10, -2]} form="ring" scale={[10, 5]} target={[0, 0, 0]} />
        </Environment>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute bottom-6 right-6 text-white/30 text-[10px] font-mono pointer-events-none tracking-widest">
        INTERACTIVE_SIMULATION // HOVER_TO_MOVE
      </div>
    </div>
  );
}

function Rig() {
  const card = useRef();
  const lineGeo = useRef(); // Ref for the line geometry
  
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ]));
  
  // Simulation state
  const targetPos = useRef(new THREE.Vector3());
  const cardPos = useRef(new THREE.Vector3(0, 0, 0));
  const cardVel = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(new THREE.Euler(0, 0, 0));
  
  const { width, height } = useThree((state) => state.size);

  useFrame((state, delta) => {
    // 1. Calculate Target based on mouse/pointer
    const x = (state.pointer.x * width) / 2.5;
    const y = (state.pointer.y * height) / 2.5;
    
    targetPos.current.set(x, y, 0);

    // 2. Physics-like interpolation
    const lerpFactor = Math.min(delta * 5, 1);
    cardPos.current.lerp(targetPos.current, lerpFactor);

    // 3. Calculate rotation
    const tiltX = (targetPos.current.y - cardPos.current.y) * 0.1;
    const tiltY = (cardPos.current.x - targetPos.current.x) * 0.1;
    
    rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, tiltX, delta * 10);
    rotation.current.y = THREE.MathUtils.lerp(rotation.current.y, tiltY, delta * 10);

    // 4. Update Card Transform
    if (card.current) {
      card.current.position.copy(cardPos.current);
      card.current.rotation.x = rotation.current.x;
      card.current.rotation.y = rotation.current.y;
    }

    // 5. Update Lanyard Curve points
    curve.points[0].set(0, height / 3, 0); // Fixed Top
    curve.points[3].copy(cardPos.current).add(new THREE.Vector3(0, 1.1, 0)); // Moving Bottom (Card top)

    curve.points[1].lerpVectors(curve.points[0], curve.points[3], 0.33);
    curve.points[2].lerpVectors(curve.points[0], curve.points[3], 0.66);
    
    // Gravity sag
    const dist = curve.points[0].distanceTo(curve.points[3]);
    const maxDist = 8;
    const sag = Math.max(0, (maxDist - dist) * 0.2);
    
    curve.points[1].y -= sag * 0.5;
    curve.points[2].y -= sag;

    // Update the Line Geometry using the new points
    if (lineGeo.current) {
      lineGeo.current.setFromPoints(curve.getPoints(32));
    }
  });

  return (
    <>
      {/* The String (Standard Line) */}
      <line>
        <bufferGeometry ref={lineGeo} />
        <lineBasicMaterial color="white" opacity={0.5} transparent />
      </line>

      {/* The Card Group */}
      <group ref={card}>
        <CardContent />
      </group>
    </>
  );
}

function CardContent() {
  return (
    <group scale={2.25} position={[0, -1.2, 0]}>
       {/* Front of Card */}
      <mesh>
        <boxGeometry args={[0.6, 0.9, 0.02]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Gold Border */}
      <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[0.62, 0.92, 0.01]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} />
      </mesh>

      {/* Decorations */}
      <mesh position={[0, 0.2, 0.02]}>
          <planeGeometry args={[0.5, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.4, 0.02]} />
          <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, -0.05, 0.02]}>
          <planeGeometry args={[0.2, 0.02]} />
          <meshStandardMaterial color="#555" />
      </mesh>

      {/* Clip Holder */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} rotation={[0,0,Math.PI/2]} />
          <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}