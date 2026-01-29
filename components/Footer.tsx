import React from 'react';
import { MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-black mt-auto w-full">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
        <p>
          © 2026 <b>Aspiring Adda</b> Pro. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0 items-center">
           <a href="https://docs.google.com/forms/d/e/1FAIpQLSfmhM2CPcf3tCXeR3XCL8IP7Z1Y_9F35OSuFDMPfnHzflhlDg/viewform" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2 font-bold">
             <MessageSquare className="w-3 h-3" /> Review Us
          </a>
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