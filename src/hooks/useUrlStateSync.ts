import { useEffect, useRef } from 'react'
import { DYNASTIES } from '@/data/dynasties'
import { useAppStore } from '@/stores/appStore'

const DYNASTY_PARAM = 'dynasty'
const DETAIL_PARAM = 'detail'
const VALID_DYNASTY_IDS = new Set(DYNASTIES.map((d) => d.id))

/**
 * 将当前朝代与详情面板开关同步到 URL 查询参数。
 *
 * 支持分享：?dynasty=tang&detail=open
 * - dynasty 无效时回退当前默认状态，不写入错误 id
 * - detail=open/closed 控制初始详情面板状态
 */
export function useUrlStateSync() {
  const hasHydratedRef = useRef(false)
  const isApplyingPopStateRef = useRef(false)

  useEffect(() => {
    if (hasHydratedRef.current) return
    hasHydratedRef.current = true

    const params = new URLSearchParams(window.location.search)
    const dynastyId = params.get(DYNASTY_PARAM)
    const detail = params.get(DETAIL_PARAM)
    const shouldOpenDetail = detail === 'open'

    if (dynastyId && VALID_DYNASTY_IDS.has(dynastyId)) {
      useAppStore.getState().setSelected(dynastyId)
      if (!shouldOpenDetail) {
        useAppStore.setState({ isDetailOpen: false })
      }
    } else if (shouldOpenDetail) {
      useAppStore.setState({ isDetailOpen: true })
    }
  }, [])

  useEffect(() => {
    const unsubscribe = useAppStore.subscribe((state) => {
      if (isApplyingPopStateRef.current) return

      const url = new URL(window.location.href)
      url.searchParams.set(DYNASTY_PARAM, state.selectedDynastyId)
      url.searchParams.set(DETAIL_PARAM, state.isDetailOpen ? 'open' : 'closed')

      const next = `${url.pathname}${url.search}${url.hash}`
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
      if (next !== current) {
        window.history.replaceState(null, '', next)
      }
    })

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const dynastyId = params.get(DYNASTY_PARAM)
      const detail = params.get(DETAIL_PARAM)
      const shouldOpenDetail = detail === 'open'

      isApplyingPopStateRef.current = true
      if (dynastyId && VALID_DYNASTY_IDS.has(dynastyId)) {
        useAppStore.getState().setSelected(dynastyId)
        if (!shouldOpenDetail) {
          useAppStore.setState({ isDetailOpen: false })
        }
      } else {
        useAppStore.setState({ isDetailOpen: shouldOpenDetail })
      }
      isApplyingPopStateRef.current = false
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      unsubscribe()
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
}
