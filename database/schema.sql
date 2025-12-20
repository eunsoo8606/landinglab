-- ============================================
-- LandingLab 데이터베이스 스키마
-- ============================================
-- 생성일: 2025-12-19
-- 설명: 게시판, 문의폼, 포트폴리오 관리를 위한 테이블 스키마
-- ============================================

-- 데이터베이스 생성 (필요시)
-- CREATE DATABASE IF NOT EXISTS landing_lab DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE landing_lab;

-- ============================================
-- 1. 게시판 테이블 (boards)
-- ============================================
CREATE TABLE IF NOT EXISTS `boards` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '게시글 ID',
  `title` VARCHAR(255) NOT NULL COMMENT '제목',
  `content` TEXT NOT NULL COMMENT '내용',
  `author` VARCHAR(100) NOT NULL COMMENT '작성자',
  `category` VARCHAR(50) DEFAULT 'general' COMMENT '카테고리 (general, notice, faq 등)',
  `views` INT DEFAULT 0 COMMENT '조회수',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '작성일',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  INDEX `idx_category` (`category`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_author` (`author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='게시판 테이블';

-- ============================================
-- 2. 문의 폼 테이블 (contacts)
-- ============================================
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '문의 ID',
  `name` VARCHAR(100) NOT NULL COMMENT '이름',
  `email` VARCHAR(255) NOT NULL COMMENT '이메일',
  `phone` VARCHAR(20) COMMENT '전화번호',
  `company` VARCHAR(200) COMMENT '회사명',
  `message` TEXT NOT NULL COMMENT '문의 내용',
  `project_type` VARCHAR(50) COMMENT '프로젝트 유형 (new, renewal 등)',
  `budget` VARCHAR(50) COMMENT '예산 범위',
  `status` ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending' COMMENT '처리 상태',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '문의일',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='문의 폼 테이블';

-- ============================================
-- 3. 포트폴리오 테이블 (portfolios) - 선택적
-- ============================================
CREATE TABLE IF NOT EXISTS `portfolios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '포트폴리오 ID',
  `title` VARCHAR(255) NOT NULL COMMENT '프로젝트명',
  `description` TEXT COMMENT '프로젝트 설명',
  `client` VARCHAR(200) COMMENT '클라이언트명',
  `category` VARCHAR(50) COMMENT '카테고리 (website, app, seo 등)',
  `thumbnail` VARCHAR(500) COMMENT '썸네일 이미지 경로',
  `images` JSON COMMENT '추가 이미지 경로들 (JSON 배열)',
  `url` VARCHAR(500) COMMENT '프로젝트 URL',
  `technologies` JSON COMMENT '사용 기술 (JSON 배열)',
  `start_date` DATE COMMENT '프로젝트 시작일',
  `end_date` DATE COMMENT '프로젝트 종료일',
  `is_featured` BOOLEAN DEFAULT FALSE COMMENT '메인 노출 여부',
  `display_order` INT DEFAULT 0 COMMENT '표시 순서',
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT '상태',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  INDEX `idx_category` (`category`),
  INDEX `idx_is_featured` (`is_featured`),
  INDEX `idx_status` (`status`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='포트폴리오 테이블';

-- ============================================
-- 4. 관리자 계정 테이블 (admins) - 선택적
-- ============================================
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '관리자 ID',
  `username` VARCHAR(50) UNIQUE NOT NULL COMMENT '사용자명',
  `password` VARCHAR(255) NOT NULL COMMENT '비밀번호 (해시)',
  `email` VARCHAR(255) UNIQUE NOT NULL COMMENT '이메일',
  `name` VARCHAR(100) COMMENT '이름',
  `role` ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin' COMMENT '권한',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
  `last_login` TIMESTAMP NULL COMMENT '마지막 로그인',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='관리자 계정 테이블';

-- ============================================
-- 샘플 데이터 삽입 (테스트용)
-- ============================================

-- 게시판 샘플 데이터
INSERT INTO `boards` (`title`, `content`, `author`, `category`) VALUES
('LandingLab 서비스 오픈 안내', '안녕하세요. LandingLab 서비스가 정식으로 오픈했습니다.', '관리자', 'notice'),
('자주 묻는 질문 - 견적 문의', '견적 문의는 어떻게 하나요?', '관리자', 'faq'),
('포트폴리오 업데이트', '새로운 프로젝트 포트폴리오가 추가되었습니다.', '관리자', 'general');

-- 문의 폼 샘플 데이터
INSERT INTO `contacts` (`name`, `email`, `phone`, `company`, `message`, `project_type`, `status`) VALUES
('홍길동', 'hong@example.com', '010-1234-5678', '(주)테스트', '랜딩페이지 제작 문의드립니다.', 'new', 'pending'),
('김철수', 'kim@example.com', '010-9876-5432', '스타트업A', '기존 웹사이트 리뉴얼 상담 요청합니다.', 'renewal', 'processing');

-- 포트폴리오 샘플 데이터
INSERT INTO `portfolios` (`title`, `description`, `client`, `category`, `url`, `is_featured`, `display_order`, `status`) VALUES
('A사 랜딩페이지 제작', '전환율 중심의 랜딩페이지 제작 프로젝트', 'A사', 'website', 'https://example-a.com', TRUE, 1, 'published'),
('B사 모바일 앱 개발', '고객 관리 모바일 애플리케이션 개발', 'B사', 'app', 'https://example-b.com', TRUE, 2, 'published'),
('C사 SEO 최적화', '검색엔진 최적화 및 컨텐츠 마케팅', 'C사', 'seo', 'https://example-c.com', FALSE, 3, 'published');

-- ============================================
-- 스키마 적용 완료
-- ============================================
-- 위 SQL을 MySQL 클라이언트에서 실행하세요.
-- 명령어 예시: mysql -u username -p database_name < schema.sql
