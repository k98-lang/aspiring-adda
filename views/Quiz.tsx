import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Lock } from 'lucide-react';
import { useApp } from '../AppContext';
import { QUIZ_LEVELS, SPECIALIZATIONS } from '../constants';
import Button from '../components/Button';
import { GoogleGenAI } from "@google/genai";

type Stage = 'levels' | 'loading' | 'questions' | 'result';

const Quiz: React.FC = () => {
  const { navigate, setSelectedSpecId, lastQuizScore, setLastQuizScore, isDark, currentUser } = useApp();
  const [stage, setStage] = useState<Stage>('levels');
  const [level, setLevel] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultSpec, setResultSpec] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState(0);

  const startLevel = async (lvl: string) => {
      if (!currentUser) {
          navigate('login');
          return;
      }

      setLevel(lvl);
      setStage('loading');

      // Always use AI to generate fresh questions
      try {
          await generateAIQuiz(lvl, lastQuizScore);
      } catch (e) {
          console.error("AI Quiz Generation Failed, falling back to static", e);
          setQuestions(QUIZ_LEVELS[lvl]);
          setStage('questions');
          setCurrentStep(0);
          setAnswers([]);
      }
  };

  const generateAIQuiz = async (lvl: string, prevScore: number | null) => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const difficulty = prevScore === null
        ? "balanced"
        : prevScore < 50
            ? "easy"
            : "hard";

      // We provide the list of specs to the model so it knows valid IDs
      // Truncate list slightly to ensure we don't overwhelm context
      const specList = SPECIALIZATIONS.map(s => `${s.id}`).join(',');

      const prompt = `
          Generate a career quiz for a '${lvl}' user.
          Difficulty: ${difficulty}.

          TASK: Create EXACTLY 3 multiple-choice questions.

          OUTPUT FORMAT (JSON ONLY):
          [
            {
              "question": "Short question text (max 15 words)",
              "options": [
                { "txt": "Short answer (max 6 words)", "spec": "One_ID_From_List", "color": "border-neo-blue" }
              ]
            }
          ]

          RULES:
          1. Use these IDs for 'spec': ${specList}
          2. Randomly assign 'color' from: border-neo-blue, border-neo-green, border-neo-yellow, border-neo-rose, border-neo-purple.
          3. Provide 4 options per question.
          4. No Markdown. No Code Blocks. Just raw JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            maxOutputTokens: 1000,
            thinkingConfig: { thinkingBudget: 0 },
        }
      });

      if (response.text) {
          let cleanText = response.text.trim();
          // Remove markdown code blocks if present
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

          try {
              const generatedQuestions = JSON.parse(cleanText);
              if (Array.isArray(generatedQuestions) && generatedQuestions.length > 0) {
                  setQuestions(generatedQuestions);
                  setStage('questions');
                  setCurrentStep(0);
                  setAnswers([]);
              } else {
                  throw new Error("Invalid JSON structure");
              }
          } catch (e) {
              console.error("JSON Parse Error", e);
              throw new Error("Failed to parse AI response");
          }
      } else {
          throw new Error("Empty AI response");
      }
  };

  const handleAnswer = (specId: string) => {
      const newAnswers = [...answers, specId];
      setAnswers(newAnswers);

      if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
      } else {
          // Determine winner
          const counts: Record<string, number> = {};
          newAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
          let max = 0;
          let candidates: string[] = [];

          for (const s in counts) {
              if(counts[s] > max) max = counts[s];
          }
          candidates = Object.keys(counts).filter(s => counts[s] === max);

          // Calculate a mock "score" for the adaptive logic (consistency check)
          const consistencyScore = (max / questions.length) * 100;
          setCurrentScore(consistencyScore);
          setLastQuizScore(consistencyScore);

          let final = candidates[0];
          const advancedRoles = ['s2', 's10', 's12', 's14', 's15', 's23', 's20', 's25', 's50', 's51', 's60', 's61'];

          if(candidates.length > 1) {
              if (level === 'advanced') {
                   final = candidates.find(c => advancedRoles.includes(c)) || candidates[0];
              } else {
                   final = candidates.find(c => !advancedRoles.includes(c)) || candidates[0];
              }
          }
          setResultSpec(final);
          setStage('result');
      }
  };

  const reset = () => {
      setStage('levels');
      setAnswers([]);
      setResultSpec(null);
  };

  const goToResult = () => {
      if(resultSpec) {
        setSelectedSpecId(resultSpec);
        navigate('detail', { specId: resultSpec });
      }
  };

  if (stage === 'loading') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10">
              <Loader2 className="w-12 h-12 text-black dark:text-nebula-teal animate-spin mb-4" />
              <h3 className="text-xl font-black text-black dark:text-white uppercase">Generating Assessment</h3>
              <p className="text-zinc-500 font-bold dark:text-gray-400">Creating unique questions using Gemini AI...</p>
          </div>
      )
  }

  if (stage === 'levels') {
      return (
        <div className="max-w-5xl mx-auto px-6 py-32 min-h-screen flex flex-col justify-center text-center relative z-10">
            <button onClick={() => navigate('home')} className="absolute top-24 left-6 md:left-12 flex items-center gap-2 font-bold text-black dark:text-white hover:underline transition-colors z-10">
                <ArrowLeft className="w-5 h-5" /> Home
            </button>

            <h2 className="text-7xl font-black text-black dark:text-white mb-4 uppercase font-brutal dark:font-sans">Level Select</h2>
            <p className="text-xl font-bold text-zinc-500 dark:text-gray-400 dark:font-normal mb-16">Choose your difficulty.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div onClick={() => startLevel('beginner')} className={`card-base p-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 relative overflow-hidden group`}>
                    <h3 className="text-3xl font-black mb-2 uppercase text-black dark:text-white font-brutal dark:font-sans">Noob</h3>
                    <p className="text-sm font-bold text-black dark:text-gray-400">Just looking around.</p>
                    {!currentUser && <div className="absolute top-4 right-4 text-black/50 dark:text-white/30"><Lock className="w-6 h-6" /></div>}
                </div>
                <div onClick={() => startLevel('intermediate')} className={`card-base p-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 relative overflow-hidden group`}>
                    <h3 className="text-3xl font-black mb-2 uppercase text-black dark:text-white font-brutal dark:font-sans">Pro</h3>
                    <p className="text-sm font-bold text-black dark:text-gray-400">Know the basics.</p>
                    {!currentUser && <div className="absolute top-4 right-4 text-black/50 dark:text-white/30"><Lock className="w-6 h-6" /></div>}
                </div>
                <div onClick={() => startLevel('advanced')} className={`card-base p-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 relative overflow-hidden group`}>
                    <h3 className="text-3xl font-black mb-2 uppercase text-black dark:text-white font-brutal dark:font-sans">God</h3>
                    <p className="text-sm font-bold text-black dark:text-gray-400">Here to dominate.</p>
                    {!currentUser && <div className="absolute top-4 right-4 text-black/50 dark:text-white/30"><Lock className="w-6 h-6" /></div>}
                </div>
            </div>

            {!currentUser && (
                <p className="mt-8 text-red-500 font-bold uppercase text-sm animate-pulse">Login required to start assessment</p>
            )}
        </div>
      );
  }

  if (stage === 'result' && resultSpec) {
      const spec = SPECIALIZATIONS.find(s => s.id === resultSpec) || SPECIALIZATIONS[0];
      return (
        <div className="min-h-screen flex items-center justify-center px-6 py-24 relative z-10">
            <div className={`max-w-xl w-full text-center card-base p-12 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <h2 className="text-5xl font-black text-black dark:text-white mb-4 uppercase font-brutal dark:font-sans">Matched!</h2>
                <p className="text-xl font-bold mb-10 text-zinc-500 dark:text-gray-400">You belong in <span className="bg-black text-white px-2 dark:bg-nebula-teal dark:text-black font-black">{spec.name}</span>.</p>
                <div className="space-y-4">
                    <Button fullWidth size="lg" onClick={goToResult}>View Roadmap</Button>
                    <Button fullWidth variant="secondary" onClick={reset}>Retake</Button>
                </div>
            </div>
        </div>
      );
  }

  const q = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-6 py-32 min-h-screen flex flex-col justify-center relative z-10">
        <div className="mb-12 border-2 border-black h-4 w-full dark:border-white/20 dark:bg-black/50 dark:rounded-full">
            <div className="h-full bg-black transition-all duration-300 dark:bg-nebula-gold dark:rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-12 leading-tight uppercase animate-in slide-in-from-right-4 fade-in duration-500 key={currentStep} font-brutal dark:font-sans">
            {q.question}
        </h2>

        <div className="space-y-4">
            {q.options.map((opt: any, i: number) => (
                <button
                    key={i}
                    onClick={() => handleAnswer(opt.spec)}
                    style={{animationDelay: `${i * 100}ms`}}
                    className={`w-full text-left p-8 card-base hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-between group bg-white dark:bg-white/5 dark:hover:bg-white/10`}
                >
                    <span className="font-bold text-xl text-black dark:text-gray-200 group-hover:dark:text-white">{opt.txt}</span>
                    <ArrowRight className="w-6 h-6 text-black dark:text-white" />
                </button>
            ))}
        </div>

        <div className="mt-12 text-center">
            <button onClick={reset} className="text-sm font-black text-zinc-400 hover:text-black uppercase tracking-widest dark:hover:text-nebula-teal transition-colors">Abort</button>
        </div>
    </div>
  );
};

export default Quiz;