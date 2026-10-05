'use client'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { DRACO_PATH } from '@/lib/products'
import { stageScroll } from '@/lib/stageScroll'

/** The pack at the centre of the carousel, as a real model turning with scroll. */
function Model({ src, texture, onReady }: { src: string; texture: string; onReady?: () => void }) {
  const { scene } = useGLTF(src, DRACO_PATH)
  const art = useTexture(texture)
  const group = useRef<THREE.Group>(null)
  const spin = useRef(0)
  const announced = useRef(false)

  const model = useMemo(() => {
    art.colorSpace = THREE.SRGBColorSpace
    art.flipY = true
    art.anisotropy = 8

    const root = scene.clone(true)
    const bounds = new THREE.Box3().setFromObject(root)
    const size = bounds.getSize(new THREE.Vector3())
    const centre = bounds.getCenter(new THREE.Vector3())
    const s = 1 / Math.max(size.y, 0.0001)
    root.position.set(-centre.x * s, -centre.y * s, -centre.z * s)
    root.scale.setScalar(s)

    root.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const g = m.geometry
      g.computeBoundingBox()
      const bb = g.boundingBox!
      const w = Math.max(bb.max.x - bb.min.x, 1e-6)
      const h = Math.max(bb.max.y - bb.min.y, 1e-6)
      const pos = g.attributes.position
      const uv = new Float32Array(pos.count * 2)
      for (let i = 0; i < pos.count; i++) {
        uv[i * 2] = (pos.getX(i) - bb.min.x) / w
        uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / h
      }
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
      m.material = new THREE.MeshStandardMaterial({ map: art, roughness: 0.45, metalness: 0.1, envMapIntensity: 1.15 })
    })

    const holder = new THREE.Group()
    holder.add(root)
    return holder
  }, [scene, art])

  // Every pods line shares one mesh, so swapping product only swaps the
  // texture — the component never remounts. Without this the "painted" flag
  // would stay set from the first pack and the flat image behind it would
  // never hide again, showing the product twice.
  useEffect(() => { announced.current = false }, [model])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = Math.min(dt, 0.05)
    // the carousel position turns the pack, never past ±30° so the artwork
    // is never shown mirrored
    const LIMIT = Math.PI / 6
    const target = THREE.MathUtils.clamp(
      (stageScroll.p * 2 - 1) * 0.8 + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.45) * 0.12),
      -LIMIT, LIMIT
    )
    const k = reduced ? 1 : 1 - Math.pow(0.0012, d)
    spin.current += (target - spin.current) * k
    if (!announced.current) { announced.current = true; onReady?.() }
    g.rotation.y = spin.current
    g.position.y = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.015
  })

  return <group ref={group} scale={2.6}><primitive object={model} /></group>
}

export default function StagePack({ src, texture, tint, active, onReady }: { src: string; texture: string; tint: string; active: boolean; onReady?: () => void }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={typeof window !== 'undefined' && window.matchMedia('(pointer:coarse)').matches ? [1, 1.4] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 32, position: [0, 0, 8], near: 0.1, far: 40 }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.2 }}
    >
      <ambientLight intensity={0.95} color="#C4ACE6" />
      <directionalLight position={[3, 5, 6]} intensity={2.4} color="#FFF4DC" />
      <directionalLight position={[-5, 2, 3]} intensity={1.3} color={tint} />
      <pointLight position={[2.4, 1.6, 3]} intensity={13} distance={16} color="#F9B81F" />
      <Suspense fallback={null}>
        <Model src={src} texture={texture} onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
