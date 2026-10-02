import { useEffect, useRef, useState, forwardRef } from 'react';
import VariableFontText from './VariableFontText';
import { useSecureAsset } from './hooks/useSecureAsset';

const projectsData = [
  {
    seed: 'aurora',
    span: 'big',
    assetId: 'creative',
    video: '/assets/creative-CrXiI4kt.mp4',
    stillOffset: 1,
    name: 'humanOS',
    description:
      'An AI-powered personal OS that helps people organize their goals, habits, focus, and personal growth in one unified experience.',
    link: 'https://human-os-two.vercel.app/',
    repo: 'https://github.com/gargibhardwaj24/humanOS',
  },
  {
    seed: 'procrastinator',
    span: 'half',
    assetId: 'procrastinator',
    photo: '/assets/procrastinator-CdjJLjP4.png',
    fit: 'contain',
    name: 'Procrastinator',
    description:
      'Procrastinator is an app that helps people beat procrastination, stay focused, and get things done.',
    link: 'https://procrastinator-zeta.vercel.app/',
    repo: 'https://github.com/gargibhardwaj24/Procrastinator',
  },
  {
    seed: 'nanofacts',
    span: 'half',
    assetId: 'nanoFactz',
    photo: '/assets/nanoFactz-1Es8Qbot.png',
    name: 'NanoFactz',
    description:
      'NanoFacts is a micro-learning platform that delivers short, engaging, and easy-to-digest facts, helping users learn something new in just a few seconds.',
    link: 'https://nanofacts.vercel.app/',
    repo: 'https://github.com/gargibhardwaj24/NanoFactz',
  },
  {
    seed: 'verde',
    span: 'big',
    assetId: 'hushMeet',
    video: '/assets/hushMeet-CGzQG0sJ.mp4',
    name: 'HushMeet',
    description:
      'HushMeet is an AI-powered communication tool that converts lip movements into real-time text and voice, making conversations, meetings, and communication accessible even in noisy environments',
  },
];

function ProjSlide({
  seed,
  span,
  side = 'left',
  video,
  assetId,
  stillOffset = 0.5,
  photo,
  fit,
  name,
  description,
  link,
  repo,
  onExpand,
}) {
  const fallbackPic =
    span === 'big'
      ? `https://picsum.photos/seed/${seed}/1600/900`
      : `https://picsum.photos/seed/${seed}/900/1000`;
  const videoRef = useRef(null);
  const { url: secureUrl } = useSecureAsset(assetId, { lazy: true });

  const activeVideoSrc = secureUrl || video;
  const activePhotoSrc = secureUrl || photo || fallbackPic;

  useEffect(() => {
    if (!video) return;
    const vid = videoRef.current;
    if (!vid) return;

    const seekStill = () => {
      const duration = Number.isFinite(vid.duration)
        ? Math.max(0, vid.duration - stillOffset)
        : 0;
      try {
        vid.currentTime = duration;
      } catch {}
    };

    const onEnd = () => {
      vid.pause();
      seekStill();
    };

    vid.addEventListener('loadedmetadata', seekStill);
    vid.addEventListener('ended', onEnd);
    if (vid.readyState >= 1) seekStill();

    return () => {
      vid.removeEventListener('loadedmetadata', seekStill);
      vid.removeEventListener('ended', onEnd);
    };
  }, [video, activeVideoSrc, stillOffset]);

  return (
    <article
      className={`proj-slide proj-slide--${span} proj-slide--from-${side}${
        fit === 'contain' ? ' proj-slide--contain' : ''
      }`}
    >
      {video ? (
        <video
          ref={videoRef}
          src={activeVideoSrc}
          muted
          playsInline
          preload="metadata"
          draggable="false"
          aria-label={name}
          className="proj-video"
          onContextMenu={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            onExpand?.({ src: activeVideoSrc, name });
          }}
        />
      ) : (
        <img
          src={activePhotoSrc}
          alt={name || seed}
          loading="lazy"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
      )}
      <div className="proj-info">
        <span className="proj-line" aria-hidden="true" />
        <h3 className="proj-name">{name}</h3>
        <p className="proj-desc">{description}</p>
        <div className="proj-links">
          {link && (
            <a href={link} target="_blank" rel="noreferrer">
              Visit ↗
            </a>
          )}
          {repo && (
            <a href={repo} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

const FeaturedWorks = forwardRef(function (props, ref) {
  const listRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (!activeModal) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [activeModal]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll('.proj-slide'));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      slides.forEach((s) => s.classList.add('is-in'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-in', entry.isIntersecting);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="fw-section" id="projects" aria-label="Featured Works">
      <VariableFontText as="h2" className="fw-heading" text="Featured Works" />
      <div className="fw-projects" ref={listRef}>
        <ProjSlide {...projectsData[0]} side="left" onExpand={setActiveModal} />
        <div className="proj-row">
          <ProjSlide {...projectsData[1]} side="left" onExpand={setActiveModal} />
          <ProjSlide {...projectsData[2]} side="right" onExpand={setActiveModal} />
        </div>
        <ProjSlide {...projectsData[3]} side="right" onExpand={setActiveModal} />
      </div>

      {activeModal && (
        <div
          className="fw-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeModal.name}
          onClick={() => setActiveModal(null)}
        >
          <button
            type="button"
            className="fw-modal-close"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal(null);
            }}
            aria-label="Close video"
          >
            ×
          </button>
          <video
            src={activeModal.src}
            autoPlay
            loop
            playsInline
            controls={false}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      )}
    </section>
  );
});

FeaturedWorks.displayName = 'FeaturedWorks';

export default FeaturedWorks;
