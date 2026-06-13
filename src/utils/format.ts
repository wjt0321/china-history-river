/**
 * 年份格式化
 * - full:  "公元前 221 年" / "公元 221 年"
 * - short: "BC 221" / "221"
 */
export function formatYear(y: number, style: 'full' | 'short' = 'short'): string {
  if (y < 0) {
    return style === 'full' ? `公元前 ${-y} 年` : `BC ${-y}`
  }
  return style === 'full' ? `公元 ${y} 年` : `${y}`
}
