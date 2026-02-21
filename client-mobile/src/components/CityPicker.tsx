import React, { useState } from 'react';
import { Popup, Grid, Toast, Input } from 'antd-mobile';

interface CityPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
}

const HOT_CITIES = [
  '北京', '上海', '广州', '深圳', '成都',
  '杭州', '武汉', '西安', '南京', '重庆',
  '苏州', '厦门', '青岛', '三亚', '昆明',
];

const ALL_CITIES = [
  '北京', '上海', '天津', '重庆',
  '石家庄', '太原', '呼和浩特', '沈阳', '大连', '长春', '哈尔滨',
  '南京', '无锡', '苏州', '杭州', '宁波', '温州', '合肥', '福州', '厦门', '南昌', '济南', '青岛', '郑州', '武汉', '长沙', '广州', '深圳', '南宁', '海口', '三亚',
  '成都', '贵阳', '昆明', '拉萨',
  '西安', '兰州', '西宁', '银川', '乌鲁木齐',
  '台北', '香港', '澳门'
];

export const CityPicker: React.FC<CityPickerProps> = ({ visible, onClose, onSelect }) => {
  const [searchText, setSearchText] = useState('');

  const filteredCities = searchText
    ? ALL_CITIES.filter(city => city.includes(searchText))
    : ALL_CITIES;

  const handleCityClick = (city: string) => {
    onSelect(city);
    Toast.show({ content: `已选择：${city}`, duration: 500 });
    onClose();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '70vh', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex flex-col h-full bg-white rounded-t-2xl overflow-hidden font-sans">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-bold text-gray-900">选择城市</div>
            <button
              className="p-2 -mr-2 rounded-full text-gray-500 active:bg-gray-100"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <Input
            placeholder="搜索城市"
            value={searchText}
            onChange={setSearchText}
            clearable
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {!searchText && (
            <div className="p-4">
              <div className="text-sm font-bold text-gray-500 mb-3">热门城市</div>
              <Grid columns={4} gap={8}>
                {HOT_CITIES.map(city => (
                  <Grid.Item key={city} className="text-center">
                    <button
                      className="w-full py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                      onClick={() => handleCityClick(city)}
                    >
                      {city}
                    </button>
                  </Grid.Item>
                ))}
              </Grid>
            </div>
          )}

          <div className="p-4 pt-2">
            <div className="text-sm font-bold text-gray-500 mb-3">
              {searchText ? '搜索结果' : '全部城市'}
            </div>
            <Grid columns={4} gap={8}>
              {filteredCities.length > 0 ? (
                filteredCities.map(city => (
                  <Grid.Item key={city} className="text-center">
                    <button
                      className="w-full py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                      onClick={() => handleCityClick(city)}
                    >
                      {city}
                    </button>
                  </Grid.Item>
                ))
              ) : (
                <div className="col-span-4 text-center text-gray-400 text-sm py-8">
                  未找到相关城市
                </div>
              )}
            </Grid>
          </div>
        </div>
      </div>
    </Popup>
  );
};
