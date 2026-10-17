import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FloatingBg from './components/FloatingBg';
import Hero from './components/Hero';
import StatsRibbon from './components/StatsRibbon';
import PillarsSection from './components/PillarsSection';
import InitiativesExplorer from './components/InitiativesExplorer';
import InteractiveHub from './components/InteractiveHub';
import LiteratureSection from './components/LiteratureSection';
import PledgeWall from './components/PledgeWall';
import IdeaBoard from './components/IdeaBoard';
import Footer from './components/Footer';
import Toast from './components/Toast';

export default function App() {
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3800);
  };

  return (
    <div className="app-root">
      <FloatingBg />
      <Navbar />

      <main>
        <Hero />
        <StatsRibbon />
        <div className="alpana-band" aria-hidden="true" />
        <PillarsSection />
        <InitiativesExplorer onToast={showToast} />
        <InteractiveHub onToast={showToast} />
        <LiteratureSection />
        <PledgeWall onToast={showToast} />
        <IdeaBoard onToast={showToast} />
      </main>

      <Footer />
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
