// ============================================
// 3D 포트폴리오 갤러리
// ============================================

(function() {
  'use strict';

  // DOM 요소
  const gallery = document.getElementById('gallery3d');
  const items = document.querySelectorAll('.portfolio-item');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const autoRotateBtn = document.getElementById('autoRotateBtn');
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

  // 포트폴리오 데이터
  const portfolios = window.portfolioData || [];
  const totalItems = items.length;

  // ============================================
  // 3D 위치 계산 및 업데이트
  // ============================================
  function updateGallery() {
    const angleStep = (2 * Math.PI) / totalItems;
    const radius = 450; // 타원의 가로 반지름
    const radiusY = 150; // 타원의 세로 반지름

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
    targetRotation = -angleStep * index;

    animateRotation();
  }

  function animateRotation() {
    const diff = targetRotation - currentRotation;
    currentRotation += diff * 0.1;

    if (Math.abs(diff) > 0.001) {
      updateGallery();
      requestAnimationFrame(animateRotation);
    } else {
      currentRotation = targetRotation;
      updateGallery();
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
    autoRotateBtn.classList.add('active');
    autoRotateBtn.innerHTML = '<i class="fas fa-pause"></i>';

    autoRotateInterval = setInterval(() => {
      rotateTo(currentIndex + 1);
    }, 3000);
  }

  function stopAutoRotate() {
    if (!isAutoRotating) return;

    isAutoRotating = false;
    autoRotateBtn.classList.remove('active');
    autoRotateBtn.innerHTML = '<i class="fas fa-play"></i>';

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
  if (autoRotateBtn) autoRotateBtn.addEventListener('click', toggleAutoRotate);

  // 드래그 이벤트 (마우스)
  if (gallery) {
    gallery.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    // 드래그 이벤트 (터치)
    gallery.addEventListener('touchstart', handleDragStart, { passive: true });
    document.addEventListener('touchmove', handleDragMove, { passive: true });
    document.addEventListener('touchend', handleDragEnd);
  }

  // 인디케이터 클릭
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopAutoRotate();
      rotateTo(index);
    });
  });

  // 상세보기 버튼
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const portfolioId = parseInt(btn.dataset.id);
      showDetails(portfolioId);
    });
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

})();
