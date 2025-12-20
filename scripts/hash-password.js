const bcrypt = require('bcryptjs');

/**
 * 비밀번호 해시 생성 스크립트
 * 입력한 비밀번호를 bcrypt로 해싱하여 출력합니다.
 */

async function hashPassword() {
  const password = 'admin1234!';
  
  console.log('='.repeat(50));
  console.log('비밀번호 해시 생성');
  console.log('='.repeat(50));
  console.log(`\n원본 비밀번호: ${password}`);
  
  try {
    // bcrypt로 해싱 (cost factor: 10)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log(`\n해시된 비밀번호:\n${hashedPassword}`);
    console.log('\n위의 해시값을 데이터베이스의 password 컬럼에 복사하세요.');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('오류 발생:', error.message);
  }
}

// 스크립트 실행
hashPassword();
