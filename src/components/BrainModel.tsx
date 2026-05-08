import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function BrainModel() {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/brain.glb')

  const cloned = useMemo(() => {
    const copy = scene.clone(true)

    copy.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      child.castShadow = false
      child.receiveShadow = false

      const originalMaterials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      const clonedMaterials = originalMaterials.map((material) => {
        const clonedMaterial = material.clone()

        if (clonedMaterial instanceof THREE.MeshStandardMaterial) {
          clonedMaterial.emissive = new THREE.Color('#000000')
          clonedMaterial.emissiveIntensity = 0
          clonedMaterial.roughness = 0.58
          clonedMaterial.metalness = 0.05
        }

        return clonedMaterial
      })

      child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0]
    })

    const box = new THREE.Box3().setFromObject(copy)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxAxis = Math.max(size.x, size.y, size.z) || 1
    const scale = 2.45 / maxAxis

    copy.position.sub(center)
    copy.scale.setScalar(scale)
    copy.position.y += 0.05

    return copy
  }, [scene])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.0025
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
  })

  return <primitive ref={ref} object={cloned} />
}
