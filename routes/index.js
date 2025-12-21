const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const adminController = require('../controllers/adminController');
const boardController = require('../controllers/boardController');
const postController = require('../controllers/postController');
const contactController = require('../controllers/contactController');
const sitemapController = require('../controllers/sitemapController');

// SEO - Sitemap & Robots.txt & RSS Feed
router.get('/sitemap.xml', sitemapController.getSitemap);
router.get('/robots.txt', sitemapController.getRobots);
router.get('/rss.xml', sitemapController.getRssFeed);

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

// 포스트 게시판 페이지 (블로그 스타일)
router.get('/posts', postController.getPosts);

// 포스트 상세 페이지 (블로그 스타일)
router.get('/posts/:id', postController.getPostDetail);

// 공지사항 게시판 페이지 (데이터베이스 기반)
router.get('/boards', boardController.getBoards);

// 공지사항 상세 페이지 (데이터베이스 기반)
router.get('/boards/:id', boardController.getBoardDetail);

// Contact API
router.post('/api/contact', contactController.submitContact);
router.get('/api/contacts', contactController.getContacts);
router.get('/api/contacts/:id', contactController.getContactById);
router.put('/api/contacts/:id/status', contactController.updateContactStatus);
router.delete('/api/contacts/:id', contactController.deleteContact);

// 관리자 로그인 페이지 (기존 경로 유지)
router.get('/console', adminController.getLogin);

// 관리자 라우터 연결
const adminRouter = require('./admin');
router.use('/admin', adminRouter);

module.exports = router;
