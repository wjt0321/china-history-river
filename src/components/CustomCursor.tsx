import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/stores/appStore'
import { prefersReducedMotion } from '@/utils/motion'
import './CustomCursor.css'

/**
 * 自定义光标
 *
 * 仅在非触屏设备启用，替换默认光标为"光晕小圆点"：
 * - 常态：细圆环 + 中心点，随朝代色微亮
 * - 悬停可交互元素：圆环放大并显示朝代色 glow
 * - 按下：整体收缩
 * - 鼠标移出窗口 / 窗口失焦时自动恢复系统光标，避免"光标丢失"
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(false)
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: -100, y: -100 })
  const visibleRef = useRef(false)
  const selectedDynasty = useAppStore((s) => s.selectedDynasty)

  useEffect(() => {
    // 触屏设备不启用自定义光标
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouch(hasTouch)
    if (hasTouch) return

    const updateClasses = (hovering: boolean, pressed: boolean, visible: boolean) => {
      const el = cursorRef.current
      if (!el) return
      el.classList.toggle('is-hovering', hovering)
      el.classList.toggle('is-pressed', pressed)
      el.classList.toggle('is-visible', visible)
    }

    const showCursor = () => {
      if (visibleRef.current) return
      visibleRef.current = true
      updateClasses(false, false, true)
      document.documentElement.classList.add('cursor-hidden')
    }

    const hideCursor = () => {
      if (!visibleRef.current) return
      visibleRef.current = false
      updateClasses(false, false, false)
      document.documentElement.classList.remove('cursor-hidden')
    }

    const handleMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      if (!visibleRef.current) showCursor()

      // 靠近窗口边界时临时恢复系统光标
      const edgeMargin = 10
      const nearEdge =
        e.clientX <= edgeMargin ||
        e.clientX >= window.innerWidth - edgeMargin ||
        e.clientY <= edgeMargin ||
        e.clientY >= window.innerHeight - edgeMargin
      if (nearEdge) {
        document.documentElement.classList.remove('cursor-hidden')
      } else if (visibleRef.current) {
        document.documentElement.classList.add('cursor-hidden')
      }

      if (rafRef.current === 0) {
        rafRef.current = requestAnimationFrame(() => {
          // 直接操作 DOM，绕过 React 渲染
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate(${targetRef.current.x}px, ${targetRef.current.y}px)`
          }
          rafRef.current = 0
        })
      }
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      updateClasses(isInteractive(target), false, true)
    }

    const handleOut = () => updateClasses(false, false, true)
    const handleDown = () => updateClasses(false, true, true)
    const handleUp = () => updateClasses(false, false, true)

    // 离开浏览器窗口：relatedTarget 为 null 表示真正离开视口
    const handleWindowOut = (e: MouseEvent) => {
      if (e.relatedTarget === null) hideCursor()
    }

    // 进入浏览器窗口
    const handleWindowOver = (e: MouseEvent) => {
      if (e.relatedTarget === null) showCursor()
    }

    // 窗口失焦/隐藏时也恢复系统光标
    const handleBlur = () => hideCursor()
    const handleFocus = () => {
      if (document.visibilityState === 'visible') showCursor()
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') hideCursor()
    }

    // 初始状态：如果窗口已获得焦点且鼠标在窗口内则隐藏系统光标
    if (document.hasFocus()) {
      showCursor()
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleOver, { passive: true })
    document.addEventListener('mouseout', handleOut, { passive: true })
    window.addEventListener('mouseout', handleWindowOut)
    window.addEventListener('mouseover', handleWindowOver)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      hideCursor()
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      window.removeEventListener('mouseout', handleWindowOut)
      window.removeEventListener('mouseover', handleWindowOver)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (isTouch || prefersReducedMotion()) return null

  const color = selectedDynasty.color || 'var(--color-accent)'

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        '--cursor-color': color,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="cursor-ring" />
      <span className="cursor-dot" />
    </div>
  )
}

/** 判断元素是否可交互 */
function isInteractive(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase()
  const role = el.getAttribute('role')
  if (
    tag === 'button' ||
    tag === 'a' ||
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    tag === 'canvas' ||
    role === 'button' ||
    role === 'link'
  ) {
    return true
  }
  // 常见自定义交互类
  const interactiveClasses = ['dropdown-item', 'emperor-card', 'timeline-item', 'tab-btn', 'detail-toggle', 'nav-dynasty-trigger', 'detail-close']
  for (const c of interactiveClasses) {
    if (el.classList.contains(c)) return true
  }
  return false
}
