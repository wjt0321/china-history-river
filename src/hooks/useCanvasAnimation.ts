import { useRef, useCallback, useEffect } from 'react'

/**
 * 封装 requestAnimationFrame 循环
 *
 * 自动处理：
 * - resize（通过 window.resize 事件）
 * - visibilitychange（页面隐藏时暂停，恢复后继续）
 * - cleanup（组件卸载时 cancelAnimationFrame）
 *
 * @param drawFn  每帧绘制回调，接收 ctx、当前时间戳 dt (ms)
 * @param canvasRef  Canvas 元素引用
 * @param deps  依赖数组（类似 useEffect），变化时重启动画
 */
export function useCanvasAnimation(
  drawFn: (ctx: CanvasRenderingContext2D, dt: number) => void,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  deps: unknown[] = [],
) {
  const animIdRef = useRef(0)
  const drawRef = useRef(drawFn)
  drawRef.current = drawFn

  const start = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = (time: number) => {
      drawRef.current(ctx, time)
      animIdRef.current = requestAnimationFrame(loop)
    }

    animIdRef.current = requestAnimationFrame(loop)
  }, [canvasRef])

  const stop = useCallback(() => {
    cancelAnimationFrame(animIdRef.current)
    animIdRef.current = 0
  }, [])

  useEffect(() => {
    start()
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, stop, ...deps])
}
