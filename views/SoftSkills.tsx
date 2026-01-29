import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, BookOpen, ExternalLink, Mic2, Users, Clock, BrainCircuit, HeartHandshake, Bot, Send, X, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../AppContext';
import { SOFT_SKILLS } from '../constants';
import Button from '../components/Button';
import { GoogleGenAI } from "@google/genai";

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

  const [showAI, setShowAI] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(new Set());
  const [assessmentFeedback, setAssessmentFeedback] = useState<string | null>(null);
  const [analyzingAssessment, setAnalyzingAssessment] = useState(false);

  useEffect(() => {
    setSelectedTraits(new Set());
    setAssessmentFeedback(null);
    setUserQuery('');
    setAiResponse(null);
  }, [selectedSoftSkillId]);

  const toggleTrait = (trait: string) => {
      const next = new Set(selectedTraits);
      if (next.has(trait)) next.delete(trait);
      else next.add(trait);
      setSelectedTraits(next);
  };

  const analyzeAssessment = async () => {
    if (!selectedSkill) return;
    setAnalyzingAssessment(true);
    setAssessmentFeedback(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const strengths = Array.from(selectedTraits);
        const gaps = selectedSkill.assessment.filter(t => !selectedTraits.has(t));

        const prompt = `
            You are a career development expert. The user has completed a self-assessment for the soft skill: "${selectedSkill.title}".
            Behaviors identified (Strengths): ${strengths.join(', ') || "None"}
            Behaviors NOT selected (Gaps): ${gaps.join(', ') || "None"}
            Provide analysis and 3 specific, actionable tips. Address user as "you". Concise.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        setAssessmentFeedback(response.text || "Could not analyze at this time.");
    } catch (e) {
        console.error(e);
        setAssessmentFeedback("Error analyzing assessment. Please try again.");
    } finally {
        setAnalyzingAssessment(false);
    }
  };

  const handleScenarioClick = (scenario: string) => {
      setUserQuery(scenario);
  };

  const handleAICoach = async () => {
    if (!userQuery.trim()) return;
    setLoading(true);
    setAiResponse(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            You are an expert career coach. User wants to improve '${selectedSkill?.title}'.
            Scenario: "${userQuery}"
            Provide: 1. Proficiency Assessment, 2. Improvement Tips, 3. Learning Resources.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        setAiResponse(response.text || "I couldn't generate a response at this time.");
    } catch (error) {
        console.error(error);
        setAiResponse("Error connecting to AI Coach.");
    } finally {
        setLoading(false);
    }
  };

  if (selectedSkill) {
      const Icon = icons[selectedSkill.icon] || Mic2;
      return (
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-32 relative z-10">
            <button onClick={() => setSelectedSoftSkillId(null)} className="mb-8 px-6 py-2 rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all font-bold flex items-center gap-2 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:text-zinc-300 dark:hover:bg-white/10 dark:rounded-full">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                <div>
                    <div className={`w-20 h-20 rounded-xl border-2 border-black bg-${selectedSkill.color}-100 dark:bg-white/5 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none dark:border-white/10`}>
                        <Icon className={`w-10 h-10 text-black dark:text-${selectedSkill.color}-400`} />
                    </div>
                    <h1 className="text-5xl font-black text-black dark:text-white mb-4 uppercase font-brutal dark:font-sans">{selectedSkill.title}</h1>
                    <p className="text-xl font-bold text-zinc-500 dark:text-gray-400 dark:font-normal">{selectedSkill.desc}</p>
                </div>
                <Button
                    onClick={() => setShowAI(true)}
                    className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-2 border-black dark:border-none"
                    icon={Bot}
                >
                    AI Coach
                </Button>
            </div>

            <div className={`card-base p-8 mb-8 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
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
                                <span className="font-bold">{stmt}</span>
                                {isSelected ? <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-current" /> : <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600"></div>}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col items-center">
                    <Button onClick={analyzeAssessment} disabled={analyzingAssessment} icon={Sparkles}>
                        {analyzingAssessment ? 'Analyzing...' : 'Analyze Profile'}
                    </Button>

                    {assessmentFeedback && (
                         <div className="mt-8 p-6 bg-neo-blue border-2 border-black dark:bg-white/5 dark:border-white/10 rounded-xl w-full">
                            <div className="flex items-center gap-2 mb-4">
                                <Bot className="w-5 h-5 text-black dark:text-white" />
                                <h4 className="font-black text-black dark:text-white uppercase font-brutal dark:font-sans">Analysis</h4>
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-medium">
                                {assessmentFeedback.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2">{line}</p>
                                ))}
                            </div>
                         </div>
                    )}
                </div>
            </div>

            <div className={`card-base p-8 mb-8 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <h3 className="text-2xl font-black text-black dark:text-white mb-6 flex items-center gap-2 uppercase font-brutal dark:font-sans">
                    <Lightbulb className="w-6 h-6 text-amber-500" /> Adept Tips
                </h3>
                <ul className="space-y-3">
                    {selectedSkill.tips.map(tip => (
                        <li key={tip} className="flex gap-3 text-zinc-600 font-bold dark:text-gray-400 dark:font-normal"><span className="text-amber-500">•</span>{tip}</li>
                    ))}
                </ul>
            </div>

            {/* AI Coach Modal */}
            {showAI && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className={`card-base w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                        <div className={`p-6 border-b-2 border-black dark:border-white/10 flex justify-between items-center ${isDark ? 'bg-white/5' : 'bg-neo-purple'}`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-black text-white rounded-lg dark:bg-indigo-600">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-black dark:text-white uppercase font-brutal dark:font-sans">AI Coach</h3>
                                </div>
                            </div>
                            <button onClick={() => setShowAI(false)} className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {!aiResponse && !loading && (
                                <div className="text-center py-6">
                                    <p className="text-zinc-500 font-bold dark:text-gray-400 mb-6">Choose a scenario:</p>
                                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                                        {selectedSkill.scenarios.map((sc, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleScenarioClick(sc)}
                                                className="px-4 py-2 rounded-full border-2 border-black bg-white hover:bg-neo-yellow text-xs font-bold text-black transition-all dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                                            >
                                                {sc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-black dark:text-indigo-500" />
                                    <p className="text-sm font-bold animate-pulse dark:text-gray-400">Thinking...</p>
                                </div>
                            )}

                            {aiResponse && (
                                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed bg-zinc-50 border-2 border-black p-6 rounded-xl dark:bg-white/5 dark:border-white/10 font-medium">
                                    {aiResponse.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t-2 border-black dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
                            <div className="relative">
                                <textarea
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                    placeholder="Describe your scenario..."
                                    className="w-full pl-4 pr-12 py-3 bg-zinc-100 border-2 border-black rounded-xl focus:bg-white outline-none resize-none font-bold text-black dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-indigo-500"
                                    rows={2}
                                />
                                <button
                                    onClick={handleAICoach}
                                    disabled={loading || !userQuery.trim()}
                                    className="absolute right-3 top-3 p-2 bg-black text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-colors dark:bg-indigo-600"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 relative z-10">
        <div className="mb-16">
            <h2 className="text-5xl font-black text-black dark:text-white mb-4 uppercase font-brutal dark:font-sans">Soft Skills</h2>
            <p className="text-xl font-bold text-zinc-500 dark:text-gray-400 dark:font-normal">Level up your personality.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOFT_SKILLS.map(skill => {
                const Icon = icons[skill.icon] || Mic2;
                return (
                    <div key={skill.id} onClick={() => setSelectedSoftSkillId(skill.id)} className={`card-base p-6 cursor-pointer group flex flex-col h-full bg-white dark:bg-transparent`}>
                        <div className={`w-14 h-14 rounded-xl border-2 border-black bg-${skill.color}-100 dark:bg-white/5 flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none dark:border-white/10`}>
                            <Icon className={`w-7 h-7 text-black dark:text-${skill.color}-400`} />
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