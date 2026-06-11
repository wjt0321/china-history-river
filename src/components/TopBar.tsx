import { DYNASTIES_BY_TIME } from '@/data/dynasties'
import { useAppStore } from '@/stores/appStore'
import { useState } from 'react'
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
  const { selectedDynasty, isDetailOpen, toggleDetail } = useAppStore()
  const [showDynastyNav, setShowDynastyNav] = useState(false)

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

      <nav className="top-bar-center">
        <button
          className="nav-dynasty-trigger"
          onClick={() => setShowDynastyNav((v) => !v)}
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
          <div className="dynasty-dropdown glass-panel">
            {DYNASTIES_BY_TIME.map((d) => (
              <button
                key={d.id}
                className={`dropdown-item ${d.id === selectedDynasty.id ? 'is-active' : ''}`}
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
          className={`detail-toggle ${isDetailOpen ? 'is-active' : ''}`}
          onClick={toggleDetail}
        >
          {isDetailOpen ? '关闭详情' : '查看详情'}
        </button>
      </div>
    </header>
  )
}

function formatYear(y: number): string {
  if (y < 0) return `BC ${-y}`
  return `${y}`
}
