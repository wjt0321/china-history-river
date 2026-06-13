import { useAppStore } from '@/stores/appStore'
import { formatYear } from '@/utils/format'
import type { Dynasty, HistoricalEvent, Battle } from '@/types/dynasty'

interface Props {
  d: Dynasty
}

export function EventsTab({ d }: Props) {
  const { setHighlightedEvent } = useAppStore()
  const sorted = [...d.events].sort((a, b) => a.year - b.year)
  const makeEventId = (ev: HistoricalEvent) => `${d.id}-${ev.year}-${ev.title}`

  return (
    <>
      <section className="detail-section">
        <h3 className="section-title">
          大事年表 <span className="section-count">共 {sorted.length} 件</span>
        </h3>
        <ul className="timeline-list">
          {sorted.map((ev: HistoricalEvent, i) => (
            <li
              key={i}
              className={`timeline-item ${ev.coords ? 'has-location' : ''}`}
              onMouseEnter={() => setHighlightedEvent(makeEventId(ev))}
              onMouseLeave={() => setHighlightedEvent(null)}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-year">{formatYear(ev.year, 'full')}</div>
                <div className="timeline-title">{ev.title}</div>
                {ev.location && <div className="timeline-location">{ev.location}</div>}
                <div className="timeline-desc">{ev.desc}</div>
                {ev.source && <div className="timeline-source">— {ev.source}</div>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {d.battles.length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">
            关键战役 <span className="section-count">共 {d.battles.length} 场</span>
          </h3>
          <div className="battle-list">
            {d.battles.map((b: Battle, i) => (
              <div key={i} className="battle-card">
                <div className="battle-year">{formatYear(b.year, 'full')}</div>
                <div className="battle-name">{b.name}</div>
                <div className="battle-desc">{b.desc}</div>
                {b.keyFigures.length > 0 && (
                  <div className="battle-figures">
                    {b.keyFigures.map((f, j) => (
                      <span key={j} className="figure-tag">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
