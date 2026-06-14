import { useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'
import { DYNASTIES } from '@/data/dynasties'

/** URL 中朝代参数的 key */
const PARAM_KEY = 'd'
/** 已知的合法朝代 id 集合，用于校验 URL 参数 */
const VALID_IDS = new Set(DYNASTIES.map((d) => d.id))

/**
 * 朝代与 URL 的双向同步
 *
 * - 挂载时：读取 `?d=<id>`，若为合法朝代 id 则 setSelected（深链分享）
 * - 选中变化时：用 history.replaceState 更新 URL（不触发刷新/导航）
 *
 * 单向数据流：仅同步 selectedDynastyId，不反向覆盖用户在 UI 中的操作。
 * 使用 replaceState 而非 pushState，避免产生大量历史记录条目。
 */
export function useUrlStateSync() {
  const selectedDynastyId = useAppStore((s) => s.selectedDynastyId)

  // 挂载时从 URL 读取初始朝代（仅一次）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get(PARAM_KEY)
    if (id && VALID_IDS.has(id) && id !== useAppStore.getState().selectedDynastyId) {
      useAppStore.getState().setSelected(id)
    }
  }, [])

  // 选中变化时同步到 URL
  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedDynastyId && VALID_IDS.has(selectedDynastyId)) {
      url.searchParams.set(PARAM_KEY, selectedDynastyId)
    } else {
      url.searchParams.delete(PARAM_KEY)
    }
    window.history.replaceState({}, '', url)
  }, [selectedDynastyId])
}

/**
 * 复制当前页面分享链接到剪贴板
 * @returns 是否复制成功
 */
export async function copyShareLink(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(window.location.href)
    return true
  } catch {
    // clipboard API 在非 HTTPS / 旧浏览器下会失败，降级用 execCommand
    try {
      const textarea = document.createElement('textarea')
      textarea.value = window.location.href
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    } catch {
      return false
    }
  }
}
