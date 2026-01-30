
import React, { useState } from 'react';
import { ArrowLeft, Lock, Check, Map, BrainCircuit, BookOpen, ExternalLink, X, Clock } from 'lucide-react';
import { useApp } from '../AppContext';
import { DEEP_DIVES, SPECIALIZATIONS } from '../constants';
import Button from '../components/Button';
import { RoadmapStep, QuizQuestion } from '../types';

const Detail: React.FC = () => {
  const { selectedSpecId, roadmapProgress, updateRoadmapProgress, navigate, setSearchTerm, isDark, currentUser } = (useApp() as any);
  const [detailTab, setDetailTab] = useState<'roadmap' | 'dayInLife'>('roadmap');
  const [activeQuiz, setActiveQuiz] = useState<{
      specId: string;
      stepIndex: number;
      step: RoadmapStep;
      currentQ: number;
      answers: (number | null)[];
      completed: boolean;
      passed: boolean;
      score: number;
  } | null>(null);

  // Fallback to default if spec not found, but keep selectedSpecId if possible for tracking
  const data = selectedSpecId && DEEP_DIVES[selectedSpecId] ? DEEP_DIVES[selectedSpecId] : DEEP_DIVES['default'];
  const spec = SPECIALIZATIONS.find((s) => s.id === selectedSpecId);
  const currentLevel = (selectedSpecId && roadmapProgress[selectedSpecId]) || 0;

  const handleBack = () => {
    if (spec) navigate('paths', { courseId: spec.courseId });
    else navigate('explore');
  };

  const getQuestions = (step: RoadmapStep): QuizQuestion[] => {
      // 1. Get pool from data or fallback
      let pool = step.quiz && step.quiz.length > 0 ? step.quiz : [
          { q: `What is the primary purpose of learning ${step.title}?`, o: ["To solve specific problems", "To waste time", "To confuse others", "Just for fun"], a: 0 },
          { q: `Which concept is most critical in ${step.title}?`, o: ["Relying on luck", "Consistent practice", "Memorizing code", "Ignoring errors"], a: 1 },
          { q: "True or False: You should apply this knowledge in real projects.", o: ["True", "False", "Maybe", "Only on Sundays"], a: 0 },
          { q: "How do you master this skill?", o: ["Practice", "Sleep", "Eat", "Gaming"], a: 0 },
          { q: "What is a common mistake?", o: ["Giving up too soon", "Drinking water", "Reading docs", "Asking help"], a: 0 },
          { q: "Who needs this skill?", o: ["Professionals", "Cats", "Trees", "Rocks"], a: 0 }
      ];

      // 2. Shuffle and pick 3
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
  };

  const openQuiz = (stepIndex: number) => {
      if (!currentUser) {
          alert("Please login to take the quiz.");
          navigate('login');
          return;
      }

      const step = data.roadmap[stepIndex];
      const quizData = getQuestions(step);

      setActiveQuiz({
          specId: selectedSpecId || 'default',
          stepIndex,
          step: { ...step, quiz: quizData },
          currentQ: 0,
          answers: new Array(quizData.length).fill(null),
          completed: false,
          passed: false,
          score: 0
      });
  };

  const answerQuiz = (optIndex: number) => {
      if(!activeQuiz) return;
      const newAnswers = [...activeQuiz.answers];
      newAnswers[activeQuiz.currentQ] = optIndex;
      setActiveQuiz({...activeQuiz, answers: newAnswers});
  };

  const nextQuestion = () => {
      if(!activeQuiz) return;
      if (activeQuiz.currentQ < (activeQuiz.step.quiz?.length || 0) - 1) {
          setActiveQuiz({...activeQuiz, currentQ: activeQuiz.currentQ + 1});
      } else {
          // Submit
          let correct = 0;
          activeQuiz.step.quiz?.forEach((q, i) => {
              if(activeQuiz.answers[i] === q.a) correct++;
          });
          const total = activeQuiz.step.quiz?.length || 1;
          const score = (correct / total) * 100;
          const passed = score >= 60;

          setActiveQuiz({ ...activeQuiz, completed: true, passed, score });
          if(passed && selectedSpecId) {
              updateRoadmapProgress(selectedSpecId, activeQuiz.stepIndex + 1);
          }
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 md:py-32 relative z-10">
      <button
        onClick={handleBack}
        className="mb-8 px-6 py-2 border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all font-bold flex items-center gap-2 dark:bg-white/5 dark:text-white dark:border-white/10 dark:shadow-none dark:rounded-full"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="card-base p-6 md:p-10">
            <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase mb-4 md:mb-6 dark:bg-nebula-gold dark:text-black dark:rounded-md">
              Career Deep Dive
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-black dark:text-white mb-4 uppercase leading-none font-brutal dark:font-sans">{data.role}</h1>
            <p className="text-xl md:text-2xl font-bold text-gray-500 dark:text-gray-400 dark:font-light">
              {data.tagline}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {data.stack.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 border-2 border-black bg-gray-100 text-sm font-bold text-black dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="prose dark:prose-invert max-w-none px-2">
            <h3 className="text-2xl font-black text-black dark:text-white mb-4 uppercase font-brutal dark:font-sans">The Role</h3>
            <p className="text-gray-600 font-bold dark:font-normal dark:text-gray-400 text-lg leading-relaxed">{data.summary}</p>
          </div>

          {/* Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => setDetailTab('roadmap')}
              className={`flex-1 py-3 md:py-4 border-2 border-black font-bold uppercase tracking-wider transition-all text-sm md:text-base ${
                detailTab === 'roadmap'
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_#999] dark:bg-nebula-teal dark:text-black dark:border-none dark:rounded-xl'
                  : 'bg-white text-black hover:bg-gray-100 dark:bg-transparent dark:text-gray-400 dark:border-white/10 dark:rounded-xl'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setDetailTab('dayInLife')}
              className={`flex-1 py-3 md:py-4 border-2 border-black font-bold uppercase tracking-wider transition-all text-sm md:text-base ${
                detailTab === 'dayInLife'
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_#999] dark:bg-nebula-teal dark:text-black dark:border-none dark:rounded-xl'
                  : 'bg-white text-black hover:bg-gray-100 dark:bg-transparent dark:text-gray-400 dark:border-white/10 dark:rounded-xl'
              }`}
            >
              Routine
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {detailTab === 'roadmap' ? (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
                  <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase font-brutal dark:font-sans">Step-by-Step Guide</h3>
                  <a href="#" className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    <Map className="w-4 h-4" /> View Graph on roadmap.sh
                  </a>
                </div>
                <div className="space-y-6 md:space-y-8 relative pl-2 md:pl-6">
                  <div className="absolute left-[30px] md:left-[39px] top-8 bottom-8 w-1 bg-black dark:bg-white/10"></div>
                  {data.roadmap.map((step, i) => {
                    const isLocked = i > currentLevel;
                    const isCompleted = i < currentLevel;
                    const isActive = i === currentLevel;

                    return (
                      <div key={i} className={`relative flex gap-4 md:gap-8 group ${isLocked ? 'opacity-50 grayscale dark:opacity-40' : ''}`}>
                        <div
                          className={`w-14 h-14 md:w-20 md:h-20 bg-white border-2 border-black shrink-0 z-10 shadow-[2px_2px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center dark:bg-black dark:border-white/20 dark:shadow-none dark:text-white dark:rounded-full`}
                        >
                          <span className="text-[10px] md:text-xs font-bold uppercase text-black dark:text-white">Step</span>
                          <span className="text-xl md:text-2xl font-black text-black dark:text-white">{i+1}</span>
                          {isLocked && <Lock className="w-3 h-3 md:w-4 md:h-4 text-zinc-400 mt-1 absolute top-1 right-1" />}
                          {isCompleted && <Check className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 mt-1 absolute top-1 right-1" />}
                        </div>

                        <div
                          className={`flex-1 card-base p-5 md:p-8 ${isActive ? 'bg-pop-yellow dark:bg-white/10 dark:border-nebula-gold' : 'bg-white dark:bg-white/5'}`}
                        >
                          <h4 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2 uppercase font-brutal dark:font-sans">{step.title}</h4>
                          <p className="text-sm md:text-base text-gray-600 font-bold dark:text-gray-400 mb-6 dark:font-light">{step.desc}</p>

                          {!isLocked && step.resources && (
                              <div className="mb-6 p-4 bg-white dark:bg-white/5 border-2 border-black dark:border-white/10">
                                  <h5 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-1"><BookOpen className="w-3 h-3"/> Study Resources</h5>
                                  <div className="flex flex-col gap-2">
                                      {step.resources.map(res => (
                                          <a key={res.name} href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                                              <ExternalLink className="w-3 h-3 shrink-0"/> {res.name}
                                          </a>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {!isLocked && (
                              <div className="mt-4">
                                  {isCompleted ? (
                                      <div className="flex items-center gap-3">
                                          <div className="flex-1 bg-black text-white text-center font-bold py-2 border-2 border-black dark:bg-white/10 dark:text-nebula-teal dark:border-nebula-teal uppercase tracking-widest text-sm dark:rounded-lg">COMPLETED</div>
                                          <button
                                              onClick={() => openQuiz(i)}
                                              className="px-4 py-2 font-bold text-xs uppercase border-2 border-black bg-white hover:bg-gray-100 dark:bg-transparent dark:text-white dark:border-white/20 dark:hover:bg-white/5 dark:rounded-lg"
                                          >
                                              Retake
                                          </button>
                                      </div>
                                  ) : (
                                      <button onClick={() => openQuiz(i)} className="w-full py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-colors dark:bg-white dark:text-black dark:border-none dark:hover:bg-nebula-teal uppercase tracking-widest dark:rounded-lg flex items-center justify-center gap-2 text-sm md:text-base">
                                          <BrainCircuit className="w-4 h-4" /> START QUIZ
                                      </button>
                                  )}
                              </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
                <div className="card-base p-6 md:p-8">
                     <ul className="space-y-6">
                        {data.dayInLife.map((d, i) => (
                           <li key={i} className="flex gap-4 md:gap-6 items-center border-b-2 border-gray-200 pb-6 last:border-0 dark:border-white/10">
                               <div className="text-3xl md:text-4xl font-black text-gray-300 dark:text-white/20 font-brutal dark:font-sans">0{i+1}</div>
                               <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                         <Clock className="w-3 h-3 md:w-4 md:h-4 text-black dark:text-white" />
                                         <span className="text-xs font-bold uppercase text-black dark:text-nebula-teal">{d.time}</span>
                                    </div>
                                    <span className="font-bold text-lg md:text-xl text-black dark:text-gray-300">{d.title}</span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{d.desc}</p>
                               </div>
                           </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className={`card-base p-6 md:p-8 ${isDark ? 'bg-white/5' : 'bg-pop-yellow'}`}>
                <h3 className="font-black text-2xl uppercase mb-6 md:mb-8 text-black dark:text-white font-brutal dark:font-sans">Stats</h3>
                <div className="space-y-4">
                    {data.stats.map(s => (
                        <div key={s.label} className="flex justify-between items-center pb-4 border-b-2 border-black dark:border-white/10">
                            <span className="font-bold text-black dark:text-gray-500 uppercase">{s.label}</span>
                            <span className="font-bold text-lg md:text-xl text-black dark:text-white">{s.value}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <Button
                        fullWidth
                        variant="primary"
                        onClick={() => {
                            navigate('jobs');
                            setSearchTerm(spec ? spec.name : data.role);
                        }}
                        className="bg-white text-black dark:bg-nebula-teal dark:text-black dark:shadow-none"
                    >
                        Find Jobs
                    </Button>
                </div>
            </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
               <div className={`card-base w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                   <div className={`p-5 md:p-6 border-b-2 border-black dark:border-white/10 flex justify-between items-center ${isDark ? 'bg-white/5' : 'bg-pop-purple'}`}>
                       <div>
                           <h3 className="text-xl font-bold uppercase dark:text-white font-brutal dark:font-sans">Quiz Time</h3>
                           <p className="text-xs font-bold uppercase text-black/60 dark:text-gray-500">{activeQuiz.step.title}</p>
                       </div>
                       <button onClick={() => setActiveQuiz(null)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:rounded-full">
                           <X className="w-5 h-5" />
                       </button>
                   </div>

                   <div className="p-6 md:p-10 overflow-y-auto">
                       {!activeQuiz.completed ? (
                           <>
                               <div className="mb-6 md:mb-8 border-2 border-black h-4 md:h-6 w-full dark:border-white/20 dark:bg-black/50 dark:rounded-full">
                                   <div className="h-full bg-black border-r-2 border-black dark:bg-nebula-teal dark:border-none dark:rounded-full" style={{width: `${((activeQuiz.currentQ + 1) / (activeQuiz.step.quiz?.length || 1)) * 100}%`}}></div>
                               </div>
                               <h4 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 md:mb-8 font-brutal dark:font-sans">
                                   {activeQuiz.step.quiz?.[activeQuiz.currentQ]?.q || "Loading..."}
                               </h4>
                               <div className="space-y-3 md:space-y-4">
                                   {activeQuiz.step.quiz?.[activeQuiz.currentQ]?.o.map((opt, idx) => (
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
                               <h3 className="text-5xl md:text-6xl font-black mb-4 uppercase text-black dark:text-white font-brutal dark:font-sans">{activeQuiz.passed ? 'PASSED!' : 'FAILED'}</h3>
                               <p className="text-xl md:text-2xl font-bold mb-8 text-black dark:text-gray-400">Score: {activeQuiz.score.toFixed(0)}/100</p>
                               <div className="max-w-xs mx-auto space-y-4">
                                   {activeQuiz.passed ? (
                                       <Button fullWidth onClick={() => setActiveQuiz(null)}>Next Step</Button>
                                   ) : (
                                       <Button fullWidth onClick={() => openQuiz(activeQuiz.stepIndex)}>Try Again</Button>
                                   )}
                               </div>
                           </div>
                       )}
                   </div>

                   {!activeQuiz.completed && (
                       <div className="p-4 md:p-6 border-t-2 border-black dark:border-white/10">
                           <Button
                            fullWidth
                            onClick={nextQuestion}
                            disabled={activeQuiz.answers[activeQuiz.currentQ] === null}
                            className={activeQuiz.answers[activeQuiz.currentQ] === null ? 'opacity-50 pointer-events-none' : ''}
                           >
                               {activeQuiz.currentQ === (activeQuiz.step.quiz?.length || 0) - 1 ? 'Submit Assessment' : 'Next Question'}
                           </Button>
                       </div>
                   )}
               </div>
           </div>
      )}
    </div>
  );
};

export default Detail;
