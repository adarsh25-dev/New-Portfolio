import { useEffect, useRef, useState } from 'react';
import './FixedVideoBg.css';

const heroVideo = '/assets/hero_vdo-BiUQ78eI.mp4';

export default function FixedVideoBg() {
  const [active, setActive] = useState(false);
  const rafId = useRef(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const vid = videoRef.current;
    const diveVid = document.querySelector('.dive-video');
    if (vid && diveVid) {
      try {
        vid.currentTime = diveVid.currentTime;
      } catch {}
    }
  }, [active]);

  useEffect(() => {
    const update = () => {
      const diveSec = document.querySelector('.dive-section');
      if (diveSec) {
        const diveProg = parseFloat(getComputedStyle(diveSec).getPropertyValue('--dive-progress')) || 0;
        const rect = diveSec.getBoundingClientRect();
        const vh = window.innerHeight;
        const stillInView = rect.bottom > vh;
        setActive(diveProg > 0.06 && stillInView);
      }
      rafId.current = 0;
    };

    const onScroll = () => {
      rafId.current ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className={`fvb-root${active ? ' is-active' : ''}`} aria-hidden="true">
      <video
        ref={videoRef}
        className="fvb-video"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="fvb-grad" />
    </div>
  );
}
