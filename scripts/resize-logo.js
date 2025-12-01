const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// scripts 폴더 내부에 있으므로 상위 폴더(..)로 이동 후 public 접근
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const logoPath = path.join(imagesDir, 'logo.webp');

async function resizeLogo() {
  try {
    if (!fs.existsSync(logoPath)) {
      console.error('Logo file not found:', logoPath);
      return;
    }

    // 메타데이터 확인
    const metadata = await sharp(logoPath).metadata();
    console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

    // 1x 버전 생성 (너비 240px)
    await sharp(logoPath)
      .resize(240)
      .toFile(path.join(imagesDir, 'logo-1x.webp'));
    console.log('Created logo-1x.webp (width: 240px)');

    // 2x 버전은 원본 사용 (또는 필요시 리사이징)
    // 원본이 약 450px라면 2x용으로 적절함
    // 명시적으로 logo-2x.webp로 복사하거나 리사이징
    await sharp(logoPath)
      .resize(480) // 2x용으로 약간 업스케일링되거나 비슷하게 유지
      .toFile(path.join(imagesDir, 'logo-2x.webp'));
    console.log('Created logo-2x.webp (width: 480px)');

  } catch (error) {
    console.error('Error resizing logo:', error);
  }
}

resizeLogo();
