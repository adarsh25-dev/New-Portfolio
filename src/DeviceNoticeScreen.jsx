import { useState } from "react";
import sigRaw from "./assets/signature.svg?raw";

// Inject clean class and prepare signature markup
const cleanSig = sigRaw
  .replace(/style="[^"]*"/g, "")
  .replace(/id="canvas"/g, 'class="dns-sig-svg"');

export default function DeviceNoticeScreen() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url =
        typeof window !== "undefined"
          ? window.location.href
          : "https://adarshparmar.dev";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <aside
      className="device-notice-root"
      aria-label="Desktop experience notice"
      role="region"
    >
      {/* Ambient blurred & grained background atmosphere */}
      <div className="dns-bg-layer" aria-hidden="true">
        <div className="dns-bg-image" />
        <div className="dns-glow-gold" />
        <div className="dns-glow-crimson" />
        <div className="dns-dark-overlay" />
        <div className="dns-grain" />
        <div className="dns-grain-coarse" />
      </div>

      {/* Borderless Centered Content */}
      <div className="dns-center-container">
        {/* Authentic Calligraphic Signature */}
        <div
          className="dns-sig-wrap"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: cleanSig }}
        />

        {/* Editorial Headline */}
        <h2 className="dns-headline">
          Best experienced on <span>desktop</span>.
        </h2>

        {/* Concise, non-techy, human copy */}
        <p className="dns-copy">
          This portfolio is crafted for large displays and cursor interaction.
          Please revisit on a computer to explore.
        </p>

        {/* Floating luxury action button */}
        <div className="dns-actions">
          <button
            type="button"
            className={`dns-copy-button ${copied ? "copied" : ""}`}
            onClick={handleCopyLink}
            aria-live="polite"
          >
            {copied ? (
              <>
                <svg
                  className="dns-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Link copied</span>
              </>
            ) : (
              <>
                <svg
                  className="dns-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Copy portfolio link</span>
              </>
            )}
          </button>
        </div>

        {/* Viewport requirement */}
        <div className="dns-viewport-note">
          <span>Requires ≥ 1024px viewport</span>
        </div>
      </div>
    </aside>
  );
}
