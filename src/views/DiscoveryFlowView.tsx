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
    <div className="min-h-screen bg-[#fafafa] py-10 px-4 sm:px-6 lg:px-8 selection:bg-rose-100 selection:text-rose-950">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono font-medium mb-2.5">
            <span className="uppercase tracking-wider text-rose-600 font-bold">Step {step} of 6</span>
            <span className="text-zinc-600 font-sans">
              {step === 1 && 'Welcome & Orientation'}
              {step === 2 && 'Your Rhythm & Life Stage'}
              {step === 3 && `Discovery Questions (${currentQuestionIndex + 1}/${totalQuestions})`}
              {step === 4 && 'AI Contextual Dialogue'}
              {step === 5 && 'Personalized Discovery Report'}
              {step === 6 && 'Clarity Checkpoint'}
            </span>
          </div>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-zinc-950 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* ================= STEP 1: WELCOME ================= */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-8 sm:p-12 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                You don’t need to have everything figured out.
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Most career guides force you to pick a job title before you even know what activities make you curious. Skill Path reverses that: let's discover what you naturally enjoy doing, what exhausts you, and what small experiments you can try this month.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs text-zinc-600">
              <div className="font-bold text-zinc-900">What to expect from this session:</div>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Takes about 4 to 6 minutes to complete</li>
                <li>No trick questions or rigid personality categorization</li>
                <li>Everything is saved so you can change answers or resume anytime</li>
                <li>You'll leave with 3 concrete starter experiments and clarity on next steps</li>
              </ul>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              <button
                onClick={onExploreLibrary}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                Just browse interests first
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>Start Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: UNDERSTAND THE USER ================= */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-8 sm:p-12 space-y-7">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
                Let's understand your current context
              </h2>
              <p className="text-xs text-zinc-600">
                Recommendations must fit your actual lifestyle and time budget—not an unrealistic fantasy schedule.
              </p>
            </div>

            {/* Life Stage */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-zinc-800">Current Life Stage</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                    className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      lifeStage === item.id
                        ? 'border-zinc-950 bg-zinc-900 text-white shadow-xs'
                        : 'border-zinc-200/80 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Hours */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-800">
                  Comfortable Time Available for Exploration
                </label>
                <span className="text-xs font-extrabold text-rose-600 font-mono">
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
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>2 hrs (Light trial)</span>
                <span>8 hrs (Active sprint)</span>
                <span>20 hrs (Deep focus)</span>
              </div>
            </div>

            {/* Preferred Learning Style */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-zinc-800">Preferred Learning Style</label>
              <div className="grid grid-cols-2 gap-2.5">
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
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      learningStyle === item.id
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                        : 'border-zinc-200/80 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className={`text-[11px] mt-0.5 ${learningStyle === item.id ? 'text-zinc-300' : 'text-zinc-500'}`}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
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
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>Continue to Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: INTERACTIVE QUESTIONS ================= */}
        {step === 3 && currentQ && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-8 sm:p-12 space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600">
                Question {currentQuestionIndex + 1} of {totalQuestions} · Category: {currentQ.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
                {currentQ.title}
              </h2>
              <p className="text-xs text-zinc-600">{currentQ.subtitle}</p>
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
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                          : 'border-zinc-200/80 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>{opt.label}</div>
                          {opt.description && (
                            <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>{opt.description}</div>
                          )}
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
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
                  className="w-full text-xs p-3.5 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                />
                <p className="text-[11px] text-zinc-400">
                  Feel free to be informal. What matters is the real sensation of enjoyment you felt.
                </p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              <button
                onClick={handlePrevQuestion}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>{currentQuestionIndex === totalQuestions - 1 ? 'Start AI Dialogue' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: AI DISCOVERY DIALOGUE ================= */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-8 sm:p-12 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight flex items-center gap-2">
                  <Bot className="w-5 h-5 text-rose-600" />
                  Skill Path Guide Follow-up
                </h2>
                <p className="text-xs text-zinc-600">
                  Refining hypotheses and testing nuance before generating your report.
                </p>
              </div>
              <button
                onClick={handleGenerateReport}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Skip straight to Report →
              </button>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3 max-h-72 overflow-y-auto p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              {aiChatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[85%] whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-zinc-950 text-white rounded-br-none shadow-xs'
                        : 'bg-white border border-zinc-200/90 text-zinc-800 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiThinking && (
                <div className="text-xs text-zinc-400 italic">Thinking and synthesizing answers...</div>
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
                className="flex-1 text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
              />
              <button
                onClick={handleSendAiMessage}
                disabled={!aiInput.trim() || aiThinking}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 disabled:opacity-40 rounded-xl transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl transition-all shadow-md shadow-zinc-950/10 hover:shadow-rose-950/20 hover:-translate-y-0.5"
              >
                <span>Generate Discovery Report</span>
                <ArrowRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: PERSONALIZED DISCOVERY REPORT ================= */}
        {step === 5 && generatedReport && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-8 sm:p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="border-b border-zinc-100 pb-5 space-y-2 relative">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase text-rose-700 bg-rose-50 border border-rose-200/70">
                <Sparkles className="w-3 h-3 text-rose-600" />
                Discovery Report · Generated for {store.currentUser.name}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight font-display">
                Your Interest & Strength Insights
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">
                {generatedReport.confidenceExplanation}
              </p>
            </div>

            {/* Primary & Secondary Themes */}
            <div className="grid sm:grid-cols-2 gap-4 relative">
              <div className="p-5 rounded-xl bg-rose-50/40 border border-rose-200/80 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-600" />
                  Primary Exploration Themes
                </span>
                <ul className="space-y-2 text-xs text-zinc-800">
                  {generatedReport.primaryThemes.map((theme, i) => (
                    <li key={i} className="flex items-start gap-2 font-medium">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{theme}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-zinc-50/80 border border-zinc-200 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-400" />
                  Secondary Exploration Angles
                </span>
                <ul className="space-y-2 text-xs text-zinc-700">
                  {generatedReport.secondaryInterests.map((sec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-400">•</span>
                      <span>{sec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tentative Strengths */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-950">
                Observed & Tentative Strengths
              </h3>
              <div className="space-y-2">
                {generatedReport.tentativeStrengths.map((str, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/30 hover:bg-zinc-50/80 transition-colors flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900">{str.strength}</div>
                      <div className="text-zinc-500 mt-0.5">{str.evidence}</div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200 capitalize shrink-0">
                      {str.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Suggested Starter Experiments */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-950">
                3 Suggested Low-Stakes Experiments to Test This
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {generatedReport.suggestedExperiments.map((exp, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between text-xs space-y-3"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900 leading-snug">{exp.title}</div>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>{exp.duration}</span>
                      <span className="px-1.5 py-0.5 rounded-sm bg-rose-50 text-rose-700 border border-rose-200/60">{exp.domain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(6)}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl transition-all shadow-md shadow-zinc-950/10 hover:shadow-rose-950/20 hover:-translate-y-0.5"
              >
                <span>Continue to Clarity Checkpoint</span>
                <ArrowRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 6: CLARITY CHECKPOINT ================= */}
        {step === 6 && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-8 sm:p-10 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/70">
                Final Checkpoint
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight font-display">
                How clear do you feel about what you want to explore next?
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
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
                  className="w-full p-5 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-900 hover:bg-zinc-50/50 text-left transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs"
                >
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-950 flex items-center gap-2">
                      <span>{opt.title}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">{opt.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
