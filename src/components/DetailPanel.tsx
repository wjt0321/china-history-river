import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'
import type { Dynasty, Emperor, HistoricalEvent, Battle, Culture, ForeignRelation, TerritoryStage, HistoricalEvaluation, RelatedPerson } from '@/types/dynasty'
import './DetailPanel.css'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const FIGURE_IMAGES: Record<string, string> = {
  xia: asset('/images/figures/xia-yu.jpg'),
  shang: asset('/images/figures/shang-tang.jpg'),
  zhou: asset('/images/figures/zhou-wuwang.jpg'),
  qin: asset('/images/figures/thirteen-emperors.jpg'),
  han: asset('/images/figures/han-guangwu.jpg'),
  sanguo: asset('/images/figures/sanguo-zhuge.jpg'),
  'jin-nanbeichao': asset('/images/figures/jin-wangxizhi.jpg'),
  sui: asset('/images/figures/sui-yangdi.jpg'),
  tang: asset('/images/figures/tang-taizong.jpg'),
  song: asset('/images/figures/song-taizu.jpg'),
  yuan: asset('/images/figures/kublai.jpg'),
  ming: asset('/images/figures/zhuyuanzhang.jpg'),
  qing: asset('/images/figures/kangxi.jpg'),
}

const SCENE_IMAGES: Record<string, string> = {
  xia: asset('/images/scenes/scene-xia-erlitou.jpg'),
  shang: asset('/images/scenes/scene-shang-ding.jpg'),
  zhou: asset('/images/scenes/scene-zhou-bells.jpg'),
  qin: asset('/images/scenes/han-palace.jpg'),
  han: asset('/images/scenes/han-palace.jpg'),
  sanguo: asset('/images/scenes/scene-sanguo-chibi.jpg'),
  'jin-nanbeichao': asset('/images/scenes/scene-dunhuang.jpg'),
  sui: asset('/images/scenes/scene-dunhuang.jpg'),
  tang: asset('/images/scenes/qianli-rivers.jpg'),
  wudai: asset('/images/scenes/scene-wudai-yeyan.jpg'),
  song: asset('/images/scenes/qingming-river.jpg'),
  yuan: asset('/images/scenes/scene-greatwall.jpg'),
  ming: asset('/images/scenes/scene-greatwall.jpg'),
  qing: asset('/images/scenes/forbidden-city.jpg'),
}

const FIGURE_CAPTIONS: Record<string, string> = {
  xia: '大禹像（公有领域 · Wikimedia Commons）',
  shang: '商汤王像',
  zhou: '周武王像',
  qin: '阎立本《历代帝王图》',
  han: '南薰殿旧藏 · 汉光武帝',
  sanguo: '诸葛亮像',
  'jin-nanbeichao': '王羲之《快雪时晴帖》',
  sui: '历代帝王图系列 · 隋炀帝',
  tang: '唐太宗李世民',
  song: '宋太祖赵匡胤',
  yuan: '元世祖忽必烈',
  ming: '明太祖朱元璋',
  qing: '清圣祖玄烨',
}

