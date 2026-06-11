import { useEffect, useRef } from 'react'
import { DYNASTIES_BY_TIME } from '@/data/dynasties'
import { useAppStore } from '@/stores/appStore'
import './Timeline.css'

const MIN_YEAR = -2150
const MAX_YEAR = 1950
const YEAR_RANGE = MAX_YEAR - MIN_YEAR
const PADDING = 40
const CANVAS_HEIGHT = 180
const CENTER_Y = 100

function yearToX(year: number, width: number): number {
  return PADDING + ((year - MIN_YEAR) / YEAR_RANGE) * (width - PADDING * 2)
}

function formatYearShort(y: number): string {
  if (y < 0) return `BC ${-y}`
  return `${y}`
}

function hexToRgba(hex: string, alpha: number): string {
  let clean = hex.replace('#', '')
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('')
  }
  const bigint = parseInt(clean, 16)
  if (Number.isNaN(bigint)) return `rgba(78, 205, 196, ${alpha})`
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface Segment {
  dynasty: (typeof DYNASTIES_BY_TIME)[number]
  startX: number
  endX: number
  midX: number
  riverHalfWidth: number
  index: number
}

export function Timeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let dpr = 1

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      dpr = window.devicePixelRatio || 1
      width = rect.width
      canvas.width = width * dpr
      canvas.height = CANVAS_HEIGHT * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${CANVAS_HEIGHT}px`
    }

    resize()
    window.addEventListener('resize', resize)

    const getDynastyAtX = (x: number) => {
      for (const d of DYNASTIES_BY_TIME) {
        const startX = yearToX(d.startYear, width)
        const endX = yearToX(d.endYear, width)
        if (x >= startX && x <= endX) return d
      }
      return null
    }

    let mouseX = -1

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      const dynasty = getDynastyAtX(mouseX)
      const currentHover = useAppStore.getState().hoveredDynastyId
      const newHover = dynasty ? dynasty.id : null
      if (currentHover !== newHover) {
        useAppStore.getState().setHovered(newHover)
      }
      canvas.style.cursor = dynasty ? 'pointer' : 'default'
    }

    const handleMouseLeave = () => {
      mouseX = -1
      const currentHover = useAppStore.getState().hoveredDynastyId
      if (currentHover !== null) {
        useAppStore.getState().setHovered(null)
      }
      canvas.style.cursor = 'default'
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const dynasty = getDynastyAtX(x)
      if (dynasty) {
        useAppStore.getState().setSelected(dynasty.id)
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleClick)

    let animId = 0

    const getHalfWidthAtX = (x: number, segments: Segment[]) => {
      const seg = segments.find((s) => x >= s.startX && x <= s.endX)
      if (!seg) {
        // Use nearest segment for padding areas
        return segments.reduce(
          (closest, s) =>
            Math.abs(x - s.midX) < Math.abs(x - closest.midX) ? s : closest,
          segments[0],
        ).riverHalfWidth
      }

      let hw = seg.riverHalfWidth
      const prev = segments[seg.index - 1]
      const next = segments[seg.index + 1]

      if (prev && x < seg.startX + 20) {
        const t = Math.max(0, Math.min(1, (x - seg.startX) / 20))
        hw = prev.riverHalfWidth * (1 - t) + hw * t
      }
      if (next && x > seg.endX - 20) {
        const t = Math.max(0, Math.min(1, (seg.endX - x) / 20))
        hw = hw * t + next.riverHalfWidth * (1 - t)
      }
      return hw
    }

    const draw = () => {
      if (width === 0) {
        animId = requestAnimationFrame(draw)
        return
      }

      const { selectedDynastyId, hoveredDynastyId } = useAppStore.getState()

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, CANVAS_HEIGHT)

      const time = performance.now() / 1000
      const phase = time * 0.4

      // Pre-compute segments
      const segments: Segment[] = DYNASTIES_BY_TIME.map((d, i) => {
        const startX = yearToX(d.startYear, width)
        const endX = yearToX(d.endYear, width)
        const riverHalfWidth =
          Math.min(48, Math.max(10, (d.peakArea || 100) / 30)) / 2
        return {
          dynasty: d,
          startX,
          endX,
          midX: (startX + endX) / 2,
          riverHalfWidth,
          index: i,
        }
      })

      // 1. River fills per segment with gradient blending
      segments.forEach((seg) => {
        const { dynasty, startX, endX, riverHalfWidth } = seg
        const prevSeg = segments[seg.index - 1]
        const nextSeg = segments[seg.index + 1]
        const isActive = dynasty.id === selectedDynastyId
        const isHovered = dynasty.id === hoveredDynastyId

        ctx.beginPath()

        // Top bank
        for (let x = startX; x <= endX; x += 1) {
          let hw = riverHalfWidth
          if (prevSeg && x < startX + 20) {
            const t = Math.max(0, Math.min(1, (x - startX) / 20))
            hw = prevSeg.riverHalfWidth * (1 - t) + hw * t
          }
          if (nextSeg && x > endX - 20) {
            const t = Math.max(0, Math.min(1, (endX - x) / 20))
            hw = hw * t + nextSeg.riverHalfWidth * (1 - t)
          }
          const wave = Math.sin(x * 0.015 + phase) * 5
          if (x === startX) ctx.moveTo(x, CENTER_Y + wave - hw)
          else ctx.lineTo(x, CENTER_Y + wave - hw)
        }

        // Bottom bank (backwards)
        for (let x = endX; x >= startX; x -= 1) {
          let hw = riverHalfWidth
          if (prevSeg && x < startX + 20) {
            const t = Math.max(0, Math.min(1, (x - startX) / 20))
            hw = prevSeg.riverHalfWidth * (1 - t) + hw * t
          }
          if (nextSeg && x > endX - 20) {
            const t = Math.max(0, Math.min(1, (endX - x) / 20))
            hw = hw * t + nextSeg.riverHalfWidth * (1 - t)
          }
          const wave = Math.sin(x * 0.015 + phase) * 5
          ctx.lineTo(x, CENTER_Y + wave + hw)
        }

        ctx.closePath()

        const color = dynasty.color || '#4ECDC4'
        const baseOpacity = isActive ? 0.5 : isHovered ? 0.45 : 0.3
        const segWidth = endX - startX
        const blendRatio = Math.min(0.2, 20 / segWidth)

        const grad = ctx.createLinearGradient(startX, 0, endX, 0)
        grad.addColorStop(
          0,
          hexToRgba(prevSeg ? prevSeg.dynasty.color || color : color, baseOpacity * 0.7),
        )
        grad.addColorStop(blendRatio, hexToRgba(color, baseOpacity))
        grad.addColorStop(1 - blendRatio, hexToRgba(color, baseOpacity))
        grad.addColorStop(
          1,
          hexToRgba(nextSeg ? nextSeg.dynasty.color || color : color, baseOpacity * 0.7),
        )

        ctx.fillStyle = grad
        ctx.fill()
      })

      // 2. Continuous top bank outline
      ctx.beginPath()
      for (let x = PADDING; x <= width - PADDING; x += 1) {
        const hw = getHalfWidthAtX(x, segments)
        const wave = Math.sin(x * 0.015 + phase) * 5
        const y = CENTER_Y + wave - hw
        if (x === PADDING) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(78, 205, 196, 0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 3. Continuous bottom bank outline
      ctx.beginPath()
      for (let x = PADDING; x <= width - PADDING; x += 1) {
        const hw = getHalfWidthAtX(x, segments)
        const wave = Math.sin(x * 0.015 + phase) * 5
        const y = CENTER_Y + wave + hw
        if (x === PADDING) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(78, 205, 196, 0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 4. Center line per segment (dynasty color)
      segments.forEach((seg) => {
        const { dynasty, startX, endX } = seg
        const isActive = dynasty.id === selectedDynastyId
        const isHovered = dynasty.id === hoveredDynastyId

        ctx.beginPath()
        for (let x = startX; x <= endX; x += 1) {
          const wave = Math.sin(x * 0.015 + phase) * 5
          const y = CENTER_Y + wave
          if (x === startX) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const alpha = isActive ? 0.9 : isHovered ? 0.75 : 0.55
        ctx.strokeStyle = hexToRgba(dynasty.color || '#4ECDC4', alpha)
        ctx.lineWidth = isActive ? 2.5 : 1.5
        ctx.stroke()
      })

      // 5. Active segment pulse / glow
      const activeSeg = segments.find((s) => s.dynasty.id === selectedDynastyId)
      if (activeSeg) {
        const pulse = Math.sin(time * 2.5) * 0.15 + 0.35
        ctx.save()
        ctx.shadowColor = activeSeg.dynasty.color || '#4ECDC4'
        ctx.shadowBlur = 15 + Math.sin(time * 2.5) * 8
        ctx.beginPath()
        for (let x = activeSeg.startX; x <= activeSeg.endX; x += 1) {
          const wave = Math.sin(x * 0.015 + phase) * 5
          const y = CENTER_Y + wave
          if (x === activeSeg.startX) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = hexToRgba(
          activeSeg.dynasty.color || '#4ECDC4',
          pulse + 0.4,
        )
        ctx.lineWidth = 5
        ctx.stroke()
        ctx.restore()
      }

      // 6. Labels
      segments.forEach((seg) => {
        const { dynasty, midX, index } = seg
        const isActive = dynasty.id === selectedDynastyId
        const labelY =
          index % 2 === 0 ? CENTER_Y - 45 : CENTER_Y + 55

        // Dynasty name
        ctx.font = `${isActive ? 'bold 15px' : '500 12px'} var(--font-zh, "Noto Serif SC", "Microsoft YaHei", serif)`
        ctx.textAlign = 'center'
        ctx.fillStyle = isActive ? '#f5f5f0' : 'rgba(200, 210, 220, 0.85)'
        ctx.fillText(dynasty.name, midX, labelY)

        // Year range
        ctx.font = '9px var(--font-mono, "SF Mono", Consolas, monospace)'
        ctx.fillStyle = 'rgba(150, 165, 180, 0.6)'
        const yearText = `${formatYearShort(dynasty.startYear)} — ${formatYearShort(dynasty.endYear)}`
        ctx.fillText(yearText, midX, labelY + 14)
      })

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div className="timeline">
      <div className="timeline-header">
        <span className="timeline-title">历史长河</span>
        <span className="timeline-divider" />
        <span className="timeline-subtitle">FIVE THOUSAND YEARS · CHINA</span>
      </div>
      <canvas ref={canvasRef} className="timeline-canvas" />
    </div>
  )
}
