import { useAppStore } from '@/stores/appStore'
import './InkDecorations.css'

/**
 * 印章 / 墨迹 SVG 点缀
 *
 * 以固定装饰层的形式覆盖在画面上，不阻挡交互：
 * - 左上角小印章（随朝代变色）
 * - 右上角墨迹飞白
 * - 右下角水墨晕染
 * - 地图信息卡旁的竖排款识
 */
export function InkDecorations() {
  const selectedDynasty = useAppStore((s) => s.selectedDynasty)
  const dynastyColor = selectedDynasty.color || 'var(--color-accent)'

  return (
    <div className="ink-decorations" aria-hidden="true">
      {/* 左上角小印章 */}
      <div className="ink-seal ink-seal-tl" style={{ borderColor: dynastyColor, color: dynastyColor }}>
        <span>长河</span>
      </div>

      {/* 右上角墨迹飞白 */}
      <svg className="ink-splash ink-splash-tr" viewBox="0 0 200 160" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="ink-blur-tr" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
        </defs>
        <path
          d="M180,20 Q120,35 95,70 T60,120 Q55,140 80,145 Q130,150 160,110 T190,40 Q200,15 180,20 Z"
          fill="currentColor"
          filter="url(#ink-blur-tr)"
          opacity="0.18"
        />
        <path
          d="M170,28 Q125,42 105,72 T75,115"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.25"
        />
      </svg>

      {/* 右下角水墨晕染 */}
      <svg className="ink-splash ink-splash-br" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="ink-blur-br" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>
        <ellipse cx="200" cy="160" rx="90" ry="60" fill="currentColor" filter="url(#ink-blur-br)" opacity="0.1" />
        <ellipse cx="220" cy="145" rx="45" ry="30" fill="currentColor" filter="url(#ink-blur-br)" opacity="0.12" />
        <path
          d="M160,180 Q190,150 230,165"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.2"
        />
      </svg>

      {/* 地图信息卡旁的竖排款识 */}
      <div className="ink-inscription">
        <span className="ink-inscription-line">中</span>
        <span className="ink-inscription-line">华</span>
        <span className="ink-inscription-line">疆</span>
        <span className="ink-inscription-line">域</span>
      </div>
    </div>
  )
}
