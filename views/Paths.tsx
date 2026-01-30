import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../AppContext';
import { COURSES, SPECIALIZATIONS } from '../constants';

const Paths: React.FC = () => {
  const { selectedCourseId, navigate, isDark } = useApp();
  const course = COURSES.find((c) => c.id === selectedCourseId);
  const paths = SPECIALIZATIONS.filter((s) => s.courseId === selectedCourseId);

  if (!course) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-zinc-500 mb-4">No course selected.</p>
            <button onClick={() => navigate('explore')} className="text-indigo-600 hover:underline">Go to Explore</button>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 md:py-32 relative z-10">
      <button
        onClick={() => navigate('explore')}
        className="mb-8 md:mb-12 px-6 py-2 border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all font-bold flex items-center gap-2 dark:bg-white/5 dark:text-white dark:border-white/10 dark:shadow-none dark:rounded-full dark:hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-12 md:mb-16 p-6 md:p-8 border-2 border-black dark:border-white/10 bg-white dark:bg-white/5 dark:rounded-2xl dark:backdrop-blur-md">
         <h2 className="text-3xl md:text-5xl font-black mb-2 uppercase text-black dark:text-white font-brutal dark:font-sans">{course.name}</h2>
         <p className="text-lg md:text-xl font-bold text-gray-500 dark:text-gray-400">Found: {paths.length} Tracks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map((s) => (
          <div
            key={s.id}
            onClick={() => navigate('detail', { specId: s.id })}
            className="card-base p-6 cursor-pointer group flex flex-col justify-between"
          >
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                        {s.tags.map(t => <span key={t} className="px-2 py-1 text-[10px] font-bold uppercase border border-black dark:border-white/10 bg-gray-50 dark:bg-white/5 text-black dark:text-gray-300 dark:rounded-md">{t}</span>)}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-black dark:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2 uppercase leading-tight group-hover:underline decoration-2 underline-offset-4 font-brutal dark:font-sans">{s.name}</h3>
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t-2 border-dashed border-black dark:border-white/10">
                <div className="flex justify-between font-bold text-sm">
                    <span className="text-gray-500 dark:text-gray-500">AVG. SALARY</span>
                    <span className="text-black dark:text-white bg-pop-yellow dark:bg-transparent px-1">{s.salary}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                    <span className="text-gray-500 dark:text-gray-500">GROWTH</span>
                    <span className={`${s.growth.includes('High') || s.growth.includes('Explosive') ? 'text-green-600 dark:text-nebula-teal' : 'text-blue-600 dark:text-blue-400'}`}>
                      {s.growth}
                    </span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Paths;