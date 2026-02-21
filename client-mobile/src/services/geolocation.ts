export const getCurrentCityWithFallback = async (fallbackCity: string = '北京'): Promise<string> => {
  try {
    const response = await fetch('http://ip-api.com/json/?lang=zh-CN');
    const geoData = await response.json();

    if (geoData.status === 'success' && geoData.city) {
      console.log('[定位] IP定位成功获取城市:', geoData.city);
      return geoData.city;
    }

    throw new Error('无法从IP定位获取城市');
  } catch (error) {
    console.warn('[定位] IP定位失败，使用默认城市:', error);
    return fallbackCity;
  }
};
