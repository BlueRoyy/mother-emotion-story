import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

type BrainModelProps = {
  color: string
}

export function BrainModel({ color }: BrainModelProps) {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/brain.glb')

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.0025
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
  })

  const cloned = scene.clone()

  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true

      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissive = new THREE.Color(color)
        mesh.material.emissiveIntensity = 0.18
        mesh.material.roughness = 0.55
        mesh.material.metalness = 0.08
      }
    }
  })

  return <primitive ref={ref} object={cloned} scale={2.1} position={[0, -0.1, 0]} />
}
