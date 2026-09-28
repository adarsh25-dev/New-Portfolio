import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const HEIGHT_RATIO = 0.56;
let measureCanvas = null;

function measureAscentRatio(text) {
  measureCanvas ||= document.createElement('canvas').getContext('2d');
  measureCanvas.font = '900 100px "Archivo", system-ui, sans-serif';
  return (measureCanvas.measureText(text).actualBoundingBoxAscent ?? 72) / 100;
}

export default function Footer() {
  const sectionRef = useRef(null);
  const wordmarkRef = useRef(null);

  useLayoutEffect(() => {
    const wordmark = wordmarkRef.current;
    if (!wordmark) return;

    const fitFontSize = () => {
      wordmark.style.fontSize = '100px';
      const scrollW = wordmark.scrollWidth;
      if (scrollW) {
        wordmark.style.fontSize = `${(window.innerWidth / scrollW) * 100}px`;
      }
    };

    fitFontSize();

    const onResize = () => {
      fitFontSize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', onResize);
    let cancelled = false;
    document.fonts?.ready &&
      document.fonts.ready.then(() => {
        if (!cancelled) {
          fitFontSize();
          ScrollTrigger.refresh();
        }
      });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmarkRef.current,
        { scaleY: 0 },
        {
          scaleY: () => {
            const el = wordmarkRef.current;
            const capHeight = parseFloat(getComputedStyle(el).fontSize) * measureAscentRatio(el.textContent);
            return capHeight ? (window.innerHeight * HEIGHT_RATIO) / capHeight : 1;
          },
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = setTimeout(refresh, 600);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section className="footer-reveal" ref={sectionRef} aria-label="End">
      <div className="footer-panel">
        <h2 ref={wordmarkRef} className="footer-wordmark">
          PARMAR
        </h2>
      </div>
    </section>
  );
}
