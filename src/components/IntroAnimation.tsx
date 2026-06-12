import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DYNASTIES_BY_TIME } from '@/data/dynasties'
import './IntroAnimation.css'

interface IntroAnimationProps {
  onComplete: () => void
}

/**
 * 入场动画：黑屏 → 逐朝代亮起 → 印章盖下 → 进入主界面
 *
 * 设计：
 * - 全屏黑色遮罩，中心显示标题
 * - 14 个朝代名按时间顺序从暗到亮依次浮现，形成"长河"意象
 * - 中央一枚朱砂印章落下、盖印
 * - 最后整体淡出， revealing 主界面
 */
export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<'titles' | 'seal' | 'prompt' | 'exit'>('titles')
  const [visibleCount, setVisibleCount] = useState(0)
  const [exiting, setExiting] = useState(false)

  // 逐个点亮朝代名
  useEffect(() => {
    if (phase !== 'titles') return
    const total = DYNASTIES_BY_TIME.length
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setVisibleCount(i)
      if (i >= total) {
        clearInterval(timer)
        setTimeout(() => setPhase('seal'), 400)
      }
    }, 220)
    return () => clearInterval(timer)
  }, [phase])

  // 印章落下
  useEffect(() => {
    if (phase !== 'seal') return
    const t = setTimeout(() => setPhase('prompt'), 1400)
    return () => clearTimeout(t)
  }, [phase])

  // 提示出现后可点击或自动进入
  useEffect(() => {
    if (phase !== 'prompt') return
    const auto = setTimeout(() => handleEnter(), 2800)
    return () => clearTimeout(auto)
  }, [phase])

  const handleEnter = () => {
    if (exiting) return
    setExiting(true)
    setTimeout(onComplete, 900)
  }

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          onClick={handleEnter}
        >
          {/* 背景暗纹 */}
          <div className="intro-texture" />

          {/* 长河：朝代名依次亮起 */}
          <div className="intro-river">
            {DYNASTIES_BY_TIME.map((d, i) => (
              <motion.span
                key={d.id}
                className="intro-dynasty"
                initial={{ opacity: 0, y: 16, textShadow: '0 0 0 transparent' }}
                animate={
                  i < visibleCount
                    ? {
                        opacity: 1,
                        y: 0,
                        textShadow: `0 0 24px ${d.color}66`,
                      }
                    : { opacity: 0.08, y: 16, textShadow: '0 0 0 transparent' }
                }
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: i < visibleCount ? d.color : 'var(--color-text-faint)' }}
              >
                {d.name}
              </motion.span>
            ))}
          </div>

          {/* 主标题 */}
          <motion.div
            className="intro-headline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="intro-title">五千年历史长河</h1>
            <p className="intro-subtitle">FIVE THOUSAND YEARS · CHINA</p>
          </motion.div>

          {/* 印章：落在标题下方，不遮挡文字 */}
          <motion.div
            className="intro-seal-wrap"
            initial={{ scale: 1.6, opacity: 0, y: -40, rotate: -8 }}
            animate={
              phase === 'seal' || phase === 'prompt'
                ? { scale: 1, opacity: 1, y: 0, rotate: 0 }
                : { scale: 1.6, opacity: 0, y: -40, rotate: -8 }
            }
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          >
            <span className="intro-seal">史</span>
          </motion.div>

          {/* 进入提示 */}
          <AnimatePresence>
            {phase === 'prompt' && (
              <motion.div
                className="intro-enter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <span className="intro-enter-text">点击任意处进入</span>
                <motion.span
                  className="intro-enter-line"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
