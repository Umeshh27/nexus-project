import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { User, Bot, FileText, ExternalLink } from 'lucide-react';
import '../../styles/ChatPreview.css';

const userMessage = 'What is the company leave policy?';

const sources = [
  { name: 'HR_Policy_2024.pdf', page: 12 },
  { name: 'Employee_Handbook.pdf', page: 34 },
];

const aiResponse = `Based on the company's HR policy documents, employees are entitled to:

• **Annual Leave**: 24 days per calendar year, accrued monthly
• **Sick Leave**: 12 days with medical certification required after 3 consecutive days
• **Personal Leave**: 5 days for personal matters

Leave requests must be submitted through the HR portal at least 5 business days in advance for planned absences.`;

function TypewriterText({ text, isInView, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [isInView, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [started, text]);

  // Parse bold markdown
  const renderText = (t) => {
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return <span>{renderText(displayed)}{started && displayed.length < text.length && <span className="chat__cursor">|</span>}</span>;
}

export default function ChatPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section chat-section" ref={ref}>
      {/* Background */}
      <div className="chat-section__bg" />

      <div className="container">
        <motion.div
          className="chat-section__header text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Experience</span>
          <h2 className="section-title mx-auto" style={{ maxWidth: 500 }}>
            Intelligence at Your Fingertips
          </h2>
          <p className="section-subtitle mx-auto" style={{ textAlign: 'center' }}>
            Ask questions in natural language. Get precise, source-backed answers
            from your entire document library.
          </p>
        </motion.div>

        <motion.div
          className="chat__window"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="chat__window-header">
            <div className="chat__window-dots">
              <span /><span /><span />
            </div>
            <span className="chat__window-title">Nexus AI</span>
          </div>

          {/* Messages */}
          <div className="chat__messages">
            {/* User message */}
            <motion.div
              className="chat__message chat__message--user"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="chat__avatar chat__avatar--user">
                <User size={14} />
              </div>
              <div className="chat__bubble chat__bubble--user">
                {userMessage}
              </div>
            </motion.div>

            {/* Sources */}
            <motion.div
              className="chat__sources"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <span className="chat__sources-label">Sources retrieved:</span>
              <div className="chat__source-tags">
                {sources.map((s) => (
                  <span key={s.name} className="chat__source-tag">
                    <FileText size={11} />
                    {s.name}
                    <span className="chat__source-page">p.{s.page}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* AI message */}
            <motion.div
              className="chat__message chat__message--ai"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <div className="chat__avatar chat__avatar--ai">
                <Bot size={14} />
              </div>
              <div className="chat__bubble chat__bubble--ai">
                <TypewriterText text={aiResponse} isInView={isInView} delay={1500} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
