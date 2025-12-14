const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const adminController = require('../controllers/adminController');

// 메인 페이지
router.get('/', homeController.getHome);

// 회사 소개 페이지
router.get('/about', homeController.getAbout);

// 서비스 페이지
router.get('/services', homeController.getServices);

// 연락처 페이지
router.get('/contact', homeController.getContact);

// 포트폴리오 페이지
router.get('/portfolio', homeController.getPortfolio);

// 포스트 게시판 페이지
router.get('/posts', homeController.getPosts);

// 포스트 상세 페이지
router.get('/posts/:id', homeController.getPostDetail);

// 관리자 로그인 페이지
router.get('/console', adminController.getLogin);

module.exports = router;
