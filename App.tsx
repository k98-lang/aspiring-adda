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

const MainContent: React.FC = () => {
  const { view, isDark } = useApp();

  // Add 3D Tilt Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDark) return;

        // Disable 3D tilt on mobile/tablet screens (< 1024px)
        if (window.innerWidth < 1024) {
             const cards = document.querySelectorAll('.card-base');
             cards.forEach((card) => {
                (card as HTMLElement).style.transform = '';
             });
             return;
        }

        const cards = document.querySelectorAll('.card-base');

        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg
            const rotateY = ((x - centerX) / centerX) * 5;  // Max 5 deg

            // Cast to HTMLElement to access style
            (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    };

    if (isDark) {
        window.addEventListener('mousemove', handleMouseMove);
    } else {
        // Reset transforms when in light mode
        const cards = document.querySelectorAll('.card-base');
        cards.forEach((card) => {
            (card as HTMLElement).style.transform = '';
        });
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        // Clean up transforms to prevent stuck tilt
        const cards = document.querySelectorAll('.card-base');
        cards.forEach((card) => {
            (card as HTMLElement).style.transform = '';
        });
    };
  }, [isDark, view]); // Re-run when view changes to attach to new cards

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