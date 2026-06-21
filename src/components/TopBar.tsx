import { DYNASTIES_BY_TIME } from '@/data/dynasties'
import { useAppStore } from '@/stores/appStore'
import { sound } from '@/utils/sound'
import { formatYear } from '@/utils/format'
import { copyShareLink } from '@/hooks/useUrlStateSync'
import { useEffect, useRef, useState } from 'react'
import './TopBar.css'

const SEAL_CHARS: Record<string, string> = {
  xia: '夏',
  shang: '商',
  zhou: '周',
  qin: '秦',
  han: '漢',
  sanguo: '三',
  'jin-nanbeichao': '晋',
  sui: '隋',
  tang: '唐',
  wudai: '五',
  song: '宋',
  yuan: '元',
  ming: '明',
  qing: '清',
}

export function TopBar() {
  // 选择器精确订阅，避免 hoveredDynastyId/timeRange 等无关 state 变化时顶栏重渲染
  const selectedDynasty = useAppStore((s) => s.selectedDynasty)
  const isDetailOpen = useAppStore((s) => s.isDetailOpen)
  const soundEnabled = useAppStore((s) => s.soundEnabled)
  const toggleDetail = useAppStore((s) => s.toggleDetail)
  const setSoundEnabled = useAppStore((s) => s.setSoundEnabled)
  const [showDynastyNav, setShowDynastyNav] = useState(false)
  const [shareHint, setShareHint] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Escape 关闭下拉；点击下拉外部关闭
  useEffect(() => {
    if (!showDynastyNav) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDynastyNav(false)
        triggerRef.current?.focus()
      }
    }
    const handlePointerDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowDynastyNav(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [showDynastyNav])

  const toggleNav = () => setShowDynastyNav((v) => !v)

  const sealChar = SEAL_CHARS[selectedDynasty.id] || '史'
  const dynastyColor = selectedDynasty.color || '#e63946'

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="brand">
          <div
            className="seal"
            style={{
              borderColor: dynastyColor,
              boxShadow: `0 0 16px ${dynastyColor}66, inset 0 0 8px ${dynastyColor}22`,
              color: dynastyColor,
            }}
          >
            {sealChar}
          </div>
          <div className="brand-text">
            <div className="brand-name">历史长河</div>
            <div className="brand-sub">FIVE THOUSAND YEARS</div>
          </div>
        </div>
      </div>

      <nav className="top-bar-center" ref={navRef}>
        <button
          ref={triggerRef}
          className="nav-dynasty-trigger"
          onClick={toggleNav}
          aria-expanded={showDynastyNav}
          aria-haspopup="true"
          aria-controls="dynasty-dropdown"
        >
          <span className="current-name" style={{ color: dynastyColor }}>
            {selectedDynasty.name}
          </span>
          <span className="current-era">
            {formatYear(selectedDynasty.startYear)} — {formatYear(selectedDynasty.endYear)}
          </span>
          <span className="caret">▾</span>
        </button>

        {showDynastyNav && (
          <div
            className="dynasty-dropdown glass-panel"
            id="dynasty-dropdown"
            role="menu"
            onKeyDown={(e) => {
              const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'))
              const currentIdx = items.indexOf(document.activeElement as HTMLElement)
              let nextIdx = currentIdx
              if (e.key === 'ArrowDown') nextIdx = (currentIdx + 1) % items.length
              else if (e.key === 'ArrowUp') nextIdx = (currentIdx - 1 + items.length) % items.length
              else if (e.key === 'Home') nextIdx = 0
              else if (e.key === 'End') nextIdx = items.length - 1
              else return
              e.preventDefault()
              items[nextIdx]?.focus()
            }}
          >
            {DYNASTIES_BY_TIME.map((d) => (
              <button
                key={d.id}
                className={`dropdown-item ${d.id === selectedDynasty.id ? 'is-active' : ''}`}
                role="menuitem"
                onClick={() => {
                  useAppStore.getState().setSelected(d.id)
                  setShowDynastyNav(false)
                }}
              >
                <span
                  className="dd-dot"
                  style={{ background: d.color || 'var(--color-primary)' }}
                />
                <span className="dd-name">{d.name}</span>
                <span className="dd-era">
                  {formatYear(d.startYear)} — {formatYear(d.endYear)}
                </span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="top-bar-right">
        <button
          className={`share-toggle ${shareHint ? 'is-feedback' : ''}`}
          onClick={async () => {
            const ok = await copyShareLink()
            if (ok) {
              setShareHint('已复制链接')
            } else {
              setShareHint('复制失败，请手动复制')
            }
            window.setTimeout(() => setShareHint(null), 1600)
          }}
          title="复制当前朝代的分享链接"
          aria-live="polite"
        >
          {shareHint ?? '分享'}
        </button>
        <button
          className="sound-toggle"
          onClick={() => {
            const next = !soundEnabled
            setSoundEnabled(next)
            sound.setEnabled(next)
          }}
          title={soundEnabled ? '关闭音效' : '开启音效'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button
          className={`detail-toggle ${isDetailOpen ? 'is-active' : ''}`}
          onClick={toggleDetail}
        >
          {isDetailOpen ? '关闭详情' : '查看详情'}
        </button>
      </div>
    </header>
  )
}

