import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import IntroLoader from './IntroLoader';
import ScrollBackground from './ScrollBackground';
import FixedVideoBg from './FixedVideoBg';
import HeroReveal from './HeroReveal';
import DiveIntro from './DiveIntro';
import ScrollCurve from './ScrollCurve';
import Hero from './Hero';
import Roles from './Roles';
import FeaturedWorks from './FeaturedWorks';
import Contact from './Contact';
import Footer from './Footer';
import DeviceNoticeScreen from './DeviceNoticeScreen';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth > 1024 : true;
  });

  const [showIntro, setShowIntro] = useState(!prefersReducedMotion);
  const [studioReached, setStudioReached] = useState(false);
  const curveRegionRef = useRef(null);
  const studioRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // Lock scroll while intro plays
  useEffect(() => {
    if (!showIntro) return;
    window.scrollTo(0, 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showIntro]);

  // Roles section in-view triggers the background zoom
  useEffect(() => {
    const el = studioRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStudioReached(entry.isIntersecting || entry.boundingClientRect.top < 0);
      },
      { rootMargin: '-35% 0px -35% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Boot Lenis after intro (desktop only)
  useEffect(() => {
    if (showIntro || !isDesktop) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', ScrollTrigger.update);

    let id = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    });

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(id);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, [showIntro, isDesktop]);

  return (
    <>
      <DeviceNoticeScreen />
      {showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
      <ScrollBackground zoomed={studioReached} />
      <FixedVideoBg />
      <div className="reveal-bg" aria-hidden="true" />
      <main className="site-main">
        <div className="hero-shift">
          <HeroReveal />
        </div>
        <DiveIntro />
        <div className="curve-region" ref={curveRegionRef}>
          <ScrollCurve regionRef={curveRegionRef} />
          <Hero />
          <Roles ref={studioRef} />
        </div>
        <FeaturedWorks />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
