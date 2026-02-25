const MUNICIPALITIES = ['北京市', '上海市', '天津市', '重庆市'];

function parseProvinceCity(address) {
    const text = String(address || '').replace(/\s+/g, '');
    if (!text) return { province: '', city: '' };

    for (const m of MUNICIPALITIES) {
        const shortName = m.replace('市', '');
        if (text.includes(m) || text.startsWith(shortName)) {
            return { province: m, city: m };
        }
    }

    let province = '';
    let city = '';

    const provinceMatch = text.match(/(.{2,}?(?:省|自治区|特别行政区))/);
    if (provinceMatch) province = provinceMatch[1];

    const afterProvince = provinceMatch ? text.slice(provinceMatch.index + provinceMatch[1].length) : text;

    const cityMatch = afterProvince.match(/(.{2,}?(?:市|自治州|地区|盟))/);
    if (cityMatch) {
        city = cityMatch[1];
    } else {
        const cityMatch2 = text.match(/(.{2,}?(?:市|自治州|地区|盟))/);
        if (cityMatch2) city = cityMatch2[1];
    }

    return { province, city };
}

module.exports = { parseProvinceCity };
