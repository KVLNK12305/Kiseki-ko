/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  return (
    <div className="relative z-0 w-full h-full flex justify-center items-center">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} form="ring" scale={[10, 5]} target={[0, 0, 0]} />
          <Lightformer intensity={0.4} color="white" position={[-1, -1, 1]} form="circle" scale={[10, 5]} target={[0, 0, 0]} />
          <Lightformer intensity={10} color="white" position={[1, 10, -2]} form="ring" scale={[10, 5]} target={[0, 0, 0]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
  
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      // Fix the top of the lanyard
      fixed.current.setNextKinematicTranslation({ x: 0, y: 1.5, z: 0 }); // Anchor point moved up slightly
    }

    // Calculate curve points for the visual line
    const [j1Lerped, j2Lerped] = [j1, j2].map((ref) => {
      if (ref.current) {
        const lerped = new THREE.Vector3().copy(ref.current.translation());
        return Object.assign(lerped, {
          x: THREE.MathUtils.lerp(lerped.x, (Math.sin(state.clock.elapsedTime / 4) * state.pointer.x * width) / 2 + Math.sin(state.clock.elapsedTime / 4) * 0.5, 0.1),
          y: THREE.MathUtils.lerp(lerped.y, state.pointer.y * 2 + Math.sin(state.clock.elapsedTime / 4) * 0.5, 0.1)
        });
      }
      return new THREE.Vector3();
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.translation());
    curve.points[2].copy(j1.current.translation());
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(32));

    // Tilt the card slightly based on movement
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="kinematicPosition" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        
        {/* THE CARD ITSELF */}
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}
          >
            {/* Front of Card */}
            <mesh>
              <boxGeometry args={[0.6, 0.9, 0.02]} /> {/* Standard Business Card Ratio */}
              <meshStandardMaterial 
                color="#0a0a0a" 
                roughness={0.3} 
                metalness={0.8}
              />
            </mesh>
            
            {/* Gold Border / Edge */}
            <mesh>
               <boxGeometry args={[0.62, 0.92, 0.01]} />
               <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} />
            </mesh>

            {/* Simulated Text/Chip (Decoration) */}
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

            {/* The Clip Holder (Top) */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} rotation={[0,0,Math.PI/2]} />
               <meshStandardMaterial color="#333" />
            </mesh>

          </group>
        </RigidBody>
      </group>
      
      {/* The String */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[1000, 1000]} useMap={0} lineWidth={1} />
      </mesh>
    </>
  );
}