import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';

import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import RAGFlow from '../components/landing/RAGFlow';
import Features from '../components/landing/Features';
import ChatPreview from '../components/landing/ChatPreview';
import About from '../components/landing/About';
import TechStack from '../components/landing/TechStack';
import Footer from '../components/landing/Footer';
import MouseGlow from '../components/landing/MouseGlow';

export default function LandingPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="app">
      <MouseGlow />
      <Navbar />
      <main>
        <Hero />
        <RAGFlow />
        <Features />
        <ChatPreview />
        <About />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
}
