// 메인 페이지 컨트롤러
exports.getHome = (req, res) => {
  res.render('index', {
    title: 'LandingLab - 홈',
    page: 'home'
  });
};

// 회사 소개 페이지 컨트롤러
exports.getAbout = (req, res) => {
  res.render('about', {
    title: 'LandingLab - 회사 소개',
    page: 'about'
  });
};

// 서비스 페이지 컨트롤러
exports.getServices = (req, res) => {
  res.render('services', {
    title: 'LandingLab - 서비스',
    page: 'services'
  });
};

// 연락처 페이지 컨트롤러
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'LandingLab - 연락처',
    page: 'contact'
  });
};
