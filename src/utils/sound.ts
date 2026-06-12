/**
 * 音效占位管理器
 * - 默认静音，避免自动播放策略问题
 * - 使用 Web Audio API 合成简单提示音
 */
class SoundManager {
  private enabled = false

  setEnabled(v: boolean) {
    this.enabled = v
  }

  isEnabled() {
    return this.enabled
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled) return
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // ignore
    }
  }

  /** 印章落下：短促金石声 */
  playSeal() {
    this.playTone(180, 0.25, 'triangle')
  }

  /** 疆域切换：低缓过渡音 */
  playTransition() {
    this.playTone(120, 0.6, 'sine')
  }
}

export const sound = new SoundManager()
