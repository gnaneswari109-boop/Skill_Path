import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Brain,
  Send,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  Bot
} from 'lucide-react';
import { store } from '../services/store';
import { SEED_DISCOVERY_QUESTIONS } from '../data/seedData';
import { ClarityLevel, DiscoveryReport } from '../types';
import { aiGuide } from '../services/aiGuide';

interface DiscoveryFlowViewProps {
  onCompleteToDashboard: () => void;
  onExploreLibrary: () => void;
  onOpenRoadmaps: () => void;
}

export const DiscoveryFlowView: React.FC<DiscoveryFlowViewProps> = ({
  onCompleteToDashboard,
  onExploreLibrary,
  onOpenRoadmaps
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 2 State
  const [lifeStage, setLifeStage] = useState(store.currentUser.lifeStage || 'career_transition');
  const [availableHours, setAvailableHours] = useState(store.currentUser.availableHoursPerWeek || 5);
  const [learningStyle, setLearningStyle] = useState(store.currentUser.preferredLearningStyle || 'hands_on');

  // Step 3 State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({ ...store.discoveryAnswers });
  const [textAnswer, setTextAnswer] = useState(
    (store.discoveryAnswers['q_tried_and_enjoyed']?.value as string) || ''
  );

  // Step 4: AI Discovery Dialogue State
  const [aiChatMessages, setAiChatMessages] = useState<
    { sender: 'assistant' | 'user'; text: string }[]
  >([
    {
      sender: 'assistant',
      text: `Based on what you've shared so far, you seem drawn to understanding how things work under the surface—like analyzing tactical patterns or deconstructing systems—rather than sitting through repetitive routine.\n\nWhen you think back to when you were totally absorbed in an activity, was it more about **cracking a tricky puzzle**, **making something look or sound compelling**, or **helping someone achieve a breakthrough**?`
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  // Step 5 & 6 State
  const [generatedReport, setGeneratedReport] = useState<DiscoveryReport | null>(
    store.discoveryReport
  );
  const [clarityChoice, setClarityChoice] = useState<ClarityLevel>('direction');

  // Question navigation helpers
  const currentQ = SEED_DISCOVERY_QUESTIONS[currentQuestionIndex];
  const totalQuestions = SEED_DISCOVERY_QUESTIONS.length;

  const handleSelectOption = (qId: string, qTitle: string, val: string) => {
    store.saveDiscoveryAnswer(qId, qTitle, val);
    setAnswers((prev) => ({
      ...prev,
      [qId]: { questionId: qId, questionTitle: qTitle, value: val }
    }));
  };

  const handleNextQuestion = () => {
    if (currentQ.type === 'text') {
      store.saveDiscoveryAnswer(currentQ.id, currentQ.title, textAnswer);
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: { questionId: currentQ.id, questionTitle: currentQ.title, value: textAnswer }
      }));
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStep(4); // Move to AI Discovery Dialogue
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setStep(2);
    }
  };

  // AI Dialogue Submit
  const handleSendAiMessage = async () => {
    if (!aiInput.trim() || aiThinking) return;

    const userText = aiInput.trim();
    const newChat = [...aiChatMessages, { sender: 'user' as const, text: userText }];
    setAiChatMessages(newChat);
    setAiInput('');
    setAiThinking(true);

    try {
      const resp = await aiGuide.getGuideResponse(userText, newChat);
      setAiChatMessages((prev) => [...prev, { sender: 'assistant', text: resp.text }]);
    } catch {
      setAiChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `Thank you for clarifying. That points to a genuine interest in tactical clarity and visual storytelling. Let's look at your personalized report.`
        }
      ]);
    } finally {
      setAiThinking(false);
    }
  };

  const handleGenerateReport = () => {
    const report = store.completeDiscoverySession(clarityChoice);
    setGeneratedReport(report);
    setStep(5);
  };

  const handleFinalizeClarity = (choice: ClarityLevel) => {
    setClarityChoice(choice);
    store.completeDiscoverySession(choice);
    onCompleteToDashboard();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
            <span>Step {step} of 6</span>
            <span>
              {step === 1 && 'Welcome & Orientation'}
              {step === 2 && 'Your Rhythm & Life Stage'}
              {step === 3 && `Discovery Questions (${currentQuestionIndex + 1}/${totalQuestions})`}
              {step === 4 && 'AI Contextual Dialogue'}
              {step === 5 && 'Personalized Discovery Report'}
              {step === 6 && 'Clarity Checkpoint'}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* ================= STEP 1: WELCOME ================= */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                You don’t need to have everything figured out.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most career guides force you to pick a job title before you even know what activities make you curious. Skill Path reverses that: let's discover what you naturally enjoy doing, what exhausts you, and what small experiments you can try this month.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="font-semibold text-slate-900">What to expect from this session:</div>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Takes about 4 to 6 minutes to complete</li>
                <li>No trick questions or rigid personality categorization</li>
                <li>Everything is saved so you can change answers or resume anytime</li>
                <li>You'll leave with 3 concrete starter experiments and clarity on next steps</li>
              </ul>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={onExploreLibrary}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Just browse interests first
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
              >
                <span>Start Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: UNDERSTAND THE USER ================= */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Let's understand your current context
              </h2>
              <p className="text-xs text-slate-600">
                Recommendations must fit your actual lifestyle and time budget—not an unrealistic fantasy schedule.
              </p>
            </div>

            {/* Life Stage */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Current Life Stage</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'school', label: 'High School' },
                  { id: 'college', label: 'University / College' },
                  { id: 'employed', label: 'Currently Employed' },
                  { id: 'career_transition', label: 'In Career Transition' },
                  { id: 'exploring', label: 'Open Exploration' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLifeStage(item.id as any)}
                    className={`p-3 rounded-lg border text-xs font-medium text-left transition-colors ${
                      lifeStage === item.id
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">
                  Comfortable Time Available for Exploration
                </label>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  {availableHours} hours / week
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                step={1}
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>2 hrs (Light hobby)</span>
                <span>8 hrs (Active project)</span>
                <span>20 hrs (Deep focus)</span>
              </div>
            </div>

            {/* Preferred Learning Style */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Preferred Learning Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hands_on', title: 'Hands-On Building', desc: 'Experimenting first, learning theory as questions arise' },
                  { id: 'reading_research', title: 'Curated Research', desc: 'Reading essays, watching deep-dives, taking structured notes' },
                  { id: 'mentored', title: 'Mentored Guidance', desc: 'Direct review and targeted advice from experienced practitioners' },
                  { id: 'collaborative', title: 'Collaborative Groups', desc: 'Bouncing ideas with study partners and community peers' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLearningStyle(item.id as any)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      learningStyle === item.id
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => {
                  store.updateCurrentUserProfile({
                    lifeStage,
                    availableHoursPerWeek: availableHours,
                    preferredLearningStyle: learningStyle
                  });
                  setStep(3);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
              >
                <span>Continue to Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: INTERACTIVE QUESTIONS ================= */}
        {step === 3 && currentQ && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Question {currentQuestionIndex + 1} of {totalQuestions} · Category: {currentQ.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {currentQ.title}
              </h2>
              <p className="text-xs text-slate-600">{currentQ.subtitle}</p>
            </div>

            {/* Options */}
            {currentQ.type === 'single' && currentQ.options && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id]?.value === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, currentQ.title, opt.value)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{opt.label}</div>
                          {opt.description && (
                            <div className="text-[11px] text-slate-500 mt-0.5">{opt.description}</div>
                          )}
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'text' && (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="e.g. Last weekend I spent an hour sketching a simple card game mechanic with friends..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  Feel free to be informal. What matters is the real sensation of enjoyment you felt.
                </p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={handlePrevQuestion}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
              >
                <span>{currentQuestionIndex === totalQuestions - 1 ? 'Start AI Dialogue' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: AI DISCOVERY DIALOGUE ================= */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Bot className="w-5 h-5 text-emerald-700" />
                  Skill Path Guide Follow-up
                </h2>
                <p className="text-xs text-slate-600">
                  Refining hypotheses and testing nuance before generating your report.
                </p>
              </div>
              <button
                onClick={handleGenerateReport}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                Skip straight to Report →
              </button>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3 max-h-72 overflow-y-auto p-4 rounded-xl bg-slate-50 border border-slate-200">
              {aiChatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiThinking && (
                <div className="text-xs text-slate-400 italic">Thinking and synthesizing answers...</div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                placeholder="Type your reflection or answer..."
                className="flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendAiMessage}
                disabled={!aiInput.trim() || aiThinking}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs"
              >
                <span>Generate Discovery Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: PERSONALIZED DISCOVERY REPORT ================= */}
        {step === 5 && generatedReport && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-8">
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Discovery Report · Generated for {store.currentUser.name}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Your Interest & Strength Insights
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {generatedReport.confidenceExplanation}
              </p>
            </div>

            {/* Primary & Secondary Themes */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Primary Themes
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {generatedReport.primaryThemes.map((theme, i) => (
                    <li key={i} className="flex items-start gap-2 font-medium">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{theme}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Secondary Exploration Angles
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {generatedReport.secondaryInterests.map((sec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{sec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tentative Strengths */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Observed & Tentative Strengths
              </h3>
              <div className="space-y-2">
                {generatedReport.tentativeStrengths.map((str, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{str.strength}</div>
                      <div className="text-slate-500 mt-0.5">{str.evidence}</div>
                    </div>
                    <span className="text-[11px] text-slate-400 capitalize shrink-0">
                      [{str.status}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Suggested Starter Experiments */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                3 Suggested Low-Stakes Experiments to Test This
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {generatedReport.suggestedExperiments.map((exp, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between text-xs space-y-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 leading-snug">{exp.title}</div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{exp.duration}</span>
                      <span>{exp.domain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(6)}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
              >
                <span>Continue to Clarity Checkpoint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 6: CLARITY CHECKPOINT ================= */}
        {step === 6 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Final Checkpoint
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How clear do you feel about what you want to explore next?
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Be genuinely honest. There is zero expectation to have an absolute career chosen. Your selection determines what appears on your home dashboard.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'direction',
                  title: 'I have a clear direction to test',
                  desc: 'Take me to my personalized 4-week roadmap and start my first mini-challenge'
                },
                {
                  id: 'possibilities',
                  title: 'I have a few exciting possibilities',
                  desc: 'Show me recommendations to compare and let me browse starter experiments'
                },
                {
                  id: 'unsure',
                  title: 'I’m still unsure and exploring',
                  desc: 'Give me low-commitment 30-minute activities without putting me in a track'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleFinalizeClarity(opt.id as any)}
                  className="w-full p-4 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-emerald-950">
                      {opt.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
