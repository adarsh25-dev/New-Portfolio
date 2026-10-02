import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const phoneNumber = '+91 9724397749';
const emailAddress = 'adarshparmar.dev@gmail.com';
const rotatingTerms = ['impact', 'visions', 'systems', 'ideas'];

const socialIcons = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4z" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  ),
};

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adarsh-parmar-161960288' },
  { label: 'GitHub', href: 'https://github.com/adarsh25-dev' },
];

export default function Contact() {
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % rotatingTerms.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const revealBg = document.querySelector('.reveal-bg');
    const panel = panelRef.current;
    if (!wrap || !revealBg || !panel) return;

    const maxRadius = () => Math.hypot(window.innerWidth / 2, window.innerHeight) + 140;
    const setClip = (r) => {
      revealBg.style.clipPath = `circle(${r}px at 50% 100%)`;
      revealBg.style.webkitClipPath = `circle(${r}px at 50% 100%)`;
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setClip(maxRadius());
      gsap.set(panel, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const state = { p: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=130%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        state,
        {
          p: 1,
          ease: 'none',
          duration: 1,
          onUpdate: () => setClip(state.p * maxRadius()),
        },
        0
      );

      tl.fromTo(
        panel,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: 0.4 },
        0.55
      );
    }, wrap);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = setTimeout(refresh, 600);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
      ctx.revert();
      setClip(0);
    };
  }, []);

  return (
    <section className="contact-reveal" aria-label="Contact">
      <div className="contact-blob-wrap" ref={wrapRef}>
        <div className="contact-panel" ref={panelRef} id="contact">
          <h2 className="cr-heading">
            Let’s build
            <br />
            <span className="cr-rotate" key={wordIdx}>
              {rotatingTerms[wordIdx]}
            </span>
            <br />
            together
          </h2>
          <div className="cr-right">
            <div className="cr-direct">
              <a className="cr-email" href={`mailto:${emailAddress}`}>
                {emailAddress}
              </a>
              <a className="cr-phone" href={`tel:${phoneNumber.replace(/\s+/g, '')}`}>
                {phoneNumber}
              </a>
            </div>
            <ul className="cr-socials">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                  >
                    {socialIcons[item.label]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
