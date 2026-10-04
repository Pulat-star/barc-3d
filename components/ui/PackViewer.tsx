'use client'
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { DRACO_PATH } from '@/lib/products'

/**
 * A real 3D pack: the AI-baked texture mangles the packaging copy, so the
 * original photograph is re-projected onto the mesh with a front-facing planar
 * UV map. Rotation comes from scroll position, pointer and a slow idle spin.
 */
function Pack({ src, texture }: { src: string; texture: string }) {
  const { scene } = useGLTF(src, DRACO_PATH)
  const art = useTexture(texture)
  const group = useRef<THREE.Group>(null)
  const spin = useRef({ y: 0, target: 0 })

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
      m.material = new THREE.MeshStandardMaterial({
        map: art, roughness: 0.45, metalness: 0.1, envMapIntensity: 1.1
      })
    })

    const holder = new THREE.Group()
    holder.add(root)
    return holder
  }, [scene, art])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const d = Math.min(dt, 0.05)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // where this section sits in the viewport drives the turn
    const host = state.gl.domElement.parentElement
    let scrollTurn = 0
    if (host) {
      const r = host.getBoundingClientRect()
      const p = 1 - (r.top + r.height / 2) / window.innerHeight
      scrollTurn = THREE.MathUtils.clamp(p, -1, 1)
    }
    // Never show the back of the pack: a full spin would mirror the artwork and
    // read as a different design. Hard-clamp the turn to ±30°.
    const LIMIT = Math.PI / 6
    const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.4) * 0.16
    const raw = scrollTurn * 0.5 + idle + state.pointer.x * 0.3
    spin.current.target = THREE.MathUtils.clamp(raw, -LIMIT, LIMIT)

    const k = reduced ? 1 : 1 - Math.pow(0.001, d)
    spin.current.y += (spin.current.target - spin.current.y) * k

    g.rotation.y = spin.current.y
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * -0.09, k)
    g.position.y = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.02
  })

  return <group ref={group} scale={2.35}><primitive object={model} /></group>
}

export default function PackViewer({ src, tint, active = true }: { src: string; tint: string; active?: boolean }) {
  const texture = src.replace('/models/pack-', '/products/').replace('.glb', '.webp')

  return (
    <Canvas
      // rendering an off-screen canvas every frame costs the whole page its
      // framerate — park the loop until the section is actually in view
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 32, position: [0, 0, 8], near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.2
      }}
    >
      <ambientLight intensity={0.9} color="#C4ACE6" />
      <directionalLight position={[3, 5, 6]} intensity={2.4} color="#FFF4DC" />
      <directionalLight position={[-5, 2, 3]} intensity={1.3} color={tint} />
      <directionalLight position={[0, -3, 4]} intensity={0.7} color="#7B3FBF" />
      <pointLight position={[2.4, 1.6, 3]} intensity={14} distance={16} color="#F9B81F" />
      <Suspense fallback={null}>
        <Pack src={src} texture={texture} />
      </Suspense>
    </Canvas>
  )
}
