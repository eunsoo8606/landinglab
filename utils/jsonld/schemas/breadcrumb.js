/**
 * BreadcrumbList 스키마 생성
 * @param {Array} items - 빵부스러기 항목 배열 [{ name, url }, ...]
 * @returns {Object} BreadcrumbList JSON-LD 스키마
 */
function createBreadcrumbSchema(items = []) {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}

module.exports = createBreadcrumbSchema;
