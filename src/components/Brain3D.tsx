import { Html, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { BrainModel } from './BrainModel'

type Brain3DProps = { color: string; brainAreas: string[] }

type NodeConfig = { position: [number, number, number]; scale: [number, number, number]; label: [number, number, number] }

const regionNodes: Record<string, NodeConfig> = {
  'Prefrontal Cortex': { position: [-0.62, 0.46, 0.86], scale: [0.28, 0.18, 0.055], label: [-1.35, 1.02, 0.9] },
  Amygdala: { position: [0.48, -0.28, 0.72], scale: [0.105, 0.075, 0.045], label: [1.1, -0.55, 0.95] },
  Hippocampus: { position: [0.22, -0.1, 0.76], scale: [0.25, 0.07, 0.045], label: [0.95, 0.1, 1.0] },
  Hypothalamus: { position: [0.02, -0.3, 0.78], scale: [0.1, 0.07, 0.045], label: [-0.55, -0.75, 0.95] },
  'Limbic System': { position: [0.12, 0.02, 0.78], scale: [0.33, 0.13, 0.05], label: [0.9, 0.55, 1.05] },
  'Anterior Cingulate Cortex': { position: [-0.2, 0.28, 0.82], scale: [0.15, 0.24, 0.045], label: [-1.05, 0.55, 1.0] },
}

function LeaderLine({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const points = useMemo(() => [new THREE.Vector3(...from), new THREE.Vector3(...to)], [from, to])
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.55} />
    </line>
  )
}

function EmotionRegions({ color, brainAreas }: Brain3DProps) {
  const activeColor = new THREE.Color(color)
  const activeNodes = useMemo(() => brainAreas.map((area) => ({ area, node: regionNodes[area] })).filter((item) => Boolean(item.node)), [brainAreas])

  return (
    <>
      {activeNodes.map(({ area, node }) => (
        <group key={area}>
          <mesh position={node.position} scale={node.scale} rotation={[0.15, -0.2, 0.08]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={0.9} transparent opacity={0.34} depthWrite={false} />
          </mesh>
          <mesh position={node.position} scale={[node.scale[0] * 1.16, node.scale[1] * 1.16, node.scale[2] * 1.16]} rotation={[0.15, -0.2, 0.08]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshBasicMaterial color={activeColor} transparent opacity={0.12} depthWrite={false} />
          </mesh>
          <LeaderLine from={node.position} to={node.label} color={color} />
          <Html position={node.label} center distanceFactor={6} className="brain-label-wrap">
            <div className="brain-region-label" style={{ borderColor: color }}>
              <span style={{ background: color }} />{area}
            </div>
          </Html>
          <pointLight position={node.position} color={activeColor} intensity={1.05} distance={2.2} />
        </group>
      ))}
      <Sparkles count={34} speed={0.45} size={2} scale={[3.5, 2.5, 2.5]} color={color} />
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
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
      <div className="brain-note">Educational visualization — highlighted areas are approximate, not a medical diagnosis.</div>
    </div>
  )
}
