const { query } = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * 문의 폼 모델
 * 고객 문의 데이터 관리
 */
class Contact {
  /**
   * 조회된 데이터의 민감 정보 복호화
   * @param {Object|Array} data - 복호화할 데이터
   * @returns {Object|Array} 복호화된 데이터
   */
  static decryptSensitiveData(data) {
    if (!data) return data;
    
    const decryptItem = (item) => {
      if (!item) return item;
      
      try {
        return {
          ...item,
          email: item.email ? decrypt(item.email) : item.email,
          phone: item.phone ? decrypt(item.phone) : item.phone
        };
      } catch (error) {
        // 복호화 실패 시 원본 데이터 반환 (마이그레이션 전 평문 데이터 대응)
        // 평문 데이터는 조용히 그대로 사용
        return item;
      }
    };
    
    return Array.isArray(data) ? data.map(decryptItem) : decryptItem(data);
  }

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
    
    const results = await query(sql, params);
    return this.decryptSensitiveData(results);
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
    return this.decryptSensitiveData(result[0]);
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
      company_name = null,
      description,
      project_type = null,
      services = null,
      package: packageType = null,
      reference = null,
      website = null,
      budget = null,
      privacyAgree = false
    } = data;
    
    // 민감 정보 암호화
    const encryptedEmail = email ? encrypt(email) : null;
    const encryptedPhone = phone ? encrypt(phone) : null;
    
    const sql = `
      INSERT INTO contacts 
      (name, email, phone, company_name, description, project_type, services, package, reference, website, budget, agree_yn, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    
    const result = await query(sql, [
      name, 
      encryptedEmail, 
      encryptedPhone, 
      company_name, 
      description, 
      project_type,
      services,
      packageType,
      reference,
      website,
      budget,
      privacyAgree ? 'Y' : 'N'
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
    
    const results = await query(sql, [limit]);
    return this.decryptSensitiveData(results);
  }

  /**
   * 이메일로 문의 조회 (암호화된 이메일로 검색)
   * @param {string} email - 이메일 주소 (평문)
   * @returns {Promise<Array>} 해당 이메일의 문의 목록
   */
  static async getByEmail(email) {
    // 이메일을 암호화하여 검색 (주의: IV가 다르므로 정확한 검색 불가)
    // 대안: 전체 조회 후 복호화하여 필터링
    const allContacts = await this.getAll({ limit: 1000, offset: 0 });
    return allContacts.filter(contact => contact.email === email);
  }
}

module.exports = Contact;
