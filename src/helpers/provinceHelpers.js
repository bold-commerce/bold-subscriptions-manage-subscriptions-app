function getProvinces(country) {
  const countries = window.Countries;
  return (country in countries) ? countries[country].province_codes : {};
}

function getProvinceCode(country, province) {
  if (province.length <= 2) {
    return province;
  }
  const provinces = getProvinces(country);
  const provinceFound = provinces.find(p => p.name === province);

  return (provinceFound === undefined ? null : provinceFound.value);
}

function getProvinceName(country, province) {
  if (!province) {
    return null;
  } else if (province.length > 2) {
    return province;
  }

  const found = Object.entries(getProvinces(country)).find(
    element => element[0] === province || element[1] === province,
  );

  return !found ? null : found[0];
}

function getProvinceOptions(country, useCodeAsValue) {
  const provinces = getProvinces(country);

  if (provinces.length === 0) return [];

  const shouldUseCodeAsValue = useCodeAsValue !== undefined ? useCodeAsValue : false;

  return Object.entries(provinces)
    .map(p => ({ name: p[0], value: (shouldUseCodeAsValue ? p[1] : p[0]) }));
}

function countryHasProvinces(country) {
  return Object.keys(getProvinces(country)).length > 0;
}


export { getProvinces, getProvinceCode, getProvinceName, getProvinceOptions, countryHasProvinces };
