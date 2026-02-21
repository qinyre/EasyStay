import React, { useState, useRef, useEffect } from 'react';
import { Swiper } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

interface OptimizedSwiperProps {
  images?: string[];
  hotels?: Array<{ id: string; name_cn: string; name_en: string; image?: string; price_start?: number; rating?: number; star_level?: number }>;
  className?: string;
  height?: string;
  autoplay?: boolean;
  loop?: boolean;
  title?: string;
  onIndexChange?: (index: number) => void;
}

/**
 * 优化的轮播图组件 - 预加载策略
 *
 * 性能优化:
 * - 只预加载当前、前一张和后一张图片
 * - 使用 requestIdleCallback 在空闲时预加载
 * - 骨架屏占位
 */
const OptimizedSwiper: React.FC<OptimizedSwiperProps> = ({
  images,
  hotels,
  className = '',
  height = '12rem',
  autoplay = true,
  loop = true,
  title,
  onIndexChange,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(new Set([0]));
  const preloadTimeoutRef = useRef<NodeJS.Timeout>();

  const isHotelSwiper = hotels && hotels.length > 0;
  const swiperItems = isHotelSwiper ? hotels : images || [];

  // 预加载相邻图片
  const preloadImage = (index: number) => {
    if (index < 0 || index >= images.length || loadedIndexes.has(index)) return;

    const img = new Image();
    img.src = images[index];
    img.onload = () => {
      setLoadedIndexes((prev) => new Set([...prev, index]));
    };
  };

  // 当索引变化时，预加载相邻图片
  useEffect(() => {
    if (!isHotelSwiper) {
      preloadImage(currentIndex);
      preloadImage(currentIndex + 1);
      preloadImage(currentIndex - 1);

      // 使用 requestIdleCallback 或 setTimeout 延迟预加载更远的图片
      const preloadFarImages = () => {
        preloadImage(currentIndex + 2);
        preloadImage(currentIndex - 2);
      };

      // @ts-ignore - requestIdleCallback 存在于现代浏览器
      if (typeof requestIdleCallback !== 'undefined') {
        // @ts-ignore
        const idleCallbackId = requestIdleCallback(preloadFarImages);
        return () => {
          // @ts-ignore
          cancelIdleCallback(idleCallbackId);
        };
      } else {
        preloadTimeoutRef.current = setTimeout(preloadFarImages, 1000);
        return () => {
          if (preloadTimeoutRef.current) {
            clearTimeout(preloadTimeoutRef.current);
          }
        };
      }
    }
    onIndexChange?.(currentIndex);
  }, [currentIndex, swiperItems.length, isHotelSwiper]);

  const defaultImages = images?.map((url) => {
    // 优化 URL 参数 - 确保 WebP 和合适质量
    const optimizedUrl = url.includes('unsplash.com')
      ? url.replace(/q=\d+/, 'q=75').replace(/w=\d+/, 'w=800').replace(/h=\d+/, 'h=400')
      : url;
    return optimizedUrl;
  });

  return (
    <div className={`${className}`} style={{ height }}>
      <Swiper
        autoplay={autoplay}
        loop={loop}
        onIndexChange={setCurrentIndex}
        indicatorProps={{
          style: {
            '--dot-color': 'rgba(255, 255, 255, 0.3)',
            '--active-dot-color': '#fff',
          } as React.CSSProperties,
        }}
      >
        {isHotelSwiper ? (
          hotels.map((hotel) => (
            <Swiper.Item key={hotel.id}>
              <div
                className="relative h-full cursor-pointer"
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              >
                {/* 骨架屏 */}
                {!loadedIndexes.has(Number(hotel.id)) && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]" />
                )}

                {/* 图片 */}
                {hotel.image && (
                  <img
                    src={hotel.image.includes('unsplash.com')
                      ? hotel.image.includes('h=')
                        ? hotel.image.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=675')
                        : hotel.image.replace(/w=\d+/, 'w=1200') + '&h=675'
                      : hotel.image}
                    alt={hotel.name_cn}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      loadedIndexes.has(Number(hotel.id)) ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="eager"
                    onLoad={() => {
                      setLoadedIndexes((prev) => new Set([...prev, Number(hotel.id)]));
                    }}
                  />
                )}

                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 flex flex-col justify-end p-6">
                  <h1 className="text-white text-2xl font-bold drop-shadow-md mb-2">
                    {hotel.name_cn}
                  </h1>
                  <div className="flex items-center gap-1">
                    {[...Array(hotel.star_level || 5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </Swiper.Item>
          ))
        ) : (
          defaultImages?.map((url, index) => (
            <Swiper.Item key={index}>
              <div className="relative h-full">
                {/* 骨架屏 */}
                {!loadedIndexes.has(index) && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]" />
                )}

                {/* 图片 */}
                <img
                  src={url}
                  alt={`Banner ${index + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    loadedIndexes.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onLoad={() => {
                    setLoadedIndexes((prev) => new Set([...prev, index]));
                  }}
                />

                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 flex items-end p-6">
                  {title && (
                    <h1 className="text-white text-2xl font-bold drop-shadow-md">
                      {title}
                    </h1>
                  )}
                </div>
              </div>
            </Swiper.Item>
          ))
        )}
      </Swiper>
    </div>
  );
};

export default OptimizedSwiper;
