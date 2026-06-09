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
    console.log('공지사항 수 조회 중...');
    const [boardStats] = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM posts p
       JOIN boards b ON p.board_id = b.id
       WHERE b.company_id = 1 AND b.category = 'notice'`
    );
    console.log('공지사항 수:', boardStats[0].count);

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

/**
 * 대시보드 통계 데이터 제공 API
 * 서비스 활성 상태 파악을 위해 일일/주간/월간 방문자 및 문의 수, 7일 트래픽 추이, 기기 비율, 유입경로 비율을 집계합니다.
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const { pool } = require('../config/database');

    // 1. 일일/주간/월간 요약 정보 집계 (방문자 수 및 문의 접수량)
    // 오늘 방문자 및 문의 (CURDATE() 이후)
    const [todayVisits] = await pool.execute("SELECT COUNT(*) as count FROM visit_logs WHERE created_at >= CURDATE()");
    const [todayContacts] = await pool.execute("SELECT COUNT(*) as count FROM contacts WHERE created_at >= CURDATE()");

    // 최근 7일(오늘 포함) 방문자 및 문의
    const [weeklyVisits] = await pool.execute("SELECT COUNT(*) as count FROM visit_logs WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)");
    const [weeklyContacts] = await pool.execute("SELECT COUNT(*) as count FROM contacts WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)");

    // 최근 30일(오늘 포함) 방문자 및 문의
    const [monthlyVisits] = await pool.execute("SELECT COUNT(*) as count FROM visit_logs WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)");
    const [monthlyContacts] = await pool.execute("SELECT COUNT(*) as count FROM contacts WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)");

    // 2. 최근 7일간의 일자별 트래픽 및 문의 트렌드 데이터 구축
    const dates = [];
    const visitTrendMap = {};
    const contactTrendMap = {};

    // 날짜 매핑 맵 초기화 (데이터가 없는 일자의 경우 0으로 출력되도록 보장)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      // 현지 시간 기준으로 날짜 오프셋을 계산합니다.
      d.setDate(d.getDate() - i);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const formattedDate = `${month}-${day}`;
      dates.push(formattedDate);
      visitTrendMap[formattedDate] = 0;
      contactTrendMap[formattedDate] = 0;
    }

    // 최근 7일 방문자 일별 집계 쿼리 실행
    const [visitTrends] = await pool.execute(`
      SELECT DATE_FORMAT(created_at, '%m-%d') as date, COUNT(*) as count 
      FROM visit_logs 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) 
      GROUP BY DATE_FORMAT(created_at, '%m-%d')
    `);
    visitTrends.forEach(item => {
      if (visitTrendMap[item.date] !== undefined) {
        visitTrendMap[item.date] = item.count;
      }
    });

    // 최근 7일 문의 일별 집계 쿼리 실행
    const [contactTrends] = await pool.execute(`
      SELECT DATE_FORMAT(created_at, '%m-%d') as date, COUNT(*) as count 
      FROM contacts 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) 
      GROUP BY DATE_FORMAT(created_at, '%m-%d')
    `);
    contactTrends.forEach(item => {
      if (contactTrendMap[item.date] !== undefined) {
        contactTrendMap[item.date] = item.count;
      }
    });

    // 라벨 순서에 맞춰 배열 데이터로 추출
    const visitTrendData = dates.map(date => visitTrendMap[date]);
    const contactTrendData = dates.map(date => contactTrendMap[date]);

    // 3. 기기 접근 비중 집계 (PC vs Mobile vs Tablet)
    // 디바이스 타입별로 그룹화하여 렌더링에 적절한 데이터를 추출합니다.
    const [deviceStats] = await pool.execute(`
      SELECT device_type, COUNT(*) as count 
      FROM visit_logs 
      GROUP BY device_type
    `);
    const deviceData = { pc: 0, mobile: 0, tablet: 0 };
    deviceStats.forEach(item => {
      if (deviceData[item.device_type] !== undefined) {
        deviceData[item.device_type] = item.count;
      }
    });

    // 4. 유입 경로 비중 집계 (naver, google, daum, ad, sns, direct, etc)
    // 주요 유입 소스별 분석용 통계를 조회합니다.
    const [inflowStats] = await pool.execute(`
      SELECT inflow_path, COUNT(*) as count 
      FROM visit_logs 
      GROUP BY inflow_path
      ORDER BY count DESC
    `);
    const inflowData = {};
    inflowStats.forEach(item => {
      inflowData[item.inflow_path] = item.count;
    });

    // 성공 응답으로 취합된 통계 JSON 반환
    return res.json({
      success: true,
      summary: {
        today: { visits: todayVisits[0].count, contacts: todayContacts[0].count },
        weekly: { visits: weeklyVisits[0].count, contacts: weeklyContacts[0].count },
        monthly: { visits: monthlyVisits[0].count, contacts: monthlyContacts[0].count }
      },
      trends: {
        labels: dates,
        visits: visitTrendData,
        contacts: contactTrendData
      },
      deviceRatio: deviceData,
      inflowRatio: inflowData
    });

  } catch (error) {
    // 예외 발생 시 에러 로깅 후 500 응답 반환
    console.error('대시보드 통계 API 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '통계 데이터를 집계하는 중 서버 오류가 발생했습니다.'
    });
  }
};
