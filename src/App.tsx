import { useEffect, useState } from 'react'
import { MapView } from '@/components/MapView'
import { Timeline } from '@/components/Timeline'
import { DetailPanel } from '@/components/DetailPanel'
import { TopBar } from '@/components/TopBar'
import { StoryTour } from '@/components/StoryTour'
import { AtmosphereParticles } from '@/components/AtmosphereParticles'
import { IntroAnimation } from '@/components/IntroAnimation'
import { InkDecorations } from '@/components/InkDecorations'
import { CustomCursor } from '@/components/CustomCursor'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAppStore } from '@/stores/appStore'
import { useUrlStateSync } from '@/hooks/useUrlStateSync'
import { prefersReducedMotion } from '@/utils/motion'
import './App.css'

function App() {
  const selectedDynastyColor = useAppStore((s) => s.selectedDynasty.color)
  const [introDone, setIntroDone] = useState(prefersReducedMotion())

  // URL ↔ 选中朝代双向同步（深链分享：?d=tang）
  useUrlStateSync()

  // 动态注入当前朝代主题色到 CSS 变量 --dynasty-color。
  // dim / bright / glow 三个派生色由 global.css 中的 color-mix 自动派生，
  // 这里不再用 JS 覆盖，避免双重定义与维护混乱。
  useEffect(() => {
    const color = selectedDynastyColor || '#e63946'
    document.documentElement.style.setProperty('--dynasty-color', color)
  }, [selectedDynastyColor])

  return (
    <div className="app">
      <AtmosphereParticles />
      <ErrorBoundary name="地图">
        <MapView />
      </ErrorBoundary>
      <TopBar />
      {introDone && <StoryTour />}
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
