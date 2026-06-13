import { formatYear } from '@/utils/format'
import { DataBar } from './DataBar'
import type { Dynasty, TerritoryStage } from '@/types/dynasty'

interface Props {
  d: Dynasty
}

export function TerritoryTab({ d }: Props) {
  const color = d.color || '#e63946'

  return (
    <>
      <section className="detail-section">
        <h3 className="section-title">疆域变化</h3>
        <ul className="territory-list">
          {d.territoryEvolution.map((t: TerritoryStage, i) => (
            <li key={i} className="territory-item">
              <div className="territory-year">{formatYear(t.year, 'full')}</div>
              <div className="territory-range">{t.range}</div>
              <div className="territory-event">{t.event}</div>
            </li>
          ))}
        </ul>
      </section>

      {d.economy && (
        <section className="detail-section">
          <h3 className="section-title">数据概览</h3>
          <DataBar label="极盛疆域" value={d.economy.territory} max={1400} unit="万 km²" color={color} />
          {d.economy.population !== undefined && (
            <DataBar label="极盛人口" value={d.economy.population} max={45000} unit="万" color={color} />
          )}
        </section>
      )}

      {d.economy && (
        <section className="detail-section">
          <h3 className="section-title">经济数据</h3>
          <div className="economy-grid">
            <div className="economy-stat">
              <div className="stat-num">
                {d.economy.territory}
                <span className="stat-unit">万</span>
              </div>
              <div className="stat-label">极盛疆域 (万 km²)</div>
            </div>
            {d.economy.population && (
              <div className="economy-stat">
                <div className="stat-num">
                  {d.economy.population.toLocaleString()}
                  <span className="stat-unit">万</span>
                </div>
                <div className="stat-label">极盛人口 (万)</div>
              </div>
            )}
            {d.economy.currency && (
              <div className="economy-stat">
                <div className="stat-val">{d.economy.currency}</div>
                <div className="stat-label">货币</div>
              </div>
            )}
            {d.economy.roads && (
              <div className="economy-stat">
                <div className="stat-val">{d.economy.roads}</div>
                <div className="stat-label">道路/水运</div>
              </div>
            )}
          </div>
          {d.economy.others && d.economy.others.length > 0 && (
            <ul className="economy-others">
              {d.economy.others.map((o, i) => (
                <li key={i}>
                  <span className="oth-label">{o.label}：</span>
                  {o.value}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  )
}
