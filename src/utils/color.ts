/** 十六进制转 RGBA */
export function hexToRgba(hex: string, alpha: number): string {
  let clean = hex.replace('#', '')
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('')
  }
  const num = parseInt(clean, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** 调整十六进制颜色亮度（-100~100） */
export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + percent * 2.55))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent * 2.55))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent * 2.55))
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}
