/**
 * ItemList (ImageGallery) 스키마 생성
 * 리뷰 이미지들을 구조화된 데이터로 변환
 * @param {Object} options - 갤러리 정보
 * @returns {Object} ItemList JSON-LD 스키마
 */
function createImageGallerySchema(options = {}) {
  const {
    name = '고객 리뷰',
    description = '랜딩랩 고객 리뷰 갤러리',
    images = [] // [{ url, name, description }, ...]
  } = options;

  const itemListElement = images.map((image, index) => ({
    '@type': 'ImageObject',
    position: index + 1,
    contentUrl: image.url,
    name: image.name || `리뷰 ${index + 1}`,
    description: image.description || `고객 리뷰 이미지 ${index + 1}`
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    itemListElement
  };
}

module.exports = createImageGallerySchema;
