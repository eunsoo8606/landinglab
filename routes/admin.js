const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');

/**
 * 관리자 라우터
 * 로그인, 로그아웃, 대시보드 등 관리자 관련 라우트
 */

// 로그인 페이지 (이미 로그인된 경우 대시보드로 리다이렉트)
router.get('/login', redirectIfAuthenticated, adminController.showLoginPage);

// 로그인 처리
router.post('/login', redirectIfAuthenticated, adminController.login);

// 로그아웃
router.get('/logout', adminController.logout);

// 대시보드 (인증 필요)
router.get('/dashboard', requireAuth, adminController.showDashboard);

module.exports = router;
