import { useRef, useState, forwardRef } from 'react';
import { useSecureAsset } from './hooks/useSecureAsset';

const rolesList = [
  'Product Designer',
  'Full-Stack Developer',
  'AI Product Developer',
];

const fallbackRoleVideoSrc = '/assets/creative-CrXiI4kt.mp4';

const Roles = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const { url: videoUrl } = useSecureAsset('creative', { lazy: true, trigger: hovering });

  const setCombinedRef = (node) => {
    sectionRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleMouseMove = (e) => {
    const vid = videoRef.current;
    const sec = sectionRef.current;
    if (!vid || !sec) return;
    const rect = sec.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    vid.style.transform = `translate(${x}px, ${y}px) translate(18px, 24px)`;
  };

  return (
    <section className="roles-section" id="roles" ref={setCombinedRef}>
      <p className="roles-eyebrow">04 — ROLES</p>
      <ul
        className="roles-list"
        onMouseEnter={(e) => {
          handleMouseMove(e);
          setHovering(true);
        }}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {rolesList.map((role) => (
          <li key={role} className="roles-item" tabIndex={0}>
            {role}
          </li>
        ))}
      </ul>
      <video
        ref={videoRef}
        className={`roles-cursor-vid${hovering ? ' is-visible' : ''}`}
        src={videoUrl || fallbackRoleVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onContextMenu={(e) => e.preventDefault()}
      />
    </section>
  );
});

Roles.displayName = 'Roles';

export default Roles;
