import React from 'react';
import { Mail, Linkedin } from 'lucide-react';
import { TEAM_DATA } from '../constants';

const Team: React.FC = () => {
  const { mentor, members } = TEAM_DATA;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative z-10">
        <div className="text-center mb-12 md:mb-16">
            <span className="bg-white dark:bg-[#050508] px-4 text-black dark:text-gray-500 text-xs md:text-sm font-black uppercase tracking-widest border-2 border-black dark:border-white/10 inline-block mb-4 py-1">OUR SQUAD</span>
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase text-black dark:text-white font-brutal dark:font-sans">Meet the Team</h2>
            <p className="text-lg md:text-xl font-bold text-zinc-500 dark:text-zinc-400 dark:font-normal">The brilliant minds and creative souls dedicated to building Aspiring Adda.</p>
        </div>

        {/* Mentor */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20 transform md:hover:scale-105 transition-transform duration-200">
            <div className="card-base p-6 md:p-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-white dark:bg-white/5 border-2 border-black dark:border-white/10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-none relative">
                <div className="absolute top-0 right-0 p-4 hidden md:block">
                    <span className="bg-neo-yellow dark:bg-nebula-gold/20 text-black dark:text-nebula-gold text-xs font-bold px-3 py-1 border-2 border-black dark:border-nebula-gold uppercase dark:rounded-md">{mentor.role}</span>
                </div>

                <div className="md:hidden mb-2">
                     <span className="bg-neo-yellow dark:bg-nebula-gold/20 text-black dark:text-nebula-gold text-xs font-bold px-3 py-1 border-2 border-black dark:border-nebula-gold uppercase dark:rounded-md">{mentor.role}</span>
                </div>

                <div className="w-24 h-24 md:w-40 md:h-40 shrink-0 rounded-full border-4 border-black bg-neo-yellow flex items-center justify-center text-black font-black text-4xl md:text-6xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-nebula-gold dark:bg-nebula-gold/10 dark:text-nebula-gold dark:shadow-none">
                    {mentor.name.charAt(0)}
                </div>

                <div className="text-center md:text-left flex-1">
                    <h3 className="font-black text-2xl md:text-3xl text-black dark:text-white mb-2 uppercase font-brutal dark:font-sans">{mentor.name}</h3>
                    <p className="text-zinc-500 font-bold dark:text-gray-400 dark:font-light mb-6 text-base md:text-lg">{mentor.desc}</p>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6 text-sm font-bold text-zinc-600 dark:text-gray-300">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4" /> <a href={`mailto:${mentor.email}`} className="hover:underline">{mentor.email}</a>
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-start gap-4">
                        <a href={mentor.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-blue-600 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 dark:rounded-full dark:hover:shadow-none font-bold text-sm">
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div className="border-t-2 border-black dark:border-white/10 my-16 flex items-center justify-center">
            <span className="bg-white dark:bg-[#050508] px-4 text-black dark:text-gray-500 text-sm font-black uppercase tracking-widest -mt-3 border-2 border-black dark:border-white/10">Core Members</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((p) => (
                <div key={p.name} className="card-base p-8 flex flex-col items-center text-center bg-white dark:bg-white/5">
                    <div className="w-24 h-24 rounded-full border-2 border-black bg-neo-yellow p-1 mb-6 dark:border-white/20 dark:bg-transparent">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-3xl text-black dark:bg-black dark:text-white border-2 border-black dark:border-none">{p.name.charAt(0)}</div>
                    </div>
                    <h4 className="font-black text-xl text-black mb-1 dark:text-white uppercase font-brutal dark:font-sans">{p.name}</h4>
                    <p className="text-xs font-bold bg-black text-white px-2 py-1 mb-6 dark:bg-nebula-gold dark:text-black dark:rounded-md uppercase">{p.role}</p>

                    <div className="space-y-3 w-full mb-8 border-t-2 border-b-2 border-black/10 dark:border-white/10 py-6">
                        <div className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" /> <a href={`mailto:${p.email}`} className="hover:text-black dark:hover:text-white transition-colors truncate max-w-[150px]">{p.email}</a>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-auto">
                        <a href={p.linkedin} target="_blank" rel="noreferrer" className="p-2 border-2 border-black hover:bg-blue-600 hover:text-white transition-colors dark:border-white/20 dark:text-gray-400 dark:hover:text-white dark:rounded-full">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Team;