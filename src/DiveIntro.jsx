import { useEffect, useRef, useState } from "react";
import "./DiveIntro.css";

const heroBgImg = "/assets/hero_bg-CfSw2las.png";
const heroVideo = "/assets/hero_vdo-BiUQ78eI.mp4";

// Scale factor to match the visual size of the original 1600×900 / 140px design
function calcScale(w, h) {
  return Math.max(w / 1600, h / 900);
}

export default function DiveIntro() {
  const sectionRef = useRef(null);
  const groupRef = useRef(null);
  const textRef = useRef(null);

  const [dims, setDims] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  // Zoom-origin: where the camera "punches through" on zoom (SVG user-space = px)
  const [center, setCenter] = useState(() => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  }));

  // Keep viewport dims in sync & recalculate zoom origin after fonts load
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDims({ w, h });

      const el = textRef.current;
      if (el && typeof el.getExtentOfChar === "function") {
        try {
          const bbox = el.getExtentOfChar(4);
          setCenter({
            x: bbox.x + bbox.width * 0.11,
            y: bbox.y + bbox.height / 2,
          });
          return;
        } catch {}
      }
      setCenter({ x: w / 2, y: h / 2 });
    };

    const rafId = requestAnimationFrame(measure);
    document.fonts?.ready && document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Scroll animation — re-runs whenever the zoom origin changes
  useEffect(() => {
    const sec = sectionRef.current;
    const group = groupRef.current;
    if (!sec || !group) return;

    const ox = center.x;
    const oy = center.y;
    let rafId = 0;

    const update = () => {
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollDist = Math.max(1, sec.offsetHeight - vh);
      const progress =
        Math.max(0, Math.min(scrollDist, -rect.top)) / scrollDist;
      const zoomProgress = Math.max(0, Math.min(1, (progress - 0.02) / 0.46));
      // Smooth gradual power curve for slow, cinematic zoom
      const scale = 1 + Math.pow(zoomProgress, 2.8) * 95;

      group.setAttribute(
        "transform",
        `translate(${ox} ${oy}) scale(${scale.toFixed(3)}) translate(${-ox} ${-oy})`,
      );
      sec.style.setProperty("--dive-progress", progress.toFixed(4));
      rafId = 0;
    };

    const onScroll = () => {
      rafId ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [center]);

  const { w, h } = dims;
  // Font size scales with viewport just like the original 140px @ 1600×900 design
  const fontSize = Math.round(140 * calcScale(w, h));

  return (
    <section ref={sectionRef} className="dive-section" id="work">
      <div className="dive-sticky">
        <img
          className="dive-cover-bg"
          src={heroBgImg}
          alt=""
          draggable="false"
        />
        <div className="dive-masked">
          <video
            className="dive-video"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div className="dive-blur-grad" />
        </div>
        <div className="dive-noise" />

        {/*
          SVG viewBox = actual viewport (px).
          preserveAspectRatio="none" — no scaling; 1 SVG unit = 1 CSS pixel.
          Text at (w/2, h/2) is ALWAYS at the exact viewport centre on every screen.
        */}
        <svg
          className="dive-cover-svg"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs className="dive-svg-defs">
            <mask
              id="dive-text-mask"
              maskUnits="userSpaceOnUse"
              x="-50000"
              y="-50000"
              width="100000"
              height="100000"
            >
              <rect
                x="-50000"
                y="-50000"
                width="100000"
                height="100000"
                fill="black"
              />
              <g ref={groupRef}>
                <text
                  style={{ margin: 0 }}
                  ref={textRef}
                  x={w / 2}
                  y={h / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="Archivo, system-ui, sans-serif"
                  fontWeight="900"
                  fontSize={fontSize}
                  letterSpacing="-3"
                  fill="white"
                >
                  DELVE IN
                </text>
              </g>
            </mask>
          </defs>
        </svg>

        <div className="dive-journey-content">
          <h2 className="dive-journey-title">
            <span className="dive-journey-title-span">through</span> THIS
            <br />
            JOURNEY WITH ME
          </h2>
        </div>
      </div>
    </section>
  );
}
