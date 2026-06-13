/**
 * 时间轴河段数据计算（纯函数，可测试）
 */
import { DYNASTIES_BY_TIME } from '@/data/dynasties'
import { MIN_YEAR, MAX_YEAR } from '@/stores/appStore'

export const FULL_YEAR_RANGE = MAX_YEAR - MIN_YEAR
export const PADDING = 40
export const CANVAS_HEIGHT = 200
export const CENTER_Y = 96
export const BRUSH_TOP = 154
export const BRUSH_BOTTOM = 192
export const BRUSH_CENTER = 173
export const HANDLE_W = 6
export const MIN_BRUSH_SPAN = 120
export const DEFAULT_BRUSH_SPAN = 1200

/** 单个河段数据 */
export interface Segment {
  dynasty: (typeof DYNASTIES_BY_TIME)[number]
  startX: number
  endX: number
  midX: number
  riverHalfWidth: number
  index: number
}

/** 全时间轴 year → x（用于 brush 条） */
export function fullYearToX(year: number, width: number): number {
  return PADDING + ((year - MIN_YEAR) / FULL_YEAR_RANGE) * (width - PADDING * 2)
}

/** 当前视图时间轴 year → x（用于主河流） */
export function viewYearToX(year: number, width: number, startYear: number, endYear: number): number {
  const range = endYear - startYear
  return PADDING + ((year - startYear) / range) * (width - PADDING * 2)
}

/** x → full year */
export function xToFullYear(x: number, width: number): number {
  return MIN_YEAR + ((x - PADDING) / (width - PADDING * 2)) * FULL_YEAR_RANGE
}

/** Brush 范围钳制 */
export function clampRange(
  start: number,
  end: number,
): { startYear: number; endYear: number } {
  let s = Math.max(MIN_YEAR, Math.min(MAX_YEAR - MIN_BRUSH_SPAN, start))
  let e = Math.max(MIN_YEAR + MIN_BRUSH_SPAN, Math.min(MAX_YEAR, end))
  if (e - s < MIN_BRUSH_SPAN) {
    if (s + MIN_BRUSH_SPAN > MAX_YEAR) {
      s = MAX_YEAR - MIN_BRUSH_SPAN
      e = MAX_YEAR
    } else {
      e = s + MIN_BRUSH_SPAN
    }
  }
  return { startYear: s, endYear: e }
}

/**
 * 构建当前视图下的河段列表
 */
export function buildSegments(
  width: number,
  timeRange: { startYear: number; endYear: number },
): Segment[] {
  return DYNASTIES_BY_TIME.map((d, i) => {
    const startX = viewYearToX(d.startYear, width, timeRange.startYear, timeRange.endYear)
    const endX = viewYearToX(d.endYear, width, timeRange.startYear, timeRange.endYear)
    const riverHalfWidth = Math.min(48, Math.max(10, (d.peakArea || 100) / 30)) / 2
    return {
      dynasty: d,
      startX,
      endX,
      midX: (startX + endX) / 2,
      riverHalfWidth,
      index: i,
    }
  })
}

/**
 * 根据 x 坐标查找对应的朝代
 */
export function findDynastyAtX(
  x: number,
  width: number,
  timeRange: { startYear: number; endYear: number },
): (typeof DYNASTIES_BY_TIME)[number] | null {
  for (const d of DYNASTIES_BY_TIME) {
    const startX = viewYearToX(d.startYear, width, timeRange.startYear, timeRange.endYear)
    const endX = viewYearToX(d.endYear, width, timeRange.startYear, timeRange.endYear)
    if (x >= startX && x <= endX) return d
  }
  return null
}
