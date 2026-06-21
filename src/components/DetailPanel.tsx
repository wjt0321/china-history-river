import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'
import { formatYear } from '@/utils/format'
import { FIGURE_IMAGES, SCENE_IMAGES, FIGURE_CAPTIONS } from './detail/resourceMaps'
import { OverviewTab } from './detail/OverviewTab'
import { EmperorsTab } from './detail/EmperorsTab'
import { EventsTab } from './detail/EventsTab'
import { CultureTab } from './detail/CultureTab'
import { TerritoryTab } from './detail/TerritoryTab'
import './DetailPanel.css'

type TabKey = 'overview' | 'emperors' | 'events' | 'culture' | 'territory'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: '概览' },
  { key: 'emperors', label: '帝王' },
  { key: 'events', label: '大事' },
  { key: 'culture', label: '文化' },
  { key: 'territory', label: '疆域' },
]

const panelVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
}

const tabContentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export function DetailPanel() {
  // 用选择器精确订阅，避免 hoveredDynastyId 等无关 state 变化时整面板重渲染
  const selectedDynasty = useAppStore((s) => s.selectedDynasty)
  const isDetailOpen = useAppStore((s) => s.isDetailOpen)
  const closeDetail = useAppStore((s) => s.closeDetail)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const figureUrl = FIGURE_IMAGES[selectedDynasty.id]
  const sceneUrl = SCENE_IMAGES[selectedDynasty.id]
  const dynastyColor = selectedDynasty.color || '#e63946'

  // 移动端底部 Sheet 下滑关闭手势
  const swipeStartY = useRef(0)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    swipeStartY.current = e.touches[0].clientY
  }, [])
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - swipeStartY.current
    // 仅在内容已滚动到顶部且向下滑 > 80px 时关闭
    const scrollEl = (e.currentTarget as HTMLElement)
    if (scrollEl.scrollTop <= 0 && deltaY > 80) {
      closeDetail()
    }
  }, [closeDetail])

  return (
    <AnimatePresence>
      {isDetailOpen && (
        <motion.aside
          className="detail-panel scroll-panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="scroll-roller" />
          <div
            className="scroll-content"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <header className="detail-header">
              <motion.div
                className="detail-era"
                custom={0}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                style={{ color: dynastyColor }}
              >
                {formatYear(selectedDynasty.startYear, 'full')} — {formatYear(selectedDynasty.endYear, 'full')}
              </motion.div>
              <motion.h2
                className="detail-name"
                custom={1}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${dynastyColor} 0%, var(--color-paper) 100%)`,
                }}
              >
                {selectedDynasty.name}
              </motion.h2>
              <motion.div className="detail-pinyin" custom={2} variants={contentVariants} initial="hidden" animate="visible">
                {selectedDynasty.pinyin}
              </motion.div>
              <motion.div
                className="detail-tagline"
                custom={3}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                style={{ borderLeftColor: dynastyColor }}
              >
                {selectedDynasty.oneLineTag}
              </motion.div>
              <button className="detail-close" onClick={closeDetail} aria-label="关闭">
                <span>×</span>
              </button>
            </header>

            {figureUrl && (
              <motion.div className="detail-hero" custom={4} variants={contentVariants} initial="hidden" animate="visible">
                <div className="hero-img-wrap">
                  <img src={figureUrl} alt={FIGURE_CAPTIONS[selectedDynasty.id]} className="hero-img" loading="lazy" key={selectedDynasty.id} />
                  <div className="hero-vignette" />
                </div>
                <div className="hero-caption">{FIGURE_CAPTIONS[selectedDynasty.id]}</div>
              </motion.div>
            )}

            <nav className="detail-tabs" role="tablist" aria-label="内容分类">
              {TABS.map((t, idx) => {
                const isActive = activeTab === t.key
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    className={`tab-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveTab(t.key)}
                    onKeyDown={(e) => {
                      // 左右箭头切换 Tab
                      const tabCount = TABS.length
                      let nextIdx = idx
                      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabCount
                      else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabCount) % tabCount
                      else return
                      e.preventDefault()
                      setActiveTab(TABS[nextIdx].key)
                      // 将焦点移到新激活的按钮
                      const tabs = (e.currentTarget.parentNode as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]')
                      tabs[nextIdx]?.focus()
                    }}
                    style={isActive ? { background: dynastyColor, color: 'var(--color-bg-deep)' } : undefined}
                  >
                    {t.label}
                  </button>
                )
              })}
            </nav>

            <div className="detail-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + selectedDynasty.id}
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {activeTab === 'overview' && <OverviewTab d={selectedDynasty} sceneUrl={sceneUrl} />}
                  {activeTab === 'emperors' && <EmperorsTab d={selectedDynasty} />}
                  {activeTab === 'events' && <EventsTab d={selectedDynasty} />}
                  {activeTab === 'culture' && <CultureTab d={selectedDynasty} />}
                  {activeTab === 'territory' && <TerritoryTab d={selectedDynasty} />}
                </motion.div>
              </AnimatePresence>
            </div>

            <footer className="detail-footer">
              图像均来自 Wikimedia Commons · Public Domain
              <br />
              数据来源：维基百科 / 史记 / 资治通鉴 / 谭其骧 / CHGIS
            </footer>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
