import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { DARK_TECHNO_STYLE } from '@/styles/mapStyle'
import { useAppStore } from '@/stores/appStore'
import type { Dynasty } from '@/types/dynasty'
import type { Feature, FeatureCollection } from 'geojson'

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
      popupRef.current = new maplibregl.Popup({ offset: 12, closeButton: true })
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
      10,
      6,
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
          {formatYear(selectedDynasty.startYear)} — {formatYear(selectedDynasty.endYear)}
        </div>
        <div className="info-accent-line" style={{ background: dynastyColor }} />
      </div>
      <div className="map-attribution">
        数据 · 谭其骧《中国历史地图集》+ 维基 CC BY-SA · 制图 · MapLibre GL
      </div>
    </div>
  )
}

function formatYear(y: number): string {
  if (y < 0) return `BC ${-y}`
  return `${y} CE`
}

/**
 * 加载朝代疆域（fade 切换 + 朝代专属色）
 */
async function loadDynasty(map: maplibregl.Map, dynasty: Dynasty) {
  try {
    const url = `/dynasties/${dynasty.id}.json?t=${Date.now()}`
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`Failed to load dynasty: ${dynasty.id}`)
      return
    }
    const feature: Feature = await res.json()

    // 取出中心点
    const coords = (feature.geometry as any).coordinates[0] as [number, number][]
    const center = computeCentroid(coords)

    const color = dynasty.color || '#e63946'

    const sourceId = 'dynasty-territory'
    const fillLayer = 'dynasty-fill'
    const lineLayer = 'dynasty-line'
    const glowLayer = 'dynasty-glow'
    const innerGlowLayer = 'dynasty-inner-glow'

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

      map.setPaintProperty(fillLayer, 'fill-color', color)
      map.setPaintProperty(fillLayer, 'fill-opacity', 0.45)
      map.setPaintProperty(lineLayer, 'line-color', color)
      map.setPaintProperty(lineLayer, 'line-opacity', 0.9)
      map.setPaintProperty(glowLayer, 'line-color', color)
      map.setPaintProperty(glowLayer, 'line-opacity', 0.4)
      map.setPaintProperty(innerGlowLayer, 'line-color', color)
      map.setPaintProperty(innerGlowLayer, 'line-opacity', 0.2)
    } else {
      // 首次 → 添加 source + layer（带 transition 配置）
      map.addSource(sourceId, { type: 'geojson', data })
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
        map.setPaintProperty(fillLayer, 'fill-opacity', 0.45)
        map.setPaintProperty(lineLayer, 'line-opacity', 0.9)
        map.setPaintProperty(glowLayer, 'line-opacity', 0.4)
        map.setPaintProperty(innerGlowLayer, 'line-opacity', 0.2)
      })
    }

    // === 都城标记 ===
    const capitalCoords = CAPITAL_COORDS[dynasty.id]
    if (capitalCoords) {
      const capSourceId = 'capital-marker'
      const capLayer = 'capital-dot'
      const capLabel = 'capital-label'
      const capData: FeatureCollection = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: { type: 'Point', coordinates: capitalCoords },
          properties: { name: dynasty.name + ' · 都城', color },
        }],
      }
      if (map.getSource(capSourceId)) {
        ;(map.getSource(capSourceId) as maplibregl.GeoJSONSource).setData(capData)
        map.setPaintProperty(capLayer, 'circle-color', color)
        map.setPaintProperty(capLabel, 'text-color', color)
      } else {
        map.addSource(capSourceId, { type: 'geojson', data: capData })
        map.addLayer({
          id: capLayer,
          type: 'circle',
          source: capSourceId,
          paint: {
            'circle-radius': 6,
            'circle-color': color,
            'circle-opacity': 0.9,
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 1.5,
            'circle-stroke-opacity': 0.6,
          },
        })
        map.addLayer({
          id: capLabel,
          type: 'symbol',
          source: capSourceId,
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 11,
            'text-offset': [0, 1.2],
            'text-anchor': 'top',
            'text-font': ['Open Sans Regular'],
          },
          paint: {
            'text-color': color,
            'text-opacity': 0.85,
            'text-halo-color': '#000',
            'text-halo-width': 2,
          },
        })
      }
    }

    // === 事件标记 ===
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
          'circle-radius': 18,
          'circle-color': color,
          'circle-opacity': 0.18,
          'circle-blur': 0.8,
        },
      })
      // 核心圆点
      map.addLayer({
        id: eventLayerId,
        type: 'circle',
        source: eventSourceId,
        paint: {
          'circle-radius': 6,
          'circle-color': color,
          'circle-opacity': 0.95,
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 1.5,
          'circle-stroke-opacity': 0.6,
        },
      })
    }

    // 飞行到中心
    map.flyTo({
      center: center,
      zoom: 3.6,
      duration: 1800,
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
