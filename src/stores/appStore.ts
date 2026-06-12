import { create } from 'zustand'
import { DYNASTIES } from '@/data/dynasties'
import type { Dynasty } from '@/types/dynasty'

interface TimeRange {
  startYear: number
  endYear: number
}

interface AppState {
  /** 当前选中的朝代 id（默认第一个） */
  selectedDynastyId: string
  /** 当前选中的朝代详情 */
  selectedDynasty: Dynasty
  /** 时间轴 hover 的朝代 id（用于预览） */
  hoveredDynastyId: string | null
  /** 详情面板展开状态 */
  isDetailOpen: boolean
  /** 当前高亮的事件 id（用于地图标记联动） */
  highlightedEventId: string | null
  /** 时间轴 brush 缩放范围 */
  timeRange: TimeRange

  setSelected: (id: string) => void
  setHovered: (id: string | null) => void
  toggleDetail: () => void
  closeDetail: () => void
  setHighlightedEvent: (id: string | null) => void
  setTimeRange: (range: TimeRange) => void
  resetTimeRange: () => void
}

const findDynasty = (id: string): Dynasty => {
  return DYNASTIES.find((d) => d.id === id) ?? DYNASTIES[0]
}

export const MIN_YEAR = -2150
export const MAX_YEAR = 1950
export const FULL_TIME_RANGE: TimeRange = { startYear: MIN_YEAR, endYear: MAX_YEAR }

export const useAppStore = create<AppState>((set) => ({
  selectedDynastyId: DYNASTIES[0].id,
  selectedDynasty: findDynasty(DYNASTIES[0].id),
  hoveredDynastyId: null,
  isDetailOpen: false,
  highlightedEventId: null,
  timeRange: { ...FULL_TIME_RANGE },

  setSelected: (id) =>
    set({
      selectedDynastyId: id,
      selectedDynasty: findDynasty(id),
      isDetailOpen: true,
      highlightedEventId: null,
    }),
  setHovered: (id) => set({ hoveredDynastyId: id }),
  toggleDetail: () => set((s) => ({ isDetailOpen: !s.isDetailOpen })),
  closeDetail: () => set({ isDetailOpen: false }),
  setHighlightedEvent: (id) => set({ highlightedEventId: id }),
  setTimeRange: (range) => set({ timeRange: range }),
  resetTimeRange: () => set({ timeRange: { ...FULL_TIME_RANGE } }),
}))
