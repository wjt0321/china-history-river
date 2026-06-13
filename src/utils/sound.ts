/**
 * 音效占位管理器
 * - 默认静音，避免自动播放策略问题
 * - 使用 Web Audio API 合成简单提示音
 */
class SoundManager {
  private enabled = false
  private ctx: AudioContext | null = null

  private getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (this.ctx) return this.ctx
    const AudioCtx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    this.ctx = new AudioCtx()
    return this.ctx
  }

  private async ensureRunning() {
    const ctx = this.getCtx()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch {
        // ignore
      }
    }
  }

  setEnabled(v: boolean) {
    this.enabled = v
    if (v) {
      void this.ensureRunning()
    }
  }

  isEnabled() {
    return this.enabled
  }

  private async playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled) return
    const ctx = this.getCtx()
    if (!ctx) return
    await this.ensureRunning()
    if (ctx.state !== 'running') return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, now)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + duration)
    } catch {
      // ignore
    }
  }

  /** 印章落下：短促金石声 */
  async playSeal() {
    await this.playTone(220, 0.18, 'triangle')
  }

  /** 疆域切换：低缓过渡音 */
  async playTransition() {
    const ctx = this.getCtx()
    if (!ctx || !this.enabled) return
    await this.ensureRunning()
    if (ctx.state !== 'running') return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(110, now)
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.4)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.55)
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundManager()
