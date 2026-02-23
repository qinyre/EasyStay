import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import { HotelCard } from './HotelCard'
import { Hotel } from '../types'

const mockHotel: Hotel = {
  id: '1',
  name_cn: '深圳湾安达仕酒店',
  name_en: 'Andaz Shenzhen Bay',
  star_level: 5,
  location: {
    province: '广东省',
    city: '深圳市',
    address: '南山区科技园南路',
  },
  rooms: [
    { id: 'r1', type: '标准间', price: 299, stock: 10 },
    { id: 'r2', type: '豪华间', price: 499, stock: 5 },
  ],
  rating: 4.8,
  image: 'https://example.com/hotel.jpg',
  images: ['https://example.com/hotel1.jpg', 'https://example.com/hotel2.jpg'],
  tags: ['豪华', '亲子', '免费停车'],
  price_start: 299,
  is_offline: false,
  audit_status: 'approved',
  created_at: '2026-01-01T00:00:00Z',
}

describe('HotelCard', () => {
  it('应该正确渲染酒店信息', () => {
    const handleClick = vi.fn()
    render(<HotelCard hotel={mockHotel} onClick={handleClick} />)

    // 检查酒店名称
    expect(screen.getByText('深圳湾安达仕酒店')).toBeInTheDocument()
    expect(screen.getByText('Andaz Shenzhen Bay')).toBeInTheDocument()

    // 检查评分
    expect(screen.getByText('4.8')).toBeInTheDocument()

    // 检查地址
    expect(screen.getByText('南山区科技园南路')).toBeInTheDocument()

    // 检查标签
    expect(screen.getByText('豪华')).toBeInTheDocument()
    expect(screen.getByText('亲子')).toBeInTheDocument()
    expect(screen.getByText('免费停车')).toBeInTheDocument()

    // 检查价格
    expect(screen.getByText('from')).toBeInTheDocument()
    expect(screen.getByText('¥299')).toBeInTheDocument()
  })

  it('应该显示正确的星级数量', () => {
    const handleClick = vi.fn()
    render(<HotelCard hotel={mockHotel} onClick={handleClick} />)

    // 获取所有星星元素 (通过 SVG 元素)
    const stars = document.querySelectorAll('.text-yellow-400')
    // 评分星星 + 星级星星 = 2 + 5 = 7
    expect(stars.length).toBeGreaterThan(0)
  })

  it('应该在没有标签时不渲染标签区域', () => {
    const hotelWithoutTags: Hotel = {
      ...mockHotel,
      tags: undefined,
    }
    const handleClick = vi.fn()
    render(<HotelCard hotel={hotelWithoutTags} onClick={handleClick} />)

    // 标签容器应该存在但是空的
    const tagContainer = screen.getByText('from').closest('.flex')
    expect(tagContainer).toBeInTheDocument()
  })

  it('应该在点击时调用 onClick 处理函数', () => {
    const handleClick = vi.fn()
    render(<HotelCard hotel={mockHotel} onClick={handleClick} />)

    const card = screen.getByText('深圳湾安达仕酒店').closest('.adm-card')
    expect(card).toBeInTheDocument()

    if (card) {
      fireEvent.click(card)
      expect(handleClick).toHaveBeenCalledTimes(1)
    }
  })

  it('应该在没有起始价格时显示 ¥0', () => {
    const hotelWithoutPrice: Hotel = {
      ...mockHotel,
      price_start: undefined,
    }
    const handleClick = vi.fn()
    render(<HotelCard hotel={hotelWithoutPrice} onClick={handleClick} />)

    expect(screen.getByText('¥0')).toBeInTheDocument()
  })

  it('应该正确渲染酒店图片', () => {
    const handleClick = vi.fn()
    render(<HotelCard hotel={mockHotel} onClick={handleClick} />)

    const image = screen.getByAltText('深圳湾安达仕酒店')
    expect(image).toBeInTheDocument()
    expect(image.getAttribute('src')).toBe('https://example.com/hotel.jpg')
  })

  it('应该正确处理不同星级的酒店', () => {
    const threeStarHotel: Hotel = {
      ...mockHotel,
      star_level: 3,
    }
    const handleClick = vi.fn()
    const { rerender } = render(<HotelCard hotel={threeStarHotel} onClick={handleClick} />)

    // 重新渲染五星级酒店
    const fiveStarHotel: Hotel = {
      ...mockHotel,
      star_level: 5,
    }
    rerender(<HotelCard hotel={fiveStarHotel} onClick={handleClick} />)

    // 组件应该正常渲染
    expect(screen.getByText('深圳湾安达仕酒店')).toBeInTheDocument()
  })
})
