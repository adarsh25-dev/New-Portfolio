import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MIN_WIDTH = 600;
const CURVE_POINTS = [
  { c1: [0, 0.1], c2: [-0.1, 0.16], end: [-0.08, 0.26] },
  { c1: [-0.06, 0.36], c2: [0.12, 0.34], end: [0.12, 0.47] },
  { c1: [0.12, 0.59], c2: [-0.04, 0.64], end: [0.05, 0.76] },
  { c1: [0.13, 0.88], c2: [0.34, 0.9], end: [0.58, 1.05] },
];
const BLUR_SCALE = 0.55;
const STEM_OFFSET_RATIO = 0.2;

let measureCanvas = null;

function measureStemWidth(fontWeight, fontSize, fontFamily) {
  measureCanvas ||= document.createElement('canvas').getContext('2d');
  measureCanvas.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const metrics = measureCanvas.measureText('I');
  return metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
}

function getHeroBlur() {
  return parseFloat(document.documentElement.style.getPropertyValue('--hero-blur')) || 0;
}

function buildSvgPath(startX, startY, pts) {
  let pathStr = `M ${startX.toFixed(1)} ${startY.toFixed(1)}`;
  for (const pt of pts) {
    pathStr += ` C ${pt.c1x.toFixed(1)} ${pt.c1y.toFixed(1)}, ${pt.c2x.toFixed(1)} ${pt.c2y.toFixed(1)}, ${pt.ex.toFixed(1)} ${pt.ey.toFixed(1)}`;
  }
  return pathStr;
}

export default function ScrollCurve({ regionRef }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const region = regionRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!region || !svg || !path) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx = null;
    let cached = null;
    let lastBlurOffset = -1;

    const build = () => {
      ctx && (ctx.revert(), (ctx = null));
      cached = null;
      const anchor = region.querySelector('.curve-anchor');
      if (window.innerWidth < MIN_WIDTH || !anchor) {
        svg.style.display = 'none';
        return;
      }
      svg.style.display = '';

      const regRect = region.getBoundingClientRect();
      const w = regRect.width;
      const h = regRect.height;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

      const anchorRect = anchor.getBoundingClientRect();
      const cs = getComputedStyle(anchor);
      const fontSize = parseFloat(cs.fontSize) || anchorRect.height;
      const blurOffset = getHeroBlur() * window.innerHeight * BLUR_SCALE;
      const sx = anchorRect.left + anchorRect.width / 2 - regRect.left;
      const sy = anchorRect.bottom - regRect.top + blurOffset - fontSize * STEM_OFFSET_RATIO;

      const stemWidth = measureStemWidth(cs.fontWeight, fontSize, cs.fontFamily);
      if (stemWidth > 0) {
        path.style.strokeWidth = `${stemWidth}px`;
      }

      const pts = CURVE_POINTS.map((pt) => ({
        c1x: sx + pt.c1[0] * w,
        c1y: sy + pt.c1[1] * h,
        c2x: sx + pt.c2[0] * w,
        c2y: sy + pt.c2[1] * h,
        ex: sx + pt.end[0] * w,
        ey: sy + pt.end[1] * h,
      }));

      cached = { sx0: sx, sy0: sy, pts };
      lastBlurOffset = -1;

      path.setAttribute('pathLength', '1');
      path.setAttribute('d', buildSvgPath(sx, sy, pts));
      path.style.strokeDasharray = '1';
      path.style.strokeDashoffset = prefersReducedMotion ? '0' : '1';

      if (prefersReducedMotion) return;

      const rolesSection = region.querySelector('.roles-section');
      ctx = gsap.context(() => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: anchor,
            start: 'top 18%',
            endTrigger: rolesSection || region,
            end: 'bottom center',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }, region);

      ScrollTrigger.refresh();
    };

    const onTick = () => {
      if (!cached) return;
      const bo = getHeroBlur() * window.innerHeight * BLUR_SCALE;
      if (bo !== lastBlurOffset) {
        lastBlurOffset = bo;
        path.setAttribute('d', buildSvgPath(cached.sx0, cached.sy0 - bo, cached.pts));
      }
    };

    gsap.ticker.add(onTick);
    build();

    const onResize = () => build();
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);

    let isDone = false;
    document.fonts?.ready &&
      document.fonts.ready.then(() => {
        if (!isDone) build();
      });

    return () => {
      isDone = true;
      gsap.ticker.remove(onTick);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      ctx && ctx.revert();
    };
  }, [regionRef]);

  return (
    <svg ref={svgRef} className="scroll-curve" preserveAspectRatio="none" aria-hidden="true">
      <path ref={pathRef} className="scroll-curve-path" fill="none" />
    </svg>
  );
}
