const { query, testConnection } = require('../config/database');
const fs = require('fs');
const path = require('path');

/**
 * 방문자 로그 테이블 생성 스크립트
 * database/visit_logs.sql 파일을 읽어 데이터베이스에 직접 실행합니다.
 */
async function main() {
  const connected = await testConnection();
  if (!connected) {
    console.error('데이터베이스 연결 실패로 스크립트를 종료합니다.');
    process.exit(1);
  }

  try {
    const sqlPath = path.join(__dirname, '../database/visit_logs.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('방문자 로그 테이블 생성 쿼리를 실행합니다...');
    await query(sql);
    console.log('✅ visit_logs 테이블이 성공적으로 생성되었습니다!');
  } catch (error) {
    console.error('❌ visit_logs 테이블 생성 오류:', error);
  } finally {
    process.exit(0);
  }
}

main();
