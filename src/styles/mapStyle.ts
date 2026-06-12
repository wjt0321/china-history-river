/**
 * 古地图风格底图 + 中国轮廓叠加
 * - CartoDB dark_nolabels 作为暗色底图
 * - 中国轮廓微亮勾勒
 * - 实际朝代疆域由 MapView 组件动态加载
 */
import type { StyleSpecification } from 'maplibre-gl'

export const DARK_TECHNO_STYLE: StyleSpecification = {
  version: 8,
  name: 'dark-techno',
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    },
    'china-base': {
      type: 'geojson',
      data: `${import.meta.env.BASE_URL}geo-data/china.json`,
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#0d1117',
      },
    },
    {
      id: 'carto-dark-base',
      type: 'raster',
      source: 'carto-dark',
      paint: {
        'raster-opacity': 0.55,
        'raster-saturation': -0.6,
        'raster-contrast': 0.1,
      },
    },
    {
      id: 'china-base-fill',
      type: 'fill',
      source: 'china-base',
      paint: {
        'fill-color': '#0d1117',
        'fill-opacity': 0.4,
      },
    },
    {
      id: 'china-base-glow',
      type: 'line',
      source: 'china-base',
      paint: {
        'line-color': '#2a5a5a',
        'line-width': 1.2,
        'line-opacity': 0.25,
        'line-blur': 8,
      },
    },
    {
      id: 'china-base-line',
      type: 'line',
      source: 'china-base',
      paint: {
        'line-color': '#3a7a7a',
        'line-width': 0.6,
        'line-opacity': 0.35,
      },
    },
  ],
}
