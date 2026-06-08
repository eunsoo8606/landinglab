// ============================================
// 3D 포트폴리오 갤러리
// ============================================

(function () {
  'use strict';

  // DOM 요소
  const gallery = document.getElementById('gallery3d');
  const items = document.querySelectorAll('.portfolio-item');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = document.querySelectorAll('.indicator');
  const detailsPanel = document.getElementById('detailsPanel');
  const closeDetailsBtn = document.getElementById('closeDetailsBtn');

  // 상태 변수
  let currentIndex = 0;
  let isAutoRotating = false;
  let autoRotateInterval = null;
  let isDragging = false;
  let startX = 0;
  let currentRotation = 0;
  let targetRotation = 0;
  let animationFrameId = null; // 프레임 애니메이션 ID
  let animStartTime = 0;       // 애니메이션 시작 시간
  let startRotation = 0;       // 애니메이션 시작 각도
  let endRotation = 0;         // 애니메이션 목표 각도
  const animDuration = 500;    // 회전 완료 시간 (500ms)

  // 포트폴리오 데이터 로드 (DOM에서 읽기)
  function getPortfolios() {
    try {
      if (window.portfolioData && window.portfolioData.length > 0) return window.portfolioData;

      const dataStore = document.getElementById('portfolio-raw-data');
      if (dataStore && dataStore.dataset.portfolios) {
        const data = JSON.parse(dataStore.dataset.portfolios);
        console.log('Portfolio Data Loaded from DOM:', data.length);
        return data;
      }
    } catch (e) {
      console.error('Failed to load portfolio data:', e);
    }
    return [];
  }

  let portfolios = getPortfolios();
  const totalItems = items.length;

  console.log('Portfolio Gallery Initialized:', { totalItems, dataCount: portfolios.length });

  // 데이터 보완 (비동기 대응)
  if (portfolios.length === 0) {
    const timer = setInterval(() => {
      portfolios = getPortfolios();
      if (portfolios.length > 0) {
        console.log('Portfolio Data Recovered:', portfolios.length);
        clearInterval(timer);
      }
    }, 500);
    setTimeout(() => clearInterval(timer), 5000);
  }

  // ============================================
  // 3D 위치 계산 및 업데이트
  // ============================================
  function updateGallery() {
    const angleStep = (2 * Math.PI) / totalItems;
    
    // 화면 크기에 맞게 3D 회전 반경 유동적 조절 (모바일 깨짐 방지)
    let radius = 500; 
    let radiusY = 150;
    
    if (window.innerWidth <= 480) {
      radius = window.innerWidth * 0.38;
      radiusY = 30;
    } else if (window.innerWidth <= 768) {
      radius = window.innerWidth * 0.42;
      radiusY = 60;
    } else if (window.innerWidth <= 1024) {
      radius = 350;
      radiusY = 100;
    }

    items.forEach((item, index) => {
      const angle = angleStep * index + currentRotation;

      // 타원형 좌표 계산
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radiusY;

      // z값에 따른 스케일 및 투명도 계산
      const scale = 0.6 + (z + radius) / (radius * 2) * 0.4;
      const opacity = 0.3 + (z + radius) / (radius * 2) * 0.7;
      const zIndex = Math.round(z);

      // Transform 적용
      item.style.transform = `
        translate3d(${x}px, ${y}px, ${z}px)
        scale(${scale})
      `;
      item.style.opacity = opacity;
      item.style.zIndex = zIndex;

      // 현재 활성 아이템 표시
      if (index === currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 인디케이터 업데이트
    updateIndicators();
  }

  // ============================================
  // 인디케이터 업데이트
  // ============================================
  function updateIndicators() {
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // ============================================
  // 회전 애니메이션
  // ============================================
  function rotateTo(index) {
    if (index < 0) index = totalItems - 1;
    if (index >= totalItems) index = 0;

    currentIndex = index;
    const angleStep = (2 * Math.PI) / totalItems;
    
    startRotation = currentRotation;
    endRotation = -angleStep * index;
    
    // 최단 경로 회전 보정 (360도 반대로 뺑 도는 현상 방지)
    const diff = endRotation - startRotation;
    const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
    endRotation = startRotation + normalizedDiff;

    animStartTime = performance.now();

    // 기존 진행 중인 프레임 루프 취소
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    animateRotation();
  }

  function animateRotation() {
    const now = performance.now();
    const elapsed = now - animStartTime;
    const progress = Math.min(elapsed / animDuration, 1);
    
    // easeOutCubic 이징 공식 적용 (스르륵하고 점진적으로 멈추는 효과)
    const ease = 1 - Math.pow(1 - progress, 3);
    currentRotation = startRotation + (endRotation - startRotation) * ease;
    
    updateGallery();

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animateRotation);
    } else {
      currentRotation = endRotation;
      
      // 누적 회전각 단순화 정돈 (0 ~ 2*PI 범위로 가둠)
      const twoPi = Math.PI * 2;
      currentRotation = ((currentRotation % twoPi) + twoPi) % twoPi;
      
      updateGallery();
      animationFrameId = null;
    }
  }

  // ============================================
  // 이전/다음 버튼
  // ============================================
  function goToPrev() {
    stopAutoRotate();
    rotateTo(currentIndex - 1);
  }

  function goToNext() {
    stopAutoRotate();
    rotateTo(currentIndex + 1);
  }

  // ============================================
  // 자동 회전
  // ============================================
  function startAutoRotate() {
    if (isAutoRotating) return;

    isAutoRotating = true;

    autoRotateInterval = setInterval(() => {
      rotateTo(currentIndex + 1);
    }, 3000);
  }

  function stopAutoRotate() {
    if (!isAutoRotating) return;

    isAutoRotating = false;

    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  function toggleAutoRotate() {
    if (isAutoRotating) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
  }

  // ============================================
  // 드래그 인터랙션
  // ============================================
  function handleDragStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    gallery.style.cursor = 'grabbing';
    stopAutoRotate();

    // 드래그가 시작되면 기존에 돌고 있던 스무스 회전 애니메이션 강제 정지
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function handleDragMove(e) {
    if (!isDragging) return;

    const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - startX;
    const rotationDelta = (deltaX / window.innerWidth) * Math.PI;

    currentRotation += rotationDelta;
    targetRotation = currentRotation;
    startX = currentX;

    updateGallery();

    // 현재 인덱스 업데이트
    const angleStep = (2 * Math.PI) / totalItems;
    currentIndex = Math.round(-currentRotation / angleStep);
    if (currentIndex < 0) currentIndex += totalItems;
    if (currentIndex >= totalItems) currentIndex -= totalItems;
  }

  function handleDragEnd() {
    if (!isDragging) return;

    isDragging = false;
    gallery.style.cursor = 'grab';

    // 가장 가까운 아이템으로 스냅
    rotateTo(currentIndex);
  }

  // ============================================
  // 상세정보 패널
  // ============================================
  function showDetails(portfolioId) {
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio) return;

    // 데이터 채우기
    document.getElementById('detailsImage').src = portfolio.image;
    document.getElementById('detailsImage').alt = portfolio.title;
    document.getElementById('detailsCategory').textContent = portfolio.category;
    document.getElementById('detailsTitle').textContent = portfolio.title;
    document.getElementById('detailsDescription').textContent = portfolio.description;

    // 기술 스택 태그 생성
    const techContainer = document.getElementById('detailsTech');
    techContainer.innerHTML = '';
    portfolio.tech.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      techContainer.appendChild(tag);
    });

    document.getElementById('detailsLink').href = portfolio.url;

    // 패널 표시
    detailsPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideDetails() {
    detailsPanel.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ============================================
  // 이벤트 리스너
  // ============================================

  // 버튼 이벤트
  if (prevBtn) prevBtn.addEventListener('click', goToPrev);
  if (nextBtn) nextBtn.addEventListener('click', goToNext);

  // 갤러리 클릭/터치로 자동 회전 토글
  if (gallery) {
    let clickStartTime = 0;
    let clickStartPos = { x: 0, y: 0 };

    gallery.addEventListener('mousedown', (e) => {
      clickStartTime = Date.now();
      clickStartPos = { x: e.clientX, y: e.clientY };
      handleDragStart(e);
    });

    gallery.addEventListener('touchstart', (e) => {
      clickStartTime = Date.now();
      clickStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      handleDragStart(e);
    }, { passive: true });

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: true });

    document.addEventListener('mouseup', (e) => {
      const clickDuration = Date.now() - clickStartTime;
      const distance = Math.sqrt(
        Math.pow(e.clientX - clickStartPos.x, 2) +
        Math.pow(e.clientY - clickStartPos.y, 2)
      );

      // 클릭으로 판단 (300ms 이내, 10px 이내 이동)
      if (clickDuration < 300 && distance < 10) {
        toggleAutoRotate();
      }

      handleDragEnd();
    });

    document.addEventListener('touchend', (e) => {
      const clickDuration = Date.now() - clickStartTime;
      const touch = e.changedTouches[0];
      const distance = Math.sqrt(
        Math.pow(touch.clientX - clickStartPos.x, 2) +
        Math.pow(touch.clientY - clickStartPos.y, 2)
      );

      // 탭으로 판단 (300ms 이내, 10px 이내 이동)
      if (clickDuration < 300 && distance < 10) {
        toggleAutoRotate();
      }

      handleDragEnd();
    });
  }

  // 인디케이터 클릭
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopAutoRotate();
      rotateTo(index);
    });
  });

  // 상세보기 버튼
  function bindDetailButtons() {
    const detailButtons = document.querySelectorAll('.view-details-btn');
    console.log('Binding Details Buttons:', detailButtons.length);

    detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const portfolioId = parseInt(btn.dataset.id);
        console.log('Detail Button Clicked. ID:', portfolioId);
        showDetails(portfolioId);
      });
    });
  }

  // 초기 로드 시 버튼 바인딩
  bindDetailButtons();

  // 포트폴리오 카드 클릭으로 상세보기
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // 상세보기 버튼 클릭은 이미 처리되므로 제외
      if (e.target.closest('.view-details-btn')) return;

      const portfolioItem = card.closest('.portfolio-item');
      const portfolioId = parseInt(portfolioItem.dataset.id);
      showDetails(portfolioId);
    });

    // 카드에 포인터 커서 추가
    card.style.cursor = 'pointer';
  });

  // 상세정보 닫기
  if (closeDetailsBtn) {
    closeDetailsBtn.addEventListener('click', hideDetails);
  }

  // 패널 배경 클릭 시 닫기
  if (detailsPanel) {
    detailsPanel.addEventListener('click', (e) => {
      if (e.target === detailsPanel) {
        hideDetails();
      }
    });
  }

  // ESC 키로 패널 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailsPanel.classList.contains('active')) {
      hideDetails();
    }
  });

  // 키보드 네비게이션
  document.addEventListener('keydown', (e) => {
    if (detailsPanel.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  });

  // ============================================
  // 초기화
  // ============================================
  function init() {
    updateGallery();

    // 페이지 로드 후 자동 회전 시작 (선택사항)
    // setTimeout(startAutoRotate, 1000);
  }

  // DOM 로드 완료 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 윈도우 리사이즈 시 갤러리 업데이트
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateGallery();
    }, 200);
  });

  // ============================================
  // 라이트박스 (이미지 전체 화면 확대 보기)
  // ============================================
  function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightboxModal';
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <button class="lightbox-close" id="lightboxClose" aria-label="닫기">
        <i class="fas fa-times"></i>
      </button>
      <div class="lightbox-content">
        <img src="" alt="Portfolio Large View" id="lightboxImage">
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const detailsImg = document.getElementById('detailsImage');

    if (detailsImg) {
      detailsImg.style.cursor = 'zoom-in';
      detailsImg.addEventListener('click', () => {
        if (detailsImg.src) {
          lightboxImg.src = detailsImg.src;
          lightbox.classList.add('active');
        }
      });
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        lightbox.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });
  }

  // 초기화 시 라이트박스 빌드
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }

})();
