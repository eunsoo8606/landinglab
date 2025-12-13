// 포스트 게시판 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // 페이지 로드 애니메이션
  document.body.classList.add('page-loaded');
  
  // 스크롤 시 카드 애니메이션
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // 모든 포스트 카드 관찰
  const postCards = document.querySelectorAll('.post-card');
  postCards.forEach(card => {
    observer.observe(card);
  });
  
  // 자세히 보기 버튼 클릭 이벤트
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const postId = this.getAttribute('data-id');
      
      // 상세 페이지로 이동
      window.location.href = `/posts/${postId}`;
    });
  });
  
  // 카드 클릭 이벤트
  postCards.forEach(card => {
    card.addEventListener('click', function() {
      const readMoreBtn = this.querySelector('.read-more-btn');
      if (readMoreBtn) {
        readMoreBtn.click();
      }
    });
  });
  
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
});
