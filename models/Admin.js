const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * 관리자 모델
 * 관리자 계정 관련 데이터베이스 작업
 */

class Admin {
  /**
   * 사용자명으로 관리자 조회
   * @param {string} username - 사용자명
   * @returns {Promise<Object|null>} 관리자 정보 또는 null
   */
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM admins WHERE username = ? AND is_active = TRUE',
        [username]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('관리자 조회 오류:', error.message);
      throw error;
    }
  }

  /**
   * ID로 관리자 조회
   * @param {number} id - 관리자 ID
   * @returns {Promise<Object|null>} 관리자 정보 또는 null
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM admins WHERE id = ? AND is_active = TRUE',
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('관리자 조회 오류:', error.message);
      throw error;
    }
  }

  /**
   * 비밀번호 검증
   * @param {string} plainPassword - 평문 비밀번호
   * @param {string} hashedPassword - 해시된 비밀번호
   * @returns {Promise<boolean>} 일치 여부
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('비밀번호 검증 오류:', error.message);
      return false;
    }
  }

  /**
   * 마지막 로그인 시간 업데이트
   * @param {number} id - 관리자 ID
   * @returns {Promise<boolean>} 성공 여부
   */
  static async updateLastLogin(id) {
    try {
      await pool.execute(
        'UPDATE admins SET last_login = NOW() WHERE id = ?',
        [id]
      );
      return true;
    } catch (error) {
      console.error('마지막 로그인 업데이트 오류:', error.message);
      return false;
    }
  }

  /**
   * 새 관리자 계정 생성
   * @param {Object} adminData - 관리자 정보
   * @returns {Promise<Object>} 생성 결과
   */
  static async create(adminData) {
    const { username, password, email, name, role = 'admin' } = adminData;
    
    try {
      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.execute(
        `INSERT INTO admins (username, password, email, name, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [username, hashedPassword, email, name, role]
      );
      
      return {
        success: true,
        id: result.insertId,
        message: '관리자 계정이 생성되었습니다.'
      };
    } catch (error) {
      console.error('관리자 생성 오류:', error.message);
      
      // 중복 키 에러 처리
      if (error.code === 'ER_DUP_ENTRY') {
        return {
          success: false,
          message: '이미 존재하는 사용자명 또는 이메일입니다.'
        };
      }
      
      return {
        success: false,
        message: '관리자 계정 생성에 실패했습니다.'
      };
    }
  }

  /**
   * 비밀번호 변경
   * @param {number} id - 관리자 ID
   * @param {string} newPassword - 새 비밀번호
   * @returns {Promise<boolean>} 성공 여부
   */
  static async changePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await pool.execute(
        'UPDATE admins SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      
      return true;
    } catch (error) {
      console.error('비밀번호 변경 오류:', error.message);
      return false;
    }
  }
}

module.exports = Admin;
