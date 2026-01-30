
import React, { useMemo, useState } from 'react';
import { Search, X, Heart, ExternalLink, MapPin, Building2, Briefcase, Filter, BookOpen, BrainCircuit, Check, Trophy } from 'lucide-react';
import { useApp } from '../AppContext';
import { AVAILABLE_SKILLS, SPECIALIZATIONS, DEEP_DIVES } from '../constants';
import { Job, QuizQuestion } from '../types';
import Button from '../components/Button';

const LOCATIONS = ["Bangalore", "Remote", "Hyderabad", "Pune", "Gurgaon", "Mumbai", "Noida", "Chennai"];

// Expanded Question Bank for Randomization
const SKILL_QUESTIONS: Record<string, QuizQuestion[]> = {
    "React": [
        { q: "What is a React Component?", o: ["A database table", "A JavaScript function/class", "A server endpoint", "A CSS style"], a: 1 },
        { q: "What hook manages state?", o: ["useEffect", "useReducer", "useState", "useContext"], a: 2 },
        { q: "What is JSX?", o: ["Java XML", "JavaScript XML", "JSON XML", "Java Syntax"], a: 1 },
        { q: "How do you pass data to child components?", o: ["State", "Props", "Context", "Redux"], a: 1 },
        { q: "What is the Virtual DOM?", o: ["A virus", "A lightweight copy of DOM", "A heavy database", "A browser plugin"], a: 1 },
        { q: "Which hook handles side effects?", o: ["useState", "useMemo", "useEffect", "useCallback"], a: 2 },
        { q: "What prevents re-renders?", o: ["React.memo", "React.stop", "React.block", "React.prevent"], a: 0 }
    ],
    "Node.js": [
        { q: "What is Node.js?", o: ["A runtime environment", "A programming language", "A framework", "A database"], a: 0 },
        { q: "Which core module works with files?", o: ["http", "os", "fs", "path"], a: 2 },
        { q: "What is npm?", o: ["Node Process Manager", "New Project Maker", "Node Package Manager", "None"], a: 2 },
        { q: "How do you handle async code?", o: ["Loops", "Callbacks/Promises", "Variables", "CSS"], a: 1 },
        { q: "What is Express.js?", o: ["A database", "A framework for Node", "A frontend lib", "A testing tool"], a: 1 },
        { q: "Which event loop phase executes setTimeout?", o: ["Poll", "Check", "Timers", "Close"], a: 2 }
    ],
    "Python": [
        { q: "How do you define a function?", o: ["function myFunc()", "def myFunc():", "func myFunc{}", "lambda()"], a: 1 },
        { q: "Which is a Python list?", o: ["{1,2,3}", "[1,2,3]", "(1,2,3)", "<1,2,3>"], a: 1 },
        { q: "What is Pandas used for?", o: ["Web Dev", "Game Dev", "Data Analysis", "Security"], a: 2 },
        { q: "What is a tuple?", o: ["Mutable list", "Immutable list", "Dictionary", "Set"], a: 1 },
        { q: "How do you install packages?", o: ["npm install", "pip install", "apt-get", "brew"], a: 1 },
        { q: "What is PEP 8?", o: ["A game", "Style guide", "Compiler", "Database"], a: 1 }
    ],
    "Data": [
        { q: "What is SQL?", o: ["Structured Query Language", "Strong Question Logic", "Server Query Loop", "None"], a: 0 },
        { q: "What is a DataFrame?", o: ["A 2D data structure", "A video frame", "A database key", "A network packet"], a: 0 },
        { q: "Mean vs Median?", o: ["Average vs Middle", "Total vs Average", "Middle vs Mode", "Same thing"], a: 0 },
        { q: "What is data cleaning?", o: ["Deleting data", "Fixing errors/missing values", "Formatting hard drive", "Printing data"], a: 1 },
        { q: "Which is a visualization tool?", o: ["Tableau", "Notepad", "Git", "Docker"], a: 0 }
    ],
    "Design": [
        { q: "What is UX?", o: ["User Xenon", "User Experience", "Unified Xylophone", "Ultra Extreme"], a: 1 },
        { q: "RGB stands for?", o: ["Red Green Blue", "Red Gold Black", "Real Good Background", "None"], a: 0 },
        { q: "What is wireframing?", o: ["Coding", "Blueprint design", "Networking", "3D Modeling"], a: 1 },
        { q: "What is white space?", o: ["Empty area", "White paint", "Error code", "Loading screen"], a: 0 },
        { q: "Which tool is for vector graphics?", o: ["Photoshop", "Illustrator", "Premiere", "Excel"], a: 1 }
    ],
    "AWS": [
        { q: "What is EC2?", o: ["Virtual Server", "Database", "Storage", "DNS"], a: 0 },
        { q: "What is S3 used for?", o: ["Computing", "Object Storage", "Networking", "Caching"], a: 1 },
        { q: "What manages permissions?", o: ["IAM", "EC2", "RDS", "VPC"], a: 0 },
        { q: "What is Lambda?", o: ["Serverless Compute", "Database", "Container", "Firewall"], a: 0 }
    ]
};

