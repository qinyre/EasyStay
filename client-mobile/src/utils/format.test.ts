import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate } from './format'

describe('formatCurrency', () => {
  it('应该正确格式化正整数金额', () => {
    expect(formatCurrency(299)).toBe('¥299')
    expect(formatCurrency(1000)).toBe('¥1,000')
    expect(formatCurrency(10000)).toBe('¥10,000')
  })

  it('应该正确格式化带小数的金额', () => {
    // 注意：formatCurrency 不自动四舍五入，需要调用者先处理
    // minimumFractionDigits: 0 只是控制显示不显示小数点
    expect(formatCurrency(299.5)).toBe('¥299.5')
    expect(formatCurrency(Math.round(299.5))).toBe('¥300')
    expect(formatCurrency(Math.round(299.4))).toBe('¥299')
  })

  it('应该正确格式化零', () => {
    expect(formatCurrency(0)).toBe('¥0')
  })

  it('应该正确格式化大额金额', () => {
    expect(formatCurrency(999999)).toBe('¥999,999')
    expect(formatCurrency(1000000)).toBe('¥1,000,000')
  })
})

describe('formatDate', () => {
  it('应该使用默认格式 yyyy-MM-dd 格式化日期', () => {
    const date = new Date(2026, 1, 23) // 2026-02-23 本地时区
    expect(formatDate(date)).toBe('2026-02-23')
  })

  it('应该使用自定义格式格式化日期', () => {
    const date = new Date(2026, 1, 23) // 2026-02-23 本地时区
    expect(formatDate(date, 'yyyy年MM月dd日')).toBe('2026年02月23日')
    expect(formatDate(date, 'MM/dd/yyyy')).toBe('02/23/2026')
    expect(formatDate(date, 'dd-MM-yyyy')).toBe('23-02-2026')
  })

  it('应该正确处理闰年日期', () => {
    const date = new Date(2024, 1, 29) // 2024-02-29 本地时区
    expect(formatDate(date)).toBe('2024-02-29')
  })

  it('应该正确处理年末日期', () => {
    const date = new Date(2026, 11, 31) // 2026-12-31 本地时区
    expect(formatDate(date)).toBe('2026-12-31')
  })

  it('应该正确处理年初日期', () => {
    const date = new Date(2026, 0, 1) // 2026-01-01 本地时区
    expect(formatDate(date)).toBe('2026-01-01')
  })
})
