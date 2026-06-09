const { query } = require('../config/database');

/**
 * 접속한 기기의 User-Agent 문자열을 기반으로 디바이스 타입을 판별합니다.
 * 모바일 최적화 및 유저 환경 분석을 위해 기기 종류(PC, 모바일, 태블릿)를 식별할 필요가 있습니다.
 * @param {string} userAgent - 브라우저 User-Agent 정보
 * @returns {string} pc | mobile | tablet
 */
function getDeviceType(userAgent) {
  if (!userAgent) return 'pc';
  const ua = userAgent.toLowerCase();
  
  // 태블릿 디바이스 키워드 판별
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }
  // 모바일 디바이스 키워드 판별
  if (/mobi|ipod|iphone|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }
  return 'pc';
}

/**
 * 유저의 Referer 헤더 및 UTM 소스 파라미터를 기반으로 유입 경로를 분류합니다.
 * 마케팅 채널별 유입 비중 및 광고 효율을 측정하기 위해 정확한 유입 경로 식별이 중요합니다.
 * @param {string} referer - 이전 페이지 URL (레퍼러)
 * @param {string} utmSource - 마케팅용 UTM Source 쿼리 파라미터
 * @returns {string} naver | google | daum | sns | ad | direct | etc
 */
function getInflowPath(referer, utmSource) {
  // UTM 파라미터가 있을 경우 최우선으로 유입 경로를 식별합니다. (광고 성과 추적용)
  if (utmSource) {
    const source = utmSource.toLowerCase();
    if (source.includes('naver')) return 'naver';
    if (source.includes('google')) return 'google';
    if (source.includes('daum')) return 'daum';
    if (source.includes('ad')) return 'ad';
    if (source.includes('sns') || source.includes('facebook') || source.includes('instagram') || source.includes('twitter')) return 'sns';
    return source;
  }

  // 레퍼러 헤더가 없다면 주소창에 직접 타이핑하거나 즐겨찾기를 통해 유입된 것으로 판단합니다.
  if (!referer) return 'direct';
  
  const ref = referer.toLowerCase();
  // 국내외 주요 검색엔진 및 도메인 분석
  if (ref.includes('naver.com')) return 'naver';
  if (ref.includes('google.com') || ref.includes('google.co.kr')) return 'google';
  if (ref.includes('daum.net') || ref.includes('tistory.com')) return 'daum';
  
  // 주요 소셜 네트워크 서비스(SNS) 유입 분석
  if (ref.includes('facebook.com') || ref.includes('instagram.com') || ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('youtube.com')) {
    return 'sns';
  }
  
  // 광고 트래픽 도메인 판별 (예: ad.naver.com 등)
  if (ref.includes('ad.')) return 'ad';
  
  // 그 외의 외부 사이트 링크를 통한 유입
  return 'etc';
}

/**
 * 방문자 로그 추적 미들웨어
 * 사용자의 IP, 디바이스 종류, 유입 경로를 감지하여 당일(00:00~23:59) 최초 접속인 경우에 한해 DB에 적재합니다.
 */
async function visitorTracker(req, res, next) {
  const path = req.path;
  
  // 관리자 페이지, 관리자 API, 정적 파일(이미지, JS, CSS 등) 접속은 순수 방문자 통계에서 제외합니다.
  if (
    path.startsWith('/admin') || 
    path.startsWith('/api/admin') || 
    path.includes('.') || 
    path.startsWith('/js') || 
    path.startsWith('/css') || 
    path.startsWith('/images')
  ) {
    return next();
  }

  try {
    // 로드 밸런서나 프록시 뒤에 배치되어 있을 경우 유저의 실제 IP를 획득하기 위해 X-Forwarded-For를 우선 참조합니다.
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ipAddress = ip.split(',')[0].trim();
    
    // 개발 및 테스트 중 발생하는 무의미한 로컬 트래픽이 실운영 통계에 포함되어 오차가 발생하는 것을 방지하기 위해,
    // 루프백 IP(127.0.0.1, ::1 등)에서의 접근은 DB 기록 없이 즉시 다음 미들웨어로 건너뜁니다.
    if (
      ipAddress === '127.0.0.1' || 
      ipAddress === '::1' || 
      ipAddress === '::ffff:127.0.0.1' || 
      ipAddress.toLowerCase() === 'localhost'
    ) {
      return next();
    }
    
    // 동일 IP에 대해 중복 집계를 방지하기 위해 오늘 날짜(CURDATE()) 기준의 로그가 이미 존재하는지 체크합니다.
    const checkSql = 'SELECT COUNT(*) as count FROM visit_logs WHERE ip_address = ? AND created_at >= CURDATE()';
    const checkResult = await query(checkSql, [ipAddress]);
    
    // 당일 첫 방문인 경우에만 로그를 삽입합니다. (순방문자 수 기준 통계 수집)
    if (checkResult[0].count === 0) {
      const userAgent = req.headers['user-agent'] || '';
      const referer = req.headers['referer'] || '';
      const utmSource = req.query.utm_source || '';
      
      const deviceType = getDeviceType(userAgent);
      const inflowPath = getInflowPath(referer, utmSource);
      
      const insertSql = `
        INSERT INTO visit_logs (ip_address, user_agent, device_type, referrer, inflow_path)
        VALUES (?, ?, ?, ?, ?)
      `;
      await query(insertSql, [ipAddress, userAgent, deviceType, referer, inflowPath]);
    }
  } catch (error) {
    // 통계 로그 수집 실패가 실제 웹서비스 이용(메인 페이지 서빙 등)에 장애를 초래하지 않도록
    // 오류는 로그로만 남기고 다음 미들웨어로 항상 무조건 통과시킵니다.
    console.error('방문자 로그 수집 오류:', error.message);
  }
  
  next();
}

module.exports = visitorTracker;
