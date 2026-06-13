import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'

type ParticleType = 'fireflies' | 'dust' | 'petals' | 'snow'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  targetOpacity: number
  rotation: number
  rotationSpeed: number
  swayPhase: number
  swaySpeed: number
  life: number
  lifeSpeed: number
}

const TYPE_MAP: Record<string, ParticleType> = {
  xia: 'fireflies',
  shang: 'fireflies',
  zhou: 'fireflies',
  qin: 'dust',
  han: 'dust',
  sanguo: 'petals',
  'jin-nanbeichao': 'petals',
  sui: 'petals',
  tang: 'petals',
  wudai: 'snow',
  song: 'snow',
  yuan: 'snow',
  ming: 'snow',
  qing: 'snow',
}

const TYPE_CONFIG: Record<
  ParticleType,
  { count: number; color: string; minOpacity: number; maxOpacity: number }
> = {
  fireflies: { count: 40, color: '#c4d440', minOpacity: 0.15, maxOpacity: 0.7 },
  dust: { count: 60, color: '#b8943a', minOpacity: 0.2, maxOpacity: 0.6 },
  petals: { count: 35, color: '#d4a0a0', minOpacity: 0.3, maxOpacity: 0.7 },
  snow: { count: 50, color: '#c8d2e6', minOpacity: 0.2, maxOpacity: 0.6 },
}

