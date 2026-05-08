import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Cpu, Database, Search, MessageSquare } from 'lucide-react';
import '../../styles/RAGFlow.css';

const steps = [
  {
    icon: FileText,
    title: 'Documents',
    desc: 'Ingest enterprise documents — PDFs, docs, spreadsheets — into the pipeline.',
    color: 'var(--navy)',
  },
  {
    icon: Cpu,
    title: 'Embeddings',
    desc: 'Transform text into high-dimensional vector representations.',
    color: 'var(--soft-blue)',
  },
  {
    icon: Database,
    title: 'Vector Database',
    desc: 'Store and index embeddings for lightning-fast similarity search.',
    color: 'var(--emerald)',
  },
  {
    icon: Search,
    title: 'Retrieval',
    desc: 'Fetch the most relevant context using semantic similarity.',
    color: 'var(--soft-blue)',
  },
  {
    icon: MessageSquare,
    title: 'AI Response',
    desc: 'Generate accurate, context-grounded answers with citations.',
    color: 'var(--navy)',
  },
];

function StepCard({ step, index, isInView }) {
  const Icon = step.icon;

  return (
    <motion.div
      className="rag__step"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 * index, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rag__step-card">
        <div className="rag__step-icon" style={{ '--step-color': step.color }}>
          <Icon size={22} />
        </div>
        <h3 className="rag__step-title">{step.title}</h3>
        <p className="rag__step-desc">{step.desc}</p>
      </div>
      {index < steps.length - 1 && (
        <div className="rag__connector">
          <motion.div
            className="rag__connector-line"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.15 * index + 0.3, duration: 0.5 }}
          />
          <motion.div
            className="rag__connector-dot"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.15 * index + 0.5, duration: 0.3 }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default function RAGFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="architecture" className="section rag" ref={ref}>
      <div className="container">
        <motion.div
          className="rag__header text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Architecture</span>
          <h2 className="section-title mx-auto" style={{ maxWidth: 600 }}>
            How Nexus Works
          </h2>
          <p className="section-subtitle mx-auto" style={{ textAlign: 'center' }}>
            An end-to-end Retrieval-Augmented Generation pipeline that transforms
            raw documents into intelligent, contextual answers.
          </p>
        </motion.div>

        <div className="rag__pipeline">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
