const { pool } = require('../config/database');

/**
 * 공지사항 컨트롤러
 * 게시글 목록 조회, 상세 조회, 검색 기능
 */

/**
 * 공지사항 목록 조회
 * GET /posts?page=1&search=검색어
 */
exports.getBoards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || '';
    
    // WHERE 조건 생성
    let whereClause = '';
    let params = [];
    
    if (searchQuery) {
      whereClause = 'WHERE title LIKE ?';
      params.push(`%${searchQuery}%`);
    }
    
    // 전체 게시글 수 조회
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM boards ${whereClause}`,
      params
    );
    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / limit);
    
    // 게시글 목록 조회
    const [boards] = await pool.execute(
      `SELECT id, title, author, category, views, created_at 
       FROM boards 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    res.render('posts', {
      title: '공지사항 - LandingLab',
      page: 'posts',
      boards,
      currentPage: page,
      totalPages,
      totalCount,
      searchQuery
    });
    
  } catch (error) {
    console.error('공지사항 목록 조회 오류:', error);
    res.render('error', {
      title: '오류 - LandingLab',
      page: 'error',
      message: '공지사항을 불러오는 중 오류가 발생했습니다.',
      error: { status: 500 }
    });
  }
};

/**
 * 공지사항 상세 조회
 * GET /posts/:id
 */
exports.getBoardDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 조회수 증가
    await pool.execute(
      'UPDATE boards SET views = views + 1 WHERE id = ?',
      [id]
    );
    
    // 게시글 조회
    const [boards] = await pool.execute(
      'SELECT * FROM boards WHERE id = ?',
      [id]
    );
    
    if (boards.length === 0) {
      return res.status(404).render('error', {
        title: '404 - LandingLab',
        page: 'error',
        message: '게시글을 찾을 수 없습니다.',
        error: { status: 404 }
      });
    }
    
    const board = boards[0];
    
    res.render('post-detail', {
      title: `${board.title} - LandingLab`,
      page: 'post-detail',
      board
    });
    
  } catch (error) {
    console.error('공지사항 상세 조회 오류:', error);
    res.render('error', {
      title: '오류 - LandingLab',
      page: 'error',
      message: '게시글을 불러오는 중 오류가 발생했습니다.',
      error: { status: 500 }
    });
  }
};
