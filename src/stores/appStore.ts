import { create } from 'zustand'
import { DYNASTIES } from '@/data/dynasties'
import type { Dynasty } from '@/types/dynasty'

interface AppState {
  /** 当前选中的朝代 id（默认第一个） */
  selectedDynastyId: string
  /** 当前选中的朝代详情 */
  selectedDynasty: Dynasty
  /** 时间轴 hover 的朝代 id（用于预览） */
  hoveredDynastyId: string | null
  /** 详情面板展开状态 */
  isDetailOpen: boolean

  setSelected: (id: string) => void
  setHovered: (id: string | null) => void
  toggleDetail: () => void
  closeDetail: () => void
}

const findDynasty = (id: string): Dynasty => {
  return DYNASTIES.find((d) => d.id === id) ?? DYNASTIES[0]
}

export const useAppStore = create<AppState>((set) => ({
  selectedDynastyId: DYNASTIES[0].id,
  selectedDynasty: findDynasty(DYNASTIES[0].id),
  hoveredDynastyId: null,
  isDetailOpen: false,

  setSelected: (id) =>
    set({
      selectedDynastyId: id,
      selectedDynasty: findDynasty(id),
      isDetailOpen: true,
    }),
  setHovered: (id) => set({ hoveredDynastyId: id }),
  toggleDetail: () => set((s) => ({ isDetailOpen: !s.isDetailOpen })),
  closeDetail: () => set({ isDetailOpen: false }),
}))
