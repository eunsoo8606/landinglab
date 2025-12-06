// 문의 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initContactForm();
  initSitemapScroll();
  initPrivacyModal();
});

// 문의 폼 초기화
function initContactForm() {
  const form = document.getElementById('contactForm');
  
  // 단일 선택 버튼 (프로젝트 유형)
  const singleSelectButtons = document.querySelectorAll('.option-btn:not(.multi-select)');
  singleSelectButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const group = this.closest('.button-group');
      const hiddenInput = group.nextElementSibling;
      
      // 같은 그룹의 다른 버튼 비활성화
      group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
      
      // 현재 버튼 활성화
      this.classList.add('active');
      
      // hidden input에 값 저장
      hiddenInput.value = this.dataset.value;
    });
  });
  
  // 다중 선택 버튼 (필요 서비스)
  const multiSelectButtons = document.querySelectorAll('.option-btn.multi-select');
  multiSelectButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      
      // 선택된 값들 수집
      const group = this.closest('.button-group');
      const hiddenInput = group.nextElementSibling;
      const selectedValues = [];
      
      group.querySelectorAll('.option-btn.active').forEach(activeBtn => {
        selectedValues.push(activeBtn.dataset.value);
      });
      
      hiddenInput.value = selectedValues.join(',');
    });
  });
  
  // 패키지 카드 선택
  const packageCards = document.querySelectorAll('.package-card');
  const packageInput = document.querySelector('input[name="package"]');
  
  packageCards.forEach(card => {
    card.addEventListener('click', function() {
      // 다른 카드 비활성화
      packageCards.forEach(c => c.classList.remove('active'));
      
      // 현재 카드 활성화
      this.classList.add('active');
      
      // hidden input에 값 저장
      packageInput.value = this.dataset.package;
    });
  });
  
  // 폼 제출
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    // 폼 데이터 수집
    const formData = {
      projectType: form.projectType.value,
      services: form.services.value.split(','),
      package: form.package.value,
      reference: form.reference.value,
      companyName: form.companyName.value,
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      website: form.website.value,
      description: form.description.value,
      privacyAgree: form.privacyAgree.checked
    };
    
    console.log('문의 데이터:', formData);
    
    // 여기에 실제 폼 제출 로직 추가 (AJAX 등)
    alert('문의가 성공적으로 접수되었습니다!\n빠른 시일 내에 연락드리겠습니다.');
    
    // 폼 초기화
    form.reset();
    document.querySelectorAll('.option-btn, .package-card').forEach(el => {
      el.classList.remove('active');
    });
  });
}

// 폼 유효성 검사
function validateForm() {
  const form = document.getElementById('contactForm');
  
  // 프로젝트 유형 확인
  if (!form.projectType.value) {
    alert('프로젝트 유형을 선택해주세요.');
    scrollToStep(1);
    return false;
  }
  
  // 필요 서비스 확인
  if (!form.services.value) {
    alert('필요한 서비스를 하나 이상 선택해주세요.');
    scrollToStep(2);
    return false;
  }
  
  // 패키지 확인
  if (!form.package.value) {
    alert('프로젝트 패키지를 선택해주세요.');
    scrollToStep(3);
    return false;
  }
  
  // 필수 고객 정보 확인
  if (!form.name.value.trim()) {
    alert('이름을 입력해주세요.');
    form.name.focus();
    return false;
  }
  
  if (!form.phone.value.trim()) {
    alert('연락처를 입력해주세요.');
    form.phone.focus();
    return false;
  }
  
  if (!form.email.value.trim()) {
    alert('이메일을 입력해주세요.');
    form.email.focus();
    return false;
  }
  
  // 이메일 형식 확인
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email.value)) {
    alert('올바른 이메일 형식을 입력해주세요.');
    form.email.focus();
    return false;
  }
  
  // 프로젝트 설명 확인
  if (!form.description.value.trim()) {
    alert('프로젝트 설명을 입력해주세요.');
    form.description.focus();
    return false;
  }
  
  // 개인정보 동의 확인
  if (!form.privacyAgree.checked) {
    alert('개인정보 수집 및 이용에 동의해주세요.');
    scrollToStep(7);
    return false;
  }
  
  return true;
}

// 특정 스텝으로 스크롤
function scrollToStep(stepNumber) {
  const step = document.querySelector(`[data-step="${stepNumber}"]`);
  if (step) {
    step.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 사이트맵 스크롤 연동
function initSitemapScroll() {
  const formSteps = document.querySelectorAll('.form-step');
  const sitemapItems = document.querySelectorAll('.sitemap-item');
  
  // Intersection Observer 설정
  const observerOptions = {
    root: document.querySelector('.contact-left'),
    threshold: 0.5,
    rootMargin: '-100px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepNumber = entry.target.dataset.step;
        
        // 모든 사이트맵 아이템 비활성화
        sitemapItems.forEach(item => item.classList.remove('active'));
        
        // 현재 스텝에 해당하는 사이트맵 아이템 활성화
        const targetItem = document.querySelector(`.sitemap-item[data-target="${stepNumber}"]`);
        if (targetItem) {
          targetItem.classList.add('active');
        }
      }
    });
  }, observerOptions);
  
  // 모든 폼 스텝 관찰
  formSteps.forEach(step => observer.observe(step));
  
  // 사이트맵 아이템 클릭 시 해당 스텝으로 스크롤
  sitemapItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetStep = this.dataset.target;
      scrollToStep(targetStep);
    });
  });
}

// 개인정보 처리방침 모달
function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  const openBtn = document.getElementById('privacyDetailBtn');
  const closeBtn = document.getElementById('privacyModalClose');
  
  // 모달 열기
  openBtn.addEventListener('click', function(e) {
    e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // 모달 닫기
  closeBtn.addEventListener('click', function() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // 모달 외부 클릭 시 닫기
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // ESC 키로 모달 닫기
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}
