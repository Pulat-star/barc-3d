import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { PRODUCTS, DRACO_PATH } from '../data'
import { journey, clamp } from '../journey'

// Screen-fraction -> world units on the z=0 plane, so the 3D pack can be
// parked exactly over the washing machine in the photographic backdrop.
function useProjector() {
  const { camera, size } = useThree()
  return useMemo(() => {
    const dist = camera.position.z
    const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist
    const w = h * (size.width / size.height)
    return (fx, fy) => [(fx - 0.5) * w, (0.5 - fy) * h]
  }, [camera, size.width, size.height])
}

// Normalise each GLB: centre it, scale height to 1 world unit, and re-project
// the ORIGINAL pack artwork onto it with a planar (front-facing) UV map.
// The AI-baked texture garbles the packaging copy; the original photo does not.
function useNormalisedModel(url, textureUrl) {
  const { scene } = useGLTF(url, DRACO_PATH)
  const art = useTexture(textureUrl)

  return useMemo(() => {
    art.colorSpace = THREE.SRGBColorSpace
    art.flipY = true
    art.anisotropy = 8
    art.needsUpdate = true

    const root = scene.clone(true)
    const bounds = new THREE.Box3().setFromObject(root)
    const size = bounds.getSize(new THREE.Vector3())
    const centre = bounds.getCenter(new THREE.Vector3())
    const s = 1 / Math.max(size.y, 0.0001)
    root.position.set(-centre.x * s, -centre.y * s, -centre.z * s)
    root.scale.setScalar(s)

    root.traverse((o) => {
      if (!o.isMesh) return
      const g = o.geometry
      g.computeBoundingBox()
      const bb = g.boundingBox
      const w = Math.max(bb.max.x - bb.min.x, 1e-6)
      const h = Math.max(bb.max.y - bb.min.y, 1e-6)
      const pos = g.attributes.position
      const uv = new Float32Array(pos.count * 2)
      for (let i = 0; i < pos.count; i++) {
        uv[i * 2] = (pos.getX(i) - bb.min.x) / w
        uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / h
      }
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

      const m = new THREE.MeshStandardMaterial({
        map: art,
        transparent: true,
        roughness: 0.46,
        metalness: 0.08,
        envMapIntensity: 1.1
      })
      o.material = m
      o.castShadow = false
      o.receiveShadow = false
    })

    const holder = new THREE.Group()
    holder.add(root)
    return holder
  }, [scene, art])
}

// Fallbacks only — the real placement comes from the measured layout slots.
const FALLBACK = {
  desktop: { hero: { cx: 0.5, cy: 0.755, w: 0.62, h: 0.40 }, chapter: { cx: 0.605, cy: 0.445, w: 0.34, h: 0.50 } },
  mobile:  { hero: { cx: 0.5, cy: 0.775, w: 0.92, h: 0.26 }, chapter: { cx: 0.545, cy: 0.187, w: 0.6, h: 0.24 } }
}

// A pack's world scale equals its height as a fraction of the visible frustum.
const VISIBLE = 2 * Math.tan((35 * Math.PI) / 360) * 8
const PACK_ASPECT = 0.76 // width / height of a pouch

// A slot can be very tall on a big phone; cap the pack so the row still fits
// across the viewport instead of bursting out of the sides.
function fitHeight(slotH, slotW, maxWidthFrac) {
  const aspect = journey.vw / Math.max(journey.vh, 1)
  const byWidth = (Math.min(slotW, maxWidthFrac) * aspect) / PACK_ASPECT
  return Math.min(slotH, byWidth)
}

function slotFor(kind) {
  const measured = journey.slots?.[kind]
  if (measured) return measured
  return (journey.isMobile ? FALLBACK.mobile : FALLBACK.desktop)[kind]
}

