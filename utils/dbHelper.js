const { pool } = require('../config/database');

/**
 * 데이터베이스 유틸리티 헬퍼 함수 모음
 */

/**
 * 페이징 정보 계산
 * @param {number} totalCount - 전체 항목 수
 * @param {number} page - 현재 페이지 (1부터 시작)
 * @param {number} limit - 페이지당 항목 수
 * @returns {Object} 페이징 정보
 */
function getPagination(totalCount, page = 1, limit = 10) {
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * limit;
  
  return {
    totalCount,
    totalPages,
    currentPage,
    limit,
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}

/**
 * SQL 쿼리 빌더 - WHERE 조건 생성
 * @param {Object} conditions - 조건 객체
 * @returns {Object} { sql, params }
 */
function buildWhereClause(conditions = {}) {
  const whereClauses = [];
  const params = [];
  
  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      whereClauses.push(`${key} = ?`);
      params.push(value);
    }
  });
  
  const sql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  
  return { sql, params };
}

/**
 * 안전한 쿼리 실행 (에러 핸들링 포함)
 * @param {string} sql - SQL 쿼리
 * @param {Array} params - 쿼리 파라미터
 * @returns {Promise} 쿼리 결과
 */
async function safeQuery(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    console.error('쿼리 실행 오류:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 트랜잭션 헬퍼
 * @param {Function} callback - 트랜잭션 내에서 실행할 함수
 * @returns {Promise} 트랜잭션 결과
 */
async function executeTransaction(callback) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return { success: true, data: result };
  } catch (error) {
    await connection.rollback();
    console.error('트랜잭션 오류:', error.message);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}

/**
 * 일괄 삽입 헬퍼
 * @param {string} table - 테이블명
 * @param {Array} data - 삽입할 데이터 배열
 * @returns {Promise} 삽입 결과
 */
async function bulkInsert(table, data) {
  if (!data || data.length === 0) {
    return { success: false, error: '삽입할 데이터가 없습니다.' };
  }
  
  const keys = Object.keys(data[0]);
  const placeholders = data.map(() => `(${keys.map(() => '?').join(', ')})`).join(', ');
  const values = data.flatMap(item => keys.map(key => item[key]));
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES ${placeholders}`;
  
  return await safeQuery(sql, values);
}

/**
 * 검색 쿼리 빌더 (LIKE 검색)
 * @param {string} table - 테이블명
 * @param {Array} searchFields - 검색할 필드명 배열
 * @param {string} keyword - 검색 키워드
 * @param {Object} options - 추가 옵션 (limit, offset 등)
 * @returns {Promise} 검색 결과
 */
async function search(table, searchFields, keyword, options = {}) {
  const { limit = 10, offset = 0, orderBy = 'created_at', order = 'DESC' } = options;
  
  const searchConditions = searchFields.map(field => `${field} LIKE ?`).join(' OR ');
  const searchTerm = `%${keyword}%`;
  const params = Array(searchFields.length).fill(searchTerm);
  
  const sql = `
    SELECT * FROM ${table}
    WHERE ${searchConditions}
    ORDER BY ${orderBy} ${order}
    LIMIT ? OFFSET ?
  `;
  
  params.push(limit, offset);
  
  return await safeQuery(sql, params);
}

/**
 * 데이터 존재 여부 확인
 * @param {string} table - 테이블명
 * @param {Object} conditions - 조건 객체
 * @returns {Promise<boolean>} 존재 여부
 */
async function exists(table, conditions) {
  const { sql: whereClause, params } = buildWhereClause(conditions);
  const query = `SELECT COUNT(*) as count FROM ${table} ${whereClause}`;
  
  const result = await safeQuery(query, params);
  
  if (result.success && result.data.length > 0) {
    return result.data[0].count > 0;
  }
  
  return false;
}

/**
 * 소프트 삭제 (deleted_at 업데이트)
 * @param {string} table - 테이블명
 * @param {number} id - 삭제할 항목 ID
 * @returns {Promise} 삭제 결과
 */
async function softDelete(table, id) {
  const sql = `UPDATE ${table} SET deleted_at = NOW() WHERE id = ?`;
  return await safeQuery(sql, [id]);
}

module.exports = {
  getPagination,
  buildWhereClause,
  safeQuery,
  executeTransaction,
  bulkInsert,
  search,
  exists,
  softDelete
};
