import { OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { BrainModel } from './BrainModel'

type Brain3DProps = { color: string; brainAreas: string[] }

type NodeConfig = { position: [number, number, number]; scale: [number, number, number] }

const regionNodes: Record<string, NodeConfig> = {
  'Prefrontal Cortex': { position: [-1.15, 0.35, 0.5], scale: [0.55, 0.42, 0.36] },
  Amygdala: { position: [0.55, -0.38, 0.45], scale: [0.22, 0.17, 0.18] },
  Hippocampus: { position: [0.35, -0.15, 0.35], scale: [0.52, 0.16, 0.18] },
  Hypothalamus: { position: [0.02, -0.38, 0.48], scale: [0.22, 0.15, 0.16] },
  'Limbic System': { position: [0.3, -0.02, 0.37], scale: [0.75, 0.32, 0.22] },
  'Anterior Cingulate Cortex': { position: [-0.25, 0.2, 0.58], scale: [0.28, 0.55, 0.18] },
}

function EmotionRegions({ color, brainAreas }: Brain3DProps) {
  const activeColor = new THREE.Color(color)
  const activeNodes = useMemo(() => brainAreas.map((area) => regionNodes[area]).filter(Boolean), [brainAreas])

  return (
    <>
      {activeNodes.map((node, index) => (
        <mesh key={`${node.position.join('-')}-${index}`} position={node.position} scale={node.scale}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={1.6} transparent opacity={0.72} />
        </mesh>
      ))}
      {activeNodes.map((node, index) => (
        <pointLight key={`light-${index}`} position={node.position} color={activeColor} intensity={2.6} distance={3.8} />
      ))}
      <Sparkles count={58} speed={0.7} size={2.8} scale={[4, 3, 3]} color={color} />
    </>
  )
}

export function Brain3D({ color, brainAreas }: Brain3DProps) {
  return (
    <div className="brain-3d-canvas" role="img" aria-label="Interactive 3D brain showing highlighted emotional regions">
      <Canvas shadows camera={{ position: [0, 0.2, 4.1], fov: 42 }} dpr={[1, 1.7]} performance={{ min: 0.5 }}>
        <fog attach="fog" args={['#07111f', 5, 9]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} castShadow />
        <spotLight position={[-3, 3, 3]} intensity={1.1} angle={0.45} penumbra={0.5} color={color} />
        <Suspense fallback={null}>
          <BrainModel />
        </Suspense>
        <EmotionRegions color={color} brainAreas={brainAreas} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  )
}
