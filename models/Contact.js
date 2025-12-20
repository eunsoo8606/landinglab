const { query } = require('../config/database');

/**
 * 문의 폼 모델
 * 고객 문의 데이터 관리
 */
class Contact {
  /**
   * 전체 문의 조회
   * @param {Object} options - 페이징 및 필터 옵션
   * @returns {Promise<Array>} 문의 목록
   */
  static async getAll(options = {}) {
    const { limit = 20, offset = 0, status = null } = options;
    
    let sql = 'SELECT * FROM contacts';
    const params = [];
    
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    return await query(sql, params);
  }

  /**
   * 문의 총 개수 조회
   * @param {string} status - 처리 상태 필터 (선택)
   * @returns {Promise<number>} 문의 개수
   */
  static async getCount(status = null) {
    let sql = 'SELECT COUNT(*) as count FROM contacts';
    const params = [];
    
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    const result = await query(sql, params);
    return result[0].count;
  }

  /**
   * 특정 문의 조회
   * @param {number} id - 문의 ID
   * @returns {Promise<Object>} 문의 정보
   */
  static async getById(id) {
    const sql = 'SELECT * FROM contacts WHERE id = ?';
    const result = await query(sql, [id]);
    return result[0];
  }

  /**
   * 문의 생성
   * @param {Object} data - 문의 데이터
   * @returns {Promise<Object>} 생성된 문의 정보
   */
  static async create(data) {
    const { 
      name, 
      email, 
      phone, 
      company = null,
      message,
      project_type = null,
      budget = null
    } = data;
    
    const sql = `
      INSERT INTO contacts 
      (name, email, phone, company, message, project_type, budget, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    
    const result = await query(sql, [
      name, email, phone, company, message, project_type, budget
    ]);
    
    return { id: result.insertId, ...data, status: 'pending' };
  }

  /**
   * 문의 상태 업데이트
   * @param {number} id - 문의 ID
   * @param {string} status - 상태 (pending, processing, completed, rejected)
   * @returns {Promise<boolean>} 업데이트 성공 여부
   */
  static async updateStatus(id, status) {
    const sql = `
      UPDATE contacts 
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    const result = await query(sql, [status, id]);
    return result.affectedRows > 0;
  }

  /**
   * 문의 삭제
   * @param {number} id - 문의 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  static async delete(id) {
    const sql = 'DELETE FROM contacts WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * 최근 문의 조회
   * @param {number} limit - 조회할 개수
   * @returns {Promise<Array>} 최근 문의 목록
   */
  static async getRecent(limit = 5) {
    const sql = `
      SELECT * FROM contacts 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    return await query(sql, [limit]);
  }

  /**
   * 이메일로 문의 조회
   * @param {string} email - 이메일 주소
   * @returns {Promise<Array>} 해당 이메일의 문의 목록
   */
  static async getByEmail(email) {
    const sql = `
      SELECT * FROM contacts 
      WHERE email = ?
      ORDER BY created_at DESC
    `;
    
    return await query(sql, [email]);
  }
}

module.exports = Contact;