const GENERIC_POOL: QuizQuestion[] = [
    { q: "What is the most important soft skill?", o: ["Communication", "Typing speed", "Gaming", "Memorization"], a: 0 },
    { q: "How do you handle failure?", o: ["Quit", "Learn & Iterate", "Blame others", "Hide"], a: 1 },
    { q: "Why do you want this job?", o: ["Money only", "Growth & Impact", "Free food", "No idea"], a: 1 },
    { q: "What is a deadline?", o: ["A suggestion", "A hard limit", "Optional", "Flexible"], a: 1 },
    { q: "Teamwork means?", o: ["Working alone", "Collaboration", "Fighting", "Ignoring others"], a: 1 },
    { q: "What is Git?", o: ["Version Control", "A game", "A social network", "A virus"], a: 0 },
    { q: "What is Agile?", o: ["Yoga pose", "Project Mgmt Methodology", "A programming language", "A database"], a: 1 }
];

const Jobs: React.FC = () => {
  const {
    view,
    searchTerm, setSearchTerm,
    jobFilter, setJobFilter,
    locationFilter, setLocationFilter,
    userSkills, toggleUserSkill,
    savedJobs, toggleSaveJob,
    isDark,
    currentUser,
    navigate
  } = useApp();

  const [activeQuiz, setActiveQuiz] = useState<{
      job: Job;
      questions: QuizQuestion[];
      currentQ: number;
      answers: (number | null)[];
      score: number | null;
  } | null>(null);

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

        const deepDive = DEEP_DIVES[spec.id] || DEEP_DIVES['default'];
        const jobResources = deepDive.roadmap ? deepDive.roadmap.flatMap(step => step.resources || []).slice(0, 3) : [];

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
                url: "#",
                studyResources: jobResources
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

  // Helper to get 3 random questions from a pool
  const getRandomQuestions = (pool: QuizQuestion[], count: number) => {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
  };

  const startJobQuiz = (job: Job) => {
      if (!currentUser) {
          navigate('login');
          return;
      }

      let questionPool: QuizQuestion[] = [];

      // Aggregate questions from all matching tags
      for (const tag of job.tags) {
          if (SKILL_QUESTIONS[tag]) {
              questionPool = [...questionPool, ...SKILL_QUESTIONS[tag]];
          }
      }

      // If we didn't find specific skill questions, use generic pool
      if (questionPool.length === 0) {
          questionPool = [...GENERIC_POOL];
      }

      // Ensure we have enough unique questions by filling with generic if needed
      if (questionPool.length < 3) {
          questionPool = [...questionPool, ...GENERIC_POOL];
      }

      // Deduplicate questions based on text 'q' to avoid repeats if pools overlap
      const uniquePool = Array.from(new Map(questionPool.map(item => [item.q, item])).values());

      const selectedQuestions = getRandomQuestions(uniquePool, 3);

      setActiveQuiz({
          job,
          questions: selectedQuestions,
          currentQ: 0,
          answers: new Array(selectedQuestions.length).fill(null),
          score: null
      });
  };

  const answerQuiz = (optIdx: number) => {
      if (!activeQuiz) return;
      const newAnswers = [...activeQuiz.answers];
      newAnswers[activeQuiz.currentQ] = optIdx;
      setActiveQuiz({ ...activeQuiz, answers: newAnswers });
  };

  const nextQuestion = () => {
      if (!activeQuiz) return;
      if (activeQuiz.currentQ < activeQuiz.questions.length - 1) {
          setActiveQuiz({ ...activeQuiz, currentQ: activeQuiz.currentQ + 1 });
      } else {
          // Calculate Score
          let correct = 0;
          activeQuiz.questions.forEach((q, i) => {
              if (activeQuiz.answers[i] === q.a) correct++;
          });
          setActiveQuiz({ ...activeQuiz, score: (correct / activeQuiz.questions.length) * 100 });
      }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* --- HEADER SECTION --- */}
        <div className="mb-6 md:mb-10">
          <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase font-brutal dark:font-sans leading-[0.9] mb-2">
            {isSavedView ? 'Saved Gigs' : 'Job Board'}
          </h2>
          <p className="text-sm md:text-lg font-bold text-zinc-500 dark:text-gray-400">
            {isSavedView ? 'Your curated collection.' : 'Hunt or be hunted.'}
          </p>
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="flex flex-col gap-5 mb-8">
            {/* Search Bar */}
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search roles, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 md:py-4 bg-white border-2 border-black rounded-xl font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all dark:bg-black/50 dark:border-white/20 dark:text-white dark:shadow-none text-sm md:text-base"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-white" />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 rounded-full dark:hover:bg-white/10"
                    >
                        <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                )}
            </div>

            {/* Filter Scrollers Container */}
            {!isSavedView && (
                <div className="flex flex-col gap-4">
                    {/* Skills Row */}
                    <div>
                         <div className="flex items-center gap-2 mb-2 px-1">
                            <Filter className="w-3 h-3 text-zinc-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Skills</span>
                         </div>
                         <div className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 no-scrollbar snap-x">
                            {AVAILABLE_SKILLS.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleUserSkill(skill)}
                                    className={`snap-start shrink-0 px-3 py-1.5 border-2 font-bold uppercase text-[10px] md:text-xs rounded-lg transition-all ${userSkills.has(skill)
                                        ? 'bg-black text-white border-black dark:bg-nebula-gold dark:text-black dark:border-nebula-gold'
                                        : 'bg-white text-black border-black dark:bg-transparent dark:text-gray-400 dark:border-white/20'}`}
                                >
                                    {skill}
                                </button>
                            ))}
                         </div>
                    </div>

                    {/* Exp & Loc Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Experience */}
                        <div className="overflow-hidden">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Level</span>
                            <div className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 no-scrollbar">
                                {['All', 'Fresher (0-2y)', 'Mid-Level (2-5y)', 'Senior (5y+)'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setJobFilter(f)}
                                        className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-bold border-2 whitespace-nowrap transition-all ${jobFilter === f
                                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                            : 'bg-white text-zinc-600 border-black dark:bg-transparent dark:text-zinc-500 dark:border-zinc-700'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Location */}
                        <div className="overflow-hidden">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Zone</span>
                            <div className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 no-scrollbar">
                                {['All', ...LOCATIONS].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLocationFilter(l)}
                                        className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-bold border-2 whitespace-nowrap transition-all ${locationFilter === l
                                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                            : 'bg-white text-zinc-600 border-black dark:bg-transparent dark:text-zinc-500 dark:border-zinc-700'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {(userSkills.size > 0 || jobFilter !== 'All' || locationFilter !== 'All') && (
                        <button
                            onClick={() => { setJobFilter('All'); setLocationFilter('All'); toggleUserSkill(''); }}
                            className="self-start text-xs font-bold text-red-500 hover:underline px-1"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* --- JOB LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
            {filteredJobs.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-black rounded-2xl bg-white/50 dark:border-white/10 dark:bg-white/5">
                    <p className="font-bold text-zinc-500 dark:text-gray-400">No active signals found.</p>
                </div>
            )}

            {filteredJobs.map((job) => (
                <div
                    key={job.id}
                    className="card-base p-4 flex flex-col gap-3 relative group bg-white dark:bg-white/5 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:!shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:!shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all dark:!shadow-none dark:hover:bg-white/10"
                >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Logo */}
                            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 border-2 border-black bg-white flex items-center justify-center rounded-lg overflow-hidden dark:bg-black dark:border-white/10 relative">
                                <span className="font-black text-lg text-black dark:text-white z-0">{job.company[0]}</span>
                                <img
                                    src={job.logoUrl}
                                    alt={job.company}
                                    className="absolute inset-0 w-full h-full object-contain bg-white p-1 dark:bg-black z-10 transition-opacity duration-300"
                                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                                />
                            </div>

                            {/* Title Info */}
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm md:text-lg font-black uppercase text-black dark:text-white truncate font-brutal dark:font-sans leading-tight">
                                    {job.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-zinc-500 dark:text-zinc-400 truncate">
                                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {job.company}</span>
                                    <span className="hidden md:flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.loc}</span>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                            className={`shrink-0 p-2 rounded-lg border-2 border-black transition-colors dark:border-white/10 ${savedJobs.has(job.id) ? 'bg-red-50 text-red-500 border-red-500 dark:bg-red-900/20 dark:border-red-500' : 'bg-white text-zinc-300 hover:text-black dark:bg-transparent dark:text-zinc-600 dark:hover:text-white'}`}
                        >
                            <Heart className={`w-4 h-4 md:w-5 md:h-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Meta Tags (Mobile Only) */}
                    <div className="flex md:hidden items-center gap-3 text-[10px] font-bold text-zinc-500 border-b-2 border-black/5 pb-2 dark:border-white/5 dark:text-zinc-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.loc}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.experience}</span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        {job.tags.slice(0, 4).map(t => (
                            <span key={t} className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-bold uppercase border border-black bg-zinc-100 rounded text-black dark:bg-white/5 dark:border-white/20 dark:text-zinc-300">
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* Study Resources */}
                    {job.studyResources && job.studyResources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-dashed border-black/20 dark:border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> Study Kit
                            </p>
                            <div className="flex flex-col gap-1.5">
                            {job.studyResources.map((res, idx) => (
                                <a key={idx} href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                                    <ExternalLink className="w-3 h-3 shrink-0" /> {res.name}
                                </a>
                            ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-auto pt-3 flex gap-2">
                        <button
                            onClick={() => startJobQuiz(job)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 bg-white text-black font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-all text-xs md:text-sm uppercase tracking-wider dark:bg-white/5 dark:text-white dark:border-white/10 dark:shadow-none dark:hover:bg-white/10"
                        >
                            <BrainCircuit className="w-3 h-3 md:w-4 md:h-4" /> Check Fit
                        </button>
                        <a
                            href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title} ${job.company}`)}&location=${encodeURIComponent(job.loc)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 bg-blue-600 text-white font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-all text-xs md:text-sm uppercase tracking-wider dark:border-none dark:shadow-none"
                        >
                            Apply <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                        </a>
                    </div>
                </div>
            ))}
        </div>

        {/* QUIZ MODAL */}
        {activeQuiz && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className={`card-base w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                   {/* Modal Header */}
                   <div className={`p-5 md:p-6 border-b-2 border-black dark:border-white/10 flex justify-between items-center ${isDark ? 'bg-white/5' : 'bg-pop-purple'}`}>
                       <div>
                           <h3 className="text-xl font-bold uppercase dark:text-white font-brutal dark:font-sans">Skill Check</h3>
                           <p className="text-xs font-bold uppercase text-black/60 dark:text-gray-500">{activeQuiz.job.title}</p>
                       </div>
                       <button onClick={() => setActiveQuiz(null)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:rounded-full">
                           <X className="w-5 h-5" />
                       </button>
                   </div>

                   <div className="p-6 md:p-10 overflow-y-auto">
                       {activeQuiz.score === null ? (
                           <>
                               <div className="mb-6 md:mb-8 border-2 border-black h-4 md:h-6 w-full dark:border-white/20 dark:bg-black/50 dark:rounded-full">
                                   <div className="h-full bg-black border-r-2 border-black dark:bg-nebula-teal dark:border-none dark:rounded-full" style={{width: `${((activeQuiz.currentQ + 1) / activeQuiz.questions.length) * 100}%`}}></div>
                               </div>
                               <h4 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 md:mb-8 font-brutal dark:font-sans">
                                   {activeQuiz.questions[activeQuiz.currentQ].q}
                               </h4>
                               <div className="space-y-3 md:space-y-4">
                                   {activeQuiz.questions[activeQuiz.currentQ].o.map((opt, idx) => (
                                       <button
                                           key={idx}
                                           onClick={() => answerQuiz(idx)}
                                           className={`w-full text-left p-4 md:p-6 border-2 border-black font-bold text-base md:text-lg hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_#000] transition-all dark:border-white/10 dark:text-gray-300 dark:hover:border-nebula-teal dark:hover:text-nebula-teal dark:hover:shadow-none dark:bg-white/5 dark:rounded-xl ${activeQuiz.answers[activeQuiz.currentQ] === idx ? 'bg-black text-white dark:bg-nebula-teal dark:text-black dark:border-none' : 'bg-white dark:bg-white/5'}`}
                                        >
                                           <span className="font-medium text-base md:text-lg">{opt}</span>
                                           {activeQuiz.answers[activeQuiz.currentQ] === idx && <Check className="w-5 h-5 md:w-6 md:h-6 inline float-right"/>}
                                       </button>
                                   ))}
                               </div>
                           </>
                       ) : (
                           <div className="text-center py-8 md:py-12">
                               <Trophy className={`w-20 h-20 mx-auto mb-6 ${activeQuiz.score >= 60 ? 'text-yellow-500' : 'text-gray-400'}`} />
                               <h3 className="text-5xl md:text-6xl font-black mb-4 uppercase text-black dark:text-white font-brutal dark:font-sans">
                                   {activeQuiz.score >= 60 ? 'HIRED!' : 'REJECTED'}
                               </h3>
                               <p className="text-xl md:text-2xl font-bold mb-8 text-black dark:text-gray-400">Score: {activeQuiz.score.toFixed(0)}/100</p>
                               <div className="max-w-xs mx-auto space-y-4">
                                    <Button fullWidth onClick={() => setActiveQuiz(null)}>Close</Button>
                               </div>
                           </div>
                       )}
                   </div>

                   {activeQuiz.score === null && (
                       <div className="p-4 md:p-6 border-t-2 border-black dark:border-white/10">
                           <Button
                            fullWidth
                            onClick={nextQuestion}
                            disabled={activeQuiz.answers[activeQuiz.currentQ] === null}
                            className={activeQuiz.answers[activeQuiz.currentQ] === null ? 'opacity-50 pointer-events-none' : ''}
                           >
                               {activeQuiz.currentQ === activeQuiz.questions.length - 1 ? 'Submit Results' : 'Next Question'}
                           </Button>
                       </div>
                   )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
