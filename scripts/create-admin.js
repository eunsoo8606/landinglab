const Admin = require('../models/Admin');
require('dotenv').config();

/**
 * 관리자 계정 생성 스크립트
 * 초기 관리자 계정을 데이터베이스에 생성합니다.
 */

async function createAdminAccount() {
  console.log('='.repeat(50));
  console.log('관리자 계정 생성 스크립트');
  console.log('='.repeat(50));
  
  // 초기 관리자 정보
  const adminData = {
    username: 'admin',
    password: 'admin1234!',
    email: 'admin@landinglab.com',
    name: '관리자',
    role: 'super_admin'
  };
  
  try {
    console.log('\n관리자 계정 생성 중...');
    console.log(`사용자명: ${adminData.username}`);
    console.log(`이메일: ${adminData.email}`);
    
    // 기존 계정 확인
    const existingAdmin = await Admin.findByUsername(adminData.username);
    
    if (existingAdmin) {
      console.log('\n⚠️  이미 동일한 사용자명의 관리자 계정이 존재합니다.');
      console.log('계정 정보:');
      console.log(`  - ID: ${existingAdmin.id}`);
      console.log(`  - 사용자명: ${existingAdmin.username}`);
      console.log(`  - 이메일: ${existingAdmin.email}`);
      console.log(`  - 권한: ${existingAdmin.role}`);
      console.log(`  - 생성일: ${existingAdmin.created_at}`);
      process.exit(0);
    }
    
    // 관리자 계정 생성
    const result = await Admin.create(adminData);
    
    if (result.success) {
      console.log('\n✅ 관리자 계정이 성공적으로 생성되었습니다!');
      console.log(`  - ID: ${result.id}`);
      console.log(`  - 사용자명: ${adminData.username}`);
      console.log(`  - 비밀번호: ${adminData.password}`);
      console.log(`  - 이메일: ${adminData.email}`);
      console.log(`  - 권한: ${adminData.role}`);
      console.log('\n⚠️  보안을 위해 첫 로그인 후 반드시 비밀번호를 변경하세요!');
    } else {
      console.error('\n❌ 관리자 계정 생성 실패:', result.message);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    process.exit(1);
  } finally {
    // 데이터베이스 연결 종료
    const { pool } = require('../config/database');
    await pool.end();
    console.log('\n데이터베이스 연결 종료');
    console.log('='.repeat(50));
  }
}

// 스크립트 실행
createAdminAccount();
