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
      if (!(child instanceof THREE.Mesh)) return

      child.castShadow = true
      child.receiveShadow = true

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      child.material = materials.map((material) => {
        const clonedMaterial = material.clone()

        if (clonedMaterial instanceof THREE.MeshStandardMaterial) {
          clonedMaterial.emissive = new THREE.Color('#000000')
          clonedMaterial.emissiveIntensity = 0
          clonedMaterial.roughness = 0.58
          clonedMaterial.metalness = 0.05
        }

        return clonedMaterial
      })
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
