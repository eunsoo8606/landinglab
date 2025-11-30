# LandingLab 회사 홈페이지

Node.js + Express + EJS + Bootstrap 5 기반의 LandingLab 회사 홈페이지입니다.

## 프로젝트 구조

```
landing-lab/
├── app.js                  # 메인 애플리케이션 파일
├── package.json            # 프로젝트 의존성
├── .env                    # 환경 변수
├── .gitignore             # Git 제외 파일
├── controllers/           # 컨트롤러 (MVC)
│   └── homeController.js
├── routes/                # 라우트 정의
│   └── index.js
├── views/                 # EJS 뷰 템플릿
│   ├── layout/
│   │   ├── head.ejs
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── about.ejs
│   ├── services.ejs
│   ├── contact.ejs
│   └── error.ejs
└── public/                # 정적 파일
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        ├── hero-image.svg
        └── about-image.svg
```

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 프로덕션 서버 실행:
```bash
npm start
```

## 기술 스택

- **Backend**: Node.js, Express
- **Template Engine**: EJS
- **Frontend**: Bootstrap 5, Vanilla JavaScript
- **Icons**: Font Awesome

## 페이지 구성 (원페이지)

- **홈** (`#home`): 메인 히어로 섹션
- **회사 소개** (`#about`): 스토리텔링 방식의 회사 소개
- **서비스** (`#services`): 서비스 특징 및 프로세스
- **연락처** (`#contact`): 문의 폼 및 연락 정보

## 개발 환경

- Node.js 14.x 이상
- npm 6.x 이상

## 라이선스

ISC