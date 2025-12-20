/**
 * 인증 미들웨어
 * 관리자 로그인 및 권한 체크를 위한 미들웨어
 */

/**
 * 로그인 여부 확인 미들웨어
 * 세션에 사용자 정보가 있는지 확인
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.admin) {
    // 로그인된 상태
    return next();
  }
  
  // 로그인되지 않은 상태 - 로그인 페이지로 리다이렉트
  return res.redirect('/admin/login');
}

/**
 * 관리자 권한 확인 미들웨어
 * 특정 권한이 필요한 페이지에 사용
 */
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    const { role } = req.session.admin;
    
    // super_admin 또는 admin 권한 확인
    if (role === 'super_admin' || role === 'admin') {
      return next();
    }
    
    // 권한 부족
    return res.status(403).render('error', {
      message: '접근 권한이 없습니다.',
      error: { status: 403 }
    });
  }
  
  // 로그인되지 않은 상태
  return res.redirect('/admin/login');
}

/**
 * 이미 로그인된 사용자 체크 미들웨어
 * 로그인 페이지 접근 시 사용
 */
function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.admin) {
    // 이미 로그인된 상태 - 대시보드로 리다이렉트
    return res.redirect('/admin/dashboard');
  }
  
  // 로그인되지 않은 상태 - 계속 진행
  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  redirectIfAuthenticated
};
