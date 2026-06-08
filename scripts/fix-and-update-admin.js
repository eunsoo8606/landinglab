require('dotenv').config();
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🔄 관리자 테이블 스키마 교정 및 비밀번호 설정 시작...');
  try {
    // 외래 키 제약조건 해제 (DROP TABLE/TRUNCATE 우회 목적)
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');

    // 1. 기존 admins 테이블이 잘못 생성되었을 수 있으므로 테이블 삭제 후 재생성
    console.log('1. 기존 admins 테이블 삭제 및 정상 스키마로 생성 중...');
    await pool.query('DROP TABLE IF EXISTS `admins`');
    
    await pool.query(`
      CREATE TABLE \`admins\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY COMMENT '관리자 ID',
        \`username\` VARCHAR(50) UNIQUE NOT NULL COMMENT '사용자명',
        \`password\` VARCHAR(255) NOT NULL COMMENT '비밀번호 (해시)',
        \`email\` VARCHAR(255) UNIQUE NOT NULL COMMENT '이메일',
        \`name\` VARCHAR(100) COMMENT '이름',
        \`role\` ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin' COMMENT '권한',
        \`is_active\` BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
        \`last_login\` TIMESTAMP NULL COMMENT '마지막 로그인',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
        INDEX \`idx_username\` (\`username\`),
        INDEX \`idx_email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='관리자 계정 테이블'
    `);
    console.log('   -> admins 테이블 재생성 완료!');

    // 2. 요청된 비밀번호(admin1234!)로 관리자 계정 생성
    console.log('2. 관리자 계정 생성 중...');
    const username = 'admin';
    const plainPassword = 'admin1234!';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const email = 'admin@landinglab.com';
    const name = '관리자';
    const role = 'super_admin';

    await pool.execute(
      `INSERT INTO admins (username, password, email, name, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, hashedPassword, email, name, role]
    );
    console.log(`   -> 관리자 계정 생성 완료!`);
    console.log(`      아이디: ${username}`);
    console.log(`      비밀번호: ${plainPassword}`);
    
    // 외래 키 제약조건 원복
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    process.exit(0);
  } catch (error) {
    // 에러 시에도 외래 키는 되돌림
    await pool.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => {});
    console.error('❌ 관리자 초기화 실패:', error.message);
    process.exit(1);
  }
}

main();
