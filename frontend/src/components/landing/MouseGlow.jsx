import { useEffect, useRef } from 'react';
import '../../styles/MouseGlow.css';

export default function MouseGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let x = 0, y = 0;
    let targetX = 0, targetY = 0;

    const handleMouse = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      glow.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouse);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div ref={glowRef} className="mouse-glow" />;
}
