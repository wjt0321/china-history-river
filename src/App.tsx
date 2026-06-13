import { useEffect, useState } from 'react'
import { MapView } from '@/components/MapView'
import { Timeline } from '@/components/Timeline'
import { DetailPanel } from '@/components/DetailPanel'
import { TopBar } from '@/components/TopBar'
import { AtmosphereParticles } from '@/components/AtmosphereParticles'
import { IntroAnimation } from '@/components/IntroAnimation'
import { InkDecorations } from '@/components/InkDecorations'
import { CustomCursor } from '@/components/CustomCursor'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAppStore } from '@/stores/appStore'
import { adjustBrightness, hexToRgba } from '@/utils/color'
import { prefersReducedMotion } from '@/utils/motion'
import './App.css'

function App() {
  const selectedDynasty = useAppStore((s) => s.selectedDynasty)
  const [introDone, setIntroDone] = useState(prefersReducedMotion())

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
      <ErrorBoundary name="地图">
        <MapView />
      </ErrorBoundary>
      <TopBar />
      <ErrorBoundary name="详情面板">
        <DetailPanel />
      </ErrorBoundary>
      <ErrorBoundary name="时间轴">
        <Timeline />
      </ErrorBoundary>
      <InkDecorations />
      <CustomCursor />
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}
    </div>
  )
}

export default App

