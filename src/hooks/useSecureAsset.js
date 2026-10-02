import { useState, useEffect } from 'react';
import { loadSecureAsset, getCachedAssetUrl } from '../utils/secureAsset';

/**
 * Custom React hook for consuming an encrypted media asset.
 * Handles instant synchronous return if already cached, async decryption, and optional lazy loading.
 *
 * @param {string} assetId - The logical asset identifier in assetManifest.json
 * @param {object} [options]
 * @param {boolean} [options.lazy=false] - Whether to delay loading until triggered
 * @param {boolean} [options.trigger=true] - External trigger condition (e.g. when visible)
 * @returns {{ url: string | null, loading: boolean, error: any }}
 */
export function useSecureAsset(assetId, options = {}) {
  const { lazy = false, trigger = true } = options;

  const [url, setUrl] = useState(() => getCachedAssetUrl(assetId));
  const [loading, setLoading] = useState(() => !getCachedAssetUrl(assetId));
  const [error, setError] = useState(null);

  useEffect(() => {
    // If already resolved in memory, nothing to do
    const cached = getCachedAssetUrl(assetId);
    if (cached) {
      return;
    }

    // If lazy and trigger is false, wait for trigger
    if (lazy && !trigger) {
      return;
    }

    let isMounted = true;

    loadSecureAsset(assetId)
      .then((blobUrl) => {
        if (isMounted) {
          setUrl(blobUrl);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [assetId, lazy, trigger]);

  return { url, loading, error };
}
