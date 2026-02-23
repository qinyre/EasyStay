import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import Home from './Home'
import { getPopularCities } from '../services/api'
import { getCurrentCityWithFallback } from '../services/geolocation'

// Mock API 服务
vi.mock('../services/api', () => ({
  getPopularCities: vi.fn(),
}))

// Mock 定位服务
vi.mock('../services/geolocation', () => ({
  getCurrentCityWithFallback: vi.fn(),
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('Home 页面', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 默认 mock 返回值
    vi.mocked(getPopularCities).mockResolvedValue([
      { name: '北京', image: 'https://example.com/beijing.jpg' },
      { name: '上海', image: 'https://example.com/shanghai.jpg' },
    ])
    vi.mocked(getCurrentCityWithFallback).mockResolvedValue('深圳')
  })

  describe('页面渲染', () => {
    it('应该渲染搜索表单', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('home.search_placeholder')).toBeInTheDocument()
      })
    })

    it('应该渲染关键词输入框', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Keyword (Optional)')).toBeInTheDocument()
      })
    })

    it('应该渲染搜索按钮', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('home.search_btn')).toBeInTheDocument()
      })
    })

    it('应该渲染定位按钮', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('定位')).toBeInTheDocument()
      })
    })

    it('应该渲染筛选按钮', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('筛选')).toBeInTheDocument()
      })
    })
  })

  describe('热门城市', () => {
    it('应该在加载时显示骨架屏', async () => {
      vi.mocked(getPopularCities).mockImplementation(() => new Promise(() => {})) // 永不 resolve
      render(<Home />)

      // 应该有4个骨架屏元素
      const skeletons = document.querySelectorAll('.animate-pulse.bg-gray-200')
      expect(skeletons.length).toBe(4)
    })

    it('应该加载并显示热门城市', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('北京')).toBeInTheDocument()
        expect(screen.getByText('上海')).toBeInTheDocument()
      })
    })

    it('应该显示热门城市标题', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('home.popular_destinations')).toBeInTheDocument()
      })
    })
  })

  describe('快捷城市标签', () => {
    it('应该显示所有快捷城市标签', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('北京')).toBeInTheDocument()
        expect(screen.getByText('上海')).toBeInTheDocument()
        expect(screen.getByText('广州')).toBeInTheDocument()
        expect(screen.getByText('深圳')).toBeInTheDocument()
        expect(screen.getByText('成都')).toBeInTheDocument()
        expect(screen.getByText('杭州')).toBeInTheDocument()
        expect(screen.getByText('武汉')).toBeInTheDocument()
        expect(screen.getByText('西安')).toBeInTheDocument()
        expect(screen.getByText('南京')).toBeInTheDocument()
        expect(screen.getByText('重庆')).toBeInTheDocument()
        expect(screen.getByText('三亚')).toBeInTheDocument()
        expect(screen.getByText('新加坡')).toBeInTheDocument()
      })
    })
  })

  describe('功能特色区域', () => {
    it('应该显示"为什么选择我们"标题', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('home.why_choose_us')).toBeInTheDocument()
      })
    })

    it('应该显示最佳价格功能', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('home.best_price')).toBeInTheDocument()
      })
    })

    it('应该显示客服支持功能', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('home.support')).toBeInTheDocument()
      })
    })
  })

  describe('筛选面板', () => {
    it('应该能够打开筛选面板', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('筛选')).toBeInTheDocument()
      })

      // 点击筛选按钮
      const filterButton = screen.getByText('筛选')
      filterButton.click()

      // 检查筛选选项是否显示
      await waitFor(() => {
        expect(screen.getByText('星级')).toBeInTheDocument()
        expect(screen.getByText('价格区间')).toBeInTheDocument()
        expect(screen.getByText('特色标签')).toBeInTheDocument()
      })
    })

    it('应该显示所有星级选项', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('筛选')).toBeInTheDocument()
      })

      const filterButton = screen.getByText('筛选')
      filterButton.click()

      await waitFor(() => {
        expect(screen.getByText('全部')).toBeInTheDocument()
        expect(screen.getByText('五星')).toBeInTheDocument()
        expect(screen.getByText('四星')).toBeInTheDocument()
        expect(screen.getByText('三星')).toBeInTheDocument()
      })
    })
  })

  describe('日期显示', () => {
    it('应该显示入住和退房日期标签', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('home.check_in')).toBeInTheDocument()
        expect(screen.getByText('home.check_out')).toBeInTheDocument()
      })
    })

    it('应该显示间夜数标签', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText('间夜数')).toBeInTheDocument()
      })
    })
  })

  describe('API 调用', () => {
    it('应该在组件挂载时调用 getPopularCities', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(getPopularCities).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('间夜数控制', () => {
    it('应该显示间夜数', async () => {
      render(<Home />)

      await waitFor(() => {
        // 默认是1晚
        const nightCount = screen.getByText('1')
        expect(nightCount).toBeInTheDocument()
      })
    })
  })
})
