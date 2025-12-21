/**
 * WebSite 스키마 생성
 * @param {Object} options - 웹사이트 정보
 * @returns {Object} WebSite JSON-LD 스키마
 */
function createWebSiteSchema(options = {}) {
  const {
    name = '랜딩랩',
    url = 'https://landinglab.com',
    description = '단순한 페이지가 아닙니다. 매출을 바꾸는 전략입니다.',
    inLanguage = 'ko-KR'
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    inLanguage
  };
}

module.exports = createWebSiteSchema;
