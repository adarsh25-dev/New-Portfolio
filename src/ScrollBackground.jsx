import { useEffect, useRef, useState } from 'react';
import './ScrollBackground.css';

const bgVideo = '/assets/bgvideo-WLnX9sPP.mp4';

export default function ScrollBackground({ zoomed = false }) {
  const rootRef = useRef(null);
  const ticking = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      el.style.setProperty('--scroll-progress', progress.toFixed(4));

      const diveSection = document.querySelector('.dive-section');
      const diveProgress = diveSection
        ? parseFloat(getComputedStyle(diveSection).getPropertyValue('--dive-progress')) || 0
        : 1;
      setRevealed(diveProgress > 0.50);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`sb-root${zoomed ? ' sb-zoomed' : ''}${revealed ? ' sb-revealed' : ''}`}
      aria-hidden="true"
    >
      <video
        className="sb-video"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="sb-wash" />
      <div className="sb-tint" />
      <div className="sb-grain-coarse" />
      <div className="sb-grain" />
      <div className="sb-vignette" />
      <div className="sb-cover" />
    </div>
  );
}
