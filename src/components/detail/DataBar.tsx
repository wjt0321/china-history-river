/**
 * 数据对比条（可复用组件）
 * 用于疆域/人口等数值对比展示
 */
export function DataBar({
  label,
  value,
  max,
  unit,
  color,
}: {
  label: string
  value: number
  max: number
  unit: string
  color: string
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="data-bar">
      <div className="data-bar-header">
        <div className="data-bar-label">{label}</div>
        <div className="data-bar-value">
          {value.toLocaleString()} <span className="data-bar-unit">{unit}</span>
        </div>
      </div>
      <div className="data-bar-track">
        <div className="data-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

/** 元数据项（都城/开国/末代等） */
export function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-item">
      <div className="meta-label">{label}</div>
      <div className="meta-value">{value}</div>
    </div>
  )
}
