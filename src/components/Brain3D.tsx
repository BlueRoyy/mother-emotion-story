import { OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

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

function BrainCore({ color, brainAreas }: Brain3DProps) {
  const group = useRef<THREE.Group>(null)
  const activeColor = new THREE.Color(color)
  const activeNodes = useMemo(() => brainAreas.map((area) => regionNodes[area]).filter(Boolean), [brainAreas])

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.22
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.24) * 0.08
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.85) * 0.04
  })

  return (
    <group ref={group}>
      <mesh position={[-0.42, 0.1, 0]} scale={[1.05, 0.82, 0.72]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color="#e7b7a6" roughness={0.65} metalness={0.04} />
      </mesh>
      <mesh position={[0.42, 0.1, 0]} scale={[1.05, 0.82, 0.72]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color="#e2a896" roughness={0.68} metalness={0.04} />
      </mesh>
      <mesh position={[0, -0.58, -0.1]} scale={[0.35, 0.24, 0.38]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#d89583" roughness={0.7} />
      </mesh>

      {[-0.88, -0.48, -0.1, 0.32, 0.76].map((x, index) => (
        <mesh key={x} position={[x, 0.18 + Math.sin(index) * 0.12, 0.74]} rotation={[0.65, 0.2, index * 0.4]} scale={[0.045, 0.045, 0.78]}>
          <torusGeometry args={[0.65, 0.035, 10, 70]} />
          <meshStandardMaterial color="#b86f65" roughness={0.8} />
        </mesh>
      ))}

      {activeNodes.map((node, index) => (
        <mesh key={`${node.position.join('-')}-${index}`} position={node.position} scale={node.scale}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={1.4} transparent opacity={0.82} />
        </mesh>
      ))}

      {activeNodes.map((node, index) => (
        <pointLight key={`light-${index}`} position={node.position} color={activeColor} intensity={2.4} distance={3} />
      ))}

      <Sparkles count={42} speed={0.65} size={2.4} scale={[3.2, 2.2, 2.2]} color={color} />
    </group>
  )
}

export function Brain3D({ color, brainAreas }: Brain3DProps) {
  return (
    <div className="brain-3d-canvas" role="img" aria-label="Interactive 3D brain showing highlighted emotional regions">
      <Canvas camera={{ position: [0, 0.2, 4.1], fov: 42 }} dpr={[1, 1.7]} performance={{ min: 0.5 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <spotLight position={[-3, 3, 3]} intensity={0.9} angle={0.45} penumbra={0.5} />
        <BrainCore color={color} brainAreas={brainAreas} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  )
}
