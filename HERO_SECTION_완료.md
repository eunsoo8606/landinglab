# Hero 섹션 구현 완료

## 완료된 작업

### 1. HTML 구조 (`views/index.ejs`)
✅ 비디오 배경 섹션 추가
- `<video>` 태그로 전체 화면 배경 구현
- 실제 비디오 파일 연결: `/videos/이미지_재활용_및_디지털_배경_영상_제작.mp4`
- autoplay, muted, loop, playsinline 속성 적용

✅ 오버레이 레이어
- Main Dark 컬러 (hsl(203.48deg 51.11% 8.82%))
- opacity 0.65로 가독성 확보

✅ 콘텐츠 구조
- **헤드라인**: "단순한 페이지가 아닙니다. **매출을 바꾸는 전략**입니다."
  - "매출을 바꾸는 전략" 부분 Accent Blue로 강조
- **서브텍스트**: "기획부터 디자인, 퍼블리싱까지. 고객의 마음을 움직이는 고효율 랜딩페이지를 경험하세요."
- **버튼 2개**:
  - Primary Solid: "무료 견적 문의하기" (Accent Blue 배경)
  - Outline Ghost: "포트폴리오 보러가기" (흰색 테두리)

### 2. CSS 스타일 (`public/css/style.css`)

✅ **디자인 시스템 변수**
```css
--main-dark: hsl(203.48deg 51.11% 8.82%)
--accent-blue: hsl(203.94deg 90.61% 41.76%)
--text-white: #FFFFFF
```

✅ **Hero 섹션 스타일**
- 전체 화면 (100vh, min-height: 600px)
- Flexbox 중앙 정렬
- 비디오 배경 (position: absolute, object-fit: cover)
- 오버레이 (opacity: 0.65)
- z-index 레이어링 (비디오 1, 오버레이 2, 콘텐츠 3)

✅ **타이포그래피**
- Pretendard 폰트 적용
- 반응형 폰트 크기 (clamp 사용)
  - 헤드라인: clamp(2rem, 5vw, 3.5rem)
  - 서브텍스트: clamp(1rem, 2.5vw, 1.25rem)

✅ **버튼 스타일**
- Primary Solid: Accent Blue 배경, hover 시 어두워짐 + 상승 효과
- Outline Ghost: 투명 배경, 흰색 테두리, hover 시 흰색 배경으로 전환

✅ **애니메이션**
- fadeInUp 애니메이션 (1s, 1.2s, 1.4s 순차 적용)
- 버튼 hover 시 translateY(-2px) 효과

✅ **반응형 디자인**
- 태블릿 (max-width: 768px): 버튼 세로 정렬, 폰트 크기 조정
- 모바일 (max-width: 480px): 더 작은 폰트와 패딩

### 3. 폰트 적용 (`views/layout/head.ejs`)
✅ Pretendard 웹폰트 CDN 추가
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
```

### 4. 로고 적용 (`views/layout/header.ejs`)
✅ navbar-brand에 logo.png 이미지 사용
✅ CSS로 로고 크기 조정 (height: 40px)

## 파일 구조

```
landing-lab/
├── views/
│   ├── layout/
│   │   ├── head.ejs          ✅ Pretendard 폰트 추가
│   │   └── header.ejs        ✅ 로고 이미지 적용
│   └── index.ejs             ✅ Hero 섹션 구현
├── public/
│   ├── css/
│   │   └── style.css         ✅ Hero 섹션 스타일 추가
│   ├── images/
│   │   └── logo.png          ✅ 사용 중
│   └── videos/
│       └── 이미지_재활용_및_디지털_배경_영상_제작.mp4  ✅ 연결됨
```

## 확인 방법

1. 브라우저에서 http://localhost:3000 접속
2. Hero 섹션 확인:
   - ✅ 비디오 배경이 전체 화면으로 재생되는지
   - ✅ 어두운 오버레이가 적용되어 텍스트가 잘 보이는지
   - ✅ 헤드라인의 "매출을 바꾸는 전략" 부분이 파란색인지
   - ✅ 두 버튼이 나란히 배치되어 있는지
   - ✅ 버튼 hover 시 효과가 작동하는지
   - ✅ 로고가 헤더에 표시되는지

3. 반응형 테스트:
   - 브라우저 창 크기를 줄여서 태블릿/모바일 뷰 확인
   - 버튼이 세로로 정렬되는지 확인

## 주요 기능

✅ **시맨틱 HTML**: `<section>`, `<video>`, `<h1>`, `<p>` 등 사용
✅ **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
✅ **접근성**: alt 텍스트, 시맨틱 태그 사용
✅ **성능**: autoplay, muted, loop로 자동 재생
✅ **폴백**: 비디오 미지원 시 이미지 대체

## 디자인 스펙 준수

✅ Colors: Main Dark, Accent Blue, Text White 정확히 적용
✅ Background: 100vh 비디오 배경 + 오버레이
✅ Typography: Pretendard 폰트, 반응형 크기
✅ Layout: Flexbox 중앙 정렬
✅ Content: 요청한 텍스트 정확히 반영
✅ Buttons: Solid/Ghost 타입, hover 효과 구현
✅ Responsive: 미디어 쿼리로 모바일 대응
