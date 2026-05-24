import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { 
  Trophy, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Trash2, 
  MapPin, 
  Building2, 
  Heart, 
  ExternalLink,
  ShieldAlert,
  Compass,
  Zap,
  Target
} from 'lucide-react';
import { SPECIALIZATIONS, DEEP_DIVES } from '../constants';
import Button from '../components/Button';
import { Job } from '../types';

const LOCATIONS = ["Bangalore", "Remote", "Hyderabad", "Pune", "Gurgaon", "Mumbai", "Noida", "Chennai"];

const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    savedJobs, 
    toggleSaveJob,
    roadmapProgress, 
    aiRoadmaps, 
    deleteAIRoadmap,
    navigate,
    isDark
  } = useApp();

  // Reconstruct all jobs list to match saved jobs IDs and get details
  const allJobsMap = useMemo(() => {
    const jobsMap: Record<string, Job> = {};
    const bgs = ["bg-blue-500", "bg-emerald-500", "bg-black", "bg-rose-500", "bg-purple-500", "bg-orange-500"];
    
    SPECIALIZATIONS.forEach((spec) => {
      const companies = ["Google", "Microsoft", "Amazon", "Tesla", "Adobe", "Salesforce", "Atlassian", "Uber", "Flipkart", "Swiggy", "Zomato", "Paytm"];
      for (let i = 0; i < 12; i++) {
        const company = companies[(i + parseInt(spec.id.replace(/\D/g, ''))) % companies.length];
        const isStartup = i > 4;
        const bg = bgs[(i + parseInt(spec.id.replace(/\D/g, ''))) % bgs.length];
        
        const jobId = `job_${spec.id}_${i}`;
        jobsMap[jobId] = {
          id: jobId,
          title: spec.name,
          company,
          loc: LOCATIONS[i % LOCATIONS.length],
          sal: spec.salary,
          experience: ["Fresher (0-2y)", "Mid-Level (2-5y)", "Senior (5y+)"][i % 3],
          tags: [isStartup ? "Startup" : "MNC", ...spec.tags],
          bg,
          logoUrl: `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, '')}.com`,
          url: "#"
        };
      }
    });
    return jobsMap;
  }, []);

  // Filter saved jobs details
  const savedJobsList = useMemo(() => {
    return Array.from(savedJobs)
      .map(id => allJobsMap[id])
      .filter(Boolean);
  }, [savedJobs, allJobsMap]);

  // Check if authenticated
  if (!currentUser?.isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center p-5 relative z-10 w-full">
        <div className="card-base max-w-md w-full bg-white dark:bg-[#0a0a0a] text-center p-8 border-4 border-black dark:border-white/10 dark:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-16 h-16 bg-pop-yellow dark:bg-white/5 border-2 border-black dark:border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
            <ShieldAlert className="w-8 h-8 text-black dark:text-nebula-gold" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-3 font-brutal dark:font-sans">
            Authentication Required
          </h2>
          <p className="text-zinc-600 dark:text-gray-400 font-bold text-sm mb-8 leading-relaxed">
            Please sign in to access your personalized developer dashboard, monitor skill tracks, and compile custom AI roadmaps.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate('login')} 
              className="w-full bg-neo-purple text-black font-black hover:bg-neo-purple/90"
            >
              Sign In Now
            </Button>
            <button 
              onClick={() => navigate('home')}
              className="text-sm font-bold text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activePathsCount = Object.keys(roadmapProgress).length;
  const aiRoadmapsCount = aiRoadmaps.length;
  const savedJobsCount = savedJobs.size;

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* --- WELCOME HEADER BANNER --- */}
        <div className="relative mb-10 overflow-hidden border-4 border-black dark:border-white/10 rounded-2xl bg-pop-purple dark:bg-white/5 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
            <div className="w-full h-full bg-grid-pattern"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded-lg mb-3 tracking-widest">
                Developer HQ
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase leading-[0.9] font-brutal dark:font-sans">
                Greetings, {currentUser.name}!
              </h1>
              <p className="text-sm md:text-base font-bold text-zinc-900 dark:text-gray-400 mt-2">
                Your sandbox is primed. Launch roadmaps, log skill sets, and claim matching job offers.
              </p>
            </div>
            <Button 
              onClick={() => navigate('ai-roadmap')}
              className="bg-black text-white font-black hover:bg-zinc-800 dark:bg-nebula-teal dark:text-black dark:hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Generate AI Roadmap
            </Button>
          </div>
        </div>

        {/* --- STATS COUNTER GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {/* Active Tracks */}
          <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">Active Paths</p>
              <h3 className="text-3xl font-black text-black dark:text-white leading-none mt-1">{activePathsCount}</h3>
            </div>
            <div className="w-12 h-12 bg-pop-yellow dark:bg-white/10 border-2 border-black dark:border-white/20 rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              <Target className="w-6 h-6 text-black dark:text-nebula-teal" />
            </div>
          </div>

          {/* AI Roadmaps */}
          <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">AI Roadmaps</p>
              <h3 className="text-3xl font-black text-black dark:text-white leading-none mt-1">{aiRoadmapsCount}</h3>
            </div>
            <div className="w-12 h-12 bg-pop-green dark:bg-white/10 border-2 border-black dark:border-white/20 rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              <Sparkles className="w-6 h-6 text-black dark:text-nebula-gold" />
            </div>
          </div>

          {/* Saved Jobs */}
          <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">Saved Gigs</p>
              <h3 className="text-3xl font-black text-black dark:text-white leading-none mt-1">{savedJobsCount}</h3>
            </div>
            <div className="w-12 h-12 bg-pop-blue dark:bg-white/10 border-2 border-black dark:border-white/20 rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              <Briefcase className="w-6 h-6 text-black dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* --- MAIN GRID SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: ROADMAPS & PATH PROGRESS */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* 1. Custom AI Roadmaps section */}
            <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-black dark:text-nebula-gold" />
                  <h2 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white font-brutal dark:font-sans">
                    Custom AI Roadmaps
                  </h2>
                </div>
                <button 
                  onClick={() => navigate('ai-roadmap')}
                  className="text-xs font-black uppercase text-blue-600 hover:underline dark:text-nebula-teal flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Generate New
                </button>
              </div>

              {aiRoadmaps.length === 0 ? (
                <div className="py-12 px-4 border-2 border-dashed border-zinc-300 dark:border-white/10 rounded-xl text-center bg-zinc-50 dark:bg-black/20">
                  <Sparkles className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="font-bold text-sm text-zinc-500 dark:text-zinc-400">
                    No custom AI-generated roadmaps compiled yet.
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 mb-5">
                    Map any niche path (e.g. "Solidity Auditor in 4 weeks") using our prompt-driven system.
                  </p>
                  <Button 
                    onClick={() => navigate('ai-roadmap')}
                    className="bg-black text-white font-bold text-xs uppercase hover:bg-zinc-800 dark:bg-nebula-teal dark:text-black"
                  >
                    Build First AI Roadmap
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {aiRoadmaps.map((map) => {
                    const progressLevel = map.progress_level || 0;
                    const totalSteps = map.steps.length;
                    const percent = Math.min(100, Math.round((progressLevel / totalSteps) * 100));
                    
                    return (
                      <div 
                        key={map.id}
                        className="border-2 border-black dark:border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50 dark:bg-black/20 hover:scale-[1.01] transition-transform"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-md md:text-lg text-black dark:text-white uppercase truncate">
                              {map.title}
                            </h3>
                            <span className="px-2 py-0.5 border border-black bg-pop-green text-black text-[9px] font-black rounded uppercase tracking-wider dark:border-white/20">
                              AI Built
                            </span>
                          </div>
                          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1 max-w-md line-clamp-1">
                            Goal: {map.goal}
                          </p>
                          
                          {/* Progress bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 mb-1">
                              <span>PROGRESS</span>
                              <span>{progressLevel}/{totalSteps} STEPS ({percent}%)</span>
                            </div>
                            <div className="w-full h-3 border-2 border-black dark:border-white/25 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-pop-yellow dark:bg-nebula-teal transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <Button 
                            onClick={() => navigate('ai-roadmap', { aiRoadmapId: map.id })}
                            className="bg-black text-white py-1.5 px-3 text-xs font-bold hover:bg-zinc-800 dark:bg-white dark:text-black"
                          >
                            Resume <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                          <button 
                            onClick={() => deleteAIRoadmap(map.id)}
                            className="p-2 border-2 border-black text-red-500 hover:bg-red-50 dark:border-white/10 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Delete Roadmap"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Active Standard Specialization Tracks */}
            <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-black dark:text-nebula-teal" />
                  <h2 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white font-brutal dark:font-sans">
                    Standard Tracks Progress
                  </h2>
                </div>
                <button 
                  onClick={() => navigate('explore')}
                  className="text-xs font-black uppercase text-blue-600 hover:underline dark:text-nebula-teal flex items-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" /> Browse All Paths
                </button>
              </div>

              {activePathsCount === 0 ? (
                <div className="py-12 px-4 border-2 border-dashed border-zinc-300 dark:border-white/10 rounded-xl text-center bg-zinc-50 dark:bg-black/20">
                  <Trophy className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="font-bold text-sm text-zinc-500 dark:text-zinc-400">
                    No curriculum specialization tracks started yet.
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 mb-5">
                    Start a predefined roadmap from our rich developer curricula catalog.
                  </p>
                  <Button 
                    onClick={() => navigate('explore')}
                    className="bg-black text-white font-bold text-xs uppercase hover:bg-zinc-800 dark:bg-nebula-teal dark:text-black"
                  >
                    Explore Developer Paths
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {Object.entries(roadmapProgress).map(([specId, level]) => {
                    const spec = SPECIALIZATIONS.find(s => s.id === specId);
                    if (!spec) return null;

                    const totalSteps = DEEP_DIVES[specId]?.steps?.length || 5;
                    const percent = Math.min(100, Math.round((level / totalSteps) * 100));

                    return (
                      <div 
                        key={specId}
                        className="border-2 border-black dark:border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50 dark:bg-black/20 hover:scale-[1.01] transition-transform"
                      >
                        <div className="flex-1">
                          <h3 className="font-black text-md md:text-lg text-black dark:text-white uppercase truncate">
                            {spec.name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            <span>Curriculum Track</span>
                            <span>•</span>
                            <span className="font-bold text-black dark:text-white">{spec.salary} avg / yr</span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 mb-1">
                              <span>PROGRESS</span>
                              <span>{level}/{totalSteps} STEPS ({percent}%)</span>
                            </div>
                            <div className="w-full h-3 border-2 border-black dark:border-white/25 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-neo-purple dark:bg-nebula-gold transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Resume button */}
                        <div className="shrink-0 self-end md:self-center">
                          <Button 
                            onClick={() => navigate('detail', { specId: spec.id })}
                            className="bg-black text-white py-1.5 px-3 text-xs font-bold hover:bg-zinc-800 dark:bg-white dark:text-black"
                          >
                            Continue Path <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: QUICK LINKS & SAVED JOBS */}
          <div className="flex flex-col gap-8">
            
            {/* Quick Actions Card */}
            <div className="border-4 border-black dark:border-white/10 bg-pop-yellow dark:bg-white/5 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              <h3 className="text-lg font-black uppercase text-black dark:text-white border-b-2 border-black dark:border-white/10 pb-2 mb-4 font-brutal dark:font-sans">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => navigate('ai-roadmap')}
                  className="w-full py-2 px-4 border-2 border-black dark:border-white/20 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-white/5 text-black dark:text-white font-bold text-xs uppercase rounded-lg text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-nebula-gold" /> AI Roadmap Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => navigate('jobs')}
                  className="w-full py-2 px-4 border-2 border-black dark:border-white/20 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-white/5 text-black dark:text-white font-bold text-xs uppercase rounded-lg text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-purple-400" /> Career Job Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => navigate('soft-skills')}
                  className="w-full py-2 px-4 border-2 border-black dark:border-white/20 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-white/5 text-black dark:text-white font-bold text-xs uppercase rounded-lg text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-pop-yellow" /> Power Soft Skills</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Saved Gigs Summary */}
            <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <h2 className="text-lg font-black uppercase text-black dark:text-white font-brutal dark:font-sans">
                    Saved Gigs ({savedJobsCount})
                  </h2>
                </div>
                {savedJobsCount > 0 && (
                  <button 
                    onClick={() => navigate('jobs')}
                    className="text-[10px] font-black uppercase text-blue-600 hover:underline dark:text-nebula-teal"
                  >
                    View All
                  </button>
                )}
              </div>

              {savedJobsList.length === 0 ? (
                <div className="py-8 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-xl text-center bg-zinc-50 dark:bg-black/10">
                  <Heart className="w-8 h-8 text-zinc-300 dark:text-zinc-800 mx-auto mb-2" />
                  <p className="font-bold text-xs text-zinc-400 dark:text-zinc-500">
                    No active job applications cataloged.
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 px-4 mt-1 mb-4">
                    Heart jobs on our Job Board to track application signals here.
                  </p>
                  <Button 
                    onClick={() => navigate('jobs')}
                    className="bg-black text-white font-bold text-[10px] py-1 px-3 uppercase hover:bg-zinc-800 dark:bg-nebula-teal dark:text-black"
                  >
                    Browse Jobs
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {savedJobsList.slice(0, 4).map((job) => (
                    <div 
                      key={job.id}
                      className="border border-black dark:border-white/10 bg-zinc-50 dark:bg-black/20 rounded-xl p-3 flex flex-col gap-2 relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-black text-xs md:text-sm text-black dark:text-white uppercase truncate font-brutal dark:font-sans leading-tight">
                            {job.title}
                          </h4>
                          <p className="text-[10px] font-bold text-zinc-500 dark:text-gray-400 truncate">
                            {job.company} • {job.loc}
                          </p>
                        </div>
                        <button 
                          onClick={() => toggleSaveJob(job.id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 rounded transition-colors"
                          title="Remove from Saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <a
                        href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title} ${job.company}`)}&location=${encodeURIComponent(job.loc)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-1 py-1.5 bg-blue-600 text-white font-bold rounded border border-black text-[10px] uppercase tracking-wider dark:border-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:shadow-none hover:shadow-none"
                      >
                        Apply <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                  {savedJobsCount > 4 && (
                    <p className="text-[10px] font-black text-center text-zinc-400 dark:text-zinc-500 uppercase mt-1">
                      + {savedJobsCount - 4} more saved jobs
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
