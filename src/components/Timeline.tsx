import { useEffect, useRef } from 'react'
import { DYNASTIES_BY_TIME } from '@/data/dynasties'
import { useAppStore, FULL_TIME_RANGE } from '@/stores/appStore'
import { formatYear } from '@/utils/format'
import { hexToRgba } from '@/utils/color'
import {
  type Segment,
  PADDING,
  CANVAS_HEIGHT,
  CENTER_Y,
  BRUSH_TOP,
  BRUSH_BOTTOM,
  BRUSH_CENTER,
  HANDLE_W,
  FULL_YEAR_RANGE,
  DEFAULT_BRUSH_SPAN,
  fullYearToX,
  xToFullYear,
  clampRange,
  buildSegments,
  findDynastyAtX,
} from './timeline/TimelineSegments'
import './Timeline.css'

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
      const { timeRange } = useAppStore.getState()
      return findDynastyAtX(x, width, timeRange)
    }

    let isInBrush = false

    // brush 拖拽状态
    const brushDrag = {
      active: false,
      mode: 'none' as 'none' | 'pan' | 'resize-left' | 'resize-right' | 'create',
      startX: 0,
      startRangeStart: 0,
      startRangeEnd: 0,
    }

    const updateCursor = (x: number, y: number) => {
      if (y < BRUSH_TOP) {
        const dynasty = getDynastyAtX(x)
        canvas.style.cursor = dynasty ? 'pointer' : 'default'
        return
      }
      const { timeRange } = useAppStore.getState()
      const wx1 = fullYearToX(timeRange.startYear, width)
      const wx2 = fullYearToX(timeRange.endYear, width)
      if (Math.abs(x - wx1) < HANDLE_W + 4 || Math.abs(x - wx2) < HANDLE_W + 4) {
        canvas.style.cursor = 'col-resize'
      } else if (x >= wx1 && x <= wx2) {
        canvas.style.cursor = 'grab'
      } else {
        canvas.style.cursor = 'default'
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      // 触屏设备上 pointermove 可能频繁触发 hover 更新，防止默认滚动行为
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      isInBrush = y >= BRUSH_TOP

      if (brushDrag.active) {
        // 拖拽中阻止默认手势（防止页面滚动/缩放）
        e.preventDefault()
        const { mode, startX, startRangeStart, startRangeEnd } = brushDrag
        if (mode === 'pan') {
          const px = ((x - startX) / (width - PADDING * 2)) * FULL_YEAR_RANGE
          let s = startRangeStart - px
          let e = startRangeEnd - px
          const maxYear = Math.max(...DYNASTIES_BY_TIME.map((d) => d.endYear))
          if (e > maxYear) {
            const d = e - maxYear
            e -= d
            s -= d
          }
          const minYear = Math.min(...DYNASTIES_BY_TIME.map((d) => d.startYear))
          if (s < minYear) {
            const d = minYear - s
            s += d
            e += d
          }
          useAppStore.getState().setTimeRange(clampRange(s, e))
        } else if (mode === 'resize-left') {
          const year = xToFullYear(x, width)
          useAppStore.getState().setTimeRange(clampRange(year, startRangeEnd))
        } else if (mode === 'resize-right') {
          const year = xToFullYear(x, width)
          useAppStore.getState().setTimeRange(clampRange(startRangeStart, year))
        } else if (mode === 'create') {
          const center = xToFullYear(x, width)
          const half = DEFAULT_BRUSH_SPAN / 2
          useAppStore.getState().setTimeRange(clampRange(center - half, center + half))
        }
        return
      }

      updateCursor(x, y)

      if (isInBrush) return

      // 触屏设备上不通过 pointermove 触发 hover 预览，避免误触
      if (e.pointerType === 'touch') return

      const dynasty = getDynastyAtX(x)
      const currentHover = useAppStore.getState().hoveredDynastyId
      const newHover = dynasty ? dynasty.id : null
      if (currentHover !== newHover) {
        useAppStore.getState().setHovered(newHover)
      }
    }

    const handlePointerLeave = (e: PointerEvent) => {
      // 触屏设备 pointerleave 后不立即清 hover，留给 click 处理
      if (e.pointerType === 'touch') return
      isInBrush = false
      brushDrag.active = false
      brushDrag.mode = 'none'
      const currentHover = useAppStore.getState().hoveredDynastyId
      if (currentHover !== null) {
        useAppStore.getState().setHovered(null)
      }
      canvas.style.cursor = 'default'
    }

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (y < BRUSH_TOP) return

      // brush 区域内捕获 pointer，保证拖拽到 canvas 外部也能接收事件
      canvas.setPointerCapture(e.pointerId)
      e.preventDefault()

      const { timeRange } = useAppStore.getState()
      const wx1 = fullYearToX(timeRange.startYear, width)
      const wx2 = fullYearToX(timeRange.endYear, width)

      brushDrag.active = true
      brushDrag.startX = x
      brushDrag.startRangeStart = timeRange.startYear
      brushDrag.startRangeEnd = timeRange.endYear

      if (Math.abs(x - wx1) < HANDLE_W + 4) {
        brushDrag.mode = 'resize-left'
      } else if (Math.abs(x - wx2) < HANDLE_W + 4) {
        brushDrag.mode = 'resize-right'
      } else if (x >= wx1 && x <= wx2) {
        brushDrag.mode = 'pan'
      } else {
        brushDrag.mode = 'create'
      }
    }

    const handlePointerUp = (e: PointerEvent) => {
      canvas.releasePointerCapture(e.pointerId)
      brushDrag.active = false
      brushDrag.mode = 'none'
    }

    const handleClick = (e: MouseEvent) => {
      if (brushDrag.active) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (y >= BRUSH_TOP) return
      const dynasty = getDynastyAtX(x)
      if (dynasty) {
        useAppStore.getState().setSelected(dynasty.id)
      }
    }

    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerleave', handlePointerLeave)
    canvas.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('click', handleClick)

    let animId = 0

    // 帧级缓存：避免每帧重建 segments
    const drawState: { lastKey: string; cachedSegments: Segment[] | null } = {
      lastKey: '',
      cachedSegments: null,
    }

    const getHalfWidthAtX = (x: number, segments: Segment[]) => {
      const seg = segments.find((s) => x >= s.startX && x <= s.endX)
      if (!seg) {
        return segments.reduce(
          (closest, s) => (Math.abs(x - s.midX) < Math.abs(x - closest.midX) ? s : closest),
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

      const { selectedDynastyId, hoveredDynastyId, timeRange } = useAppStore.getState()

      // 脏标记：仅在状态变化时重建 segments 和标签，节省构建开销
      const lastDrawKey = drawState.lastKey
      const drawKey = `${selectedDynastyId}|${hoveredDynastyId}|${timeRange.startYear}|${timeRange.endYear}|${width}`
      const isDirty = drawKey !== lastDrawKey
      if (isDirty) {
        drawState.lastKey = drawKey
        drawState.cachedSegments = buildSegments(width, timeRange)
      }
      const segments = drawState.cachedSegments!

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, CANVAS_HEIGHT)

      const time = performance.now() / 1000
      const phase = time * 0.4

      // 1. 河流填充
      segments.forEach((seg) => {
        const { dynasty, startX, endX, riverHalfWidth } = seg
        const prevSeg = segments[seg.index - 1]
        const nextSeg = segments[seg.index + 1]
        const isActive = dynasty.id === selectedDynastyId
        const isHovered = dynasty.id === hoveredDynastyId

        ctx.beginPath()
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
        const segWidth = Math.max(1, endX - startX)
        const blendRatio = Math.min(0.2, 20 / segWidth)

        const grad = ctx.createLinearGradient(startX, 0, endX, 0)
        grad.addColorStop(0, hexToRgba(prevSeg ? prevSeg.dynasty.color || color : color, baseOpacity * 0.7))
        grad.addColorStop(blendRatio, hexToRgba(color, baseOpacity))
        grad.addColorStop(1 - blendRatio, hexToRgba(color, baseOpacity))
        grad.addColorStop(1, hexToRgba(nextSeg ? nextSeg.dynasty.color || color : color, baseOpacity * 0.7))

        ctx.fillStyle = grad
        ctx.fill()
      })

      // 2. 连续上岸边线
      ctx.beginPath()
      for (let x = PADDING; x <= width - PADDING; x += 1) {
        const hw = getHalfWidthAtX(x, segments)
        const wave = Math.sin(x * 0.015 + phase) * 5
        const y = CENTER_Y + wave - hw
        if (x === PADDING) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(184, 148, 58, 0.22)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 3. 连续下岸边线
      ctx.beginPath()
      for (let x = PADDING; x <= width - PADDING; x += 1) {
        const hw = getHalfWidthAtX(x, segments)
        const wave = Math.sin(x * 0.015 + phase) * 5
        const y = CENTER_Y + wave + hw
        if (x === PADDING) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(184, 148, 58, 0.22)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 4. 中心线
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
        ctx.strokeStyle = hexToRgba(dynasty.color || '#b8943a', alpha)
        ctx.lineWidth = isActive ? 2.5 : 1.5
        ctx.stroke()
      })

      // 5. 当前河段脉冲
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
        ctx.strokeStyle = hexToRgba(activeSeg.dynasty.color || '#b8943a', pulse + 0.4)
        ctx.lineWidth = 5
        ctx.stroke()
        ctx.restore()
      }

      // 6. 标签
      segments.forEach((seg) => {
        const { dynasty, midX, index } = seg
        const isActive = dynasty.id === selectedDynastyId
        const segWidth = seg.endX - seg.startX
        if (segWidth < 36) return
        const labelY = index % 2 === 0 ? CENTER_Y - 45 : CENTER_Y + 55

        ctx.font = `${isActive ? 'bold 15px' : '500 12px'} "Noto Serif SC", "Source Han Serif SC", "宋体", "STSong", serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = isActive ? '#f5f0e6' : 'rgba(168, 160, 144, 0.85)'
        ctx.fillText(dynasty.name, midX, labelY)

        ctx.font = '9px "JetBrains Mono", "Consolas", monospace'
        ctx.fillStyle = 'rgba(168, 160, 144, 0.6)'
        const yearText = `${formatYear(dynasty.startYear, 'short')} — ${formatYear(dynasty.endYear, 'short')}`
        ctx.fillText(yearText, midX, labelY + 14)
      })

      // 7. Brush 条
      drawBrush(ctx, width, timeRange, selectedDynastyId)

      animId = requestAnimationFrame(draw)
    }

    const drawBrush = (
      ctx: CanvasRenderingContext2D,
      width: number,
      timeRange: { startYear: number; endYear: number },
      selectedDynastyId: string,
    ) => {
      const trackY = BRUSH_CENTER
      const trackH = 10

      // 背景轨道
      ctx.fillStyle = 'rgba(245, 240, 230, 0.04)'
      ctx.fillRect(PADDING, trackY - trackH / 2, width - PADDING * 2, trackH)

      // 全时间轴朝代缩影
      DYNASTIES_BY_TIME.forEach((d) => {
        const sx = fullYearToX(d.startYear, width)
        const ex = fullYearToX(d.endYear, width)
        const isActive = d.id === selectedDynastyId
        ctx.fillStyle = hexToRgba(d.color || '#b8943a', isActive ? 0.55 : 0.28)
        ctx.fillRect(sx, trackY - trackH / 2, Math.max(1, ex - sx), trackH)
      })

      const wx1 = fullYearToX(timeRange.startYear, width)
      const wx2 = fullYearToX(timeRange.endYear, width)
      const dynastyColor = DYNASTIES_BY_TIME.find((d) => d.id === selectedDynastyId)?.color || '#b8943a'

      ctx.save()
      ctx.fillStyle = hexToRgba(dynastyColor, 0.14)
      ctx.strokeStyle = hexToRgba(dynastyColor, 0.7)
      ctx.lineWidth = 1
      ctx.shadowColor = dynastyColor
      ctx.shadowBlur = 10

      ctx.fillStyle = hexToRgba(dynastyColor, 0.9)
      ctx.fillRect(wx1 - HANDLE_W / 2, trackY - trackH / 2 - 2, HANDLE_W, trackH + 4)
      ctx.fillRect(wx2 - HANDLE_W / 2, trackY - trackH / 2 - 2, HANDLE_W, trackH + 4)

      ctx.font = '9px "JetBrains Mono", "Consolas", monospace'
      ctx.fillStyle = 'rgba(168, 160, 144, 0.7)'
      ctx.textAlign = 'left'
      ctx.fillText(formatYear(timeRange.startYear, 'short'), PADDING, BRUSH_BOTTOM - 2)
      ctx.textAlign = 'right'
      ctx.fillText(formatYear(timeRange.endYear, 'short'), width - PADDING, BRUSH_BOTTOM - 2)
      ctx.restore()

      ctx.beginPath()
      ctx.moveTo(PADDING, BRUSH_TOP - 6)
      ctx.lineTo(width - PADDING, BRUSH_TOP - 6)
      ctx.strokeStyle = hexToRgba(dynastyColor, 0.08)
      ctx.lineWidth = 1
      ctx.stroke()
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('click', handleClick)
    }
  }, [])

  const handleReset = () => useAppStore.getState().resetTimeRange()

  // Canvas 不可键盘/屏幕阅读器操作，提供一个 visually-hidden 的原生 <select>
  // 作为可达性替代入口：键盘 Tab 聚焦后用方向键选择朝代，等价于点击河段。
  const selectedDynastyId = useAppStore((s) => s.selectedDynastyId)
  // 仅当用户拖动过 brush（timeRange 偏离全范围）时才显示重置按钮，
  // 否则按钮点了等于无操作，造成"假按钮"困惑。
  const timeRange = useAppStore((s) => s.timeRange)
  const isRangeModified =
    timeRange.startYear !== FULL_TIME_RANGE.startYear ||
    timeRange.endYear !== FULL_TIME_RANGE.endYear

  return (
    <div className="timeline">
      <div className="timeline-header">
        <span className="timeline-title">历史长河</span>
        <span className="timeline-divider" />
        <span className="timeline-subtitle">FIVE THOUSAND YEARS · CHINA</span>
        {isRangeModified && (
          <button className="timeline-reset" onClick={handleReset} aria-label="重置时间轴">
            重置
          </button>
        )}
      </div>
      <canvas ref={canvasRef} className="timeline-canvas" aria-hidden="true" />
      {/* 无障碍：键盘可达的朝代选择器，视觉隐藏但可 Tab 聚焦 */}
      <label className="sr-only" htmlFor="timeline-dynasty-select">
        选择朝代
      </label>
      <select
        id="timeline-dynasty-select"
        className="sr-only"
        value={selectedDynastyId}
        onChange={(e) => useAppStore.getState().setSelected(e.target.value)}
      >
        {DYNASTIES_BY_TIME.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}（{formatYear(d.startYear, 'short')} — {formatYear(d.endYear, 'short')}）
          </option>
        ))}
      </select>
    </div>
  )
}
