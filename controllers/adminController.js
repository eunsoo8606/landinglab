// 관리자 페이지 컨트롤러

// 관리자 로그인 페이지
exports.getLogin = (req, res) => {
    res.render('admin/login', {
        title: '관리자 로그인 - LandingLab'
    });
};

// 추후 추가될 관리자 기능들
// exports.postLogin = (req, res) => { ... };
// exports.getDashboard = (req, res) => { ... };
// exports.logout = (req, res) => { ... };
