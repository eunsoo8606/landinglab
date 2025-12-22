/**
 * 로켓 마우스 커서 파티클 효과
 * 마우스를 움직일 때 로켓 뒤에서 연기가 나오는 효과를 생성합니다.
 */

class RocketCursor {
  constructor() {
    this.particles = [];
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.currentX = this.mouseX;
    this.currentY = this.mouseY;
    this.isMoving = false;
    this.lastMoveTime = 0;
    
    this.init();
  }

  init() {
    // 커스텀 로켓 커서 생성
    this.cursor = document.createElement('div');
    this.cursor.id = 'rocket-cursor';
    this.cursor.innerHTML = `
      <div class="rocket-body"></div>
      <div class="rocket-window"></div>
      <div class="rocket-wing-left"></div>
      <div class="rocket-wing-right"></div>
      <div class="rocket-engine"></div>
    `;
    document.body.appendChild(this.cursor);

    // 파티클 컨테이너 생성
    this.container = document.createElement('div');
    this.container.id = 'rocket-particles-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(this.container);

    // 이벤트 리스너 등록
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // 애니메이션 루프 시작
    this.animate();
  }

  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.isMoving = true;
    this.lastMoveTime = Date.now();
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'rocket-particle';
    
    // 로켓 엔진 뒤쪽에서 파티클 생성 (45도 회전 고려)
    // 로켓이 -45도 회전되어 있으므로 오른쪽 아래 방향으로 오프셋
    const angle = Math.PI / 4; // 45도
    const distance = 20 + Math.random() * 5;
    const offsetX = Math.cos(angle) * distance + (Math.random() - 0.5) * 8;
    const offsetY = Math.sin(angle) * distance + (Math.random() - 0.5) * 8;
    
    const x = this.currentX + offsetX;
    const y = this.currentY + offsetY;
    
    // 파티클 크기 랜덤화
    const size = Math.random() * 8 + 4;
    
    // 파티클 색상 (주황색 -> 빨간색 그라데이션)
    const colors = [
      'rgba(255, 140, 0, 0.8)',   // 진한 주황색
      'rgba(255, 100, 0, 0.7)',   // 주황-빨강
      'rgba(255, 69, 0, 0.6)',    // 빨강-주황
      'rgba(255, 50, 0, 0.5)',    // 빨간색
      'rgba(255, 200, 100, 0.4)'  // 밝은 주황색
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 ${size}px ${color};
    `;
    
    this.container.appendChild(particle);
    
    // 파티클 데이터 저장
    this.particles.push({
      element: particle,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 1 + 0.5,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.01
    });
    
    // 파티클 개수 제한 (성능 최적화)
    if (this.particles.length > 50) {
      const oldParticle = this.particles.shift();
      if (oldParticle.element.parentNode) {
        oldParticle.element.parentNode.removeChild(oldParticle.element);
      }
    }
  }

  animate() {
    // 마우스가 멈춘 후 100ms 후에 isMoving을 false로 설정
    if (Date.now() - this.lastMoveTime > 100) {
      this.isMoving = false;
    }

    // 로켓 커서 위치를 즉각 업데이트
    this.currentX = this.mouseX;
    this.currentY = this.mouseY;
    
    // 로켓 커서 위치 업데이트
    if (this.cursor) {
      this.cursor.style.left = this.currentX + 'px';
      this.cursor.style.top = this.currentY + 'px';
    }
    
    // 마우스가 움직이고 있을 때만 파티클 생성
    if (this.isMoving && Math.random() > 0.3) {
      this.createParticle();
    }

    // 파티클 업데이트
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // 파티클 위치 업데이트
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      
      // 파티클 스타일 업데이트
      if (p.element) {
        p.element.style.left = p.x + 'px';
        p.element.style.top = p.y + 'px';
        p.element.style.opacity = p.life;
        p.element.style.transform = `scale(${p.life})`;
      }
      
      // 수명이 다한 파티클 제거
      if (p.life <= 0) {
        if (p.element.parentNode) {
          p.element.parentNode.removeChild(p.element);
        }
        this.particles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(this.animate.bind(this));
  }
}

// DOM이 로드되면 로켓 커서 효과 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new RocketCursor();
  });
} else {
  new RocketCursor();
}
