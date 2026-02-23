import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd-mobile'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import { SearchProvider } from '../contexts/SearchContext'
import { AuthProvider } from '../contexts/AuthContext'

// 测试用的包装组件
interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <AuthProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  )
}

// 自定义渲染函数
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// 重新导出所有 Testing Library 工具
export * from '@testing-library/react'
export { customRender as render }

// Mock 数据生成器
export const mockHotel = {
  id: '1',
  name_cn: '测试酒店',
  name_en: 'Test Hotel',
  star_level: 5,
  location: {
    province: '广东省',
    city: '深圳市',
    address: '南山区科技园',
  },
  rooms: [
    { id: 'r1', type: '标准间', price: 299, stock: 10 },
    { id: 'r2', type: '豪华间', price: 499, stock: 5 },
    { id: 'r3', type: '套房', price: 899, stock: 2 },
  ],
  rating: 4.8,
  image: 'https://example.com/hotel.jpg',
  images: ['https://example.com/hotel1.jpg'],
  tags: ['豪华', '亲子'],
  price_start: 299,
  is_offline: false,
  audit_status: 'approved' as const,
}

export const mockBooking = {
  id: 'b1',
  hotelId: '1',
  roomId: 'r1',
  userId: 'u1',
  checkIn: '2026-02-25',
  checkOut: '2026-02-27',
  totalPrice: 598,
  status: 'confirmed' as const,
  guestName: '张三',
  guestPhone: '13800138000',
  hotelName: '测试酒店',
  hotelImage: 'https://example.com/hotel.jpg',
  roomType: '标准间',
}

export const mockUser = {
  id: 'u1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'user' as const,
}
