// 메인 JavaScript 파일

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
  console.log('LandingLab 웹사이트가 로드되었습니다.');
  
  // 스무스 스크롤
  initSmoothScroll();
  
  // 폼 제출 처리
  initFormSubmit();
  
  // 스크롤 애니메이션
  initScrollAnimations();
  
  // 숫자 카운터 애니메이션
  initCounterAnimations();
  
  // 섹션 활성화 감지
  initSectionObserver();
  
  // 페이지 전환 애니메이션
  initPageTransition();
  
  // 반응형 비디오
  initResponsiveVideo();

  // 내비바 스크롤 초기화
  initNavbarScroll();
});

// 스무스 스크롤 초기화
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// 폼 제출 처리
function initFormSubmit() {
  const contactForm = document.querySelector('.contact-section form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 폼 데이터 수집
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      console.log('폼 데이터:', formData);
      
      // 여기에 실제 폼 제출 로직 추가 (AJAX 등)
      alert('문의가 접수되었습니다. 감사합니다!');
      
      // 폼 초기화
      contactForm.reset();
    });
  }
}

// 스크롤 애니메이션 초기화
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 모든 fade-in-up 요소 관찰
  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });

  // 스토리 블록 요소 관찰
  document.querySelectorAll('.story-block, .story-cta').forEach(el => {
    observer.observe(el);
  });
}

// 숫자 카운터 애니메이션
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          animateCounter(counter);
        });
      }
    });
  }, observerOptions);

  if (counters.length > 0) {
    observer.observe(counters[0].parentElement.parentElement);
  }
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const duration = 2000; // 2초
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// 내비바 스크롤 효과
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// 스크롤 리스너 호출부 수정 (DOMContentLoaded 내부에 추가되어 있다고 가정하거나 함수 정의만 교체)

// 섹션 활성화 감지
function initSectionObserver() {
  const sections = document.querySelectorAll('#home, #about, #services, #contact');
  const navLinks = document.querySelectorAll('.nav-link');
  
  console.log('섹션 개수:', sections.length);
  console.log('메뉴 링크 개수:', navLinks.length);
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '-80px 0px -60% 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        console.log('섹션 도달:', sectionId);
        
        // 모든 nav-link에서 active 클래스 제거
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // 현재 섹션에 해당하는 nav-link에 active 클래스 추가
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          console.log('메뉴 활성화:', sectionId);
        }
      }
    });
  }, observerOptions);
  
  // 모든 섹션 관찰
  sections.forEach(section => {
    if (section) {
      observer.observe(section);
      console.log('관찰 시작:', section.id);
    }
  });
}

// 페이지 전환 애니메이션
function initPageTransition() {
  // 페이지 로드 시 fade-in
  document.body.classList.add('page-loaded');
  
  // 페이지 전환 링크 처리
  const transitionLinks = document.querySelectorAll('.page-transition');
  
  transitionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetUrl = this.getAttribute('href');
      
      // 페이드 아웃 애니메이션
      document.body.classList.add('page-transitioning');
      
      // 애니메이션 완료 후 페이지 이동
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 500);
    });
  });
}

// 반응형 비디오
function initResponsiveVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) {
    console.log('hero-video 요소를 찾을 수 없습니다.');
    return;
  }
  
  const desktopSrc = video.dataset.desktopSrc;
  const mobileSrc = video.dataset.mobileSrc;
  
  // 데이터 속성이 없으면 종료
  if (!desktopSrc || !mobileSrc) {
    console.log('비디오 소스 데이터가 없습니다.');
    return;
  }
  
  function updateVideoSource() {
    const isMobile = window.innerWidth <= 768;
    const newSrc = isMobile ? mobileSrc : desktopSrc;
    const sourceElement = video.querySelector('source');
    
    if (!sourceElement) {
      console.log('video source 요소를 찾을 수 없습니다.');
      return;
    }
    
    const currentSrc = sourceElement.src;
    
    // 현재 소스와 다를 때만 변경
    if (!currentSrc.includes(newSrc)) {
      const currentTime = video.currentTime;
      sourceElement.src = newSrc;
      video.load();
      video.currentTime = currentTime;
      video.play().catch(err => console.log('비디오 재생 실패:', err));
    }
  }
  
  // 초기 로드
  updateVideoSource();
  
  // 화면 크기 변경 시
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateVideoSource, 250);
  });
}
