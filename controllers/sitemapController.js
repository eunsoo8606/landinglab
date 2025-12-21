const { getPostsData } = require('./homeController');

/**
 * Sitemap.xml 생성
 */
exports.getSitemap = (req, res) => {
  const baseUrl = 'https://landinglab.com';
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
  
  // 정적 페이지 URL 목록
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/services', priority: '0.8', changefreq: 'monthly' },
    { url: '/portfolio', priority: '0.9', changefreq: 'weekly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/posts', priority: '0.8', changefreq: 'weekly' },
    { url: '/boards', priority: '0.6', changefreq: 'weekly' }
  ];
  
  // 동적 페이지 - 포스트 목록
  const posts = getPostsData();
  const postPages = posts.map(post => ({
    url: `/posts/${post.id}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.date || currentDate
  }));
  
  // 모든 페이지 합치기
  const allPages = [...staticPages, ...postPages];
  
  // XML 생성
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod || currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  // XML 응답
  res.header('Content-Type', 'application/xml');
  res.send(xml);
};

/**
 * robots.txt 생성
 */
exports.getRobots = (req, res) => {
  const baseUrl = 'https://landinglab.com';
  
  const robotsTxt = `# Robots.txt for LandingLab
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin pages
User-agent: *
Disallow: /admin/
Disallow: /api/
`;
  
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
};

/**
 * RSS Feed 생성 (Atom 형식)
 */
exports.getRssFeed = (req, res) => {
  const baseUrl = 'https://landinglab.com';
  const posts = getPostsData();
  const currentDate = new Date().toISOString();
  
  // Atom Feed XML 생성
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
  xml += '  <title>랜딩랩 블로그</title>\n';
  xml += `  <link href="${baseUrl}/rss.xml" rel="self" type="application/atom+xml"/>\n`;
  xml += `  <link href="${baseUrl}/posts" rel="alternate" type="text/html"/>\n`;
  xml += `  <updated>${currentDate}</updated>\n`;
  xml += `  <id>${baseUrl}/</id>\n`;
  xml += '  <author>\n';
  xml += '    <name>랜딩랩</name>\n';
  xml += '    <email>landing.lab0@gmail.com</email>\n';
  xml += '  </author>\n';
  xml += '  <subtitle>GA4, SEO 최적화, 반응형 웹 디자인, 랜딩페이지 제작 전략 등 웹 개발과 마케팅 정보</subtitle>\n';
  
  // 각 포스트를 entry로 추가
  posts.forEach(post => {
    const postUrl = `${baseUrl}/posts/${post.id}`;
    const postDate = post.date ? new Date(post.date).toISOString() : currentDate;
    
    xml += '  <entry>\n';
    xml += `    <title>${escapeXml(post.title)}</title>\n`;
    xml += `    <link href="${postUrl}" rel="alternate" type="text/html"/>\n`;
    xml += `    <id>${postUrl}</id>\n`;
    xml += `    <published>${postDate}</published>\n`;
    xml += `    <updated>${postDate}</updated>\n`;
    xml += '    <author>\n';
    xml += `      <name>${escapeXml(post.author)}</name>\n`;
    xml += '    </author>\n';
    xml += `    <summary type="html">${escapeXml(post.description)}</summary>\n`;
    
    // 카테고리 추가
    if (post.category) {
      xml += `    <category term="${escapeXml(post.category)}"/>\n`;
    }
    
    // 태그 추가
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => {
        xml += `    <category term="${escapeXml(tag)}"/>\n`;
      });
    }
    
    xml += '  </entry>\n';
  });
  
  xml += '</feed>';
  
  // XML 응답
  res.header('Content-Type', 'application/atom+xml; charset=utf-8');
  res.send(xml);
};

/**
 * XML 특수문자 이스케이프 헬퍼 함수
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
