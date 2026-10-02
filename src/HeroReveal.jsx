import { useEffect, useRef, useState, useCallback } from 'react';
import { useSecureAsset } from './hooks/useSecureAsset';

const fallbackJacketImg = '/assets/jacket-ChiCZOcV.jpg';
const fallbackHeroImg = '/assets/hero-Cw4fjYfy.png';

export default function HeroReveal() {
  const btnRef = useRef(null);
  const [active, setActive] = useState(false);
  const [forced, setForced] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { url: jacketUrl } = useSecureAsset('jacket');
  const { url: heroSuitUrl } = useSecureAsset('hero_suit');

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const checkMotion = () => setReducedMotion(media.matches);
    checkMotion();
    media.addEventListener('change', checkMotion);
    return () => media.removeEventListener('change', checkMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const shiftEl = btnRef.current?.parentElement; // .reveal-section
    const heroShiftEl = shiftEl?.parentElement; // .hero-shift
    if (!shiftEl || !heroShiftEl) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const vh = window.innerHeight;
      const scrollable = Math.max(1, heroShiftEl.offsetHeight - vh);
      const progress = Math.min(1, Math.max(0, -heroShiftEl.getBoundingClientRect().top / scrollable));
      const eased = progress * progress;
      shiftEl.style.filter = `brightness(${(1 - eased * 0.55).toFixed(3)})`;
      shiftEl.style.visibility = progress >= 1 ? 'hidden' : 'visible';
      shiftEl.style.pointerEvents = progress > 0.5 ? 'none' : '';
    };

    const onScroll = () => {
      rafId ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (rafId) cancelAnimationFrame(rafId);
      shiftEl.style.transform = '';
      shiftEl.style.filter = '';
      shiftEl.style.visibility = '';
      shiftEl.style.pointerEvents = '';
    };
  }, [reducedMotion]);

  const updatePos = useCallback((clientX, clientY) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${clientX - rect.left}px`);
    el.style.setProperty('--my', `${clientY - rect.top}px`);
  }, []);

  const onMouseEnter = useCallback(
    (e) => {
      updatePos(e.clientX, e.clientY);
      setActive(true);
    },
    [updatePos]
  );

  const onMouseMove = useCallback(
    (e) => {
      updatePos(e.clientX, e.clientY);
    },
    [updatePos]
  );

  const onMouseLeave = useCallback(() => {
    setActive(false);
  }, []);

  const onTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      if (touch) {
        updatePos(touch.clientX, touch.clientY);
        setActive(true);
      }
    },
    [updatePos]
  );

  const onTouchMove = useCallback(
    (e) => {
      const touch = e.touches[0];
      if (touch) {
        updatePos(touch.clientX, touch.clientY);
        setActive(true);
      }
    },
    [updatePos]
  );

  const onTouchEnd = useCallback(() => {
    setActive(false);
  }, []);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setForced((prev) => !prev);
    }
  }, []);

  return (
    <section className="reveal-section" aria-label="Featured portrait">
      <button
        ref={btnRef}
        type="button"
        className={`reveal${active ? ' is-active' : ''}${forced ? ' is-forced' : ''}`}
        aria-pressed={forced}
        aria-label={
          forced
            ? 'Suit revealed — press to hide'
            : 'Move the pointer to reveal the suit, or press to reveal it fully'
        }
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
      >
        <img
          className="reveal-img reveal-base"
          src={jacketUrl || fallbackJacketImg}
          alt="Portrait wearing a black jacket"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
        <img
          className="reveal-img reveal-top"
          src={heroSuitUrl || fallbackHeroImg}
          alt=""
          loading="lazy"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
        <svg
          className="reveal-shape"
          aria-hidden="true"
          focusable="false"
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id="amoebaDistort"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="turbulence"
                baseFrequency="0.013"
                numOctaves="2"
                seed="4"
                result="noise"
              >
                {!reducedMotion && (
                  <animate
                    attributeName="baseFrequency"
                    dur="12s"
                    values="0.009;0.018;0.012;0.009"
                    repeatCount="indefinite"
                  />
                )}
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="60"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <mask id="revealMask">
              <g filter="url(#amoebaDistort)">
                <circle className="reveal-mask-shape" fill="#fff" />
              </g>
            </mask>
          </defs>
          <g className="reveal-edge-glow">
            <circle className="reveal-edge" filter="url(#amoebaDistort)" />
          </g>
        </svg>
        <span className="reveal-scrim reveal-scrim-top" aria-hidden="true" />
        <span className="reveal-scrim reveal-scrim-bottom" aria-hidden="true" />
        <div className="reveal-caption" aria-hidden="true">
          <span className="reveal-caption-base">Casual — hover to suit up</span>
          <span className="reveal-caption-top">Tailored — engineered for precision</span>
        </div>
      </button>
    </section>
  );
}
