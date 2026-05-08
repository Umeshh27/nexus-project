import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Search, Brain, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/Hero.css';

/* Floating node graph visualization */
function AIVisualization() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    const nodes = [];
    const nodeCount = 18;

    function resize() {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(2, 2);
    }

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 3 + 2,
          type: i < 5 ? 'document' : i < 10 ? 'vector' : 'node',
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(154, 206, 226, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node, i) => {
        node.pulse += 0.02;
        const pulseScale = 1 + Math.sin(node.pulse) * 0.15;

        // Mouse influence
        const mdx = mouseRef.current.x - node.x;
        const mdy = mouseRef.current.y - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120 && mdist > 0) {
          node.vx += (mdx / mdist) * 0.02;
          node.vy += (mdy / mdist) * 0.02;
        }

        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const r = node.radius * pulseScale;

        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 6);
        if (node.type === 'document') {
          gradient.addColorStop(0, 'rgba(31, 171, 120, 0.15)');
          gradient.addColorStop(1, 'rgba(31, 171, 120, 0)');
        } else if (node.type === 'vector') {
          gradient.addColorStop(0, 'rgba(154, 206, 226, 0.15)');
          gradient.addColorStop(1, 'rgba(154, 206, 226, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(34, 57, 89, 0.1)');
          gradient.addColorStop(1, 'rgba(34, 57, 89, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 6, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        if (node.type === 'document') {
          ctx.fillStyle = '#1FAB78';
        } else if (node.type === 'vector') {
          ctx.fillStyle = '#9ACEE2';
        } else {
          ctx.fillStyle = '#223959';
        }
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();

    const handleResize = () => { resize(); initNodes(); };
    window.addEventListener('resize', handleResize);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener('mousemove', handleMouse);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" />;
}

const trustItems = [
  { icon: Search, label: 'Semantic Search' },
  { icon: Brain, label: 'Context-Aware AI' },
  { icon: Shield, label: 'Enterprise Ready' },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      {/* Background Grid */}
      <div className="hero__grid-bg" />
      
      {/* Gradient Orbs */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      <motion.div className="hero__container container" style={{ opacity, y }}>
        <div className="hero__content">
          {/* Left: Copy */}
          <div className="hero__left">
            <motion.div
              className="hero__badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="hero__badge-dot" />
              AI-Powered Document Intelligence
            </motion.div>

            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              AI-Powered Knowledge{' '}
              <span className="hero__title-accent">Retrieval</span> for Modern
              Organizations
            </motion.h1>

            <motion.p
              className="hero__description"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Nexus transforms enterprise documents into an intelligent
              AI-powered knowledge system using Retrieval-Augmented Generation.
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              <Link to="/register" className="hero__cta">
                Try Nexus
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              className="hero__trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="hero__trust-item">
                  <Icon size={14} />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Visualization */}
          <motion.div
            className="hero__right"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero__viz-container">
              <AIVisualization />
              <div className="hero__viz-overlay">
                <div className="hero__viz-label">RAG Architecture</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
