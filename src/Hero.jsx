import { useEffect, useRef, useState } from 'react';
import { useSecureAsset } from './hooks/useSecureAsset';

const rotatingWords = ['PRESENCE', 'DESIGN', 'IDEAS', 'SYSTEMS', 'VISION'];
const ROTATE_INTERVAL = 2500;
const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Roles', href: '#roles' },
  { label: 'Projects', href: '#projects' },
];

const fallbackHeroVideo = '/assets/hero_vdo-BiUQ78eI.mp4';

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [atBottom, setAtBottom] = useState(false);
  const [cueHidden, setCueHidden] = useState(false);

  const thumbVidRef = useRef(null);
  const modalVidRef = useRef(null);
  const sectionRef = useRef(null);
  const { url: videoUrl } = useSecureAsset('hero_vdo');

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let ticking = 0;

    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const scrollHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, scrollHeight - vh);
      const sec = sectionRef.current;
      const secTop = sec ? sec.getBoundingClientRect().top + window.scrollY : 0;
      const blur = Math.min(1, Math.max(0, (window.scrollY - secTop) / (vh * 0.6)));
      document.documentElement.style.setProperty('--hero-blur', blur.toFixed(4));

      const revealSec = document.querySelector('.reveal-section');
      setCueHidden((revealSec ? -revealSec.getBoundingClientRect().top : window.scrollY) > vh * 0.6);

      const pageProg = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      document.documentElement.style.setProperty('--page-progress', pageProg.toFixed(4));
      setAtBottom(pageProg > 0.92);
      ticking = 0;
    };

    const queueScroll = () => {
      ticking ||= requestAnimationFrame(onScroll);
    };

    onScroll();
    window.addEventListener('scroll', queueScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', queueScroll);
      window.removeEventListener('resize', onScroll);
      if (ticking) cancelAnimationFrame(ticking);
    };
  }, []);

  useEffect(() => {
    const thumb = thumbVidRef.current;
    const modal = modalVidRef.current;
    if (thumb) {
      if (modalOpen && modal) {
        try {
          modal.currentTime = thumb.currentTime;
        } catch {}
        modal.muted = false;
        modal.volume = 1;
        modal.play().catch(() => {});
      }
      thumb.muted = true;
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleNavClick = (href) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const targetId = href.replace('#', '');

    const scrollToTarget = (y) => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(y, { duration: 1.2 });
      } else {
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    setTimeout(() => {
      if (targetId === 'top') {
        scrollToTarget(0);
        return;
      }
      if (targetId.toLowerCase() === 'contact') {
        const blobWrap = document.querySelector('.contact-blob-wrap');
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (blobWrap) {
          const top = blobWrap.getBoundingClientRect().top + window.scrollY;
          scrollToTarget(prefersReduced ? top : top + window.innerHeight * 1.3 * 0.95);
          return;
        }
      }
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        scrollToTarget(targetEl.getBoundingClientRect().top + window.scrollY);
      }
    }, 120);
  };

  return (
    <>
      <header className="site-nav">
        <button
          className="nav-btn nav-menu"
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true">
            <line x1="0" y1="2" x2="22" y2="2" stroke="currentColor" strokeWidth="1.4" />
            <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span>Menu</span>
        </button>

        <a href="#top" className="nav-logo" onClick={handleNavClick('#top')}>
          <span className="logo-from">Adarsh</span>
          <span className="logo-another">Parmar</span>
        </a>

        <div className="nav-right">
          <a
            href="https://cal.com/adarshparmar/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn nav-chat"
            aria-label="Book a call"
          >
            <span>Book a call</span>
            <span className="nav-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <section className="hero" id="top" ref={sectionRef}>
        <h1 className="hero-headline">
          NOT JUST<br />
          WEBSITES — <span className="curve-anchor">I</span><br />
          BUILD{' '}
          <button
            type="button"
            className="hero-vid-btn"
            onClick={() => setModalOpen(true)}
            aria-label="Play showreel with sound"
          >
            <video
              ref={thumbVidRef}
              src={videoUrl || fallbackHeroVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onContextMenu={(e) => e.preventDefault()}
            />
          </button>
          <br />
          <span className="hero-rotating-word" key={wordIndex}>
            {rotatingWords[wordIndex]}
          </span>
        </h1>
      </section>

      <button
        type="button"
        className={`hero-scroll-cue${atBottom ? ' is-at-bottom' : ''}${cueHidden ? ' is-hidden' : ''}`}
        onClick={() => {
          if (atBottom) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
          }
        }}
        aria-label={atBottom ? 'Back to top' : 'Scroll down'}
      >
        <span className="cue-dot" />
        <span className="cue-line" />
      </button>

      <div
        className={`menu-overlay${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        >
          <span>Close</span>
          <svg
            className="menu-close-x"
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

        <nav className="menu-nav" aria-label="Primary">
          <ul>
            {navItems.map((item, idx) => (
              <li key={item.href} style={{ '--menu-i': idx }}>
                <a
                  href={item.href}
                  className="menu-link"
                  onClick={handleNavClick(item.href)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-contact" style={{ '--menu-i': navItems.length }}>
          <span className="menu-contact-label">
            Reach out to me
          </span>
          <a
            href="mailto:adarshparmar.dev@gmail.com"
            className="menu-contact-email"
            tabIndex={menuOpen ? 0 : -1}
          >
            adarshparmar.dev@gmail.com
          </a>
          <a
            href="tel:+919724397749"
            className="menu-contact-phone"
            tabIndex={menuOpen ? 0 : -1}
          >
            +91 9724397749
          </a>
          <div className="menu-socials">
            <a
              href="https://www.linkedin.com/in/adarsh-parmar-161960288"
              target="_blank"
              rel="noreferrer"
              tabIndex={menuOpen ? 0 : -1}
              aria-label="LinkedIn"
            >
              LinkedIn ↗
            </a>
            <span className="menu-social-sep" aria-hidden="true">•</span>
            <a
              href="https://github.com/adarsh25-dev"
              target="_blank"
              rel="noreferrer"
              tabIndex={menuOpen ? 0 : -1}
              aria-label="GitHub"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="hero-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
        >
          <button
            type="button"
            className="hero-modal-close"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(false);
            }}
            aria-label="Close video"
          >
            ×
          </button>
          <video
            ref={modalVidRef}
            src={videoUrl || fallbackHeroVideo}
            autoPlay
            loop
            playsInline
            controls={false}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      )}
    </>
  );
}
