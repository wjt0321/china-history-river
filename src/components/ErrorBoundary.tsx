import { Component, type ReactNode } from 'react'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  /** 自定义 fallback 内容 */
  fallback?: ReactNode
  /** 组件名（用于错误信息展示） */
  name?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * 错误边界
 *
 * React 错误边界必须是 Class Component。
 * 包裹关键 UI 区域，防止单点崩溃导致整页白屏。
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.name ? ` · ${this.props.name}` : ''}]`, error, info.componentStack)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="error-boundary-fallback glass-panel">
          <div className="error-boundary-icon">⚠</div>
          <div className="error-boundary-title">
            {this.props.name ? `${this.props.name} 组件出现错误` : '出错了'}
          </div>
          <div className="error-boundary-message">
            {this.state.error?.message || '未知错误'}
          </div>
          <button className="error-boundary-reload" onClick={this.handleReload}>
            重新加载
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
