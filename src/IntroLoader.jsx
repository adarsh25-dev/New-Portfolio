import sigRaw from "./assets/signature.svg?raw";

// Vite's ?raw gives us the SVG as a string, so we can inject
// pathLength="1" into every path and strip any inline styles from Calligrapher.ai.
const sigMarkup = sigRaw
  .replace(/style="[^"]*"/g, "")
  .replace(/<path /g, '<path pathLength="1" ');

export default function IntroLoader({ onComplete }) {
  return (
    <div
      className="intro-loader"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.animationName === "intro-lift") onComplete?.();
      }}
      dangerouslySetInnerHTML={{
        __html: `<div class="intro-sig">${sigMarkup}</div>`,
      }}
    />
  );
}
