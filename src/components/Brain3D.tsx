import { Html, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { BrainModel } from './BrainModel'

type Brain3DProps = { color: string; brainAreas: string[]; intensity?: number }

type NodeConfig = { position: [number, number, number]; scale: [number, number, number]; label: [number, number, number] }

const regionNodes: Record<string, NodeConfig> = {
  'Prefrontal Cortex': { position: [-0.62, 0.46, 0.86], scale: [0.28, 0.18, 0.055], label: [-0.92, 0.72, 1.02] },
  Amygdala: { position: [0.48, -0.28, 0.72], scale: [0.105, 0.075, 0.045], label: [0.88, -0.5, 1.02] },
  Hippocampus: { position: [0.22, -0.1, 0.76], scale: [0.25, 0.07, 0.045], label: [0.72, 0.08, 1.04] },
  Hypothalamus: { position: [0.02, -0.3, 0.78], scale: [0.1, 0.07, 0.045], label: [-0.42, -0.66, 1.02] },
  'Limbic System': { position: [0.12, 0.02, 0.78], scale: [0.33, 0.13, 0.05], label: [0.72, 0.42, 1.05] },
  'Anterior Cingulate Cortex': { position: [-0.2, 0.28, 0.82], scale: [0.15, 0.24, 0.045], label: [-0.82, 0.45, 1.04] },
}

function LeaderLine({ from, to, color, intensity }: { from: [number, number, number]; to: [number, number, number]; color: string; intensity: number }) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ])
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.28 + intensity * 0.35,
    })
    return new THREE.Line(geometry, material)
  }, [from, to, color, intensity])

  return <primitive object={line} />
}

function EmotionRegions({ color, brainAreas, intensity = 0.5 }: Brain3DProps) {
  const activeColor = new THREE.Color(color)
  const activeNodes = useMemo(() => brainAreas.map((area) => ({ area, node: regionNodes[area] })).filter((item) => Boolean(item.node)), [brainAreas])
  const innerOpacity = 0.2 + intensity * 0.24
  const outerOpacity = 0.06 + intensity * 0.1
  const emissive = 0.45 + intensity * 0.75

  return (
    <>
      {activeNodes.map(({ area, node }) => (
        <group key={area}>
          <mesh position={node.position} scale={node.scale} rotation={[0.15, -0.2, 0.08]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={emissive} transparent opacity={innerOpacity} depthWrite={false} />
          </mesh>
          <mesh position={node.position} scale={[node.scale[0] * 1.16, node.scale[1] * 1.16, node.scale[2] * 1.16]} rotation={[0.15, -0.2, 0.08]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshBasicMaterial color={activeColor} transparent opacity={outerOpacity} depthWrite={false} />
          </mesh>
          <LeaderLine from={node.position} to={node.label} color={color} intensity={intensity} />
          <Html position={node.label} center distanceFactor={8.5} className="brain-label-wrap">
            <div className="brain-region-label" style={{ borderColor: color }}>
              <span style={{ background: color }} />{area}
            </div>
          </Html>
          <pointLight position={node.position} color={activeColor} intensity={0.55 + intensity * 1.3} distance={2.2} />
        </group>
      ))}
      <Sparkles count={Math.round(22 + intensity * 28)} speed={0.25 + intensity * 0.45} size={1.4 + intensity * 1.1} scale={[3.5, 2.5, 2.5]} color={color} />
    </>
  )
}

export function Brain3D({ color, brainAreas, intensity = 0.5 }: Brain3DProps) {
  return (
    <div className="brain-3d-canvas" role="img" aria-label="Interactive 3D brain showing highlighted emotional regions">
      <Canvas camera={{ position: [0, 0.12, 4.35], fov: 45 }} dpr={[1, 1.7]} performance={{ min: 0.5 }}>
        <fog attach="fog" args={['#07111f', 5, 9]} />
        <ambientLight intensity={0.62 + intensity * 0.18} />
        <directionalLight position={[3, 4, 5]} intensity={1.45 + intensity * 0.6} />
        <spotLight position={[-3, 3, 3]} intensity={0.55 + intensity * 0.85} angle={0.45} penumbra={0.5} color={color} />
        <Suspense fallback={null}>
          <BrainModel />
        </Suspense>
        <EmotionRegions color={color} brainAreas={brainAreas} intensity={intensity} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.25 + intensity * 0.22} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
      <div className="brain-note">Educational visualization — highlighted areas are approximate, not a medical diagnosis.</div>
    </div>
  )
}