function Pack({ url, texture, index }) {
  const model = useNormalisedModel(url, texture)
  const group = useRef()
  const project = useProjector()
  const state = useRef({ x: 0, y: 0, s: 0.001, o: 0, ry: 0 })

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const d = Math.min(dt, 0.05)
    const m = journey.mode
    const isActive = journey.active === index

    // ---- hero: three packs abreast inside the reserved slot ----
    const hs = slotFor('hero')
    const heroH = fitHeight(hs.h * 0.94, hs.w, 0.40)
    const spread = Math.min(hs.w * 0.30, heroH * 0.62)
    const lift = index === 0 ? 0 : heroH * 0.06
    // sit the row toward the foot of its slot so tall phones don't leave a gap
    const settle = Math.max((hs.h - heroH) / 2, 0) * 0.5
    const heroCx = hs.cx + (index === 0 ? 0 : index === 1 ? -spread : spread)
    const heroCy = hs.cy + settle + lift
    const heroScale = (index === 0 ? heroH : heroH * 0.74) * VISIBLE
    const heroRot = index === 0 ? 0 : index === 1 ? 0.16 : -0.16

    // ---- chapter: one pack standing in the scene slot ----
    const cs = slotFor('chapter')
    const chapH = fitHeight(cs.h * 0.94, cs.w, 0.52)
    const chapScaleOn = chapH * VISIBLE

    const [hx, hy] = project(heroCx, heroCy)
    const [cx, cy] = project(cs.cx, cs.cy)

    const tx = THREE.MathUtils.lerp(hx, cx, m)
    const ty = THREE.MathUtils.lerp(hy, cy, m)
    const ts = THREE.MathUtils.lerp(heroScale, isActive ? chapScaleOn : 0.0001, m) * (1 - journey.exit * 0.35)
    const to = THREE.MathUtils.lerp(1, isActive ? 1 : 0, m) * (1 - journey.exit)

    // exponential damping -> frame-rate independent, no jitter
    const k = journey.reduced ? 1 : 1 - Math.pow(0.0015, d)
    const st = state.current
    st.x += (tx - st.x) * k
    st.y += (ty - st.y) * k
    st.s += (ts - st.s) * k
    st.o += (to - st.o) * k

    // idle turn + pointer parallax
    const spin = journey.reduced ? 0 : performance.now() * 0.00012
    const parallax = journey.reduced ? 0 : journey.pointer.x * 0.18
    const baseRot = THREE.MathUtils.lerp(heroRot, 0, m)
    st.ry += (baseRot + parallax + Math.sin(spin) * 0.28 - st.ry) * Math.min(k, 0.08)

    const float = journey.reduced ? 0 : Math.sin(performance.now() * 0.0009 + index) * 0.02

    // past the chapter stack the pack is retired outright — no lingering ghost
    if (journey.exit > 0.995) { st.o = 0; st.s = 0.0001 }

    g.position.set(st.x, st.y + float, 0)
    g.scale.setScalar(Math.max(st.s, 0.0001))
    g.rotation.y = st.ry
    g.rotation.z = Math.sin(st.ry) * 0.02
    g.visible = st.o > 0.01 && journey.exit < 0.999

    g.traverse((o) => { if (o.isMesh) o.material.opacity = clamp(st.o) })
  })

  return <group ref={group}><primitive object={model} /></group>
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.85} color="#CFC3F2" />
      <directionalLight position={[3, 5, 6]} intensity={2.3} color="#FFF6E6" />
      <directionalLight position={[-5, 2, 3]} intensity={1.25} color="#8E3FB0" />
      <directionalLight position={[0, -3, 4]} intensity={0.7} color="#5B1FD1" />
      <pointLight position={[2.5, 1.5, 3]} intensity={12} distance={14} color="#E8B84B" />
    </>
  )
}

export default function Scene3D() {
  const [ok, setOk] = useState(true)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      if (!(c.getContext('webgl2') || c.getContext('webgl'))) setOk(false)
    } catch { setOk(false) }
  }, [])

  if (!ok) return null

  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 35, position: [0, 0, 8], near: 0.1, far: 50 }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.15 }}
      >
        <Lights />
        <Suspense fallback={null}>
          {PRODUCTS.map((p, i) => <Pack key={p.key} url={p.model} texture={p.image} index={i} />)}
        </Suspense>
      </Canvas>
    </div>
  )
}

PRODUCTS.forEach((p) => useGLTF.preload(p.model, DRACO_PATH))
