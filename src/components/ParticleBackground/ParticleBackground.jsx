import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import './ParticleBackground.css'

const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0xffffff, 1)
    renderer.setSize(window.innerWidth, window.innerHeight)

    // --- Scene & Camera ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.z = 30

    // --- Particle Config ---
    const PARTICLE_COUNT = 1200
    const SPREAD_X = 55
    const SPREAD_Y = 65
    const SPREAD_Z = 12
    const DRIFT_SPEED = 0.008
    const HORIZONTAL_DRIFT = 0.003
    const MOUSE_RADIUS = 12
    const MOUSE_STRENGTH = 0.4

    // --- Create soft circle texture ---
    const createParticleTexture = () => {
      const size = 64
      const cnv = document.createElement('canvas')
      cnv.width = size
      cnv.height = size
      const ctx = cnv.getContext('2d')
      const center = size / 2
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.4)')
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)
      const texture = new THREE.CanvasTexture(cnv)
      texture.needsUpdate = true
      return texture
    }

    // --- Geometry ---
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const basePositions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const opacities = new Float32Array(PARTICLE_COUNT)
    const phases = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const x = (Math.random() - 0.5) * SPREAD_X
      const y = (Math.random() - 0.5) * SPREAD_Y
      const z = (Math.random() - 0.5) * SPREAD_Z

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z

      velocities[i3] = (Math.random() - 0.5) * HORIZONTAL_DRIFT
      velocities[i3 + 1] = Math.random() * DRIFT_SPEED + 0.003
      velocities[i3 + 2] = 0

      sizes[i] = Math.random() * 2.0 + 1.0
      opacities[i] = Math.random() * 0.5 + 0.3
      phases[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))

    // --- Shader Material for soft dots ---
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTexture: { value: createParticleTexture() },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        varying float vOpacity;
        uniform float uPixelRatio;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (120.0 / -mvPosition.z);
          gl_PointSize = max(gl_PointSize, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          vOpacity = aOpacity;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying float vOpacity;
        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(texColor.rgb, texColor.a * vOpacity);
        }
      `,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // --- Mouse tracking ---
    const mouse = { x: 9999, y: 9999 }
    const mouseNDC = new THREE.Vector2(9999, 9999)
    const raycaster = new THREE.Raycaster()
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const mouseWorld = new THREE.Vector3()

    const onMouseMove = (e) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(mouseNDC, camera)
      raycaster.ray.intersectPlane(mousePlane, mouseWorld)
      mouse.x = mouseWorld.x
      mouse.y = mouseWorld.y
    }

    const onMouseLeave = () => {
      mouse.x = 9999
      mouse.y = 9999
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })

    // --- Resize ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio()
    }
    window.addEventListener('resize', onResize, { passive: true })

    // --- Animation Loop ---
    let animationId
    let time = 0
    const halfSpreadY = SPREAD_Y / 2

    // --- Dispersion Animation ---
    const dispersion = { value: 0 }
    gsap.to(dispersion, {
      value: 1,
      duration: 3,
      ease: 'power3.inOut',
      delay: 0.2
    })

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.01

      const posAttr = geometry.attributes.position
      const posArray = posAttr.array

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3

        // Gentle float upward + horizontal drift with sine wave
        basePositions[i3] += velocities[i3] + Math.sin(time + phases[i]) * 0.002
        basePositions[i3 + 1] += velocities[i3 + 1]

        // Wrap particles that go off screen
        if (basePositions[i3 + 1] > halfSpreadY) {
          basePositions[i3 + 1] = -halfSpreadY
          basePositions[i3] = (Math.random() - 0.5) * SPREAD_X
        }

        // Mouse repulsion
        const dx = posArray[i3] - mouse.x
        const dy = posArray[i3 + 1] - mouse.y
        const distSq = dx * dx + dy * dy
        const radiusSq = MOUSE_RADIUS * MOUSE_RADIUS

        if (distSq < radiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq)
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH
          basePositions[i3] += (dx / dist) * force
          basePositions[i3 + 1] += (dy / dist) * force
        }

        // Apply dispersion
        posArray[i3] = basePositions[i3] * dispersion.value
        posArray[i3 + 1] = basePositions[i3 + 1] * dispersion.value
        posArray[i3 + 2] = basePositions[i3 + 2] * dispersion.value
      }

      posAttr.needsUpdate = true
      renderer.render(scene, camera)
    }

    animate()

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-background" />
}

export default ParticleBackground
