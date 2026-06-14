import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { STORY_STEPS } from '@/data/storyline'
import { useAppStore } from '@/stores/appStore'
import { prefersReducedMotion } from '@/utils/motion'
import './StoryTour.css'

export function StoryTour() {
  const selectedDynastyId = useAppStore((s) => s.selectedDynastyId)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const currentStep = STORY_STEPS[stepIndex]
  const selectedStepIndex = useMemo(
    () => STORY_STEPS.findIndex((step) => step.dynastyId === selectedDynastyId),
    [selectedDynastyId],
  )

  useEffect(() => {
    if (isPlaying || selectedStepIndex < 0 || selectedStepIndex === stepIndex) return
    setStepIndex(selectedStepIndex)
  }, [isPlaying, selectedStepIndex, stepIndex])

  useEffect(() => {
    if (!isPlaying) return
    const step = STORY_STEPS[stepIndex]
    if (!step) return

    useAppStore.getState().setSelected(step.dynastyId)

    const duration = prefersReducedMotion() ? Math.min(step.durationMs, 1200) : step.durationMs
    const timer = window.setTimeout(() => {
      setStepIndex((idx) => {
        if (idx >= STORY_STEPS.length - 1) {
          setIsPlaying(false)
          return idx
        }
        return idx + 1
      })
    }, duration)

    return () => window.clearTimeout(timer)
  }, [isPlaying, stepIndex])

  const startTour = () => {
    const startIndex = selectedStepIndex >= 0 ? selectedStepIndex : 0
    setStepIndex(startIndex)
    setIsPlaying(true)
  }

  const stopTour = () => setIsPlaying(false)

  const goToStep = (delta: number) => {
    setStepIndex((idx) => Math.max(0, Math.min(STORY_STEPS.length - 1, idx + delta)))
  }

  return (
    <section className={`story-tour ${isPlaying ? 'is-playing' : ''}`} aria-label="自动巡游叙事模式">
      {isPlaying ? (
        <>
          <AnimatePresence mode="wait">
            {currentStep && (
              <motion.div
                key={currentStep.dynastyId}
                className="story-card glass-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <div className="story-kicker">自动巡游 · {stepIndex + 1}/{STORY_STEPS.length}</div>
                <h2 className="story-title">{currentStep.title}</h2>
                <p className="story-narration">{currentStep.narration}</p>
                <div className="story-progress" aria-hidden="true">
                  <span style={{ width: `${((stepIndex + 1) / STORY_STEPS.length) * 100}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="story-controls glass-panel">
            <button type="button" className="story-btn" onClick={() => goToStep(-1)} disabled={stepIndex === 0}>
              上一段
            </button>
            <button type="button" className="story-primary" onClick={stopTour}>
              暂停
            </button>
            <button type="button" className="story-btn" onClick={() => goToStep(1)} disabled={stepIndex === STORY_STEPS.length - 1}>
              下一段
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="story-launcher glass-panel" onClick={startTour}>
          开始巡游
        </button>
      )}
    </section>
  )
}
