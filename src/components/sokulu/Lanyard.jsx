/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, Text, useTexture, Line } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
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
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-bias={-0.0001} />
        
        <Rig gravity={gravity} />
        
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="#fff" position={[0, -1, 5]} form="ring" scale={[10, 5]} target={[0, 0, 0]} />
          <Lightformer intensity={0.4} color="#A855F7" position={[-1, -1, 1]} form="circle" scale={[10, 5]} target={[0, 0, 0]} />
          <Lightformer intensity={5} color="#FFD700" position={[1, 10, -2]} form="ring" scale={[10, 5]} target={[0, 0, 0]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Rig({ gravity }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ]));
  
  const { width, height } = useThree((state) => state.size);

  useFrame((state, delta) => {
    // Mouse interaction
    const x = (state.pointer.x * width) / 2.5;
    const y = (state.pointer.y * height) / 2.5;
    
    if (fixed.current) {
        easing.damp3(fixed.current.position, [x, y, 0], 0.2, delta);
        
        // Follow the leader
        easing.damp3(j1.current.position, fixed.current.position, 0.1, delta);
        easing.damp3(j2.current.position, j1.current.position, 0.3, delta); 
        easing.damp3(j3.current.position, j2.current.position, 0.1, delta);
        
        // Gravity
        j1.current.position.y -= 0.5 * delta * 10;
        j2.current.position.y -= 1.5 * delta * 10;
        
        // Rotation
        dir.subVectors(j3.current.position, j2.current.position).normalize();
        ang.copy(dir);
        
        const rotX = (j3.current.position.x - j2.current.position.x) * 2;
        const rotY = (j3.current.position.y - j2.current.position.y) * 2;
        
        easing.dampE(card.current.rotation, [rotY, -rotX, 0], 0.2, delta);
        card.current.position.copy(j3.current.position);
    }

    // Update Curve
    curve.points[0].copy(j3.current.position);
    curve.points[1].copy(j2.current.position);
    curve.points[2].copy(j1.current.position);
    curve.points[3].copy(fixed.current.position);
    
    if (band.current) {
        band.current.geometry.setFromPoints(curve.getPoints(32));
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

      <Line
        ref={band}
        points={[...Array(33)].map(() => [0, 0, 0])}
        color="white"
        lineWidth={1.5}
        opacity={0.6}
        transparent
      />

      <group ref={card}>
        <CardContent />
      </group>
    </>
  );
}

function CardContent() {
  const texture = useTexture("https://assets.vercel.com/image/upload/v1538361091/repositories/react-three-fiber/logo_t7k53q.png")

  return (
    <group scale={2.5} position={[0, -1.2, 0]}>
      <mesh>
        <boxGeometry args={[0.6, 0.9, 0.04]} />
        <meshPhysicalMaterial 
            color="#050505" 
            roughness={0.2} 
            metalness={0.8} 
            clearcoat={1} 
            clearcoatRoughness={0.1}
        />
      </mesh>
      
      <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.63, 0.93, 0.03]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.3} />
      </mesh>

      <group position={[0, 0.1, 0.021]}>
          <Text fontSize={0.08} color="white" font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff">
            KUSHAL
          </Text>
          <Text position={[0, -0.1, 0]} fontSize={0.05} color="#A855F7" font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff">
            DEVELOPER
          </Text>
      </group>

      <mesh position={[0, -0.25, 0.021]}>
        <planeGeometry args={[0.4, 0.04]} />
        <meshBasicMaterial color="#333" />
      </mesh>

      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 32]} rotation={[0,0,Math.PI/2]} />
          <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}