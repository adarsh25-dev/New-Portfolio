import { useEffect, useState } from 'react';

const emailAddress = 'adarshparmar.dev@gmail.com';
const phoneNumber = '+91 9724397749';
const rotatingTerms = ['impact', 'visions', 'systems', 'products', 'ideas'];

const chatLinks = [
  {
    label: 'Book a Call ↗',
    href: 'https://cal.com/adarshparmar/15min',
    external: true,
  },
  {
    label: 'Send Email',
    href: `mailto:${emailAddress}?subject=Let's%20build%20something%20together`,
  },
  {
    label: 'Call Direct',
    href: `tel:${phoneNumber.replace(/\s+/g, '')}`,
  },
  {
    label: 'LinkedIn ↗',
    href: 'https://www.linkedin.com/in/adarsh-parmar-161960288',
    external: true,
  },
];

export default function LetsChatOverlay({ isOpen, onClose }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % rotatingTerms.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const handleCopy = async (text, key, e) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      // silent fallback
    }
  };

  return (
    <div
      className={`chat-overlay${isOpen ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label="Book a call"
    >
      <button
        type="button"
        className="chat-close"
        onClick={onClose}
        aria-label="Close Book a call"
        tabIndex={isOpen ? 0 : -1}
      >
        <span>Close</span>
        <svg
          className="chat-close-x"
          viewBox="0 0 14 14"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="2" y1="2" x2="12" y2="12" />
          <line x1="12" y1="2" x2="2" y2="12" />
        </svg>
      </button>

      <div className="chat-content-wrap">
        {/* Status Eyebrow & Headline */}
        <div className="chat-header">
          <div className="chat-status-pill">
            <span className="chat-status-dot" aria-hidden="true">
              <span className="chat-dot-core" />
              <span className="chat-dot-ping" />
            </span>
            <span className="chat-status-text">Open for opportunities</span>
            <span className="chat-status-sep" aria-hidden="true">•</span>
            <span className="chat-status-loc">Worldwide</span>
          </div>

          <h2 className="chat-title-phrase">
            Let’s build{' '}
            <span className="chat-phrase-rotate" key={wordIdx}>
              {rotatingTerms[wordIdx]}
            </span>{' '}
            together
          </h2>
        </div>

        {/* Monumental Links with Peer-Blur */}
        <nav className="chat-links-nav" aria-label="Book a call navigation">
          <ul>
            {chatLinks.map((item, idx) => (
              <li key={item.label} style={{ '--c-i': idx }} className="chat-link-item">
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="chat-link"
                  tabIndex={isOpen ? 0 : -1}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Direct Contact Block identical to Menu layout */}
        <div className="chat-contact-footer">
          <span className="chat-contact-label">Reach out to me</span>

          <div className="chat-direct-actions">
            <div className="chat-direct-row">
              <a
                href={`mailto:${emailAddress}`}
                className="chat-contact-email"
                tabIndex={isOpen ? 0 : -1}
              >
                {emailAddress}
              </a>
              <button
                type="button"
                className={`chat-copy-pill ${copiedKey === 'email' ? 'is-copied' : ''}`}
                onClick={(e) => handleCopy(emailAddress, 'email', e)}
                tabIndex={isOpen ? 0 : -1}
                aria-label="Copy email address"
              >
                {copiedKey === 'email' ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

            <div className="chat-direct-row">
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                className="chat-contact-phone"
                tabIndex={isOpen ? 0 : -1}
              >
                {phoneNumber}
              </a>
              <button
                type="button"
                className={`chat-copy-pill ${copiedKey === 'phone' ? 'is-copied' : ''}`}
                onClick={(e) => handleCopy(phoneNumber, 'phone', e)}
                tabIndex={isOpen ? 0 : -1}
                aria-label="Copy phone number"
              >
                {copiedKey === 'phone' ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="chat-socials-row">
            <a
              href="https://www.linkedin.com/in/adarsh-parmar-161960288"
              target="_blank"
              rel="noreferrer"
              tabIndex={isOpen ? 0 : -1}
              aria-label="LinkedIn"
            >
              LinkedIn ↗
            </a>
            <span className="chat-social-sep" aria-hidden="true">•</span>
            <a
              href="https://github.com/adarsh25-dev"
              target="_blank"
              rel="noreferrer"
              tabIndex={isOpen ? 0 : -1}
              aria-label="GitHub"
            >
              GitHub ↗
            </a>
            <span className="chat-social-sep" aria-hidden="true">•</span>
            <span className="chat-tz-badge">IST (UTC+5:30)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
