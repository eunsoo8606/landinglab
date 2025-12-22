const { getPostsData } = require('./homeController');

/**
 * Sitemap.xml 생성
 */
exports.getSitemap = (req, res) => {
  const baseUrl = 'https://langdinglab.com';
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
  const baseUrl = 'https://langdinglab.com';
  
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
 * RSS Feed 생성 (RSS 2.0 형식)
 */
exports.getRssFeed = (req, res) => {
  const baseUrl = 'https://langdinglab.com';
  const posts = getPostsData();
  const currentDate = new Date();
  
  // RFC 822 날짜 형식으로 변환하는 헬퍼 함수
  const toRFC822 = (date) => {
    const d = date ? new Date(date) : currentDate;
    return d.toUTCString();
  };
  
  // RSS 2.0 Feed XML 생성
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  xml += '  <channel>\n';
  xml += '    <title>랜딩랩 블로그</title>\n';
  xml += `    <link>${baseUrl}/posts</link>\n`;
  xml += '    <description>GA4, SEO 최적화, 반응형 웹 디자인, 랜딩페이지 제작 전략 등 웹 개발과 마케팅 정보</description>\n';
  xml += '    <language>ko</language>\n';
  xml += `    <lastBuildDate>${toRFC822(currentDate)}</lastBuildDate>\n`;
  xml += `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`;
  xml += '    <managingEditor>landing.lab0@gmail.com (랜딩랩)</managingEditor>\n';
  xml += '    <webMaster>landing.lab0@gmail.com (랜딩랩)</webMaster>\n';
  
  // 각 포스트를 item으로 추가
  posts.forEach(post => {
    const postUrl = `${baseUrl}/posts/${post.id}`;
    const postDate = toRFC822(post.date);
    
    xml += '    <item>\n';
    xml += `      <title>${escapeXml(post.title)}</title>\n`;
    xml += `      <link>${postUrl}</link>\n`;
    xml += `      <guid isPermaLink="true">${postUrl}</guid>\n`;
    xml += `      <description>${escapeXml(post.description)}</description>\n`;
    xml += `      <pubDate>${postDate}</pubDate>\n`;
    xml += `      <author>landing.lab0@gmail.com (${escapeXml(post.author)})</author>\n`;
    
    // 카테고리 추가
    if (post.category) {
      xml += `      <category>${escapeXml(post.category)}</category>\n`;
    }
    
    // 태그 추가
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => {
        xml += `      <category>${escapeXml(tag)}</category>\n`;
      });
    }
    
    xml += '    </item>\n';
  });
  
  xml += '  </channel>\n';
  xml += '</rss>';
  
  // XML 응답
  res.header('Content-Type', 'application/rss+xml; charset=utf-8');
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
