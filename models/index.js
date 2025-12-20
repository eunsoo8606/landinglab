const db = require('../config/database');

/**
 * 모델 통합 관리 파일
 * 모든 모델을 여기서 import하여 사용
 */

// 모델 import
const Board = require('./Board');
const Contact = require('./Contact');
// const Portfolio = require('./Portfolio'); // 필요시 추가

module.exports = {
  db,
  Board,
  Contact,
  // Portfolio // 필요시 추가
};
