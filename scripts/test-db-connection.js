const path = require('path');
const { testConnection } = require(path.join(__dirname, '..', 'config', 'database'));

// 데이터베이스 연결 테스트 스크립트
console.log('🔍 MySQL 데이터베이스 연결 테스트 시작...\n');

testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ 데이터베이스 연결 테스트 성공!');
      console.log('📊 다음 단계: database/schema.sql 파일을 실행하여 테이블을 생성하세요.');
      process.exit(0);
    } else {
      console.log('\n❌ 데이터베이스 연결 테스트 실패!');
      console.log('💡 .env 파일의 DB 접속 정보를 확인해주세요.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ 연결 테스트 중 오류 발생:', error.message);
    process.exit(1);
  });
