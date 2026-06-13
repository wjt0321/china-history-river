import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { DARK_TECHNO_STYLE } from '@/styles/mapStyle'
import { useAppStore } from '@/stores/appStore'
import { sound } from '@/utils/sound'
import { formatYear } from '@/utils/format'
import { motionDuration } from '@/utils/motion'
import type { Dynasty } from '@/types/dynasty'
import type { Feature, FeatureCollection, Polygon } from 'geojson'

/**
 * 中国地图主组件
 *
 * 设计：
 * - 全中国底图（永久，深蓝灰）
 * - 当前朝代疆域叠加（朝代专属色 + 多层光晕）
 * - 切换时 fade-in + 飞行到中心
 */
export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const isMapLoaded = useRef(false)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const selectedDynasty = useAppStore((s) => s.selectedDynasty)
  const highlightedEventId = useAppStore((s) => s.highlightedEventId)

  // 初始化地图
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_TECHNO_STYLE,
      center: [105, 36],
      zoom: 3.2,
      minZoom: 2.5,
      maxZoom: 8,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchZoomRotate: true,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('load', () => {
      isMapLoaded.current = true
      setMapReady(true)
      void loadDynasty(map, useAppStore.getState().selectedDynasty)
    })

    mapRef.current = map

    return () => {
      popupRef.current?.remove()
      map.remove()
      mapRef.current = null
      isMapLoaded.current = false
    }
  }, [])

  // 选中朝代变化时 → 加载疆域 + 飞行
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isMapLoaded.current) return
    void loadDynasty(map, selectedDynasty)
  }, [selectedDynasty])

  // 事件标记 click → Popup
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const eventLayerId = 'event-dots'
    const handleClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      const feature = e.features?.[0]
      if (!feature) return
      const props = feature.properties as Record<string, string>
      const coordinates = (feature.geometry as unknown as GeoJSON.Point).coordinates as [number, number]
      popupRef.current?.remove()
      popupRef.current = new maplibregl.Popup({
        offset: 14,
        closeButton: true,
        className: 'event-popup-tibei',
      })
        .setLngLat(coordinates)
        .setHTML(`
          <div class="event-popup">
            <div class="event-popup-year">${formatYear(Number(props.year))}</div>
            <div class="event-popup-title">${props.title}</div>
            ${props.location ? `<div class="event-popup-location">${props.location}</div>` : ''}
            <div class="event-popup-desc">${props.desc}</div>
          </div>
        `)
        .addTo(map)
    }
    const handleMouseEnter = () => { map.getCanvas().style.cursor = 'pointer' }
    const handleMouseLeave = () => { map.getCanvas().style.cursor = '' }

    map.on('click', eventLayerId, handleClick)
    map.on('mouseenter', eventLayerId, handleMouseEnter)
    map.on('mouseleave', eventLayerId, handleMouseLeave)

    return () => {
      map.off('click', eventLayerId, handleClick)
      map.off('mouseenter', eventLayerId, handleMouseEnter)
      map.off('mouseleave', eventLayerId, handleMouseLeave)
    }
  }, [mapReady])

  // 高亮事件 → 对应标记半径变化
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    map.setPaintProperty('event-dots', 'circle-radius', [
      'case',
      ['==', ['get', 'id'], highlightedEventId || ''],
      14,
      10,
    ])
  }, [highlightedEventId, mapReady])

  const dynastyColor = selectedDynasty.color || '#e63946'

  return (
    <div className="map-view">
      <div ref={containerRef} className="map-container" />
      <div className="map-overlay-corner-tl">
        <div className="corner-tick" />
        <div className="corner-tick rot" />
      </div>
      <div className="map-overlay-corner-tr">
        <div className="corner-tick" />
        <div className="corner-tick rot" />
      </div>
      <div className="map-overlay-info glass-panel">
        <div className="info-label">CURRENT TERRITORY</div>
        <div className="info-name" style={{ color: dynastyColor }}>{selectedDynasty.name}</div>
        <div className="info-era" style={{ color: dynastyColor }}>
          {formatYear(selectedDynasty.startYear, 'short')} — {formatYear(selectedDynasty.endYear, 'short')}
        </div>
        <div className="info-accent-line" style={{ background: dynastyColor }} />
      </div>
      <div className="map-attribution">
        数据 · 谭其骧《中国历史地图集》+ 维基 CC BY-SA · 制图 · MapLibre GL
      </div>
    </div>
  )
}


