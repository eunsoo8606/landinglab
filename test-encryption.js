require('dotenv').config();
const { encrypt, decrypt } = require('./utils/encryption');
const bcrypt = require('bcryptjs');

console.log('=== 암호화 테스트 ===\n');

// 1. AES-256-CBC 암호화 (개인정보용)
const testData = '123456';
console.log('원본 데이터:', testData);
console.log('');

// 여러 번 암호화하여 매번 다른 결과가 나오는지 확인
console.log('--- AES-256-CBC 암호화 (개인정보용) ---');
const encrypted1 = encrypt(testData);
const encrypted2 = encrypt(testData);
const encrypted3 = encrypt(testData);

console.log('암호화 결과 #1:', encrypted1);
console.log('암호화 결과 #2:', encrypted2);
console.log('암호화 결과 #3:', encrypted3);
console.log('');
console.log('💡 매번 다른 IV를 사용하므로 결과가 다릅니다.');
console.log('');

// 복호화 테스트
console.log('--- 복호화 테스트 ---');
console.log('복호화 결과 #1:', decrypt(encrypted1));
console.log('복호화 결과 #2:', decrypt(encrypted2));
console.log('복호화 결과 #3:', decrypt(encrypted3));
console.log('');

// 2. bcrypt 해싱 (비밀번호용)
console.log('--- bcrypt 해싱 (비밀번호용) ---');
const hash1 = bcrypt.hashSync(testData, 10);
const hash2 = bcrypt.hashSync(testData, 10);
const hash3 = bcrypt.hashSync(testData, 10);

console.log('해시 결과 #1:', hash1);
console.log('해시 결과 #2:', hash2);
console.log('해시 결과 #3:', hash3);
console.log('');
console.log('💡 매번 다른 salt를 사용하므로 결과가 다릅니다.');
console.log('');

// 비밀번호 검증 테스트
console.log('--- 비밀번호 검증 테스트 ---');
console.log('올바른 비밀번호 (123456):', bcrypt.compareSync('123456', hash1));
console.log('잘못된 비밀번호 (123457):', bcrypt.compareSync('123457', hash1));
console.log('');

console.log('=== 테스트 완료 ===');
