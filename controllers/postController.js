const getPostsData = () => {
  return [
    {
      id: 1,
      title: 'GA4 사용법 가이드',
      description: '데이터 분석의 표준이 된 GA4(Google Analytics 4), 아직도 어렵게만 느껴지시나요? 2023년 기존 UA(Universal Analytics)가 종료된 이후, GA4는 선택이 아닌 필수 도구가 되었습니다.',
      category: '분석',
      tags: ['#GA4', '#구글애널리틱스', '#데이터분석', '#전환추적'],
      gradient: 'linear-gradient(135deg, #e8f4f8 0%, #b8dce8 100%)',
      image: '/images/posts/ga4.webp',
      author: '랜딩랩',
      date: '2025-12-13',
      readTime: '12분',
      content: `
        <h2>GA4 사용법 가이드: 2025년 데이터 분석을 위한 필수 설정 및 활용법</h2>
        <p>데이터 분석의 표준이 된 GA4(Google Analytics 4), 아직도 어렵게만 느껴지시나요? 2023년 기존 UA(Universal Analytics)가 종료된 이후, GA4는 선택이 아닌 필수 도구가 되었습니다.</p>
        <p>본 포스팅에서는 초보자를 위한 기초 개념부터, 마케터를 위한 성과 측정법, 그리고 개발자를 위한 기술적 설정까지 한 번에 정리해 드립니다.</p>
        
        <h3>1. GA4란 무엇인가? (UA와의 핵심 차이점)</h3>
        <img src="/images/posts/ga4-overview.webp" alt="GA4 개요 - 이벤트 중심 데이터 모델" style="width: 100%; max-width: 800px; margin: 20px auto; display: block; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <p>GA4는 기존의 '세션' 중심 데이터 모델에서 벗어나 '이벤트(Event)' 중심의 데이터 모델로 완전히 재설계되었습니다.</p>
        <ul>
          <li><strong>이벤트 중심 모델:</strong> 페이지 뷰뿐만 아니라 클릭, 스크롤, 파일 다운로드 등 사용자의 모든 행동을 개별 '이벤트'로 수집합니다.</li>
          <li><strong>교차 플랫폼 추적:</strong> 웹(Web)과 앱(App) 데이터를 하나의 속성에서 통합하여 분석할 수 있습니다.</li>
          <li><strong>머신러닝 기반 통찰:</strong> 구글의 AI가 사용자 이탈 예측이나 수익 예측 등 고도화된 데이터를 제공합니다.</li>
        </ul>
        
        <h3>2. [초보자] 5분 만에 끝내는 GA4 기본 설치 방법</h3>
        <p>처음 시작하는 분들을 위해 가장 빠르게 GA4를 설치하는 단계를 요약합니다.</p>
        <ol>
          <li><strong>구글 애널리틱스 계정 생성:</strong> 구글 계정으로 로그인 후 [관리] 메뉴에서 신규 속성을 생성합니다.</li>
          <li><strong>데이터 스트림 설정:</strong> '웹' 혹은 '앱'을 선택하고 URL을 입력하여 데이터 스트림을 만듭니다.</li>
          <li><strong>측정 ID 확인:</strong> G-XXXXXXX 형태의 측정 ID를 복사합니다.</li>
          <li><strong>태그 설치:</strong> 티스토리, 워드프레스 혹은 직접 코드 수정을 통해 &lt;head&gt; 섹션에 추적 코드를 삽입합니다.</li>
        </ol>
        
        <h3>3. [마케터] SEO 성과를 극대화하는 분석 지표 활용법</h3>
        <p>마케터에게 가장 중요한 것은 <strong>"어떤 채널에서 온 사용자가 돈이 되는가?"</strong>를 파악하는 것입니다.</p>
        
        <h4>① '참여율(Engagement Rate)'에 주목하세요</h4>
        <p>과거의 '이탈률'은 단순히 페이지를 나간 비율이었지만, GA4의 참여율은 사용자가 10초 이상 머물렀거나 전환 이벤트를 수행했는지를 측정합니다. 이는 실제 콘텐츠의 퀄리티를 판단하는 척도가 됩니다.</p>
        
        <h4>② 구글 서치 콘솔(GSC) 연동</h4>
        <p>SEO 성과를 확인하려면 GA4와 서치 콘솔을 반드시 연결해야 합니다. 연동 후에는 [보고서] > [Search Console] 메뉴에서 어떤 키워드로 유입되어 어떤 행동을 했는지 연결해서 분석할 수 있습니다.</p>
        
        <h4>③ 맞춤형 전환(Conversion) 설정</h4>
        <p>모든 방문자가 중요한 것이 아닙니다. '구매 완료', '문의하기', '회원가입' 버튼 클릭을 주요 이벤트로 등록하여 마케팅 ROI를 측정하세요.</p>
        
        <h3>4. [개발자] 정교한 추적을 위한 GTM 및 맞춤 이벤트</h3>
        <p>단순 설치를 넘어 고도화된 데이터를 수집하려면 GTM(Google Tag Manager) 활용이 필수적입니다.</p>
        <ul>
          <li><strong>데이터 레이어(DataLayer) 활용:</strong> dataLayer.push를 통해 동적인 결제 금액이나 상품 ID 정보를 GA4로 전달할 수 있습니다.</li>
          <li><strong>디버그 뷰(DebugView):</strong> 실시간으로 이벤트가 제대로 전송되는지 확인하려면 [관리] > [DebugView] 기능을 활용하세요. 개발 단계에서 데이터 누락을 방지하는 가장 확실한 방법입니다.</li>
          <li><strong>향상된 측정(Enhanced Measurement):</strong> 코드 수정 없이도 스크롤, 이탈 클릭, 사이트 검색 등을 자동으로 추적할 수 있도록 설정하세요.</li>
        </ul>
        
        <h3>5. 2025년 GA4 활용을 위한 체크리스트</h3>
        <ul>
          <li><strong>데이터 보관 기간 변경:</strong> 기본 2개월로 설정된 데이터 보관 기간을 14개월로 반드시 변경하세요. (과거 데이터 비교 분석 시 필수)</li>
          <li><strong>내부 트래픽 제외:</strong> 사무실 IP 등을 제외하여 데이터 오염을 방지하세요.</li>
          <li><strong>잠재고객(Audience) 생성:</strong> 특정 행동을 한 유저를 그룹화하여 구글 광고(Google Ads) 리마케팅에 활용하세요.</li>
        </ul>
        
        <h3>결론: 데이터가 비즈니스의 방향을 결정합니다</h3>
        <p>GA4는 단순히 숫자를 보는 도구가 아니라, 사용자의 경험을 이해하는 도구입니다. 처음에는 UI가 낯설 수 있지만, 이벤트 중심의 사고방식을 장착한다면 훨씬 더 강력한 비즈니스 통찰을 얻을 수 있습니다.</p>
        <p>혹시 GA4 설치 과정에서 막히는 부분이 있으신가요? 아래 댓글로 상황을 남겨주시면 개발/마케팅 관점에서 해결 방법을 답변해 드리겠습니다!</p>
      `
    },
    {
      id: 2,
      title: 'SEO 최적화 완벽 가이드',
      description: '검색 엔진 상위 노출을 위한 필수 SEO 전략과 기술적 최적화 방법을 소개합니다. 실전에서 바로 적용 가능한 팁을 제공합니다.',
      category: '마케팅',
      tags: ['#SEO', '#검색엔진최적화', '#상위노출', '#키워드전략'],
      gradient: 'linear-gradient(135deg, #d4f1e8 0%, #a8dcc9 100%)',
      image: '/images/posts/seo.webp',
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
      image: '/images/posts/responsive.webp',
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
      image: '/images/posts/landing.webp',
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
        <p>고객 후기, 사용 사례, 인증 마크, 보안 배지 등을 활용하여 방문자의 신뢰를 얻습니다. 사회적 증거는 전환율 향상에 매우 효과적입니다.</p>
        
        <h3>A/B 테스트와 최적화</h3>
        <p>지속적인 A/B 테스트를 통해 랜딩페이지를 개선합니다. 헤드라인, CTA 문구, 이미지, 레이아웃 등 다양한 요소를 테스트하여 최적의 조합을 찾습니다.</p>
      `
    },
    {
      id: 5,
      title: 'UI/UX 디자인 핵심 원칙',
      description: '사용자 경험을 최우선으로 하는 UI/UX 디자인 방법론과 효과적인 인터페이스 설계 전략을 다룹니다.',
      category: '디자인',
      tags: ['#UI/UX디자인', '#사용자경험', '#인터페이스디자인', '#프로토타이핑'],
      gradient: 'linear-gradient(135deg, #ffe6f0 0%, #ffb8d4 100%)',
      image: '/images/posts/uiux.webp',
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
    title: '블로그 | 랜딩랩',
    page: 'posts',
    description: 'GA4 사용법, SEO 최적화, 반응형 웹 디자인, 랜딩페이지 제작 전략 등 웹 개발과 마케팅에 대한 유용한 정보를 공유합니다.',
    keywords: 'GA4 가이드, SEO 최적화, 반응형 웹, 랜딩페이지 전략, UI/UX 디자인, 웹 개발 블로그',
    posts
  });
};

// 포스트 상세 페이지 컨트롤러
exports.getPostDetail = (req, res) => {
  const postId = parseInt(req.params.id);
  const posts = getPostsData();
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).render('error', {
      title: '404 - 페이지를 찾을 수 없습니다',
      page: 'error',
      message: '요청하신 포스트를 찾을 수 없습니다.'
    });
  }
  
  // 관련 포스트 찾기 (같은 카테고리, 최대 3개)
  const relatedPosts = posts
    .filter(p => p.id !== postId && p.category === post.category)
    .slice(0, 3);
  
  res.render('post-detail', {
    title: `${post.title} | 랜딩랩`,
    page: 'post-detail',
    description: post.description,
    keywords: post.tags.join(', '),
    ogImage: post.image,
    post,
    relatedPosts
  });
};
