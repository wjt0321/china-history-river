import { useState, useRef, useCallback } from 'react'
import type { Dynasty } from '@/types/dynasty'
import type { Feature, Polygon } from 'geojson'

interface LoadState {
  isLoading: boolean
  error: string | null
}

const FETCH_TIMEOUT_MS = 10_000

/**
 * 封装王朝疆域 GeoJSON 加载 + 缓存 + loading/error 状态
 *
 * - 自动缓存：同一朝代不重复 fetch
 * - 超时处理：10s 超时
 * - 返回 { isLoading, error, loadTerritory, territory }
 */
export function useMapTerritory() {
  const [state, setState] = useState<LoadState>({ isLoading: false, error: null })
  const [territory, setTerritory] = useState<Feature<Polygon> | null>(null)
  const cache = useRef<Map<string, Feature<Polygon>>>(new Map())
  const lastDynastyId = useRef<string | null>(null)

  const loadTerritory = useCallback(async (dynasty: Dynasty): Promise<Feature<Polygon> | null> => {
    // 缓存命中
    const cached = cache.current.get(dynasty.id)
    if (cached && lastDynastyId.current === dynasty.id) {
      return cached
    }
    if (cached) {
      lastDynastyId.current = dynasty.id
      setTerritory(cached)
      return cached
    }

    setState({ isLoading: true, error: null })
    lastDynastyId.current = dynasty.id

    try {
      const url = `${import.meta.env.BASE_URL}dynasties/${dynasty.id}.json`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: 加载 ${dynasty.name} 疆域数据失败`)
      }

      const feature: Feature<Polygon> = await res.json()
      cache.current.set(dynasty.id, feature)
      setTerritory(feature)
      setState({ isLoading: false, error: null })
      return feature
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setState({ isLoading: false, error: message })
      return null
    }
  }, [])

  return { isLoading: state.isLoading, error: state.error, loadTerritory, territory }
}