/**
 * 加载朝代疆域（fade 切换 + 朝代专属色）
 */
async function loadDynasty(map: maplibregl.Map, dynasty: Dynasty) {
  try {
    const url = `${import.meta.env.BASE_URL}dynasties/${dynasty.id}.json?t=${Date.now()}`
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`Failed to load dynasty: ${dynasty.id}`, res.status)
      return
    }
    const feature: Feature<Polygon> = await res.json()

    // 取出中心点
    const coords = feature.geometry.coordinates[0] as [number, number][]
    const center = computeCentroid(coords)

    const color = dynasty.color || '#e63946'

    const sourceId = 'dynasty-territory'
    const fillLayer = 'dynasty-fill'
    const lineLayer = 'dynasty-line'
    const glowLayer = 'dynasty-glow'
    const innerGlowLayer = 'dynasty-inner-glow'
    const outerInkLayer = 'dynasty-outer-ink'

    const data: FeatureCollection = {
      type: 'FeatureCollection',
      features: [feature],
    }

    const transition = { duration: 900, delay: 0 }

    if (map.getSource(sourceId)) {
      // 更新数据（带平滑过渡）
      ;(map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(data)
      // 设置 transition 后更新颜色和透明度 → MapLibre 自动渐变
      map.setPaintProperty(fillLayer, 'fill-color-transition', transition)
      map.setPaintProperty(fillLayer, 'fill-opacity-transition', transition)
      map.setPaintProperty(lineLayer, 'line-color-transition', transition)
      map.setPaintProperty(lineLayer, 'line-opacity-transition', transition)
      map.setPaintProperty(glowLayer, 'line-color-transition', transition)
      map.setPaintProperty(glowLayer, 'line-opacity-transition', transition)
      map.setPaintProperty(innerGlowLayer, 'line-color-transition', transition)
      map.setPaintProperty(innerGlowLayer, 'line-opacity-transition', transition)
      map.setPaintProperty(outerInkLayer, 'line-color-transition', transition)
      map.setPaintProperty(outerInkLayer, 'line-opacity-transition', transition)

      map.setPaintProperty(fillLayer, 'fill-color', color)
      map.setPaintProperty(fillLayer, 'fill-opacity', 0.42)
      map.setPaintProperty(lineLayer, 'line-color', color)
      map.setPaintProperty(lineLayer, 'line-opacity', 0.9)
      map.setPaintProperty(glowLayer, 'line-color', color)
      map.setPaintProperty(glowLayer, 'line-opacity', 0.45)
      map.setPaintProperty(innerGlowLayer, 'line-color', color)
      map.setPaintProperty(innerGlowLayer, 'line-opacity', 0.28)
      map.setPaintProperty(outerInkLayer, 'line-color', color)
      map.setPaintProperty(outerInkLayer, 'line-opacity', 0.18)
    } else {
      // 首次 → 添加 source + layer（带 transition 配置）
      map.addSource(sourceId, { type: 'geojson', data })
      // 外层墨晕（最宽最淡，模拟水墨洇开）
      map.addLayer({
        id: outerInkLayer,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': 28,
          'line-opacity': 0,
          'line-blur': 20,
        },
      })
      // 外发光（宽散光，羽化边缘）
      map.addLayer({
        id: glowLayer,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': 14,
          'line-opacity': 0,
          'line-blur': 16,
        },
      })
      // 内发光（中层）
      map.addLayer({
        id: innerGlowLayer,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': 5,
          'line-opacity': 0,
          'line-blur': 6,
        },
      })
      // 填充（带羽化效果）
      map.addLayer({
        id: fillLayer,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': color,
          'fill-opacity': 0,
        },
      })
      // 边线（锐利）
      map.addLayer({
        id: lineLayer,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': 1.5,
          'line-opacity': 0,
        },
      })
      // 淡入
      requestAnimationFrame(() => {
        map.setPaintProperty(fillLayer, 'fill-opacity', 0.42)
        map.setPaintProperty(lineLayer, 'line-opacity', 0.9)
        map.setPaintProperty(glowLayer, 'line-opacity', 0.45)
        map.setPaintProperty(innerGlowLayer, 'line-opacity', 0.28)
        map.setPaintProperty(outerInkLayer, 'line-opacity', 0.18)
      })
    }

    // === 都城标记：朱印 ===
    const capitalCoords = CAPITAL_COORDS[dynasty.id]
    if (capitalCoords) {
      // 清理旧 marker
      capitalMarkerMap.get(map)?.remove()
      const el = document.createElement('div')
      el.className = 'capital-seal'
      // 取主要城市名：去除注释、多都城取第一个
      const shortName = dynasty.capital
        .split(/[/\uFF08(]/)[0]
        .trim()
        .slice(0, 2)
      el.innerHTML = `<span>${shortName}</span>`
      el.title = `${dynasty.name} · 都城：${dynasty.capital}`
      el.style.setProperty('--capital-color', color)
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(capitalCoords)
        .addTo(map)
      capitalMarkerMap.set(map, marker)
    }
    const eventFeatures: Feature[] = []
    for (const ev of dynasty.events || []) {
      if (!ev.coords) continue
      eventFeatures.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: ev.coords },
        properties: {
          id: `${dynasty.id}-${ev.year}-${ev.title}`,
          year: ev.year,
          title: ev.title,
          desc: ev.desc,
          location: ev.location || '',
        },
      })
    }
    const eventData: FeatureCollection = { type: 'FeatureCollection', features: eventFeatures }
    const eventSourceId = 'event-markers'
    const eventLayerId = 'event-dots'
    const eventPulseId = 'event-pulse'

    if (map.getSource(eventSourceId)) {
      ;(map.getSource(eventSourceId) as maplibregl.GeoJSONSource).setData(eventData)
      map.setPaintProperty(eventLayerId, 'circle-color', color)
      map.setPaintProperty(eventPulseId, 'circle-color', color)
    } else {
      map.addSource(eventSourceId, { type: 'geojson', data: eventData })
      // 脉冲外圈
      map.addLayer({
        id: eventPulseId,
        type: 'circle',
        source: eventSourceId,
        paint: {
          'circle-radius': 28,
          'circle-color': color,
          'circle-opacity': 0.4,
          'circle-blur': 0.6,
        },
      })
      // 核心圆点
      map.addLayer({
        id: eventLayerId,
        type: 'circle',
        source: eventSourceId,
        paint: {
          'circle-radius': 10,
          'circle-color': color,
          'circle-opacity': 1,
          'circle-stroke-color': '#f5f0e6',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.9,
        },
      })
    }

    // 播放切换音效（如开启）
    sound.playTransition()

    // 飞行到中心
    map.flyTo({
      center: center,
      zoom: 3.6,
      duration: motionDuration(1800),
      essential: true,
    })
  } catch (e) {
    console.error('loadDynasty failed', e)
  }
}

/** 主要都城坐标（经度, 纬度） */
const CAPITAL_COORDS: Record<string, [number, number]> = {
  xia: [113.0, 34.5],
  shang: [114.4, 36.1],
  zhou: [108.9, 34.3],
  qin: [108.7, 34.3],
  han: [108.9, 34.3],
  sanguo: [112.5, 34.6],
  'jin-nanbeichao': [118.8, 32.1],
  sui: [108.9, 34.3],
  tang: [108.9, 34.3],
  wudai: [114.3, 34.8],
  song: [114.3, 34.8],
  yuan: [116.4, 39.9],
  ming: [116.4, 39.9],
  qing: [116.4, 39.9],
}

/** 都城朱印 Marker 缓存，避免泄露与类型污染 */
const capitalMarkerMap = new WeakMap<maplibregl.Map, maplibregl.Marker>()

/**
 * 计算多边形质心（简单平均）
 */
function computeCentroid(coords: [number, number][]): [number, number] {
  let lon = 0
  let lat = 0
  for (const [x, y] of coords) {
    lon += x
    lat += y
  }
  return [lon / coords.length, lat / coords.length]
}
