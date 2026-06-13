import { useRef, useCallback } from 'react'

/**
 * 封装 ResizeObserver 监听容器尺寸
 *
 * 返回 width / height / dpr，由调用方在 rAF 中读取
 * 避免在每个动画帧内调用 getBoundingClientRect()
 */
export function useResizeObserver() {
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const observerRef = useRef<ResizeObserver | null>(null)

  const observe = useCallback((element: HTMLElement) => {
    // 断开旧观察
    observerRef.current?.disconnect()

    const update = () => {
      const rect = element.getBoundingClientRect()
      sizeRef.current = {
        width: rect.width,
        height: rect.height,
        dpr: window.devicePixelRatio || 1,
      }
    }

    update()
    observerRef.current = new ResizeObserver(update)
    observerRef.current.observe(element)
  }, [])

  const disconnect = useCallback(() => {
    observerRef.current?.disconnect()
    observerRef.current = null
  }, [])

  return { sizeRef, observe, disconnect }
}
