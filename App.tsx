import React, { useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Explore from './views/Explore';
import Paths from './views/Paths';
import Detail from './views/Detail';
import Jobs from './views/Jobs';
import SoftSkills from './views/SoftSkills';
import Team from './views/Team';
import Quiz from './views/Quiz';
import Login from './views/Login';
import Arcade from './views/Arcade';
import Guidance from './views/Guidance';
import Dashboard from './views/Dashboard';
import AIRoadmap from './views/AIRoadmap';

const MainContent: React.FC = () => {
  const { view, isDark } = useApp();

  // Add 3D Tilt Effect
  useEffect(() => {
    let activeCard: HTMLElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDark) return;

      // Disable 3D tilt on mobile/tablet screens (< 1024px)
      if (window.innerWidth < 1024) {
        if (activeCard) {
          activeCard.style.transform = '';
          activeCard.style.transition = '';
          activeCard = null;
        }
        return;
      }

      // Find the card being hovered
      const target = e.target as HTMLElement;
      const card = target.closest('.card-base') as HTMLElement | null;

      // If we moved out of the previously active card, reset its transform
      if (activeCard && activeCard !== card) {
        activeCard.style.transform = '';
        activeCard.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        activeCard.style.removeProperty('--mouse-x');
        activeCard.style.removeProperty('--mouse-y');
        activeCard = null;
      }

      if (card) {
        activeCard = card;
        const rect = card.getBoundingClientRect();
        
        // Mouse positions relative to the card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation angles (clamped to max 8 degrees)
        const maxRotation = 8;
        const rotateX = Math.max(-maxRotation, Math.min(maxRotation, ((y - centerY) / centerY) * -maxRotation));
        const rotateY = Math.max(-maxRotation, Math.min(maxRotation, ((x - centerX) / centerX) * maxRotation));

        // Use a very fast transition during mousemove to feel snappy but smooth out jitter
        card.style.transition = 'transform 0.1s ease-out';
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Set CSS custom properties for the spotlight reflection effect
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    const handleMouseLeave = () => {
      if (activeCard) {
        activeCard.style.transform = '';
        activeCard.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        activeCard.style.removeProperty('--mouse-x');
        activeCard.style.removeProperty('--mouse-y');
        activeCard = null;
      }
    };

    if (isDark) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    } else {
      // Reset all cards' transforms when in light mode
      const cards = document.querySelectorAll('.card-base');
      cards.forEach((card) => {
        const c = card as HTMLElement;
        c.style.transform = '';
        c.style.transition = '';
        c.style.removeProperty('--mouse-x');
        c.style.removeProperty('--mouse-y');
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      // Clean up transforms to prevent stuck tilt
      const cards = document.querySelectorAll('.card-base');
      cards.forEach((card) => {
        const c = card as HTMLElement;
        c.style.transform = '';
        c.style.transition = '';
        c.style.removeProperty('--mouse-x');
        c.style.removeProperty('--mouse-y');
      });
    };
  }, [isDark]); // No need to depend on view anymore, as event delegation handles dynamic elements

  let content;
  switch (view) {
    case 'home': content = <Home />; break;
    case 'explore': content = <Explore />; break;
    case 'paths': content = <Paths />; break;
    case 'detail': content = <Detail />; break;
    case 'jobs':
    case 'saved': content = <Jobs />; break;
    case 'soft-skills': content = <SoftSkills />; break;
    case 'team': content = <Team />; break;
    case 'quiz': content = <Quiz />; break;
    case 'login': content = <Login />; break;
    case 'arcade': content = <Arcade />; break;
    case 'guidance': content = <Guidance />; break;
    case 'dashboard': content = <Dashboard />; break;
    case 'ai-roadmap': content = <AIRoadmap />; break;
    default: content = <Home />;
  }

  // Remove padding/layout constraints for arcade mode to allow full screen canvas
  if (view === 'arcade') {
    return <main className="flex-grow w-full h-screen overflow-hidden relative">{content}</main>;
  }

  return (
    <main className="flex-grow flex flex-col relative w-full overflow-x-hidden pt-20 min-h-screen">
      {content}
    </main>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Header />
      <MainContent />
      {/* Hide Footer in Arcade Mode */}
      <FooterWrapper />
    </AppProvider>
  );
};

const FooterWrapper = () => {
  const { view } = useApp();
  if (view === 'arcade') return null;
  return <Footer />;
}

export default App;