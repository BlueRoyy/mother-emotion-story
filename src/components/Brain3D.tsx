import { OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { BrainModel } from './BrainModel'

type Brain3DProps = { color: string; brainAreas: string[] }

type NodeConfig = { position: [number, number, number]; scale: [number, number, number] }

const regionNodes: Record<string, NodeConfig> = {
  'Prefrontal Cortex': { position: [-0.62, 0.46, 0.86], scale: [0.34, 0.22, 0.08] },
  Amygdala: { position: [0.48, -0.28, 0.72], scale: [0.14, 0.1, 0.06] },
  Hippocampus: { position: [0.22, -0.1, 0.76], scale: [0.32, 0.09, 0.06] },
  Hypothalamus: { position: [0.02, -0.3, 0.78], scale: [0.13, 0.09, 0.06] },
  'Limbic System': { position: [0.12, 0.02, 0.78], scale: [0.42, 0.18, 0.07] },
  'Anterior Cingulate Cortex': { position: [-0.2, 0.28, 0.82], scale: [0.2, 0.3, 0.06] },
}

function EmotionRegions({ color, brainAreas }: Brain3DProps) {
  const activeColor = new THREE.Color(color)
  const activeNodes = useMemo(() => brainAreas.map((area) => regionNodes[area]).filter(Boolean), [brainAreas])

  return (
    <>
      {activeNodes.map((node, index) => (
        <mesh key={`${node.position.join('-')}-${index}`} position={node.position} scale={node.scale} rotation={[0.15, -0.2, 0.08]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={0.85} transparent opacity={0.38} depthWrite={false} />
        </mesh>
      ))}
      {activeNodes.map((node, index) => (
        <pointLight key={`light-${index}`} position={node.position} color={activeColor} intensity={1.15} distance={2.4} />
      ))}
      <Sparkles count={38} speed={0.5} size={2.2} scale={[3.5, 2.5, 2.5]} color={color} />
    </>
  )
}

export function Brain3D({ color, brainAreas }: Brain3DProps) {
  return (
    <div className="brain-3d-canvas" role="img" aria-label="Interactive 3D brain showing highlighted emotional regions">
      <Canvas camera={{ position: [0, 0.2, 4.1], fov: 42 }} dpr={[1, 1.7]} performance={{ min: 0.5 }}>
        <fog attach="fog" args={['#07111f', 5, 9]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <spotLight position={[-3, 3, 3]} intensity={0.85} angle={0.45} penumbra={0.5} color={color} />
        <Suspense fallback={null}>
          <BrainModel />
        </Suspense>
        <EmotionRegions color={color} brainAreas={brainAreas} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  )
}
