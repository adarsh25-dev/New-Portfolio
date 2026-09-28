import { useEffect, useRef } from 'react';
import './VariableFontText.css';

const DEFAULTS = {
  thinWght: 100,
  thinWdth: 25,
  boldWght: 820,
  boldWdth: 151,
  entranceDuration: 0.9,
  entranceEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  stagger: 0.045,
  pinchRadius: 150,
  hoverTransition: '0.25s ease-out',
  inViewThreshold: 0.6,
};

const NBSP = '\u00A0';
const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const formatVariationSettings = (wght, wdth) => `"wght" ${wght}, "wdth" ${wdth}`;

export default function VariableFontText({
  text,
  as: Component = 'span',
  className = '',
  thinWght = DEFAULTS.thinWght,
  thinWdth = DEFAULTS.thinWdth,
  boldWght = DEFAULTS.boldWght,
  boldWdth = DEFAULTS.boldWdth,
  entranceDuration = DEFAULTS.entranceDuration,
  entranceEasing = DEFAULTS.entranceEasing,
  stagger = DEFAULTS.stagger,
  pinchRadius = DEFAULTS.pinchRadius,
  hoverTransition = DEFAULTS.hoverTransition,
  inViewThreshold = DEFAULTS.inViewThreshold,
  ...restProps
}) {
  const rootRef = useRef(null);
  const chars = [...text];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const letters = Array.from(el.querySelectorAll('[data-vft-letter]'));
    if (!letters.length) return;

    if (prefersReduced) {
      letters.forEach((l) => {
        l.style.fontVariationSettings = formatVariationSettings(boldWght, boldWdth);
      });
      return;
    }

    letters.forEach((l) => {
      l.style.transition = 'none';
      l.style.transitionDelay = '0s';
      l.style.fontVariationSettings = formatVariationSettings(thinWght, thinWdth);
    });

    let interactive = false;
    let entranceTimer = 0;
    let inView = false;
    let rafId = 0;
    let lastEvent = null;

    const playEntrance = () => {
      interactive = false;
      if (entranceTimer) clearTimeout(entranceTimer);

      letters.forEach((l) => {
        l.style.transition = 'none';
        l.style.transitionDelay = '0s';
        l.style.fontVariationSettings = formatVariationSettings(thinWght, thinWdth);
      });

      // Force reflow
      void el.offsetWidth;

      letters.forEach((l, idx) => {
        l.style.transition = `font-variation-settings ${entranceDuration}s ${entranceEasing}`;
        l.style.transitionDelay = `${idx * stagger}s`;
        l.style.fontVariationSettings = formatVariationSettings(boldWght, boldWdth);
      });

      const totalTime = (entranceDuration + stagger * (letters.length - 1)) * 1000 + 30;
      entranceTimer = window.setTimeout(() => {
        interactive = true;
        letters.forEach((l) => {
          l.style.transition = `font-variation-settings ${hoverTransition}`;
          l.style.transitionDelay = '0s';
        });
      }, totalTime);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !inView) {
            inView = true;
            playEntrance();
          } else if (!entry.isIntersecting && inView) {
            inView = false;
            interactive = false;
            if (entranceTimer) {
              clearTimeout(entranceTimer);
              entranceTimer = 0;
            }
          }
        }
      },
      { threshold: inViewThreshold }
    );
    observer.observe(el);

    const updateWeights = () => {
      rafId = 0;
      const e = lastEvent;
      if (!e) return;
      const rects = letters.map((l) => l.getBoundingClientRect());

      for (let i = 0; i < letters.length; i++) {
        const r = rects[i];
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const factor = Math.max(0, 1 - dist / pinchRadius);
        const wght = Math.round(boldWght + (thinWght - boldWght) * factor);
        const wdth = (boldWdth + (thinWdth - boldWdth) * factor).toFixed(2);
        letters[i].style.fontVariationSettings = formatVariationSettings(wght, wdth);
      }
    };

    const onMouseMove = (e) => {
      if (interactive) {
        lastEvent = e;
        rafId ||= requestAnimationFrame(updateWeights);
      }
    };

    const onMouseLeave = () => {
      if (interactive) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        lastEvent = null;
        letters.forEach((l) => {
          l.style.fontVariationSettings = formatVariationSettings(boldWght, boldWdth);
        });
      }
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (entranceTimer) clearTimeout(entranceTimer);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [
    text,
    thinWght,
    thinWdth,
    boldWght,
    boldWdth,
    entranceDuration,
    entranceEasing,
    stagger,
    pinchRadius,
    hoverTransition,
    inViewThreshold,
  ]);

  const initialSettings = prefersReduced
    ? formatVariationSettings(boldWght, boldWdth)
    : formatVariationSettings(thinWght, thinWdth);

  return (
    <Component
      ref={rootRef}
      className={`vft ${className}`.trim()}
      data-variable-font-text=""
      {...restProps}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          data-vft-letter=""
          className="vft-letter"
          style={{ fontVariationSettings: initialSettings }}
        >
          {char === ' ' ? NBSP : char}
        </span>
      ))}
    </Component>
  );
}
