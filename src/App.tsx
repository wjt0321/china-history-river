import { useEffect } from 'react'
import { MapView } from '@/components/MapView'
import { Timeline } from '@/components/Timeline'
import { DetailPanel } from '@/components/DetailPanel'
import { TopBar } from '@/components/TopBar'
import { AtmosphereParticles } from '@/components/AtmosphereParticles'
import { useAppStore } from '@/stores/appStore'

function App() {
  const selectedDynasty = useAppStore((s) => s.selectedDynasty)

  // 动态注入朝代主题色到 CSS 变量
  useEffect(() => {
    const color = selectedDynasty.color || '#e63946'
    const root = document.documentElement
    root.style.setProperty('--dynasty-color', color)
    root.style.setProperty('--dynasty-color-dim', adjustBrightness(color, -30))
    root.style.setProperty('--dynasty-color-bright', adjustBrightness(color, 40))
    root.style.setProperty('--dynasty-glow', hexToRgba(color, 0.4))
  }, [selectedDynasty])

  return (
    <div className="app">
      <AtmosphereParticles />
      <MapView />
      <TopBar />
      <DetailPanel />
      <Timeline />
    </div>
  )
}

/** 调整十六进制颜色亮度（-100~100） */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + percent * 2.55))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent * 2.55))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent * 2.55))
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default App
