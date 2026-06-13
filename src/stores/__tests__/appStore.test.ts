import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore, FULL_TIME_RANGE } from '../appStore'
import { DYNASTIES } from '@/data/dynasties'

function resetStore() {
  useAppStore.setState({
    selectedDynastyId: DYNASTIES[0].id,
    selectedDynasty: DYNASTIES[0],
    hoveredDynastyId: null,
    isDetailOpen: false,
    highlightedEventId: null,
    timeRange: { ...FULL_TIME_RANGE },
    soundEnabled: false,
  })
}

describe('appStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('setSelected', () => {
    it('切换朝代后 isDetailOpen 应为 true', () => {
      useAppStore.getState().setSelected('tang')
      const state = useAppStore.getState()
      expect(state.selectedDynastyId).toBe('tang')
      expect(state.isDetailOpen).toBe(true)
    })

    it('切换朝代后 highlightedEventId 应为 null', () => {
      useAppStore.getState().setHighlightedEvent('some-event')
      useAppStore.getState().setSelected('qin')
      expect(useAppStore.getState().highlightedEventId).toBeNull()
    })

    it('无效 id 仍设置 selectedDynastyId 但 selectedDynasty 回退到第一个朝代', () => {
      useAppStore.getState().setSelected('non-existent')
      // setSelected 保留原始 id，但 findDynasty 返回兜底 Dynasty
      expect(useAppStore.getState().selectedDynastyId).toBe('non-existent')
      expect(useAppStore.getState().selectedDynasty).toBe(DYNASTIES[0])
    })
  })

  describe('hoveredDynastyId', () => {
    it('setHovered 正确设置悬浮预览态', () => {
      useAppStore.getState().setHovered('ming')
      expect(useAppStore.getState().hoveredDynastyId).toBe('ming')
    })

    it('setHovered(null) 清空悬浮', () => {
      useAppStore.getState().setHovered('qin')
      useAppStore.getState().setHovered(null)
      expect(useAppStore.getState().hoveredDynastyId).toBeNull()
    })
  })

  describe('detail panel', () => {
    it('toggleDetail 切换面板', () => {
      expect(useAppStore.getState().isDetailOpen).toBe(false)
      useAppStore.getState().toggleDetail()
      expect(useAppStore.getState().isDetailOpen).toBe(true)
      useAppStore.getState().toggleDetail()
      expect(useAppStore.getState().isDetailOpen).toBe(false)
    })

    it('closeDetail 关闭面板', () => {
      useAppStore.getState().setSelected('tang') // 打开
      expect(useAppStore.getState().isDetailOpen).toBe(true)
      useAppStore.getState().closeDetail()
      expect(useAppStore.getState().isDetailOpen).toBe(false)
    })
  })

  describe('timeRange', () => {
    it('resetTimeRange 恢复全范围', () => {
      useAppStore.getState().setTimeRange({ startYear: -500, endYear: 500 })
      useAppStore.getState().resetTimeRange()
      expect(useAppStore.getState().timeRange).toEqual(FULL_TIME_RANGE)
    })

    it('setTimeRange 正确设置', () => {
      useAppStore.getState().setTimeRange({ startYear: -1000, endYear: 1000 })
      expect(useAppStore.getState().timeRange).toEqual({ startYear: -1000, endYear: 1000 })
    })
  })

  describe('soundEnabled', () => {
    it('setSoundEnabled 开关切换', () => {
      expect(useAppStore.getState().soundEnabled).toBe(false)
      useAppStore.getState().setSoundEnabled(true)
      expect(useAppStore.getState().soundEnabled).toBe(true)
      useAppStore.getState().setSoundEnabled(false)
      expect(useAppStore.getState().soundEnabled).toBe(false)
    })
  })
})
