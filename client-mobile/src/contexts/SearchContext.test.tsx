import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SearchProvider, useSearch } from './SearchContext'
import { addDays } from 'date-fns'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SearchProvider>{children}</SearchProvider>
)

describe('SearchContext', () => {
  describe('初始状态', () => {
    it('应该有正确的默认城市', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })
      expect(result.current.city).toBe('上海')
    })

    it('应该有正确的默认日期范围（今天和明天）', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })
      const today = new Date()
      const tomorrow = addDays(today, 1)

      // 检查日期是否接近（忽略时分秒差异）
      expect(Math.abs(result.current.dateRange.start.getTime() - today.getTime())).toBeLessThan(1000)
      expect(Math.abs(result.current.dateRange.end.getTime() - tomorrow.getTime())).toBeLessThan(1000)
    })

    it('应该有空的默认关键词', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })
      expect(result.current.keyword).toBe('')
    })

    it('应该有零默认星级', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })
      expect(result.current.starLevel).toBe(0)
    })

    it('应该有默认价格范围 0-5000', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })
      expect(result.current.priceRange).toEqual({ min: 0, max: 5000 })
    })

    it('应该有空的默认选中标签', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })
      expect(result.current.selectedTags).toEqual([])
    })
  })

  describe('城市设置', () => {
    it('应该能够设置城市', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setCity('北京')
      })

      expect(result.current.city).toBe('北京')
    })
  })

  describe('日期范围设置', () => {
    it('应该能够设置日期范围', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })
      const newStart = new Date('2026-03-01')
      const newEnd = new Date('2026-03-05')

      act(() => {
        result.current.setDateRange({ start: newStart, end: newEnd })
      })

      expect(result.current.dateRange.start).toEqual(newStart)
      expect(result.current.dateRange.end).toEqual(newEnd)
    })
  })

  describe('关键词设置', () => {
    it('应该能够设置关键词', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setKeyword('海景房')
      })

      expect(result.current.keyword).toBe('海景房')
    })
  })

  describe('星级设置', () => {
    it('应该能够设置星级', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setStarLevel(5)
      })

      expect(result.current.starLevel).toBe(5)
    })
  })

  describe('价格范围设置', () => {
    it('应该能够设置价格范围', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setPriceRange({ min: 200, max: 1000 })
      })

      expect(result.current.priceRange).toEqual({ min: 200, max: 1000 })
    })
  })

  describe('标签管理', () => {
    it('应该能够设置标签数组', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setSelectedTags(['亲子', '豪华'])
      })

      expect(result.current.selectedTags).toEqual(['亲子', '豪华'])
    })

    it('应该能够添加新标签', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.toggleTag('亲子')
      })

      expect(result.current.selectedTags).toContain('亲子')
    })

    it('应该能够移除已存在的标签', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setSelectedTags(['亲子', '豪华'])
        result.current.toggleTag('亲子')
      })

      expect(result.current.selectedTags).not.toContain('亲子')
      expect(result.current.selectedTags).toContain('豪华')
    })

    it('应该能够在标签不存在时添加它', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.toggleTag('新标签')
      })

      expect(result.current.selectedTags).toContain('新标签')
    })
  })

  describe('重置过滤器', () => {
    it('应该重置所有过滤器到默认值', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      // 设置一些值
      act(() => {
        result.current.setStarLevel(5)
        result.current.setPriceRange({ min: 500, max: 2000 })
        result.current.setSelectedTags(['亲子', '豪华'])
      })

      // 重置
      act(() => {
        result.current.resetFilters()
      })

      expect(result.current.starLevel).toBe(0)
      expect(result.current.priceRange).toEqual({ min: 0, max: 5000 })
      expect(result.current.selectedTags).toEqual([])
    })

    it('重置时不应该影响城市、日期和关键词', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setCity('北京')
        result.current.setKeyword('测试')
        result.current.resetFilters()
      })

      expect(result.current.city).toBe('北京')
      expect(result.current.keyword).toBe('测试')
    })
  })

  describe('调整间夜数', () => {
    it('应该能够增加间夜数', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })
      const initialEnd = result.current.dateRange.end

      act(() => {
        result.current.adjustNights(1)
      })

      expect(result.current.dateRange.end.getTime()).toBeGreaterThan(initialEnd.getTime())
    })

    it('应该能够减少间夜数', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      // 先设置3晚
      act(() => {
        result.current.setDateRange({
          start: new Date('2026-03-01'),
          end: new Date('2026-03-04')
        })
      })

      const initialEnd = result.current.dateRange.end

      act(() => {
        result.current.adjustNights(-1)
      })

      expect(result.current.dateRange.end.getTime()).toBeLessThan(initialEnd.getTime())
    })

    it('间夜数不应该少于1晚', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.adjustNights(-10)
      })

      const nights = Math.round(
        (result.current.dateRange.end.getTime() - result.current.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(nights).toBeGreaterThanOrEqual(1)
    })

    it('间夜数不应该超过30晚', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.adjustNights(100)
      })

      const nights = Math.round(
        (result.current.dateRange.end.getTime() - result.current.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(nights).toBeLessThanOrEqual(30)
    })
  })

  describe('转换为搜索参数', () => {
    it('应该正确转换基本搜索参数', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setCity('深圳')
        result.current.setDateRange({
          start: new Date('2026-03-01'),
          end: new Date('2026-03-03')
        })
      })

      const params = result.current.toSearchParams()

      expect(params.get('city')).toBe('深圳')
      expect(params.get('checkIn')).toBe('2026-03-01')
      expect(params.get('checkOut')).toBe('2026-03-03')
    })

    it('应该包含关键词参数', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setKeyword('海景')
      })

      const params = result.current.toSearchParams()
      expect(params.get('keyword')).toBe('海景')
    })

    it('应该包含星级参数（当大于0时）', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setStarLevel(5)
      })

      const params = result.current.toSearchParams()
      expect(params.get('starLevel')).toBe('5')
    })

    it('不应该包含星级参数（当为0时）', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      const params = result.current.toSearchParams()
      expect(params.get('starLevel')).toBeNull()
    })

    it('应该包含价格范围参数（当非默认时）', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setPriceRange({ min: 300, max: 2000 })
      })

      const params = result.current.toSearchParams()
      expect(params.get('priceMin')).toBe('300')
      expect(params.get('priceMax')).toBe('2000')
    })

    it('应该包含标签参数', () => {
      const { result } = renderHook(() => useSearch(), { wrapper })

      act(() => {
        result.current.setSelectedTags(['亲子', '豪华'])
      })

      const params = result.current.toSearchParams()
      expect(params.get('tags')).toBe('亲子,豪华')
    })
  })

  describe('错误处理', () => {
    it('应该在未使用 Provider 时抛出错误', () => {
      // 抑制控制台错误输出
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useSearch())
      }).toThrow('useSearch must be used within a SearchProvider')

      consoleError.mockRestore()
    })
  })
})
