import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function BrainModel() {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/brain.glb')

  const cloned = useMemo(() => {
    const copy = scene.clone()

    copy.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true

        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material = mesh.material.clone()
          mesh.material.emissive = new THREE.Color('#000000')
          mesh.material.emissiveIntensity = 0
          mesh.material.roughness = 0.58
          mesh.material.metalness = 0.05
        }
      }
    })

    return copy
  }, [scene])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.0025
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
  })

  return <primitive ref={ref} object={cloned} scale={2.1} position={[0, -0.1, 0]} />
}
