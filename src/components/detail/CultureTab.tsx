import type { Dynasty, Culture, ForeignRelation, HistoricalEvaluation, RelatedPerson } from '@/types/dynasty'

interface Props {
  d: Dynasty
}

export function CultureTab({ d }: Props) {
  const c = d.culture
  const sections: { key: keyof Culture; label: string; icon: string }[] = [
    { key: 'literature', label: '文学', icon: '文' },
    { key: 'art', label: '艺术', icon: '美' },
    { key: 'technology', label: '科技', icon: '科' },
    { key: 'engineering', label: '工程', icon: '工' },
    { key: 'philosophy', label: '思想', icon: '哲' },
    { key: 'institutions', label: '制度', icon: '制' },
  ]

  return (
    <>
      {sections.map(({ key, label, icon }) => {
        const items = c[key]
        if (!items || items.length === 0) return null
        return (
          <section key={key} className="detail-section">
            <h3 className="section-title">
              <span className="section-icon">{icon}</span>
              {label}
            </h3>
            <ul className="culture-list">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )
      })}

      {d.foreignRelations && d.foreignRelations.length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">对外关系</h3>
          <div className="foreign-grid">
            {d.foreignRelations.map((r: ForeignRelation, i) => (
              <div key={i} className="foreign-card">
                <div className="foreign-direction">{r.direction}方</div>
                <div className="foreign-target">{r.target}</div>
                {r.desc && <div className="foreign-desc">{r.desc}</div>}
                <ul className="foreign-events">
                  {r.events.map((ev, j) => (
                    <li key={j}>{ev}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {d.evaluations && d.evaluations.length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">史家评价</h3>
          <div className="eval-list">
            {d.evaluations.map((e: HistoricalEvaluation, i) => (
              <blockquote key={i} className="eval-quote">
                <p>「{e.quote}」</p>
                <cite>
                  —— {e.author} · {e.source}
                </cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {d.relatedPersons && d.relatedPersons.length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">相关人物</h3>
          <div className="person-list">
            {d.relatedPersons.map((p: RelatedPerson, i) => (
              <div key={i} className="person-card">
                <div className="person-name">{p.name}</div>
                <div className="person-role">{p.role}</div>
                <div className="person-events">{p.events}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
