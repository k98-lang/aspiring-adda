import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-black mt-auto w-full">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
        <p>
          © 2026 <b>Aspiring Adda</b> Pro. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;