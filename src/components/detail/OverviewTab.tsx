import type { Dynasty } from '@/types/dynasty'
import { MetaItem } from './DataBar'
import { SCENE_CAPTIONS } from './resourceMaps'
import { DATA_SOURCES, TERRITORY_DISCLAIMER } from '@/data/sources'

interface Props {
  d: Dynasty
  sceneUrl?: string
}

const CATEGORY_LABEL: Record<string, string> = {
  古籍: '古籍',
  现代: '现代',
  地理: '地理',
  图片: '图片',
}

export function OverviewTab({ d, sceneUrl }: Props) {
  const sceneCaption = sceneUrl ? SCENE_CAPTIONS[d.id] || '' : ''

  return (
    <>
      <section className="detail-section">
        <h3 className="section-title">朝代定位</h3>
        <p className="detail-summary">{d.summary}</p>
      </section>

      <div className="detail-meta">
        <MetaItem label="都城" value={d.capital} />
        <MetaItem label="开国" value={d.founder} />
        <MetaItem label="末代" value={d.lastRuler} />
        {d.peakArea && <MetaItem label="极盛疆域" value={`${d.peakArea.toLocaleString()} 万 km²`} />}
        {d.peakPopulation && <MetaItem label="极盛人口" value={`${d.peakPopulation.toLocaleString()} 万`} />}
      </div>

      {d.riseReasons.length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">因何而兴</h3>
          <ul className="reason-list">
            {d.riseReasons.map((r, i) => (
              <li key={`r-${i}`} className="reason-item rise">
                <div className="reason-title">{r.reason}</div>
                <div className="reason-desc">{r.desc}</div>
                {r.source && <div className="reason-source">— {r.source}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {d.fallReasons.length > 0 && (
        <section className="detail-section">
          <h3 className="section-title">因何而亡</h3>
          <ul className="reason-list">
            {d.fallReasons.map((r, i) => (
              <li key={`f-${i}`} className="reason-item fall">
                <div className="reason-title">{r.reason}</div>
                <div className="reason-desc">{r.desc}</div>
                {r.source && <div className="reason-source">— {r.source}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {sceneUrl && sceneCaption && (
        <section className="detail-section">
          <h3 className="section-title">代表场景</h3>
          <figure className="scene-card">
            <div className="scene-img-wrap">
              <img src={sceneUrl} alt={sceneCaption} className="scene-img" loading="lazy" />
              <div className="scene-vignette" />
            </div>
            <figcaption className="scene-caption">{sceneCaption}</figcaption>
          </figure>
        </section>
      )}

      <section className="detail-section sources-section">
        <h3 className="section-title">史料来源</h3>
        <ul className="sources-list">
          {DATA_SOURCES.map((s) => (
            <li key={s.name} className="source-item">
              <span className={`source-cat source-cat-${s.category}`}>{CATEGORY_LABEL[s.category]}</span>
              <div className="source-body">
                <div className="source-name">
                  {s.name}
                  <span className="source-license">{s.license}</span>
                </div>
                <div className="source-usage">{s.usage}</div>
              </div>
            </li>
          ))}
        </ul>
        <p className="territory-disclaimer">{TERRITORY_DISCLAIMER}</p>
      </section>
    </>
  )
}
