import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUrlStateSync, copyShareLink } from '../useUrlStateSync'
import { useAppStore } from '@/stores/appStore'

describe('useUrlStateSync', () => {
  beforeEach(() => {
    // 重置 store 到默认朝代
    useAppStore.getState().setSelected('xia')
    // 清空 URL
    window.history.replaceState({}, '', '/')
    vi.restoreAllMocks()
  })

  it('挂载时从 ?d=<id> 读取并切换朝代', () => {
    window.history.replaceState({}, '', '/?d=tang')
    renderHook(() => useUrlStateSync())
    expect(useAppStore.getState().selectedDynastyId).toBe('tang')
  })

  it('非法 id 不会切换朝代', () => {
    window.history.replaceState({}, '', '/?d=nonexistent')
    renderHook(() => useUrlStateSync())
    expect(useAppStore.getState().selectedDynastyId).toBe('xia')
  })

  it('合法 id 与当前相同时不重复 setSelected', () => {
    useAppStore.getState().setSelected('han')
    window.history.replaceState({}, '', '/?d=han')
    const spy = vi.spyOn(useAppStore.getState(), 'setSelected')
    renderHook(() => useUrlStateSync())
    expect(spy).not.toHaveBeenCalled()
  })

  it('选中变化时同步写入 URL', () => {
    renderHook(() => useUrlStateSync())
    // setSelected 会触发 hook 重渲染并跑 effect，需用 act 包裹让 effect flush
    act(() => {
      useAppStore.getState().setSelected('qing')
    })
    expect(window.location.search).toContain('d=qing')
  })

  it('切换朝代后 URL 参数随之更新', () => {
    renderHook(() => useUrlStateSync())
    act(() => {
      useAppStore.getState().setSelected('song')
    })
    expect(window.location.search).toBe('?d=song')
    act(() => {
      useAppStore.getState().setSelected('yuan')
    })
    expect(window.location.search).toBe('?d=yuan')
  })
})

describe('copyShareLink', () => {
  it('clipboard API 可用时返回 true 并写入', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const ok = await copyShareLink()
    expect(ok).toBe(true)
    expect(writeText).toHaveBeenCalledWith(window.location.href)
  })

  it('clipboard API 失败时降级 execCommand', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    })
    const execStub = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, 'execCommand', { value: execStub, configurable: true })
    const ok = await copyShareLink()
    expect(ok).toBe(true)
    expect(execStub).toHaveBeenCalledWith('copy')
  })
})
