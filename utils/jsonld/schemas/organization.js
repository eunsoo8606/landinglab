/**
 * Organization 스키마 생성
 * @param {Object} options - 조직 정보
 * @returns {Object} Organization JSON-LD 스키마
 */
function createOrganizationSchema(options = {}) {
  const {
    name = '랜딩랩',
    url = 'https://langdinglab.com',
    logo = 'https://langdinglab.com/images/logo-2.png',
    description = '압도적인 랜딩페이지 제작 전문 업체',
    sameAs = [] // 소셜 미디어 URL 배열
  } = options;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description
  };

  // 소셜 미디어가 있으면 추가
  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema;
}

module.exports = createOrganizationSchema;
