// 메인 페이지 컨트롤러
exports.getHome = (req, res) => {
  res.render('index', {
    title: 'LandingLab | 앞도적인 랜딩페이지 제작',
    page: 'home'
  });
};

// 회사 소개 페이지 컨트롤러
exports.getAbout = (req, res) => {
  res.render('about', {
    title: 'LandingLab - 회사 소개',
    page: 'about'
  });
};

// 서비스 페이지 컨트롤러
exports.getServices = (req, res) => {
  res.render('services', {
    title: 'LandingLab - 서비스',
    page: 'services'
  });
};

// 연락처 페이지 컨트롤러
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'LandingLab - 연락처',
    page: 'contact'
  });
};

// 포트폴리오 페이지 컨트롤러
exports.getPortfolio = (req, res) => {
  // 샘플 포트폴리오 데이터 (10개)
  const portfolios = [
    {
      id: 1,
      title: '동진담 (DongJinDam)',
      category: '웰니스/뷰티',
      description: '동양의 진귀함과 현대 과학이 만나는 머스크 기반 프리미엄 웰니스 브랜드. 브랜드 포지셔닝, 인테리어 공간, 웰니스 철학을 담은 하이엔드 랜딩페이지.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      image: '/images/portfolio/portfolio-1.jpg',
      url: 'https://cmong-portfolio1.netlify.app/'
    },
    {
      id: 2,
      title: '피트니스 센터',
      category: '헬스/피트니스',
      description: '현대적인 피트니스 센터 웹사이트. 회원 등록 및 PT 예약 기능 포함.',
      tech: ['Express', 'Bootstrap', 'JavaScript'],
      image: '/images/portfolio/portfolio-2.jpg',
      url: '#'
    },
    {
      id: 3,
      title: '부동산 중개',
      category: '부동산',
      description: '부동산 매물 검색 및 상담 신청이 가능한 전문 랜딩페이지.',
      tech: ['React', 'Node.js', 'MongoDB'],
      image: '/images/portfolio/portfolio-3.jpg',
      url: '#'
    },
    {
      id: 4,
      title: '뷰티 살롱',
      category: '뷰티/미용',
      description: '뷰티 살롱을 위한 우아한 디자인. 온라인 예약 시스템 통합.',
      tech: ['Vue.js', 'Tailwind CSS', 'Firebase'],
      image: '/images/portfolio/portfolio-4.jpg',
      url: '#'
    },
    {
      id: 5,
      title: '법률 사무소',
      category: '법률/컨설팅',
      description: '전문적이고 신뢰감 있는 법률 사무소 웹사이트. 상담 예약 기능 제공.',
      tech: ['Next.js', 'TypeScript', 'Prisma'],
      image: '/images/portfolio/portfolio-5.jpg',
      url: '#'
    },
    {
      id: 6,
      title: '카페 브랜드',
      category: '카페/베이커리',
      description: '감성적인 카페 브랜드 소개 페이지. 메뉴와 매장 위치 안내 포함.',
      tech: ['HTML5', 'SCSS', 'jQuery'],
      image: '/images/portfolio/portfolio-6.jpg',
      url: '#'
    },
    {
      id: 7,
      title: '의료 클리닉',
      category: '의료/건강',
      description: '의료 클리닉을 위한 깔끔하고 전문적인 웹사이트. 진료 예약 시스템.',
      tech: ['Angular', 'Node.js', 'PostgreSQL'],
      image: '/images/portfolio/portfolio-7.jpg',
      url: '#'
    },
    {
      id: 8,
      title: '교육 학원',
      category: '교육',
      description: '학원 소개 및 수강 신청이 가능한 교육 플랫폼 랜딩페이지.',
      tech: ['Django', 'Python', 'Bootstrap'],
      image: '/images/portfolio/portfolio-8.jpg',
      url: '#'
    },
    {
      id: 9,
      title: '인테리어 디자인',
      category: '인테리어',
      description: '인테리어 디자인 포트폴리오 및 견적 문의 페이지.',
      tech: ['Gatsby', 'GraphQL', 'Styled Components'],
      image: '/images/portfolio/portfolio-9.jpg',
      url: '#'
    },
    {
      id: 10,
      title: '자동차 정비',
      category: '자동차',
      description: '자동차 정비소 소개 및 예약 시스템. 서비스 안내 포함.',
      tech: ['Laravel', 'PHP', 'MySQL'],
      image: '/images/portfolio/portfolio-10.jpg',
      url: '#'
    }
  ];

  res.render('portfolio', {
    title: 'LandingLab - 포트폴리오',
    page: 'portfolio',
    portfolios: portfolios
  });
};
