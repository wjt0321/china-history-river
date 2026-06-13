/** 检测用户是否偏好减少动画 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 根据用户动画偏好返回动画时长
 * - reduced motion: 返回 0（调用方应视为"立即完成"）
 * - normal: 返回原始时长
 */
export function motionDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration
}