export function AtmosphereParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const typeRef = useRef<ParticleType>('fireflies')
  const transitionRef = useRef<{
    phase: 'out' | 'in' | null
    progress: number
    nextType: ParticleType
  }>({ phase: null, progress: 0, nextType: 'fireflies' })
  const isVisibleRef = useRef(true)
  const selectedDynastyId = useAppStore((s) => s.selectedDynasty.id)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = window.devicePixelRatio || 1

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = width + 'px'
      canvas!.style.height = height + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    function createParticle(type: ParticleType): Particle {
      const p: Particle = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: 0,
        opacity: 0,
        targetOpacity: 0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: 0,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0,
        life: Math.random() * Math.PI * 2,
        lifeSpeed: 0,
      }
      initParticleForType(p, type, true)
      return p
    }

    function initParticleForType(
      p: Particle,
      type: ParticleType,
      randomY: boolean
    ) {
      const cfg = TYPE_CONFIG[type]
      switch (type) {
        case 'fireflies':
          p.x = Math.random() * width
          p.y = randomY
            ? Math.random() * height
            : Math.random() * height * 0.6 + height * 0.2
          p.vx = (Math.random() - 0.5) * 0.3
          p.vy = (Math.random() - 0.5) * 0.2
          p.size = 2 + Math.random() * 1
          p.targetOpacity =
            cfg.minOpacity + Math.random() * (cfg.maxOpacity - cfg.minOpacity)
          p.rotationSpeed = 0
          p.swaySpeed = 0.02 + Math.random() * 0.03
          p.lifeSpeed = 0.01 + Math.random() * 0.02
          break
        case 'dust':
          p.x = randomY ? Math.random() * width : -10
          p.y = Math.random() * height
          p.vx = 0.3 + Math.random() * 0.5
          p.vy = (Math.random() - 0.5) * 0.15
          p.size = 1 + Math.random() * 1
          p.targetOpacity =
            cfg.minOpacity + Math.random() * (cfg.maxOpacity - cfg.minOpacity)
          p.rotationSpeed = 0
          p.swaySpeed = 0
          p.lifeSpeed = 0
          break
        case 'petals':
          p.x = Math.random() * width
          p.y = randomY ? Math.random() * height : -10
          p.vx = (Math.random() - 0.5) * 0.4
          p.vy = 0.3 + Math.random() * 0.4
          p.size = 2.5 + Math.random() * 1
          p.targetOpacity =
            cfg.minOpacity + Math.random() * (cfg.maxOpacity - cfg.minOpacity)
          p.rotationSpeed = (Math.random() - 0.5) * 0.03
          p.swaySpeed = 0.02 + Math.random() * 0.03
          p.lifeSpeed = 0
          break
        case 'snow':
          p.x = Math.random() * width
          p.y = randomY ? Math.random() * height : -10
          p.vx = (Math.random() - 0.5) * 0.3
          p.vy = 0.5 + Math.random() * 0.8
          p.size = 1 + Math.random() * 1
          p.targetOpacity =
            cfg.minOpacity + Math.random() * (cfg.maxOpacity - cfg.minOpacity)
          p.rotationSpeed = 0
          p.swaySpeed = 0
          p.lifeSpeed = 0
          break
      }
    }

    function updateParticle(p: Particle, type: ParticleType, dt: number) {
      const factor = dt / 16
      const isFadingOut = transitionRef.current.phase === 'out'

      switch (type) {
        case 'fireflies':
          p.x += p.vx * factor
          p.y += p.vy * factor
          p.life += p.lifeSpeed * factor
          if (!isFadingOut) {
            p.targetOpacity =
              TYPE_CONFIG[type].minOpacity +
              Math.abs(Math.sin(p.life)) *
                (TYPE_CONFIG[type].maxOpacity - TYPE_CONFIG[type].minOpacity)
          }
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10
          if (p.y < -10) p.y = height + 10
          if (p.y > height + 10) p.y = -10
          break
        case 'dust':
          p.x += p.vx * factor
          p.y += (p.vy + Math.sin(p.x * 0.01) * 0.1) * factor
          if (p.x > width + 10) {
            p.x = -10
            p.y = Math.random() * height
          }
          if (p.y < -10) p.y = height + 10
          if (p.y > height + 10) p.y = -10
          break
        case 'petals':
          p.swayPhase += p.swaySpeed * factor
          p.x += (p.vx + Math.sin(p.swayPhase) * 0.3) * factor
          p.y += p.vy * factor
          p.rotation += p.rotationSpeed * factor
          if (p.y > height + 10) {
            p.y = -10
            p.x = Math.random() * width
            p.swayPhase = Math.random() * Math.PI * 2
          }
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10
          break
        case 'snow':
          p.x += p.vx * factor
          p.y += p.vy * factor
          if (p.y > height + 10) {
            p.y = -10
            p.x = Math.random() * width
          }
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10
          break
      }

      const fadeSpeed = transitionRef.current.phase !== null ? 0.025 : 0.008
      if (p.opacity < p.targetOpacity) {
        p.opacity = Math.min(p.targetOpacity, p.opacity + fadeSpeed)
      } else if (p.opacity > p.targetOpacity) {
        p.opacity = Math.max(0, p.opacity - fadeSpeed)
      }
    }

    function drawParticle(p: Particle, type: ParticleType) {
      if (p.opacity <= 0.01) return
      const cfg = TYPE_CONFIG[type]
      ctx!.save()
      ctx!.globalAlpha = p.opacity

      if (type === 'petals') {
        ctx!.translate(p.x, p.y)
        ctx!.rotate(p.rotation)
        ctx!.fillStyle = cfg.color
        ctx!.beginPath()
        ctx!.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2)
        ctx!.fill()
      } else if (type === 'fireflies') {
        ctx!.fillStyle = cfg.color
        ctx!.shadowColor = cfg.color
        ctx!.shadowBlur = 8
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()
      } else {
        ctx!.fillStyle = cfg.color
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()
      }

      ctx!.restore()
    }

    let lastTime = performance.now()

    function animate(time: number) {
      animFrameRef.current = requestAnimationFrame(animate)

      if (!isVisibleRef.current) {
        lastTime = time
        return
      }

      const dt = Math.min(time - lastTime, 50)
      lastTime = time

      ctx!.clearRect(0, 0, width, height)

      const trans = transitionRef.current
      const activeType = typeRef.current

      if (trans.phase === 'out') {
        trans.progress += dt / 750
        if (trans.progress >= 1) {
          trans.phase = 'in'
          trans.progress = 0
          typeRef.current = trans.nextType

          const newCfg = TYPE_CONFIG[trans.nextType]
          while (particlesRef.current.length < newCfg.count) {
            particlesRef.current.push(createParticle(trans.nextType))
          }
          if (particlesRef.current.length > newCfg.count) {
            particlesRef.current.length = newCfg.count
          }

          for (const p of particlesRef.current) {
            initParticleForType(p, trans.nextType, false)
            p.opacity = 0
          }
        }
      } else if (trans.phase === 'in') {
        trans.progress += dt / 750
        if (trans.progress >= 1) {
          trans.phase = null
          trans.progress = 0
        }
      }

      for (const p of particlesRef.current) {
        updateParticle(p, activeType, dt)
        drawParticle(p, activeType)
      }
    }

    const initialType = TYPE_MAP[useAppStore.getState().selectedDynastyId] || 'fireflies'
    typeRef.current = initialType
    const cfg = TYPE_CONFIG[initialType]
    particlesRef.current = []
    for (let i = 0; i < cfg.count; i++) {
      particlesRef.current.push(createParticle(initialType))
    }

    animFrameRef.current = requestAnimationFrame(animate)

    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)

    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible'
      if (isVisibleRef.current) {
        lastTime = performance.now()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    const newType = TYPE_MAP[selectedDynastyId] || 'fireflies'
    const trans = transitionRef.current

    if (newType === typeRef.current) return

    if (trans.phase === null) {
      transitionRef.current = { phase: 'out', progress: 0, nextType: newType }
    } else if (trans.phase === 'in') {
      transitionRef.current = { phase: 'out', progress: 0, nextType: newType }
    } else {
      transitionRef.current.nextType = newType
    }
  }, [selectedDynastyId])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}
