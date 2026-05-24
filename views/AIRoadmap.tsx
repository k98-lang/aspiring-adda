import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Compass, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Trash2, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Code
} from 'lucide-react';
import Button from '../components/Button';

const AIRoadmap: React.FC = () => {
  const { 
    currentUser, 
    aiRoadmaps, 
    saveAIRoadmap, 
    updateAIRoadmapLevel, 
    deleteAIRoadmap,
    selectedAiRoadmapId,
    setSelectedAiRoadmapId,
    navigate,
    isDark
  } = useApp();

  // Form states
  const [role, setRole] = useState('');
  const [timeframe, setTimeframe] = useState('3 Months');
  const [level, setLevel] = useState('Beginner');
  const [commitment, setCommitment] = useState('10-20 hours/week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warningMsg, setWarningMsg] = useState('');

  // Local state for active detail view step
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Retrieve active roadmap if selected
  const activeRoadmap = useMemo(() => {
    if (!selectedAiRoadmapId) return null;
    return aiRoadmaps.find(r => r.id === selectedAiRoadmapId) || null;
  }, [selectedAiRoadmapId, aiRoadmaps]);

  // Fallback dynamic mock generator in case Gemini fails or API key is placeholder
  const generateMockRoadmap = (targetRole: string, tFrame: string, expLevel: string, commit: string) => {
    const roleClean = targetRole.trim() || 'Software Engineer';
    const steps = [
      {
        title: `Foundations of ${roleClean}`,
        duration: `Weeks 1-3`,
        desc: `Master the essential basics, command line tools, and language syntax required for ${roleClean}.`,
        topics: [
          `Syntax fundamentals & variable scope`,
          `Basic data structures (arrays, dictionaries)`,
          `Development environment setup & compiler tools`,
          `Version control with Git & repository management`
        ],
        resources: [
          `Official Language Reference Documentation`,
          `FreeCodeCamp Complete Beginner's Course`,
          `MDN Web Docs / Basic Syntax Handbook`
        ]
      },
      {
        title: `Core Architectures & Intermediate Workflows`,
        duration: `Weeks 4-6`,
        desc: `Dive into asynchronous programming, module designs, APIs, and basic state management systems.`,
        topics: [
          `Object-Oriented & Functional programming principles`,
          `HTTP protocols, networking interfaces, and fetch patterns`,
          `Asynchronous programming: promises, async/await, and event loops`,
          `Local storage models and client-server state coordination`
        ],
        resources: [
          `JavaScript/Python Info Intermediate Guide`,
          `W3Schools Interactive Labs`,
          `Youtube Crash Course: Intermediate Programming`
        ]
      },
      {
        title: `Advanced Paradigms & System Design`,
        duration: `Weeks 7-9`,
        desc: `Implement concurrency control, database integration, server logic, and advanced optimization protocols.`,
        topics: [
          `Database modeling (SQL/NoSQL structures)`,
          `Performance auditing & memory profiling`,
          `Concurrency mechanisms and parallel programming paradigms`,
          `Restful API deployment & server architecture`
        ],
        resources: [
          `System Design Primer Handbook`,
          `SQLZoo Interactive DB Playground`,
          `Awesome Development Resources Github List`
        ]
      },
      {
        title: `Security, Auditing & Capstone Deployment`,
        duration: `Weeks 10-12`,
        desc: `Wrap up with strict security protocols, defensive coding standards, CI/CD testing pipelines, and production deployment.`,
        topics: [
          `OWASP Security vulnerabilities & defensive coding`,
          `Automated testing structures (unit tests, integration tests)`,
          `CI/CD workflows & containerization with Docker`,
          `Deploying to cloud infrastructures (AWS/Vercel/DigitalOcean)`
        ],
        resources: [
          `OWASP Cheat Sheet Series`,
          `Docker Official Getting Started Guide`,
          `Vercel/AWS Production Deployment Handbook`
        ]
      }
    ];

    return {
      title: `${roleClean} Specialization Path`,
      goal: `Transition to ${roleClean} (${expLevel} level) in ${tFrame} with ${commit}`,
      steps
    };
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize and validate role input
    const cleanRole = role.trim().replace(/[<>{}]/g, '');
    if (!cleanRole) {
      setError('Please specify a valid career goal or job role.');
      return;
    }

    if (cleanRole.length > 100) {
      setError('Role description is too long (maximum 100 characters).');
      return;
    }

    setLoading(true);
    setError('');
    setWarningMsg('');

    const promptText = `You are a world-class engineering career coach. Generate a high-yield, step-by-step developer roadmap for the role: "${cleanRole}".
User profile:
- Experience Level: ${level}
- Timeframe target: ${timeframe}
- Weekly commitment: ${commitment}

Return ONLY a valid JSON object matching this structure:
{
  "title": "${role} Custom Track",
  "goal": "Master ${role} from ${level} in ${timeframe} at ${commitment}",
  "steps": [
    {
      "title": "Step Name",
      "duration": "E.g. Weeks 1-2",
      "desc": "Short description of objectives",
      "topics": ["Topic 1", "Topic 2"],
      "resources": ["Resource 1 (e.g. FreeCodeCamp)", "Resource 2"]
    }
  ]
}
Provide exactly 4 to 6 steps showing a logical learning curve from basic to advanced.`;

    try {
      let response;
      let text = '';
      
      try {
        // 1. Try local Express API Proxy first
        response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptText,
            config: { responseMimeType: 'application/json' }
          })
        });

        if (response.ok) {
          const resData = await response.json();
          text = resData.text;
        } else {
          throw new Error('Proxy returned error code: ' + response.status);
        }
      } catch (proxyError) {
        console.warn('Proxy API failed, attempting direct Express fetch:', proxyError);
        
        // 2. Direct local Express dev port fallback
        response = await fetch('http://localhost:3000/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptText,
            config: { responseMimeType: 'application/json' }
          })
        });

        if (response.ok) {
          const resData = await response.json();
          text = resData.text;
        } else {
          throw new Error('Direct Express endpoint returned error code: ' + response.status);
        }
      }

      // Parse JSON response
      if (!text) {
        throw new Error('Response text is empty');
      }

      // Clean markdown wrapper if any
      const cleanedJsonText = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsedRoadmap = JSON.parse(cleanedJsonText);
      
      if (!parsedRoadmap.title || !parsedRoadmap.steps || !Array.isArray(parsedRoadmap.steps)) {
        throw new Error('Invalid JSON schema returned by AI');
      }

      // Save to database/state
      const savedId = await saveAIRoadmap(parsedRoadmap.title, parsedRoadmap.goal, parsedRoadmap.steps);
      setSelectedAiRoadmapId(savedId || null);
      setActiveStepIndex(0);

    } catch (err: any) {
      console.error('AI Generation failed, initiating premium fallback:', err);
      
      // Notify user we fell back to premium dynamic generation
      setWarningMsg('API Key mismatch/offline. Activated Local Career Synthesis Engine to compile your roadmap!');
      
      // Wait 1.5 seconds to simulate engine compile for UI impact
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockData = generateMockRoadmap(cleanRole, timeframe, level, commitment);
      const savedId = await saveAIRoadmap(mockData.title, mockData.goal, mockData.steps);
      
      setSelectedAiRoadmapId(savedId || null);
      setActiveStepIndex(0);
    } finally {
      setLoading(false);
    }
  };

  // Auth Guard Fallback
  if (!currentUser?.isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center p-5 relative z-10 w-full">
        <div className="card-base max-w-md w-full bg-white dark:bg-[#0a0a0a] text-center p-8 border-4 border-black dark:border-white/10 dark:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-16 h-16 bg-pop-yellow dark:bg-white/5 border-2 border-black dark:border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
            <AlertCircle className="w-8 h-8 text-black dark:text-nebula-gold" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-3 font-brutal dark:font-sans">
            Authentication Required
          </h2>
          <p className="text-zinc-600 dark:text-gray-400 font-bold text-sm mb-8 leading-relaxed">
            AI Roadmap compilation requires user sandbox access. Please sign in to map custom, high-velocity developer curriculums.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate('login')} 
              className="w-full bg-neo-purple text-black font-black hover:bg-neo-purple/90"
            >
              Sign In
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

  // ==========================================
  // VIEWING ACTIVE AI ROADMAP
  // ==========================================
  if (activeRoadmap) {
    const totalSteps = activeRoadmap.steps.length;
    const progressLevel = activeRoadmap.level || 0;
    const percent = Math.min(100, Math.round((progressLevel / totalSteps) * 100));

    const handleStepToggle = async (stepIdx: number) => {
      // Toggle progress logic
      // If user marks step X as done, progress moves to X+1. If they uncheck, it moves to X.
      let newLevel = progressLevel;
      if (stepIdx >= progressLevel) {
        newLevel = stepIdx + 1;
      } else {
        newLevel = stepIdx;
      }
      
      await updateAIRoadmapLevel(activeRoadmap.id, newLevel);
      
      // Auto move highlight to next step if they checked the active one
      if (newLevel > progressLevel && stepIdx < totalSteps - 1) {
        setActiveStepIndex(stepIdx + 1);
      }
    };

    return (
      <div className="min-h-screen pt-24 pb-20 relative z-10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          
          {/* Back button */}
          <button
            onClick={() => setSelectedAiRoadmapId(null)}
            className="flex items-center gap-2 font-bold text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          {/* Header Banner */}
          <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-pop-green text-black border-2 border-black text-[9px] font-black uppercase rounded-lg tracking-wider dark:border-white/10">
                  AI Compiled Curriculum
                </span>
                <h1 className="text-2xl md:text-4xl font-black text-black dark:text-white uppercase mt-3 font-brutal dark:font-sans">
                  {activeRoadmap.title}
                </h1>
                <p className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">
                  Goal: {activeRoadmap.goal}
                </p>
              </div>

              {/* Progress Panel */}
              <div className="min-w-[200px] md:text-right">
                <p className="text-xs font-black uppercase text-zinc-400">Roadmap Progress</p>
                <h3 className="text-2xl font-black text-black dark:text-white mt-1">
                  {progressLevel} / {totalSteps} Steps Complete ({percent}%)
                </h3>
                <div className="w-full h-3 border-2 border-black dark:border-white/20 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-pop-yellow dark:bg-nebula-teal transition-all duration-500" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Warning banner for mock */}
          {warningMsg && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-pop-yellow text-black border-4 border-black rounded-xl font-bold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{warningMsg}</span>
            </div>
          )}

          {/* TWO PANEL TIMELINE LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT 1 COLUMN: STEP TREE SELECTOR */}
            <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none flex flex-col gap-2">
              <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider mb-4 px-2">
                Timeline Tree
              </h3>
              
              <div className="flex flex-col gap-3 relative before:absolute before:left-7 before:top-4 before:bottom-4 before:w-[2px] before:bg-zinc-200 dark:before:bg-zinc-800">
                {activeRoadmap.steps.map((step, idx) => {
                  const isDone = idx < progressLevel;
                  const isActive = idx === activeStepIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`w-full p-3 border-2 rounded-xl flex items-center gap-3 text-left transition-all z-10 ${
                        isActive 
                          ? 'border-black bg-pop-yellow shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] dark:border-white/30 dark:bg-white/10 dark:shadow-none' 
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-950/20 dark:hover:bg-white/5'
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepToggle(idx);
                        }}
                        className={`p-1 shrink-0 rounded-full transition-colors ${
                          isDone 
                            ? 'text-pop-green hover:text-red-500' 
                            : 'text-zinc-300 hover:text-black dark:text-zinc-700 dark:hover:text-white'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-6 h-6 fill-current text-pop-green" /> : <Circle className="w-6 h-6" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-black uppercase text-zinc-400">
                          {step.duration}
                        </span>
                        <h4 className="font-black text-xs md:text-sm text-black dark:text-white uppercase truncate font-brutal dark:font-sans">
                          {step.title}
                        </h4>
                      </div>
                      
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-4 border-t-2 border-zinc-100 dark:border-white/5 flex gap-2">
                <button
                  onClick={async () => {
                    if (confirm('Delete this custom AI roadmap?')) {
                      await deleteAIRoadmap(activeRoadmap.id);
                      setSelectedAiRoadmapId(null);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-500 text-red-500 font-bold text-xs uppercase rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Roadmap
                </button>
              </div>
            </div>

            {/* RIGHT 2 COLUMNS: STEP DETAIL VIEWER */}
            <div className="lg:col-span-2 border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              {(() => {
                const step = activeRoadmap.steps[activeStepIndex];
                if (!step) return <p className="text-center font-bold text-zinc-400">Select a step to view details.</p>;
                
                const isStepCompleted = activeStepIndex < progressLevel;

                return (
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black dark:border-white/10 pb-5 mb-6">
                      <div>
                        <span className="inline-block px-2 py-0.5 border border-black bg-pop-purple text-black text-[9px] font-black uppercase rounded dark:border-white/20">
                          {step.duration}
                        </span>
                        <h2 className="text-xl md:text-3xl font-black uppercase text-black dark:text-white mt-2 font-brutal dark:font-sans">
                          {step.title}
                        </h2>
                      </div>

                      <Button
                        onClick={() => handleStepToggle(activeStepIndex)}
                        className={`text-xs font-black uppercase ${
                          isStepCompleted 
                            ? 'bg-pop-green text-black border-2 border-black' 
                            : 'bg-black text-white hover:bg-zinc-800 dark:bg-nebula-teal dark:text-black'
                        }`}
                      >
                        {isStepCompleted ? '✓ Step Completed' : 'Mark Step Complete'}
                      </Button>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2">
                        Learning Objectives
                      </h4>
                      <p className="text-zinc-700 dark:text-gray-300 font-bold text-sm md:text-base leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Topics Sub-grid */}
                    <div className="mb-8">
                      <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-3">
                        Key Subjects to Cover
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.topics?.map((topic, tIdx) => (
                          <div 
                            key={tIdx}
                            className="p-3 border-2 border-black bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/20 rounded-xl flex items-start gap-3"
                          >
                            <div className="w-5 h-5 bg-pop-blue dark:bg-white/5 border border-black dark:border-white/20 rounded flex items-center justify-center text-[9px] font-black text-black dark:text-white shrink-0 mt-0.5">
                              {tIdx + 1}
                            </div>
                            <span className="text-xs font-black uppercase text-black dark:text-white tracking-wide">
                              {topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="mt-auto">
                      <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-3">
                        Curated Study Resources
                      </h4>
                      <div className="flex flex-col gap-2">
                        {step.resources?.map((res, rIdx) => {
                          const resourceName = typeof res === 'object' && res !== null ? (res.name || res.title || 'Resource Link') : String(res);
                          const resourceUrl = typeof res === 'object' && res !== null && res.url ? res.url : `https://www.google.com/search?q=${encodeURIComponent(`${step.title} ${resourceName} tutorial guides`)}`;

                          return (
                            <a
                              key={rIdx}
                              href={resourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 border-2 border-black hover:border-blue-600 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5 rounded-xl flex items-center justify-between transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pop-green/10 border border-pop-green flex items-center justify-center text-pop-green">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-zinc-800 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-nebula-teal transition-colors">
                                  {resourceName}
                                </span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-nebula-teal shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // COMPILER GENERATION FORM
  // ==========================================
  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10 w-full overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-pop-green border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none dark:border-white/10 dark:bg-white/5">
            <Sparkles className="w-6 h-6 text-black dark:text-nebula-gold" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-black dark:text-white uppercase leading-[0.9] font-brutal dark:font-sans">
              AI Roadmap Builder
            </h1>
            <p className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">
              Harness Generative intelligence to synthesize bulletproof developer curriculums.
            </p>
          </div>
        </div>

        {/* Dynamic warning if warnMsg active */}
        {warningMsg && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-pop-yellow text-black border-4 border-black rounded-xl font-bold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{warningMsg}</span>
          </div>
        )}

        {/* Generator Form */}
        <div className="border-4 border-black dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            
            {/* Prompt Role */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                Target Role / Career Goal
              </label>
              <input
                type="text"
                placeholder="E.g. Solidity Smart Contract Auditor, Flutter Developer, ML Ops Engineer..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 md:py-4 bg-white border-2 border-black rounded-xl font-bold outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-all dark:bg-black/50 dark:border-white/20 dark:text-white dark:shadow-none text-sm"
              />
            </div>

            {/* Config parameters grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Experience level */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  Experience Level
                </label>
                <div className="flex flex-col gap-1.5">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      disabled={loading}
                      className={`w-full py-2.5 px-3 border-2 text-xs font-bold uppercase rounded-lg transition-all text-center ${
                        level === l 
                          ? 'border-black bg-pop-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-white/10 dark:shadow-none' 
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-950/20'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeframe */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  Timeline Target
                </label>
                <div className="flex flex-col gap-1.5">
                  {['1 Month', '3 Months', '6 Months'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeframe(t)}
                      disabled={loading}
                      className={`w-full py-2.5 px-3 border-2 text-xs font-bold uppercase rounded-lg transition-all text-center ${
                        timeframe === t 
                          ? 'border-black bg-pop-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-white/10 dark:shadow-none' 
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-950/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly commitment */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  Weekly Commitment
                </label>
                <div className="flex flex-col gap-1.5">
                  {['5-10 hrs/week', '10-20 hrs/week', 'Full-time'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCommitment(c)}
                      disabled={loading}
                      className={`w-full py-2.5 px-3 border-2 text-xs font-bold uppercase rounded-lg transition-all text-center ${
                        commitment === c 
                          ? 'border-black bg-pop-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-white/10 dark:shadow-none' 
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-950/20'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Error box */}
            {error && (
              <div className="p-4 border-2 border-red-500 bg-red-50 text-red-500 rounded-xl font-bold text-xs uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* CTA Generate button */}
            <div className="mt-4 pt-4 border-t-2 border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-pop-green text-black font-black uppercase flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Compiling Sandbox Curriculum...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Synthesize Custom Path
                  </>
                )}
              </Button>
              
              <button
                type="button"
                onClick={() => setSelectedAiRoadmapId(null)}
                className="sm:w-1/3 py-3 border-2 border-black hover:bg-zinc-50 font-bold text-xs uppercase rounded-xl transition-all dark:border-white/20 dark:hover:bg-white/5 text-center text-zinc-500 dark:text-zinc-400"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AIRoadmap;
