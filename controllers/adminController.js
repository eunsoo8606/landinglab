const Admin = require('../models/Admin');
const Contact = require('../models/Contact');

/**
 * 관리자 컨트롤러
 * 로그인, 로그아웃, 대시보드 등 관리자 관련 기능 처리
 */

/**
 * 로그인 페이지 표시
 */
exports.showLoginPage = (req, res) => {
  res.render('admin/login', {
    title: '관리자 로그인 - LandingLab',
    error: null,
    message: null
  });
};

/**
 * 로그인 처리
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  // 입력 검증
  if (!username || !password) {
    return res.render('admin/login', {
      title: '관리자 로그인 - LandingLab',
      error: '사용자명과 비밀번호를 입력해주세요.',
      message: null
    });
  }
  
  try {
    // 관리자 조회
    const admin = await Admin.findByUsername(username);
    
    if (!admin) {
      return res.render('admin/login', {
        title: '관리자 로그인 - LandingLab',
        error: '사용자명 또는 비밀번호가 올바르지 않습니다.',
        message: null
      });
    }
    
    // 비밀번호 검증
    const isValidPassword = await Admin.verifyPassword(password, admin.password);
    
    if (!isValidPassword) {
      return res.render('admin/login', {
        title: '관리자 로그인 - LandingLab',
        error: '사용자명 또는 비밀번호가 올바르지 않습니다.',
        message: null
      });
    }
    
    // 세션에 관리자 정보 저장 (비밀번호 제외)
    req.session.admin = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      role: admin.role
    };
    
    // 마지막 로그인 시간 업데이트
    await Admin.updateLastLogin(admin.id);
    
    // 대시보드로 리다이렉트
    res.redirect('/admin/dashboard');
    
  } catch (error) {
    console.error('로그인 처리 오류:', error);
    res.render('admin/login', {
      title: '관리자 로그인 - LandingLab',
      error: '로그인 처리 중 오류가 발생했습니다.',
      message: null
    });
  }
};

/**
 * 로그아웃 처리
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('로그아웃 오류:', err);
    }
    res.redirect('/admin/login');
  });
};

/**
 * 대시보드 페이지 표시
 */
exports.showDashboard = async (req, res) => {
  console.log('=== 대시보드 접근 시작 ===');
  console.log('세션 정보:', req.session.admin);
  
  try {
    const { pool } = require('../config/database');
    
    console.log('데이터베이스 쿼리 시작...');
    
    // 통계 정보 조회
    console.log('게시글 수 조회 중...');
    const [boardStats] = await pool.execute('SELECT COUNT(*) as count FROM boards');
    console.log('게시글 수:', boardStats[0].count);
    
    console.log('문의 수 조회 중...');
    const [contactStats] = await pool.execute('SELECT COUNT(*) as count FROM contacts');
    console.log('문의 수:', contactStats[0].count);
    
    console.log('포트폴리오 수 조회 중...');
    const [portfolioStats] = await pool.execute('SELECT COUNT(*) as count FROM portfolios');
    console.log('포트폴리오 수:', portfolioStats[0].count);
    
    // 최근 문의 조회 (최근 5개)
    console.log('최근 문의 조회 중...');
    const [recentContactsRaw] = await pool.execute(
      `SELECT id, name, email, phone, company_name, description, status, created_at 
       FROM contacts 
       ORDER BY created_at DESC 
       LIMIT 5`
    );
    console.log('최근 문의 수:', recentContactsRaw.length);
    
    // 암호화된 데이터 복호화
    const recentContacts = Contact.decryptSensitiveData(recentContactsRaw);
    
    console.log('대시보드 렌더링 시작...');
    res.render('admin/dashboard', {
      title: '관리자 대시보드 - LandingLab',
      admin: req.session.admin,
      stats: {
        boards: boardStats[0].count,
        contacts: contactStats[0].count,
        portfolios: portfolioStats[0].count
      },
      recentContacts
    });
    console.log('=== 대시보드 렌더링 완료 ===');
    
  } catch (error) {
    console.error('=== 대시보드 조회 오류 ===');
    console.error('오류 상세:', error);
    console.error('오류 스택:', error.stack);
    res.render('error', {
      title: '오류 - LandingLab',
      page: 'error',
      message: '대시보드를 불러오는 중 오류가 발생했습니다.',
      error: { status: 500, stack: error.stack }
    });
  }
};

// 기존 함수와의 호환성 유지
exports.getLogin = exports.showLoginPage;
