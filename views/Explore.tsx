import React from 'react';
import { ArrowRight, Cpu, Code2, Briefcase, Palette, Microscope, Building2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { COURSES } from '../constants';

const icons: any = {
  cpu: Cpu,
  'code-2': Code2,
  briefcase: Briefcase,
  palette: Palette,
  microscope: Microscope,
  'building-2': Building2
};

const Explore: React.FC = () => {
  const { navigate, isDark } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative z-10">
      <div className="mb-12 md:mb-16 border-b-2 border-black dark:border-white/10 pb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2 uppercase font-brutal dark:font-sans">
          Select Domain
        </h2>
        <p className="text-lg md:text-xl font-medium text-gray-500 dark:text-gray-400">
          Choose your operating environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {COURSES.map((c) => {
          const Icon = icons[c.icon] || Cpu;
          return (
            <div
              key={c.id}
              onClick={() => navigate('paths', { courseId: c.id })}
              className={`p-6 md:p-8 cursor-pointer group h-full flex flex-col justify-between card-base ${c.bgLight} dark:bg-white/5`}
            >
              <div>
                <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-black dark:border-white/20 flex items-center justify-center mb-6 text-black dark:text-white bg-white dark:bg-white/5 shadow-[3px_3px_0px_0px_#000] dark:shadow-none dark:rounded-xl">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2 uppercase tracking-tight font-brutal dark:font-sans">{c.name}</h3>
                <p className="text-xs font-bold bg-black text-white px-2 py-1 w-fit mb-4 dark:bg-white/10 dark:text-nebula-teal dark:rounded-md">
                  {c.full}
                </p>
                <p className="text-sm md:text-base font-bold text-gray-500 dark:text-gray-400 leading-relaxed mb-8 dark:font-light">{c.desc}</p>
              </div>

              <div className="pt-6 border-t-2 border-black dark:border-white/10 flex items-center justify-between group-hover:pl-2 transition-all">
                <span className="font-bold text-sm text-black dark:text-white uppercase tracking-wider">Access</span>
                <ArrowRight className="w-5 h-5 text-black dark:text-nebula-teal" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;