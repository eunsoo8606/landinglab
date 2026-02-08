require('dotenv').config();
const Admin = require('../models/Admin');

/**
 * 관리자 계정 생성 스크립트
 * 사용법: node scripts/create-admin.js
 */

async function createAdmin() {
  try {
    // 생성할 관리자 정보
    const adminData = {
      username: 'admin',           // 사용자명
      password: '123456',          // 평문 비밀번호 (자동으로 해시됨)
      email: 'admin@landinglab.com',
      name: '관리자',
      role: 'super_admin'          // 'super_admin' 또는 'admin'
    };

    console.log('관리자 계정 생성 중...');
    console.log('사용자명:', adminData.username);
    console.log('이메일:', adminData.email);
    console.log('권한:', adminData.role);
    console.log('');

    const result = await Admin.create(adminData);

    if (result.success) {
      console.log('✅ 성공:', result.message);
      console.log('생성된 ID:', result.id);
      console.log('');
      console.log('💡 비밀번호는 bcrypt로 해시되어 안전하게 저장되었습니다.');
    } else {
      console.error('❌ 실패:', result.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

createAdmin();
