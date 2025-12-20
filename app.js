const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// Body parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 세션 미들웨어 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24시간
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // HTTPS에서만 쿠키 전송 (프로덕션)
  }
}));

// 라우트 설정
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// 404 에러 핸들링
app.use((req, res, next) => {
  res.status(404).render('error', { 
    title: '404 - 페이지를 찾을 수 없습니다',
    page: 'error',
    message: '페이지를 찾을 수 없습니다.',
    error: { status: 404 }
  });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    title: '오류 - LandingLab',
    page: 'error',
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
