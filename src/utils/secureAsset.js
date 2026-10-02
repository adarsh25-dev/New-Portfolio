import { get as idbGet, set as idbSet } from 'idb-keyval';
import { gcm } from '@noble/ciphers/aes.js';
import assetManifest from './assetManifest.json';
import { ENCRYPTION_KEY_BASE64 } from './cryptoKey.js';

// In-memory cache for decrypted object URLs within the current page session
const blobUrlCache = new Map();
// In-flight fetch/decrypt promises to deduplicate concurrent requests
const inFlightPromises = new Map();

// Parse raw 32-byte key from base64
let rawKeyBytes = null;
let webCryptoKey = null;

function getKeyBytes() {
  if (!rawKeyBytes) {
    const binaryStr = atob(ENCRYPTION_KEY_BASE64);
    rawKeyBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      rawKeyBytes[i] = binaryStr.charCodeAt(i);
    }
  }
  return rawKeyBytes;
}

async function getWebCryptoKey() {
  if (webCryptoKey) return webCryptoKey;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      webCryptoKey = await window.crypto.subtle.importKey(
        'raw',
        getKeyBytes(),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      return webCryptoKey;
    } catch (e) {
      console.warn('WebCrypto key import failed, falling back to noble-ciphers:', e);
    }
  }
  return null;
}

/**
 * Decrypts a buffer using native WebCrypto (hardware accelerated) or noble-ciphers fallback
 */
async function decryptBuffer(encryptedBuffer) {
  const bytes = new Uint8Array(encryptedBuffer);
  const iv = bytes.subarray(0, 12);
  const ciphertextAndTag = bytes.subarray(12);

  // 1. Try native WebCrypto
  const key = await getWebCryptoKey();
  if (key) {
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertextAndTag
      );
      return decrypted;
    } catch (err) {
      console.warn('WebCrypto decryption error, attempting noble-ciphers fallback:', err);
    }
  }

  // 2. Fallback to @noble/ciphers (pure JS audited AES-GCM)
  const keyBytes = getKeyBytes();
  const aesGcm = gcm(keyBytes, iv);
  // noble decrypts [ciphertext + tag] directly
  const decryptedBytes = aesGcm.decrypt(ciphertextAndTag);
  return decryptedBytes.buffer;
}

/**
 * Loads and decrypts a secure asset, caching in IndexedDB and memory
 * @param {string} assetId - The logical ID of the asset (e.g. 'hero_bg', 'hero_vdo')
 * @returns {Promise<string>} The temporary blob: URL for the decrypted asset
 */
export async function loadSecureAsset(assetId) {
  // Check memory cache first
  if (blobUrlCache.has(assetId)) {
    return blobUrlCache.get(assetId);
  }

  // Deduplicate in-flight loading
  if (inFlightPromises.has(assetId)) {
    return inFlightPromises.get(assetId);
  }

  const meta = assetManifest[assetId];
  if (!meta) {
    console.error(`Asset ID "${assetId}" not found in manifest.`);
    return '';
  }

  const loadPromise = (async () => {
    try {
      const dbKey = `sec_blob_${assetId}_${meta.hash}`;

      // Check IndexedDB cache
      let cachedBlob = null;
      try {
        cachedBlob = await idbGet(dbKey);
      } catch (idbErr) {
        console.warn('IndexedDB read failed:', idbErr);
      }

      if (cachedBlob instanceof Blob) {
        const url = URL.createObjectURL(cachedBlob);
        blobUrlCache.set(assetId, url);
        inFlightPromises.delete(assetId);
        return url;
      }

      // Fetch encrypted file from network
      const response = await fetch(meta.path);
      if (!response.ok) {
        throw new Error(`Failed to fetch encrypted asset ${meta.path}: ${response.statusText}`);
      }

      const encryptedBuffer = await response.arrayBuffer();
      const decryptedBuffer = await decryptBuffer(encryptedBuffer);

      const blob = new Blob([decryptedBuffer], { type: meta.mime });
      const blobUrl = URL.createObjectURL(blob);
      blobUrlCache.set(assetId, blobUrl);

      // Asynchronously persist to IndexedDB
      try {
        await idbSet(dbKey, blob);
      } catch (idbSaveErr) {
        console.warn('IndexedDB write failed:', idbSaveErr);
      }

      inFlightPromises.delete(assetId);
      return blobUrl;
    } catch (err) {
      inFlightPromises.delete(assetId);
      console.error(`Error loading secure asset ${assetId}:`, err);
      // Fallback: If encrypted file failed, try loading original unencrypted asset if present
      if (meta.originalFile) {
        return `/assets/${meta.originalFile}`;
      }
      return '';
    }
  })();

  inFlightPromises.set(assetId, loadPromise);
  return loadPromise;
}

/**
 * Synchronously get already cached blob URL, or null if not yet loaded
 */
export function getCachedAssetUrl(assetId) {
  return blobUrlCache.get(assetId) || null;
}

/**
 * Helper to preload critical above-the-fold assets immediately
 */
export function preloadCriticalAssets() {
  const critical = ['hero_bg', 'hero_vdo', 'hero_suit', 'jacket', 'bgvideo'];
  return Promise.all(critical.map((id) => loadSecureAsset(id)));
}

/**
 * Injects decrypted background image into document CSS variable
 */
export async function applySecureCssBackground(assetId, cssVarName = '--hero-bg-blob') {
  try {
    const url = await loadSecureAsset(assetId);
    if (url && typeof document !== 'undefined') {
      document.documentElement.style.setProperty(cssVarName, `url("${url}")`);
    }
    return url;
  } catch (err) {
    console.warn(`Failed to apply secure CSS background ${assetId}:`, err);
  }
}
