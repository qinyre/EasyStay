import React, { useState, useRef, useEffect } from 'react';
import { Swiper } from 'antd-mobile';

interface OptimizedSwiperProps {
  images: string[];
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
  className = '',
  height = '12rem',
  autoplay = true,
  loop = true,
  title,
  onIndexChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(new Set([0]));
  const preloadTimeoutRef = useRef<NodeJS.Timeout>();

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
    preloadImage(currentIndex);
    preloadImage(currentIndex + 1);
    preloadImage(currentIndex - 1);

    onIndexChange?.(currentIndex);

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
  }, [currentIndex, images.length]);

  const defaultImages = images.map((url) => {
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
        {defaultImages.map((url, index) => (
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
        ))}
      </Swiper>
    </div>
  );
};

export default OptimizedSwiper;
