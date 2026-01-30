import React from 'react';
import { Compass, Sparkles, MessageSquare } from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../AppContext';

const Home: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 text-center relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center">
      {/* CRAZY LIGHT MODE BACKGROUND ELEMENTS (Hidden in Dark) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden dark:hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pop-purple border-2 border-black rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-pop-green border-2 border-black opacity-80 rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full">
          <div className="inline-flex items-center gap-3 px-4 py-2 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] mb-6 md:mb-8 dark:bg-white/5 dark:border-white/20 dark:shadow-none dark:rounded-full dark:backdrop-blur-md">
              <span className="w-3 h-3 bg-black dark:bg-nebula-teal rounded-full"></span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-black dark:text-white">System v2026.1 Online</span>
          </div>

          <h1 className="text-5xl md:text-9xl font-black tracking-tighter text-black dark:text-white mb-6 md:mb-8 leading-[0.9] font-brutal dark:font-sans">
              FUTURE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black dark:from-nebula-teal dark:to-nebula-gold">READY.</span>
          </h1>

          <p className="text-lg md:text-2xl font-bold text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 md:mb-12 dark:font-light px-2">
              Stop guessing. Start building. Real roadmaps for the chaotic tech world.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4 sm:px-0">
            <Button onClick={() => navigate('explore')} size="lg" icon={Compass} className="w-full sm:w-auto">
              Initialize
            </Button>
            <Button onClick={() => navigate('quiz')} size="lg" variant="secondary" icon={Sparkles} className="w-full sm:w-auto">
              Scan Skills
            </Button>
          </div>

          <div className="mt-16 md:mt-20 pt-10 border-t-2 border-black dark:border-white/10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center relative z-10">
            {[
              { label: 'Students', value: '50k+' },
              { label: 'Colleges', value: '120+' },
              { label: 'Domains', value: '15+' },
              { label: 'Avg CTC', value: '₹12L' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-black text-black dark:text-white">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Review Section */}
          <div className="mt-16 md:mt-20 relative z-10 w-full max-w-4xl mx-auto">
              <div className="bg-pop-blue/20 dark:bg-white/5 border-2 border-black dark:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-none backdrop-blur-sm">
                  <div className="text-center md:text-left">
                      <h3 className="text-xl md:text-2xl font-black text-black dark:text-white uppercase font-brutal dark:font-sans mb-2">We value your opinion</h3>
                      <p className="text-zinc-600 dark:text-gray-400 font-bold dark:font-normal text-sm md:text-base">Help us improve Aspiring Adda by sharing your thoughts.</p>
                  </div>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfmhM2CPcf3tCXeR3XCL8IP7Z1Y_9F35OSuFDMPfnHzflhlDg/viewform"
                    target="_blank"
                    rel="noreferrer"
                    className="whitespace-nowrap w-full md:w-auto justify-center px-6 md:px-8 py-3 bg-black text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all dark:bg-nebula-teal dark:text-black dark:border-none dark:shadow-none dark:hover:scale-105 rounded-xl uppercase tracking-wider flex items-center gap-2"
                  >
                      <MessageSquare className="w-4 h-4" /> Review Us
                  </a>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Home;