const SCENE_CAPTIONS: Record<string, string> = {
  xia: '二里头遗址 · 夏代青铜爵（公有领域）',
  shang: '后母戊鼎 · 商代青铜礼器（公有领域）',
  zhou: '曾侯乙编钟 · 战国早期青铜礼乐重器（公有领域）',
  qin: '《汉宫春晓图》局部',
  han: '《汉宫春晓图》局部',
  sanguo: '赤壁之战 · 三国古战场画作（公有领域）',
  'jin-nanbeichao': '敦煌莫高窟壁画',
  sui: '敦煌莫高窟壁画',
  tang: '王希孟《千里江山图》',
  wudai: '顾闳中《韩熙载夜宴图》（公有领域）',
  song: '《清明上河图》局部',
  yuan: '明长城（八达岭）',
  ming: '明长城（八达岭）',
  qing: '紫禁城',
}

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
  const { selectedDynasty, isDetailOpen, closeDetail } = useAppStore()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const figureUrl = FIGURE_IMAGES[selectedDynasty.id]
  const sceneUrl = SCENE_IMAGES[selectedDynasty.id]
  const dynastyColor = selectedDynasty.color || '#e63946'

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
          <div className="scroll-content">
          <header className="detail-header">
            <motion.div
              className="detail-era"
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{ color: dynastyColor }}
            >
              {formatYear(selectedDynasty.startYear)} — {formatYear(selectedDynasty.endYear)}
            </motion.div>
            <motion.h2
              className="detail-name"
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{ backgroundImage: `linear-gradient(135deg, ${dynastyColor} 0%, var(--color-paper) 100%)` }}
            >
              {selectedDynasty.name}
            </motion.h2>
            <motion.div
              className="detail-pinyin"
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
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
            <motion.div
              className="detail-hero"
              custom={4}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="hero-img-wrap">
                <img src={figureUrl} alt={FIGURE_CAPTIONS[selectedDynasty.id]} className="hero-img" loading="lazy" />
                <div className="hero-vignette" />
              </div>
              <div className="hero-caption">{FIGURE_CAPTIONS[selectedDynasty.id]}</div>
            </motion.div>
          )}

          <nav className="detail-tabs">
            {TABS.map((t, i) => (
              <button
                key={t.key}
                className={`tab-btn ${activeTab === t.key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(t.key)}
                style={activeTab === t.key ? { background: dynastyColor, color: 'var(--color-bg-deep)' } : undefined}
              >
                {t.label}
              </button>
            ))}
            <motion.div
              className="tab-indicator"
              layoutId="tab-indicator"
              style={{ background: dynastyColor }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
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
                {activeTab === 'overview' && <OverviewTab d={selectedDynasty} sceneUrl={sceneUrl} sceneCaption={sceneUrl ? SCENE_CAPTIONS[selectedDynasty.id] : ''} />}
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

function OverviewTab({ d, sceneUrl, sceneCaption }: { d: Dynasty; sceneUrl?: string; sceneCaption: string }) {
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

      {sceneUrl && (
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
    </>
  )
}

function EmperorsTab({ d }: { d: Dynasty }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const toggle = (name: string) => setExpanded((cur) => (cur === name ? null : name))

  return (
    <section className="detail-section">
      <h3 className="section-title">帝王长廊 <span className="section-count">共 {d.emperors.length} 位</span></h3>
      <div className="emperor-list">
        {d.emperors.map((e: Emperor, i) => (
          <div
            key={i}
            className={`emperor-card ${expanded === e.name ? 'is-expanded' : ''}`}
            onClick={() => toggle(e.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(k) => { if (k.key === 'Enter' || k.key === ' ') toggle(e.name) }}
          >
            <div className="emperor-head">
              <div className="emperor-name">{e.name}</div>
              <div className="emperor-reign">{e.reign}</div>
            </div>
            <div className="emperor-meta">
              <span className="emp-tag">{e.role}</span>
              <span className="emp-tag">{e.years} 年</span>
            </div>
            <AnimatePresence>
              {expanded === e.name && (
                <motion.div
                  className="emperor-detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {e.achievements.length > 0 && (
                    <div className="emperor-body">
                      <div className="emp-subtitle">功</div>
                      <ul className="emp-list">
                        {e.achievements.map((a, j) => <li key={j}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                  {e.faults && e.faults.length > 0 && (
                    <div className="emperor-body">
                      <div className="emp-subtitle fault">过</div>
                      <ul className="emp-list">
                        {e.faults.map((a, j) => <li key={j}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

function EventsTab({ d }: { d: Dynasty }) {
  const { setHighlightedEvent } = useAppStore()
  const sorted = [...d.events].sort((a, b) => a.year - b.year)
  const makeEventId = (ev: HistoricalEvent) => `${d.id}-${ev.year}-${ev.title}`
  return (
    <>
      <section className="detail-section">
        <h3 className="section-title">大事年表 <span className="section-count">共 {sorted.length} 件</span></h3>
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
                <div className="timeline-year">{formatYear(ev.year)}</div>
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
          <h3 className="section-title">关键战役 <span className="section-count">共 {d.battles.length} 场</span></h3>
          <div className="battle-list">
            {d.battles.map((b: Battle, i) => (
              <div key={i} className="battle-card">
                <div className="battle-year">{formatYear(b.year)}</div>
                <div className="battle-name">{b.name}</div>
                <div className="battle-desc">{b.desc}</div>
                {b.keyFigures.length > 0 && (
                  <div className="battle-figures">
                    {b.keyFigures.map((f, j) => <span key={j} className="figure-tag">{f}</span>)}
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

function CultureTab({ d }: { d: Dynasty }) {
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
              {items.map((item, i) => <li key={i}>{item}</li>)}
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
                  {r.events.map((ev, j) => <li key={j}>{ev}</li>)}
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
                <cite>—— {e.author} · {e.source}</cite>
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

function TerritoryTab({ d }: { d: Dynasty }) {
  return (
    <>
      <section className="detail-section">
        <h3 className="section-title">疆域变化</h3>
        <ul className="territory-list">
          {d.territoryEvolution.map((t: TerritoryStage, i) => (
            <li key={i} className="territory-item">
              <div className="territory-year">{formatYear(t.year)}</div>
              <div className="territory-range">{t.range}</div>
              <div className="territory-event">{t.event}</div>
            </li>
          ))}
        </ul>
      </section>

      {d.economy && (
        <section className="detail-section">
          <h3 className="section-title">经济数据</h3>
          <div className="economy-grid">
            <div className="economy-stat">
              <div className="stat-num">{d.economy.territory}<span className="stat-unit">万</span></div>
              <div className="stat-label">极盛疆域 (万 km²)</div>
            </div>
            {d.economy.population && (
              <div className="economy-stat">
                <div className="stat-num">{d.economy.population.toLocaleString()}<span className="stat-unit">万</span></div>
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
                <li key={i}><span className="oth-label">{o.label}：</span>{o.value}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-item">
      <div className="meta-label">{label}</div>
      <div className="meta-value">{value}</div>
    </div>
  )
}

function formatYear(y: number): string {
  if (y < 0) return `公元前 ${-y}`
  return `公元 ${y} 年`
}
