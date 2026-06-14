import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

// 故意抛错的子组件
function Boom(): never {
  throw new Error('炸了')
}

function Good() {
  return <div>正常内容</div>
}

describe('ErrorBoundary', () => {
  it('子组件正常时不拦截渲染', () => {
    render(
      <ErrorBoundary name="测试区">
        <Good />
      </ErrorBoundary>,
    )
    expect(screen.getByText('正常内容')).toBeTruthy()
  })

  it('子组件抛错时显示 fallback 并包含组件名', () => {
    // 抑制 React 的 console.error（错误边界会打印预期内的报错）
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary name="地图">
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByText(/地图 组件出现错误/)).toBeTruthy()
    expect(screen.getByText('炸了')).toBeTruthy()
    expect(screen.getByText('重新加载')).toBeTruthy()
    spy.mockRestore()
  })

  it('未提供 name 时使用默认文案', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('出错了')).toBeTruthy()
    spy.mockRestore()
  })

  it('提供自定义 fallback 时优先使用', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary fallback={<div>自定义降级</div>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('自定义降级')).toBeTruthy()
    spy.mockRestore()
  })
})
