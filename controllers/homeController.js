// 메인 페이지 컨트롤러
exports.getHome = (req, res) => {
  res.render('index', {
    title: '랜딩랩 | 앞도적인 랜딩페이지 제작',
    page: 'home'
  });
};

// 회사 소개 페이지 컨트롤러
exports.getAbout = (req, res) => {
  res.render('about', {
    title: '랜딩랩 | 회사 소개',
    page: 'about'
  });
};

// 서비스 페이지 컨트롤러
exports.getServices = (req, res) => {
  res.render('services', {
    title: '랜딩랩 | 서비스',
    page: 'services'
  });
};

// 연락처 페이지 컨트롤러
exports.getContact = (req, res) => {
  res.render('contact', {
    title: '랜딩랩 | 연락처',
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

// 포스트 데이터 (공통 사용)
const getPostsData = () => {
  return [
    {
      id: 1,
      title: 'GA4로 시작하는 데이터 분석',
      description: 'Google Analytics 4의 핵심 기능과 이벤트 추적, 전환 측정 방법을 알아봅니다. 데이터 기반 의사결정을 위한 필수 가이드입니다.',
      category: '분석',
      tags: ['#GA4', '#구글애널리틱스', '#데이터분석', '#전환추적'],
      gradient: 'linear-gradient(135deg, #e8f4f8 0%, #b8dce8 100%)',
      image: '/images/posts/ga4.png',
      author: '랜딩랩',
      date: '2025-12-13',
      readTime: '5분',
      content: `
        <h2>GA4란 무엇인가?</h2>
        <p>Google Analytics 4(GA4)는 구글의 차세대 웹 분석 플랫폼입니다. 기존 Universal Analytics(UA)를 대체하며, 이벤트 기반 데이터 수집과 머신러닝을 활용한 인사이트 제공이 특징입니다.</p>
        
        <h3>GA4의 핵심 기능</h3>
        <p>GA4는 웹사이트와 앱을 통합하여 분석할 수 있으며, 사용자 중심의 데이터 수집 방식을 채택했습니다. 이벤트 기반 추적으로 더욱 유연한 데이터 분석이 가능합니다.</p>
        
        <h3>이벤트 추적 설정하기</h3>
        <p>GA4에서는 모든 상호작용을 이벤트로 추적합니다. 페이지뷰, 스크롤, 클릭, 전환 등 다양한 사용자 행동을 이벤트로 설정하여 상세한 분석이 가능합니다.</p>
        
        <h3>전환 측정 및 최적화</h3>
        <p>GA4의 전환 추적 기능을 활용하면 비즈니스 목표 달성 여부를 정확히 측정할 수 있습니다. 전환 경로 분석을 통해 사용자 여정을 이해하고 최적화 포인트를 찾을 수 있습니다.</p>
        
        <h3>데이터 기반 의사결정</h3>
        <p>GA4의 인사이트 기능은 머신러닝을 활용하여 중요한 트렌드와 이상 징후를 자동으로 감지합니다. 이를 통해 데이터 기반의 전략적 의사결정이 가능합니다.</p>
      `
    },
    {
      id: 2,
      title: 'SEO 최적화 완벽 가이드',
      description: '검색 엔진 상위 노출을 위한 필수 SEO 전략과 기술적 최적화 방법을 소개합니다. 실전에서 바로 적용 가능한 팁을 제공합니다.',
      category: '마케팅',
      tags: ['#SEO', '#검색엔진최적화', '#상위노출', '#키워드전략'],
      gradient: 'linear-gradient(135deg, #d4f1e8 0%, #a8dcc9 100%)',
      image: '/images/posts/seo.png',
      author: '랜딩랩',
      date: '2025-12-13',
      readTime: '7분',
      content: `
        <h2>SEO의 중요성</h2>
        <p>검색 엔진 최적화(SEO)는 웹사이트의 가시성을 높이고 유기적 트래픽을 증가시키는 핵심 전략입니다. 올바른 SEO 전략은 장기적인 비즈니스 성장의 기반이 됩니다.</p>
        
        <h3>키워드 리서치</h3>
        <p>효과적인 SEO의 첫 단계는 타겟 키워드를 선정하는 것입니다. 검색량, 경쟁도, 사용자 의도를 고려하여 최적의 키워드를 찾아야 합니다.</p>
        
        <h3>온페이지 SEO</h3>
        <p>제목 태그, 메타 설명, 헤딩 구조, 내부 링크 등 페이지 내부 요소를 최적화합니다. 콘텐츠의 품질과 관련성이 가장 중요합니다.</p>
        
        <h3>기술적 SEO</h3>
        <p>사이트 속도, 모바일 최적화, 구조화된 데이터, XML 사이트맵 등 기술적 요소를 개선합니다. 크롤링과 인덱싱이 원활하게 이루어지도록 해야 합니다.</p>
        
        <h3>콘텐츠 전략</h3>
        <p>고품질 콘텐츠는 SEO의 핵심입니다. 사용자에게 가치를 제공하고, E-E-A-T 원칙을 준수하며, 정기적으로 업데이트하는 것이 중요합니다.</p>
      `
    },
    {
      id: 3,
      title: '반응형 웹 디자인',
      description: '모바일, 태블릿, 데스크탑 모든 기기에서 완벽하게 작동하는 반응형 웹사이트 제작 노하우를 공유합니다.',
      category: '개발',
      tags: ['#반응형웹', '#모바일최적화', '#미디어쿼리', '#크로스브라우징'],
      gradient: 'linear-gradient(135deg, #f0e6ff 0%, #d4b8ff 100%)',
      image: '/images/posts/responsive.png',
      author: '랜딩랩',
      date: '2025-12-13',
      readTime: '6분',
      content: `
        <h2>반응형 웹 디자인이란?</h2>
        <p>반응형 웹 디자인은 다양한 화면 크기와 기기에서 최적의 사용자 경험을 제공하는 웹 디자인 접근 방식입니다. 하나의 코드베이스로 모든 기기를 지원합니다.</p>
        
        <h3>미디어 쿼리 활용</h3>
        <p>CSS 미디어 쿼리를 사용하여 화면 크기에 따라 다른 스타일을 적용합니다. 브레이크포인트를 전략적으로 설정하여 모든 기기에서 완벽한 레이아웃을 구현합니다.</p>
        
        <h3>유연한 그리드 시스템</h3>
        <p>Flexbox와 CSS Grid를 활용하여 유연한 레이아웃을 구축합니다. 고정 크기 대신 상대적 단위(%, vw, vh)를 사용하여 적응형 디자인을 만듭니다.</p>
        
        <h3>이미지 최적화</h3>
        <p>반응형 이미지 기법을 사용하여 각 기기에 적합한 크기의 이미지를 제공합니다. srcset과 picture 요소를 활용하여 성능을 최적화합니다.</p>
        
        <h3>모바일 우선 접근</h3>
        <p>모바일 우선(Mobile-First) 방식으로 디자인하면 핵심 콘텐츠에 집중하고 점진적으로 기능을 추가할 수 있습니다. 이는 성능과 사용성 모두를 향상시킵니다.</p>
      `
    },
    {
      id: 4,
      title: '고성과 랜딩페이지 제작 전략',
      description: '전환율을 극대화하는 랜딩페이지 디자인 원칙과 CTA 최적화 방법을 알아봅니다. 실제 사례와 함께 설명합니다.',
      category: '마케팅',
      tags: ['#랜딩페이지', '#전환율최적화', '#CTA', '#퍼포먼스마케팅'],
      gradient: 'linear-gradient(135deg, #fff4e6 0%, #ffe0b3 100%)',
      image: '/images/posts/landing.png',
      author: '랜딩랩',
      date: '2025-12-13',
      readTime: '8분',
      content: `
        <h2>랜딩페이지의 목적</h2>
        <p>랜딩페이지는 특정 마케팅 캠페인의 목표를 달성하기 위해 설계된 독립적인 웹페이지입니다. 방문자를 고객으로 전환시키는 것이 핵심 목표입니다.</p>
        
        <h3>명확한 가치 제안</h3>
        <p>방문자가 3초 안에 제품이나 서비스의 가치를 이해할 수 있어야 합니다. 헤드라인과 서브헤드라인을 통해 명확하고 설득력 있는 메시지를 전달합니다.</p>
        
        <h3>효과적인 CTA 디자인</h3>
        <p>행동 유도 버튼(CTA)은 랜딩페이지의 가장 중요한 요소입니다. 눈에 띄는 색상, 명확한 문구, 적절한 위치 배치가 전환율을 크게 향상시킵니다.</p>
        
        <h3>신뢰 구축 요소</h3>
        <p>고객 후기, 사례 연구, 인증 마크, 보안 배지 등을 활용하여 신뢰를 구축합니다. 사회적 증거는 방문자의 의사결정에 큰 영향을 미칩니다.</p>
        
        <h3>A/B 테스팅</h3>
        <p>지속적인 A/B 테스팅을 통해 랜딩페이지를 최적화합니다. 헤드라인, CTA 문구, 이미지, 레이아웃 등 다양한 요소를 테스트하여 최고의 성과를 달성합니다.</p>
      `
    },
    {
      id: 5,
      title: 'UI/UX 디자인 핵심 원칙',
      description: '사용자 경험을 최우선으로 하는 UI/UX 디자인 방법론과 효과적인 인터페이스 설계 전략을 다룹니다.',
      category: '디자인',
      tags: ['#UI/UX디자인', '#사용자경험', '#인터페이스디자인', '#프로토타이핑'],
      gradient: 'linear-gradient(135deg, #ffe6f0 0%, #ffb8d4 100%)',
      image: '/images/posts/uiux.png',
      author: '랜딩랩',
      date: '2025-12-13',
      readTime: '7분',
      content: `
        <h2>UI/UX 디자인의 차이</h2>
        <p>UI(User Interface)는 사용자가 상호작용하는 시각적 요소를, UX(User Experience)는 전체적인 사용자 경험을 의미합니다. 두 가지 모두 성공적인 제품에 필수적입니다.</p>
        
        <h3>사용자 중심 디자인</h3>
        <p>사용자 리서치를 통해 타겟 사용자의 니즈와 행동 패턴을 이해합니다. 페르소나와 사용자 여정 맵을 작성하여 디자인 결정의 근거로 활용합니다.</p>
        
        <h3>일관성과 직관성</h3>
        <p>일관된 디자인 시스템을 구축하여 사용자가 예측 가능한 경험을 할 수 있도록 합니다. 직관적인 인터페이스는 학습 곡선을 낮추고 사용성을 향상시킵니다.</p>
        
        <h3>접근성 고려</h3>
        <p>모든 사용자가 제품을 사용할 수 있도록 접근성을 고려합니다. WCAG 가이드라인을 준수하고, 색상 대비, 키보드 네비게이션, 스크린 리더 지원 등을 구현합니다.</p>
        
        <h3>프로토타이핑과 테스트</h3>
        <p>와이어프레임과 프로토타입을 제작하여 아이디어를 빠르게 검증합니다. 사용자 테스트를 통해 피드백을 수집하고 지속적으로 개선합니다.</p>
      `
    }
  ];
};

// 포스트 게시판 페이지 컨트롤러
exports.getPosts = (req, res) => {
  const posts = getPostsData();
  
  res.render('posts', {
    title: '랜딩랩 | 포스트',
    page: 'posts',
    posts: posts
  });
};

// 포스트 상세 페이지 컨트롤러
exports.getPostDetail = (req, res) => {
  const postId = parseInt(req.params.id);
  const posts = getPostsData();
  const post = posts.find(p => p.id === postId);
  
  // 포스트가 없으면 404 에러
  if (!post) {
    return res.status(404).render('error', {
      title: '페이지를 찾을 수 없습니다 | 랜딩랩',
      page: 'error',
      message: '요청하신 포스트를 찾을 수 없습니다.'
    });
  }
  
  // 관련 포스트 (같은 카테고리, 현재 포스트 제외, 최대 3개)
  const relatedPosts = posts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);
  
  res.render('post-detail', {
    title: `${post.title} | 랜딩랩`,
    page: 'post-detail',
    post: post,
    relatedPosts: relatedPosts
  });
};
