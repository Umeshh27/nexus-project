import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Sparkles, Quote, Shield, Zap, Layers } from 'lucide-react';
import '../../styles/Features.css';

const features = [
  {
    icon: Search,
    title: 'Semantic Search',
    desc: 'Go beyond keyword matching. Understand intent and meaning across your entire document corpus.',
    size: 'large',
  },
  {
    icon: Sparkles,
    title: 'Intelligent Retrieval',
    desc: 'AI-powered context retrieval that finds the most relevant information instantly.',
    size: 'small',
  },
  {
    icon: Quote,
    title: 'Source Citations',
    desc: 'Every answer comes with traceable source references for full transparency.',
    size: 'small',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Role-based access, encryption at rest, and audit logging for compliance.',
    size: 'wide',
  },
  {
    icon: Zap,
    title: 'Real-Time AI Responses',
    desc: 'Sub-second retrieval and generation for seamless user experiences.',
    size: 'small',
  },
  {
    icon: Layers,
    title: 'Scalable Architecture',
    desc: 'Horizontally scalable infrastructure designed for growing organizations.',
    size: 'small',
  },
];

function FeatureCard({ feature, index, isInView }) {
  const Icon = feature.icon;

  return (
    <motion.div
      className={`feature-card feature-card--${feature.size}`}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.08 * index, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="feature-card__icon">
        <Icon size={20} />
      </div>
      <h3 className="feature-card__title">{feature.title}</h3>
      <p className="feature-card__desc">{feature.desc}</p>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="section features" ref={ref}>
      <div className="container">
        <motion.div
          className="features__header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Features</span>
          <h2 className="section-title">Built for Enterprise Intelligence</h2>
          <p className="section-subtitle">
            Everything you need to turn your document repositories into an
            intelligent, searchable knowledge base.
          </p>
        </motion.div>

        <div className="features__grid">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
