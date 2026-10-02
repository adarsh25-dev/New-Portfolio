import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets');
const OUTPUT_DIR = path.join(PUBLIC_ASSETS_DIR, 'secure');
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'utils', 'assetManifest.json');
const CRYPTO_KEY_PATH = path.join(ROOT_DIR, 'src', 'utils', 'cryptoKey.js');

// 32-byte key derived deterministically or stored securely
const APP_SECRET_SEED = 'pp-adarsh-portfolio-vault-v1-key-salt-2026';
const DERIVED_KEY = crypto.scryptSync(APP_SECRET_SEED, 'pp-salt-secure-assets', 32);

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const UTILS_DIR = path.join(ROOT_DIR, 'src', 'utils');
if (!fs.existsSync(UTILS_DIR)) {
  fs.mkdirSync(UTILS_DIR, { recursive: true });
}

// Media assets list
const ASSETS = [
  // Images
  { id: 'hero_bg', file: 'hero_bg-CfSw2las.png', type: 'image', mime: 'image/webp' },
  { id: 'hero_suit', file: 'hero-Cw4fjYfy.png', type: 'image', mime: 'image/webp' },
  { id: 'jacket', file: 'jacket-ChiCZOcV.jpg', type: 'image', mime: 'image/webp' },
  { id: 'procrastinator', file: 'procrastinator-CdjJLjP4.png', type: 'image', mime: 'image/webp' },
  { id: 'nanoFactz', file: 'nanoFactz-1Es8Qbot.png', type: 'image', mime: 'image/webp' },
  // Videos
  { id: 'bgvideo', file: 'bgvideo-WLnX9sPP.mp4', type: 'video', mime: 'video/mp4' },
  { id: 'hero_vdo', file: 'hero_vdo-BiUQ78eI.mp4', type: 'video', mime: 'video/mp4' },
  { id: 'creative', file: 'creative-CrXiI4kt.mp4', type: 'video', mime: 'video/mp4' },
  { id: 'hushMeet', file: 'hushMeet-CGzQG0sJ.mp4', type: 'video', mime: 'video/mp4' }
];

function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(12); // 12-byte IV for AES-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', DERIVED_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag(); // 16 bytes auth tag
  // Format: [12 bytes IV] + [Encrypted Ciphertext] + [16 bytes Auth Tag]
  // Standard format for window.crypto.subtle.decrypt
  return Buffer.concat([iv, encrypted, authTag]);
}

async function processAssets() {
  console.log('🚀 Starting asset compression & encryption pipeline...\n');
  const manifest = {};
  let originalTotal = 0;
  let compressedTotal = 0;

  for (const item of ASSETS) {
    const inputPath = path.join(PUBLIC_ASSETS_DIR, item.file);
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Warning: ${item.file} not found, skipping.`);
      continue;
    }

    const originalStats = fs.statSync(inputPath);
    originalTotal += originalStats.size;

    let processedBuffer;
    if (item.type === 'image') {
      // Compress image to WebP with sharp
      console.log(`🖼️  Compressing ${item.file} (${(originalStats.size / (1024 * 1024)).toFixed(2)} MB)...`);
      processedBuffer = await sharp(inputPath)
        .webp({ quality: 88, effort: 6 })
        .toBuffer();
    } else {
      // Videos are encrypted directly
      console.log(`🎬 Encrypting video ${item.file} (${(originalStats.size / (1024 * 1024)).toFixed(2)} MB)...`);
      processedBuffer = fs.readFileSync(inputPath);
    }

    // Encrypt payload
    const encryptedBuffer = encryptBuffer(processedBuffer);
    compressedTotal += encryptedBuffer.length;

    // Obfuscated output file name
    const obfuscatedName = `${item.id}_${crypto.createHash('md5').update(item.id + APP_SECRET_SEED).digest('hex').slice(0, 8)}.enc`;
    const outputPath = path.join(OUTPUT_DIR, obfuscatedName);
    fs.writeFileSync(outputPath, encryptedBuffer);

    const hash = crypto.createHash('sha256').update(encryptedBuffer).digest('hex').slice(0, 16);

    manifest[item.id] = {
      path: `/assets/secure/${obfuscatedName}`,
      mime: item.mime,
      type: item.type,
      originalFile: item.file,
      hash,
      size: encryptedBuffer.length
    };

    const ratio = ((1 - (encryptedBuffer.length / originalStats.size)) * 100).toFixed(1);
    console.log(`   -> Created ${obfuscatedName} (${(encryptedBuffer.length / (1024 * 1024)).toFixed(2)} MB, savings: ${ratio}%)\n`);
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`📝 Manifest written to ${MANIFEST_PATH}`);

  // Write frontend cryptoKey helper
  const keyBase64 = DERIVED_KEY.toString('base64');
  const keyFileContent = `// Auto-generated cryptographic key for client asset decryption
export const ENCRYPTION_KEY_BASE64 = '${keyBase64}';
`;
  fs.writeFileSync(CRYPTO_KEY_PATH, keyFileContent);
  console.log(`🔑 Client key configuration written to ${CRYPTO_KEY_PATH}`);

  console.log('\n=============================================');
  console.log(`Total Original Assets:   ${(originalTotal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total Encrypted Assets:  ${(compressedTotal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Net Compression Savings: ${(((originalTotal - compressedTotal) / originalTotal) * 100).toFixed(1)}%`);
  console.log('=============================================\n');
}

processAssets().catch(err => {
  console.error('❌ Pipeline failed:', err);
  process.exit(1);
});
