import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import '../../styles/About.css';

/* Animated knowledge graph SVG */
function KnowledgeGraph() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const nodes = svg.querySelectorAll('.kg-node');
    const lines = svg.querySelectorAll('.kg-line');

    // Subtle floating animation
    nodes.forEach((node, i) => {
      const delay = i * 0.3;
      node.style.animation = `kg-float ${3 + i * 0.5}s ease-in-out ${delay}s infinite alternate`;
    });

    lines.forEach((line, i) => {
      line.style.animation = `kg-pulse ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite alternate`;
    });
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 400 350" className="about__graph" fill="none">
      {/* Connection Lines */}
      <line className="kg-line" x1="200" y1="80" x2="120" y2="170" stroke="#9ACEE2" strokeWidth="1.5" opacity="0.4" />
      <line className="kg-line" x1="200" y1="80" x2="280" y2="150" stroke="#9ACEE2" strokeWidth="1.5" opacity="0.4" />
      <line className="kg-line" x1="200" y1="80" x2="200" y2="180" stroke="#1FAB78" strokeWidth="1.5" opacity="0.4" />
      <line className="kg-line" x1="120" y1="170" x2="80" y2="260" stroke="#9ACEE2" strokeWidth="1.5" opacity="0.3" />
      <line className="kg-line" x1="120" y1="170" x2="200" y2="180" stroke="#223959" strokeWidth="1.5" opacity="0.3" />
      <line className="kg-line" x1="280" y1="150" x2="320" y2="240" stroke="#9ACEE2" strokeWidth="1.5" opacity="0.3" />
      <line className="kg-line" x1="280" y1="150" x2="200" y2="180" stroke="#223959" strokeWidth="1.5" opacity="0.3" />
      <line className="kg-line" x1="200" y1="180" x2="160" y2="280" stroke="#1FAB78" strokeWidth="1.5" opacity="0.3" />
      <line className="kg-line" x1="200" y1="180" x2="260" y2="290" stroke="#1FAB78" strokeWidth="1.5" opacity="0.3" />
      <line className="kg-line" x1="80" y1="260" x2="160" y2="280" stroke="#9ACEE2" strokeWidth="1.5" opacity="0.2" />
      <line className="kg-line" x1="320" y1="240" x2="260" y2="290" stroke="#9ACEE2" strokeWidth="1.5" opacity="0.2" />

      {/* Central Node */}
      <circle className="kg-node" cx="200" cy="80" r="16" fill="#223959" opacity="0.9" />
      <circle cx="200" cy="80" r="22" stroke="#223959" strokeWidth="1" opacity="0.15" />

      {/* Document Nodes */}
      <rect className="kg-node" x="105" y="155" width="30" height="30" rx="6" fill="#9ACEE2" opacity="0.8" />
      <rect className="kg-node" x="265" y="135" width="30" height="30" rx="6" fill="#9ACEE2" opacity="0.8" />

      {/* AI Node */}
      <circle className="kg-node" cx="200" cy="180" r="14" fill="#1FAB78" opacity="0.9" />
      <circle cx="200" cy="180" r="20" stroke="#1FAB78" strokeWidth="1" opacity="0.15" />

      {/* Leaf Nodes */}
      <circle className="kg-node" cx="80" cy="260" r="10" fill="#9ACEE2" opacity="0.6" />
      <circle className="kg-node" cx="160" cy="280" r="8" fill="#1FAB78" opacity="0.5" />
      <circle className="kg-node" cx="260" cy="290" r="9" fill="#1FAB78" opacity="0.5" />
      <circle className="kg-node" cx="320" cy="240" r="10" fill="#9ACEE2" opacity="0.6" />

      {/* Small accent nodes */}
      <circle className="kg-node" cx="150" cy="120" r="4" fill="#223959" opacity="0.3" />
      <circle className="kg-node" cx="250" cy="110" r="3" fill="#223959" opacity="0.25" />
      <circle className="kg-node" cx="100" cy="220" r="3.5" fill="#9ACEE2" opacity="0.3" />
      <circle className="kg-node" cx="300" cy="200" r="3.5" fill="#9ACEE2" opacity="0.3" />

      {/* Labels */}
      <text x="200" y="46" textAnchor="middle" fill="#223959" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">Query</text>
      <text x="120" y="204" textAnchor="middle" fill="#4B5563" fontSize="9" fontFamily="Inter, sans-serif">Docs</text>
      <text x="280" y="182" textAnchor="middle" fill="#4B5563" fontSize="9" fontFamily="Inter, sans-serif">Vectors</text>
      <text x="200" y="216" textAnchor="middle" fill="#1FAB78" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">AI Engine</text>
    </svg>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section about" ref={ref}>
      <div className="container">
        <div className="about__grid">
          {/* Left: Text */}
          <motion.div
            className="about__text"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-label">About Nexus</span>
            <h2 className="section-title">
              Bridging Data and Decisions
            </h2>
            <p className="about__description">
              Nexus bridges the gap between organizational data and intelligent
              decision-making by enabling AI-powered contextual retrieval across
              enterprise documents.
            </p>
            <p className="about__description about__description--secondary">
              Built on cutting-edge Retrieval-Augmented Generation technology,
              Nexus understands the meaning behind your queries — not just
              keywords — delivering precise, source-backed answers in seconds.
            </p>
            <div className="about__stats">
              <div className="about__stat">
                <span className="about__stat-number">10×</span>
                <span className="about__stat-label">Faster Retrieval</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">98%</span>
                <span className="about__stat-label">Relevance Accuracy</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">&lt;2s</span>
                <span className="about__stat-label">Response Time</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Visualization */}
          <motion.div
            className="about__visual"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about__graph-container">
              <KnowledgeGraph />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
