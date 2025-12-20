const { query } = require('../config/database');

/**
 * 게시판 모델
 * 게시글 CRUD 기능 제공
 */
class Board {
  /**
   * 전체 게시글 조회
   * @param {Object} options - 페이징 및 정렬 옵션
   * @returns {Promise<Array>} 게시글 목록
   */
  static async getAll(options = {}) {
    const { limit = 10, offset = 0, orderBy = 'created_at', order = 'DESC' } = options;
    
    const sql = `
      SELECT * FROM boards 
      ORDER BY ${orderBy} ${order}
      LIMIT ? OFFSET ?
    `;
    
    return await query(sql, [limit, offset]);
  }

  /**
   * 게시글 총 개수 조회
   * @returns {Promise<number>} 전체 게시글 수
   */
  static async getCount() {
    const sql = 'SELECT COUNT(*) as count FROM boards';
    const result = await query(sql);
    return result[0].count;
  }

  /**
   * 특정 게시글 조회
   * @param {number} id - 게시글 ID
   * @returns {Promise<Object>} 게시글 정보
   */
  static async getById(id) {
    const sql = 'SELECT * FROM boards WHERE id = ?';
    const result = await query(sql, [id]);
    return result[0];
  }

  /**
   * 조회수 증가
   * @param {number} id - 게시글 ID
   */
  static async incrementViews(id) {
    const sql = 'UPDATE boards SET views = views + 1 WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * 게시글 생성
   * @param {Object} data - 게시글 데이터
   * @returns {Promise<Object>} 생성된 게시글 정보
   */
  static async create(data) {
    const { title, content, author, category = 'general' } = data;
    
    const sql = `
      INSERT INTO boards (title, content, author, category)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await query(sql, [title, content, author, category]);
    return { id: result.insertId, ...data };
  }

  /**
   * 게시글 수정
   * @param {number} id - 게시글 ID
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<boolean>} 수정 성공 여부
   */
  static async update(id, data) {
    const { title, content, category } = data;
    
    const sql = `
      UPDATE boards 
      SET title = ?, content = ?, category = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    const result = await query(sql, [title, content, category, id]);
    return result.affectedRows > 0;
  }

  /**
   * 게시글 삭제
   * @param {number} id - 게시글 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  static async delete(id) {
    const sql = 'DELETE FROM boards WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * 카테고리별 게시글 조회
   * @param {string} category - 카테고리명
   * @param {Object} options - 페이징 옵션
   * @returns {Promise<Array>} 게시글 목록
   */
  static async getByCategory(category, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const sql = `
      SELECT * FROM boards 
      WHERE category = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    return await query(sql, [category, limit, offset]);
  }

  /**
   * 게시글 검색
   * @param {string} keyword - 검색 키워드
   * @param {Object} options - 페이징 옵션
   * @returns {Promise<Array>} 검색 결과
   */
  static async search(keyword, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const sql = `
      SELECT * FROM boards 
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const searchTerm = `%${keyword}%`;
    return await query(sql, [searchTerm, searchTerm, limit, offset]);
  }
}

module.exports = Board;
