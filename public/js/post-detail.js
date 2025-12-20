// 포스트 상세 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // 페이지 로드 애니메이션
  document.body.classList.add('page-loaded');
  
  // 스크롤 진행 바
  initScrollProgress();
  
  // 목차 자동 생성
  generateTableOfContents();
  
  // 목차 활성화 (스크롤 시)
  initTOCActivation();
  
  // 부드러운 스크롤
  initSmoothScroll();
});

// 스크롤 진행 바
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  let ticking = false;
  let windowHeight = window.innerHeight;
  let documentHeight = document.documentElement.scrollHeight - windowHeight;

  // 리사이즈 시 높이 재계산
  window.addEventListener('resize', () => {
    windowHeight = window.innerHeight;
    documentHeight = document.documentElement.scrollHeight - windowHeight;
  });

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
        ticking = false;
      });
      ticking = true;
    }
  });
}

// 목차 자동 생성
function generateTableOfContents() {
  const contentBody = document.querySelector('.content-body');
  const toc = document.getElementById('toc');
  
  if (!contentBody || !toc) return;
  
  const headings = contentBody.querySelectorAll('h2, h3');
  
  if (headings.length === 0) {
    toc.innerHTML = '<p style="color: rgba(255,255,255,0.5); font-size: 0.9rem;">목차가 없습니다</p>';
    return;
  }
  
  headings.forEach((heading, index) => {
    // 각 헤딩에 ID 추가
    const id = `heading-${index}`;
    heading.id = id;
    
    // 목차 링크 생성
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = heading.textContent;
    link.className = heading.tagName === 'H3' ? 'toc-h3' : '';
    
    toc.appendChild(link);
  });
}

// 목차 활성화 (스크롤 시)
function initTOCActivation() {
  const tocLinks = document.querySelectorAll('.table-of-contents a');
  const headings = document.querySelectorAll('.content-body h2, .content-body h3');
  
  if (tocLinks.length === 0 || headings.length === 0) return;

  // 헤딩 위치 캐싱 (Forced Reflow 방지)
  let headingPositions = [];
  function cachePositions() {
    headingPositions = Array.from(headings).map(h => ({
      id: h.id,
      top: h.offsetTop
    }));
  }
  
  cachePositions();
  window.addEventListener('resize', cachePositions);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        for (const heading of headingPositions) {
          if (scrollPosition >= heading.top) {
            current = heading.id;
          } else {
            break;
          }
        }
        
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// 부드러운 스크롤
function initSmoothScroll() {
  const tocLinks = document.querySelectorAll('.table-of-contents a');
  
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // offsetTop은 클릭 시 1회만 호출하므로 리플로우 영향 적음
        const offsetTop = targetElement.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 소셜 공유 함수들
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(window.postData.title);
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
}

function copyLink() {
  const url = window.location.href;
  
  // 클립보드에 복사
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      alert('링크가 클립보드에 복사되었습니다!');
    }).catch(err => {
      console.error('링크 복사 실패:', err);
      fallbackCopyLink(url);
    });
  } else {
    fallbackCopyLink(url);
  }
}

function fallbackCopyLink(url) {
  // 구형 브라우저 대응
  const textArea = document.createElement('textarea');
  textArea.value = url;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    alert('링크가 클립보드에 복사되었습니다!');
  } catch (err) {
    console.error('링크 복사 실패:', err);
    alert('링크 복사에 실패했습니다. 수동으로 복사해주세요.');
  }
  
  document.body.removeChild(textArea);
}

// 페이지 전환 효과
const transitionLinks = document.querySelectorAll('.page-transition');
transitionLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    
    document.body.classList.add('page-transitioning');
    
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
});
