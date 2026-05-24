import React, { useState } from 'react';
import { Zap, Menu, X, Bookmark, Sun, Moon, LogIn, User as UserIcon, LogOut, Gamepad2 } from 'lucide-react';
import { useApp } from '../AppContext';

const Header: React.FC = () => {
  const { view, navigate, isDark, toggleTheme, savedJobs, currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navs = [
    { id: 'explore', label: 'Explore' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'soft-skills', label: 'Skills' },
    { id: 'guidance', label: 'Guide' },
    ...(currentUser ? [{ id: 'dashboard', label: 'Dashboard' }] : []),
    { id: 'team', label: 'My Team' }
  ];

  const handleNav = (id: string) => {
    navigate(id as any);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b-2 border-black dark:border-none bg-white dark:bg-transparent h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNav('home')}>
          <div className="w-10 h-10 bg-black text-white dark:bg-nebula-teal dark:text-black border-2 border-black dark:border-none rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 shadow-[3px_3px_0px_0px_#000] dark:shadow-[0_0_15px_#2dd4bf]">
            <Zap className="w-5 h-5" fill="currentColor" />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-black dark:text-white uppercase">
            Aspiring<span className="text-pop-blue dark:text-nebula-teal">Adda</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navs.map((n) => (
            <button
              key={n.id}
              onClick={() => handleNav(n.id)}
              className={`px-4 py-1 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${view === n.id
                ? 'border-black text-black dark:border-nebula-teal dark:text-nebula-teal'
                : 'border-transparent text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                }`}
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('arcade')}
            className={`px-4 py-1 text-sm font-bold uppercase tracking-wider border-b-2 border-transparent transition-all ${view === 'arcade' ? 'text-pop-purple dark:text-nebula-gold' : 'text-gray-500 hover:text-indigo-600 dark:hover:text-white'}`}
            title="Break Room"
          >
            Break Room
          </button>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('saved')}
            className="relative p-2 border-2 border-black bg-white hover:bg-gray-100 dark:bg-white/10 dark:border-white/10 dark:hover:bg-white/20 dark:rounded-full transition-all hidden md:block"
            title="Saved Jobs"
          >
            <Bookmark className="w-5 h-5 text-black dark:text-white" />
            {savedJobs.size > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-black dark:bg-nebula-gold border border-white dark:border-none rounded-full"></span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 border-2 border-black bg-white hover:bg-gray-100 dark:bg-white/10 dark:border-white/10 dark:hover:bg-white/20 dark:rounded-full transition-all"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-black dark:text-white" /> : <Moon className="w-5 h-5 text-black dark:text-white" />}
          </button>

          {currentUser ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-3 pr-4 py-1.5 border-2 border-black bg-pop-yellow shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all dark:bg-white/10 dark:border-white/10 dark:shadow-none dark:rounded-full"
              >
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold dark:bg-nebula-teal dark:text-black">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="font-bold text-sm text-black dark:text-white truncate max-w-[80px]">{currentUser.name.split(' ')[0]}</span>
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border-2 border-black dark:bg-[#0a0a0a] dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b-2 border-black/10 dark:border-white/10">
                    <p className="text-xs font-bold text-gray-500 uppercase">Signed in as</p>
                    <p className="text-sm font-black truncate dark:text-white">{currentUser.email}</p>
                  </div>
                  <button onClick={() => { navigate('dashboard'); setProfileOpen(false); }} className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-white/5 text-black dark:text-white font-bold text-sm flex items-center gap-2 border-b-2 border-black/10 dark:border-white/10">
                    <UserIcon className="w-4.5 h-4.5" /> My Dashboard
                  </button>
                  <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full text-left p-3 hover:bg-red-50 dark:hover:bg-white/5 text-red-500 font-bold text-sm flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('login')}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-black text-white font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-zinc-800 transition-all dark:bg-nebula-teal dark:text-black dark:border-none dark:shadow-none dark:hover:scale-105"
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border-2 border-black dark:border-white/10 dark:bg-white/10 dark:rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b-2 border-black dark:bg-[#0a0a0a]/90 dark:backdrop-blur-xl dark:border-b dark:border-white/10 p-4 flex flex-col gap-2 md:hidden z-40 shadow-xl">
          {currentUser && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border-2 border-black dark:border-white/10 mb-2">
              <div className="w-10 h-10 bg-pop-yellow rounded-full border-2 border-black flex items-center justify-center font-black dark:bg-nebula-teal dark:border-none dark:text-black">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-black dark:text-white">{currentUser.name}</p>
                <p className="text-xs font-bold text-gray-500">{currentUser.email}</p>
              </div>
            </div>
          )}

          {navs.map((n) => (
            <button
              key={n.id}
              onClick={() => handleNav(n.id)}
              className={`text-left px-4 py-4 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all dark:border-white/10 dark:shadow-none dark:text-white dark:bg-white/5 dark:rounded-xl 
              ${view === n.id
                  ? 'bg-pop-yellow dark:bg-nebula-gold dark:text-black'
                  : 'bg-white'
                }`}
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('arcade')}
            className="text-left px-4 py-4 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-pop-purple text-black hover:shadow-none dark:bg-white/5 dark:border-white/10 dark:shadow-none dark:text-white dark:rounded-xl"
          >
            Break Room (Games)
          </button>

          {currentUser ? (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="text-left px-4 py-4 font-bold border-2 border-black bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:border-white/10 dark:text-red-400 dark:rounded-xl mt-2"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => handleNav('login')}
              className="text-left px-4 py-4 font-bold border-2 border-black bg-black text-white hover:bg-zinc-800 dark:bg-nebula-teal dark:text-black dark:border-none dark:rounded-xl mt-2"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;