const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Connection Pool 설정
 * Promise 기반으로 async/await 사용 가능
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * 데이터베이스 연결 테스트
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL 데이터베이스 연결 성공!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error.message);
    return false;
  }
}

/**
 * 쿼리 실행 헬퍼 함수
 * @param {string} sql - SQL 쿼리문
 * @param {Array} params - 쿼리 파라미터
 * @returns {Promise} 쿼리 결과
 */
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('쿼리 실행 오류:', error.message);
    throw error;
  }
}

/**
 * 트랜잭션 실행 헬퍼 함수
 * @param {Function} callback - 트랜잭션 내에서 실행할 함수
 * @returns {Promise} 트랜잭션 결과
 */
async function transaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const result = await callback(connection);
    await connection.commit();
    connection.release();
    return result;
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}

// Pool 이벤트 리스너
pool.on('connection', (connection) => {
  console.log('새로운 데이터베이스 연결이 생성되었습니다.');
});

pool.on('acquire', (connection) => {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', (connection) => {
  console.log('Connection %d released', connection.threadId);
});

module.exports = {
  pool,
  query,
  transaction,
  testConnection
};
