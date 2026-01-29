import React, { useMemo } from 'react';
import { Search, X, Heart } from 'lucide-react';
import { useApp } from '../AppContext';
import { AVAILABLE_SKILLS, SPECIALIZATIONS } from '../constants';
import { Job } from '../types';
import Button from '../components/Button';

const LOCATIONS = ["Bangalore", "Remote", "Hyderabad", "Pune", "Gurgaon", "Mumbai", "Noida", "Chennai"];

const Jobs: React.FC = () => {
  const {
    view,
    searchTerm, setSearchTerm,
    jobFilter, setJobFilter,
    locationFilter, setLocationFilter,
    userSkills, toggleUserSkill,
    savedJobs, toggleSaveJob,
    isDark
  } = useApp();

  const isSavedView = view === 'saved';

  const allJobs: Job[] = useMemo(() => {
    const jobs: Job[] = [];
    const bgs = ["bg-blue-500", "bg-emerald-500", "bg-black", "bg-rose-500", "bg-purple-500", "bg-orange-500"];

    SPECIALIZATIONS.forEach((spec) => {
        const companies = ["Google", "Microsoft", "Amazon", "Tesla", "Adobe", "Salesforce", "Atlassian", "Uber", "Flipkart", "Swiggy", "Zomato", "Paytm"];

        let extraSkills: string[] = [];
        if (spec.id === 's1') extraSkills = ["React", "Node.js", "AWS"];
        else if (spec.id === 's2') extraSkills = ["Python", "Data", "AWS"];
        else if (spec.id === 's3') extraSkills = ["AWS", "Python"];
        else if (spec.id === 's4') extraSkills = ["Mobile", "React"];
        else if (spec.id === 's12') extraSkills = ["Security", "Python"];
        else if (spec.id === 's13') extraSkills = ["Gaming", "Design"];
        else if (spec.id === 's5') extraSkills = ["Management", "Data"];
        else if (spec.id === 's6') extraSkills = ["Marketing", "Design"];
        else if (spec.id === 's7') extraSkills = ["Design"];
        else if (spec.id === 's14') extraSkills = ["Blockchain", "Security"];
        else if (spec.id === 's15') extraSkills = ["Finance", "Data"];
        else if (spec.id === 's16') extraSkills = ["HR", "Management"];

        // Increased loop to 12 to ensure all locations (8 total) are covered via the modulo operator
        for (let i = 0; i < 12; i++) {
            const company = companies[(i + parseInt(spec.id.replace(/\D/g, ''))) % companies.length];
            const isStartup = i > 4;
            const bg = bgs[(i + parseInt(spec.id.replace(/\D/g, ''))) % bgs.length];

            if (extraSkills.length === 0) {
                extraSkills = [AVAILABLE_SKILLS[Math.floor(Math.random() * AVAILABLE_SKILLS.length)]];
            }

            jobs.push({
                id: `job_${spec.id}_${i}`,
                title: spec.name,
                company,
                loc: LOCATIONS[i % LOCATIONS.length],
                sal: spec.salary,
                experience: ["Fresher (0-2y)", "Mid-Level (2-5y)", "Senior (5y+)"][i % 3],
                tags: [isStartup ? "Startup" : "MNC", ...spec.tags, ...extraSkills],
                bg,
                logoUrl: `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, '')}.com`,
                url: "#"
            });
        }
    });
    return jobs;
  }, []);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(j => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = j.title.toLowerCase().includes(term) ||
                              j.company.toLowerCase().includes(term) ||
                              j.loc.toLowerCase().includes(term);
        const matchesExperience = jobFilter === 'All' || j.experience === jobFilter;
        const matchesLocation = locationFilter === 'All' || j.loc === locationFilter;
        const matchesSkills = userSkills.size === 0 || j.tags.some(t => userSkills.has(t));
        const baseMatch = matchesSearch && matchesExperience && matchesLocation && matchesSkills;
        if (isSavedView) return savedJobs.has(j.id) && baseMatch;
        return baseMatch;
    });
  }, [allJobs, searchTerm, jobFilter, locationFilter, userSkills, savedJobs, isSavedView]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 relative z-10">
      <div className={`card-base p-8 mb-12 flex flex-col md:flex-row justify-between items-end gap-6 ${isDark ? 'bg-white/5' : 'bg-pop-green'}`}>
        <div>
          <h2 className="text-5xl font-black text-black dark:text-white mb-2 uppercase font-brutal dark:font-sans">
            {isSavedView ? 'Saved Jobs' : 'Job Board'}
          </h2>
          <p className="font-bold text-black dark:text-gray-400">Hunt or be hunted.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-lg font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all dark:bg-black/50 dark:border-white/20 dark:text-white dark:shadow-none dark:focus:border-nebula-teal dark:rounded-xl"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-black dark:text-white" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3.5 text-zinc-400 hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <Button onClick={() => { setSearchTerm(''); setJobFilter('All'); setLocationFilter('All'); toggleUserSkill(''); }} variant="secondary">
              Clear
          </Button>
        </div>
      </div>

      {!isSavedView && (
        <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-2">
                {AVAILABLE_SKILLS.map(skill => (
                    <button
                        key={skill}
                        onClick={() => toggleUserSkill(skill)}
                        className={`px-4 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors dark:border-white/20 dark:text-gray-400 dark:hover:bg-nebula-gold dark:hover:text-black dark:hover:border-nebula-gold dark:rounded-full ${userSkills.has(skill) ? 'bg-black text-white dark:bg-nebula-gold dark:text-black' : 'bg-white dark:bg-transparent'}`}
                    >
                        {skill}
                    </button>
                ))}
            </div>

            <div>
                 <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Experience</div>
                 <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['All', 'Fresher (0-2y)', 'Mid-Level (2-5y)', 'Senior (5y+)'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setJobFilter(filter)}
                          className={`px-5 py-2 rounded-full text-sm font-bold border-2 border-black whitespace-nowrap transition-all ${jobFilter === filter ? 'bg-black text-white dark:bg-white dark:text-black dark:border-white' : 'bg-white text-black hover:bg-zinc-100 dark:bg-transparent dark:text-zinc-400 dark:border-zinc-700'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
             <div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Location</div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['All', ...LOCATIONS].map(loc => (
                        <button
                          key={loc}
                          onClick={() => setLocationFilter(loc)}
                           className={`px-5 py-2 rounded-full text-sm font-bold border-2 border-black whitespace-nowrap transition-all ${locationFilter === loc ? 'bg-black text-white dark:bg-white dark:text-black dark:border-white' : 'bg-white text-black hover:bg-zinc-100 dark:bg-transparent dark:text-zinc-400 dark:border-zinc-700'}`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.length === 0 && (
              <div className="col-span-full p-12 text-center text-zinc-500 bg-white border-2 border-dashed border-black dark:bg-white/5 dark:border-white/10 dark:text-gray-400">
                  <h3 className="text-xl font-bold">No gigs found.</h3>
                  <p>Try adjusting your filters.</p>
              </div>
          )}
          {filteredJobs.map((job) => (
              <div key={job.id} className="card-base p-6 flex items-center justify-between gap-6 group cursor-pointer bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10">
                  <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center dark:border-white/10 dark:bg-black dark:rounded-lg text-2xl font-black text-black dark:text-white relative overflow-hidden shrink-0 rounded-lg">
                          <span className="z-0">{job.company[0]}</span>
                          <img
                            src={job.logoUrl}
                            alt={job.company}
                            loading="lazy"
                            className="w-full h-full object-contain p-2 absolute inset-0 bg-white dark:bg-black z-10 transition-opacity duration-300"
                            onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                          />
                      </div>
                      <div>
                          <h3 className="font-black text-xl text-black uppercase dark:text-white font-brutal dark:font-sans transition-colors">{job.title}</h3>
                          <p className="text-sm font-bold text-zinc-500 mt-1 dark:text-zinc-400">{job.company} • {job.loc}</p>
                          <div className="flex gap-2 mt-2">
                              {job.tags.slice(0,2).map(t => <span key={t} className="text-[10px] uppercase font-bold border border-black px-1 dark:border-white/20 dark:text-gray-300 dark:rounded-sm">{t}</span>)}
                          </div>
                      </div>
                  </div>
                  <button onClick={() => toggleSaveJob(job.id)} className={`p-3 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors dark:border-white/10 dark:bg-transparent dark:hover:bg-red-900/20 dark:hover:text-red-500 dark:rounded-full ${savedJobs.has(job.id) ? 'bg-red-500 text-white dark:text-red-500' : 'text-black dark:text-gray-400'}`}>
                      <Heart className={`w-5 h-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                  </button>
              </div>
          ))}
      </div>
    </div>
  );
};

export default Jobs;