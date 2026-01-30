
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, Mic2, Users, Clock, BrainCircuit, HeartHandshake, Bot, Send, X, CheckCircle2, Sparkles, RefreshCcw } from 'lucide-react';
import { useApp } from '../AppContext';
import { SOFT_SKILLS } from '../constants';
import Button from '../components/Button';

const icons: any = {
    "mic-2": Mic2,
    "heart-handshake": HeartHandshake,
    "users": Users,
    "brain-circuit": BrainCircuit,
    "clock": Clock
};

const SoftSkills: React.FC = () => {
  const { selectedSoftSkillId, setSelectedSoftSkillId, isDark } = useApp();
  const selectedSkill = SOFT_SKILLS.find(s => s.id === selectedSoftSkillId);

  const [showCoach, setShowCoach] = useState(false);
  const [coachTip, setCoachTip] = useState<string | null>(null);

  // Assessment State
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(new Set());
  const [assessmentFeedback, setAssessmentFeedback] = useState<string | null>(null);
  const [analyzingAssessment, setAnalyzingAssessment] = useState(false);

  // Scenario State
  const [activeScenarios, setActiveScenarios] = useState<string[]>([]);

  useEffect(() => {
    // Reset state when skill changes
    setSelectedTraits(new Set());
    setAssessmentFeedback(null);
    setCoachTip(null);
    if (selectedSkill) {
        setActiveScenarios(selectedSkill.scenarios);
    }
  }, [selectedSoftSkillId, selectedSkill]);

  const toggleTrait = (trait: string) => {
      const next = new Set(selectedTraits);
      if (next.has(trait)) next.delete(trait);
      else next.add(trait);
      setSelectedTraits(next);
  };

  const analyzeAssessment = () => {
    if (!selectedSkill) return;
    setAnalyzingAssessment(true);

    // Simulate thinking time for effect
    setTimeout(() => {
        const strengths = Array.from(selectedTraits);
        const gaps = selectedSkill.assessment.filter(t => !selectedTraits.has(t));

        const strengthAnalysis = strengths.length > 0
            ? `You have a solid foundation in ${selectedSkill.title}. Your ability to ${strengths[0].toLowerCase()} is a key asset.`
            : `You are at the beginning of your journey with ${selectedSkill.title}.`;

        const gapAnalysis = gaps.length > 0
            ? `To reach the next level, focus on: ${gaps.map(g => g.toLowerCase()).join(', ')}.`
            : "You've marked all key traits! Focus on maintaining these habits in high-pressure situations.";

        const resultText = `Based on your self-assessment:

STRENGTHS:
${strengths.length > 0 ? strengths.map(s => `• ${s}`).join('\n') : "• No specific strengths identified yet."}

AREAS FOR GROWTH:
${gaps.length > 0 ? gaps.map(g => `• ${g}`).join('\n') : "• Excellent! You are hitting all the marks."}

EXPERT ADVICE:
${strengthAnalysis} ${gapAnalysis}

RECOMMENDED TIPS:
${selectedSkill.tips.map(t => `• ${t}`).join('\n')}`;

        setAssessmentFeedback(resultText);
        setAnalyzingAssessment(false);
    }, 800);
  };

  const shuffleScenarios = () => {
      if (!selectedSkill || !selectedSkill.scenarios) return;
      // Simple shuffle
      const shuffled = [...selectedSkill.scenarios].sort(() => Math.random() - 0.5);
      setActiveScenarios(shuffled);
  };

  const handleGetAdvice = () => {
      if (!selectedSkill) return;
      // Pick a random tip or resource
      const tips = selectedSkill.tips;
      const randomTip = tips[Math.floor(Math.random() * tips.length)];

      setCoachTip(`💡 EXPERT TIP: \n"${randomTip}"\n\nTry applying this in your next conversation or project.`);
  };

  if (selectedSkill) {
      const Icon = icons[selectedSkill.icon] || Mic2;
      return (
        <div className="max-w-4xl mx-auto px-4 md:px-12 py-24 md:py-32 relative z-10">
            <button onClick={() => setSelectedSoftSkillId(null)} className="mb-8 px-6 py-2 rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all font-bold flex items-center gap-2 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:text-zinc-300 dark:hover:bg-white/10 dark:rounded-full">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                <div>
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-black bg-${selectedSkill.color}-100 dark:bg-white/5 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none dark:border-white/10`}>
                        <Icon className={`w-8 h-8 md:w-10 md:h-10 text-black dark:text-${selectedSkill.color}-400`} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 uppercase font-brutal dark:font-sans">{selectedSkill.title}</h1>
                    <p className="text-lg md:text-xl font-bold text-zinc-500 dark:text-gray-400 dark:font-normal">{selectedSkill.desc}</p>
                </div>
                <Button
                    onClick={() => { setShowCoach(true); handleGetAdvice(); }}
                    className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-2 border-black dark:border-none w-full md:w-auto"
                    icon={Bot}
                >
                    Get Expert Advice
                </Button>
            </div>

            <div className={`card-base p-6 md:p-8 mb-8 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <h3 className="text-2xl font-black text-black dark:text-white mb-6 uppercase font-brutal dark:font-sans">Self-Assessment</h3>
                <div className="space-y-3 mb-8">
                    {selectedSkill.assessment.map(stmt => {
                        const isSelected = selectedTraits.has(stmt);
                        return (
                            <button
                                key={stmt}
                                onClick={() => toggleTrait(stmt)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${isSelected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100' : 'border-zinc-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 text-black dark:text-gray-300'}`}
                            >
                                <span className="font-bold text-sm md:text-base">{stmt}</span>
                                {isSelected ? <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-current shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600 shrink-0"></div>}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col items-center">
                    <Button onClick={analyzeAssessment} disabled={analyzingAssessment} icon={Sparkles} fullWidth className="md:w-auto">
                        {analyzingAssessment ? 'Analyzing...' : 'Analyze Profile'}
                    </Button>

                    {assessmentFeedback && (
                         <div className="mt-8 p-6 bg-neo-blue border-2 border-black dark:bg-white/5 dark:border-white/10 rounded-xl w-full">
                            <div className="flex items-center gap-2 mb-4">
                                <Bot className="w-5 h-5 text-black dark:text-white" />
                                <h4 className="font-black text-black dark:text-white uppercase font-brutal dark:font-sans">Analysis</h4>
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-medium whitespace-pre-line">
                                {assessmentFeedback}
                            </div>
                         </div>
                    )}
                </div>
            </div>

            <div className={`card-base p-6 md:p-8 mb-8 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-2 uppercase font-brutal dark:font-sans">
                        <Lightbulb className="w-6 h-6 text-amber-500" /> Practice Scenarios
                    </h3>
                    <button
                        onClick={shuffleScenarios}
                        className="text-xs font-bold flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                        <RefreshCcw className="w-3 h-3" /> Refresh
                    </button>
                </div>
                <div className="space-y-3">
                    {activeScenarios.map((sc, i) => (
                        <div key={i} className="p-4 border-l-4 border-amber-400 bg-amber-50 dark:bg-white/5 dark:border-amber-500/50">
                            <p className="text-sm md:text-base font-bold text-zinc-700 dark:text-gray-300">{sc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coach Modal (Now simplified to Static Advice) */}
            {showCoach && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className={`card-base w-full max-w-lg overflow-hidden flex flex-col ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                        <div className={`p-4 md:p-6 border-b-2 border-black dark:border-white/10 flex justify-between items-center ${isDark ? 'bg-white/5' : 'bg-neo-purple'}`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-black text-white rounded-lg dark:bg-indigo-600">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-black dark:text-white uppercase font-brutal dark:font-sans text-sm md:text-base">Quick Advice</h3>
                                </div>
                            </div>
                            <button onClick={() => setShowCoach(false)} className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 text-center">
                            <div className="mb-6 p-6 bg-zinc-50 border-2 border-black rounded-xl dark:bg-white/5 dark:border-white/10">
                                <p className="text-lg font-bold text-black dark:text-white whitespace-pre-line">{coachTip}</p>
                            </div>
                            <Button onClick={handleGetAdvice} icon={RefreshCcw} fullWidth>
                                Get Another Tip
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 md:py-32 relative z-10">
        <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 uppercase font-brutal dark:font-sans">Soft Skills</h2>
            <p className="text-xl font-bold text-zinc-500 dark:text-gray-400 dark:font-normal">Level up your personality.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOFT_SKILLS.map(skill => {
                const Icon = icons[skill.icon] || Mic2;
                return (
                    <div key={skill.id} onClick={() => setSelectedSoftSkillId(skill.id)} className={`card-base p-6 cursor-pointer group flex flex-col h-full bg-white dark:bg-transparent`}>
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-black bg-${skill.color}-100 dark:bg-white/5 flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none dark:border-white/10`}>
                            <Icon className={`w-6 h-6 md:w-7 md:h-7 text-black dark:text-${skill.color}-400`} />
                        </div>
                        <h3 className="text-2xl font-black text-black dark:text-white mb-2 uppercase font-brutal dark:font-sans">{skill.title}</h3>
                        <p className="text-sm font-bold text-zinc-500 dark:text-gray-400 dark:font-normal">{skill.desc}</p>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default SoftSkills;
