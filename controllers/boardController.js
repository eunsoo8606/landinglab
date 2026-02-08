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
    const companyId = 1; // 랜딩랩 고정
    const category = 'notice'; // 공지사항 고정 (필요시 query에서 받을 수 있음)

    // WHERE 조건 생성
    let whereClause = 'WHERE b.company_id = ? AND b.category = ?';
    let params = [companyId, category];

    if (searchQuery) {
      whereClause += ' AND p.title LIKE ?';
      params.push(`%${searchQuery}%`);
    }

    // 전체 게시글 수 조회
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM posts p
       JOIN boards b ON p.board_id = b.id
       ${whereClause}`,
      params
    );
    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    // 게시글 목록 조회
    const [boards] = await pool.query(
      `SELECT p.post_no as id, p.title, p.author_name as author, b.category, p.views, p.create_dt as created_at 
       FROM posts p
       JOIN boards b ON p.board_id = b.id
       ${whereClause}
       ORDER BY p.top_yn DESC, p.post_no DESC 
       LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
      params
    );

    res.render('boards', {
      title: '공지사항 - LandingLab',
      page: 'boards',
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
    const companyId = 1;

    // 게시글 존재 및 권한(company_id) 확인 조회
    const [posts] = await pool.query(
      `SELECT p.*, b.category 
       FROM posts p
       JOIN boards b ON p.board_id = b.id
       WHERE p.post_no = ? AND b.company_id = ?`,
      [id, companyId]
    );

    if (posts.length === 0) {
      return res.status(404).render('error', {
        title: '404 - LandingLab',
        page: 'error',
        message: '게시글을 찾을 수 없습니다.',
        error: { status: 404 }
      });
    }

    // 조회수 증가
    await pool.execute(
      'UPDATE posts SET views = IFNULL(views, 0) + 1 WHERE post_no = ?',
      [id]
    );

    const board = {
      ...posts[0],
      id: posts[0].post_no,
      author: posts[0].author_name,
      created_at: posts[0].create_dt
    };

    res.render('board-detail', {
      title: `${board.title} - LandingLab`,
      page: 'board-detail',
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
