import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Dynasty, Emperor } from '@/types/dynasty'

interface Props {
  d: Dynasty
}

export function EmperorsTab({ d }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const toggle = (name: string) => setExpanded((cur) => (cur === name ? null : name))

  return (
    <section className="detail-section">
      <h3 className="section-title">
        帝王长廊 <span className="section-count">共 {d.emperors.length} 位</span>
      </h3>
      <div className="emperor-list">
        {d.emperors.map((e: Emperor, i) => (
          <div
            key={i}
            className={`emperor-card ${expanded === e.name ? 'is-expanded' : ''}`}
            onClick={() => toggle(e.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(k) => {
              if (k.key === 'Enter' || k.key === ' ') toggle(e.name)
            }}
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
                        {e.achievements.map((a, j) => (
                          <li key={j}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {e.faults && e.faults.length > 0 && (
                    <div className="emperor-body">
                      <div className="emp-subtitle fault">过</div>
                      <ul className="emp-list">
                        {e.faults.map((a, j) => (
                          <li key={j}>{a}</li>
                        ))}
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
