import React, { useState } from 'react';
import {
  Compass,
  Clock,
  Layers,
  CheckCircle2,
  Play,
  Check,
  Star,
  Sparkles,
  ArrowRight,
  X,
  Flame
} from 'lucide-react';
import { store } from '../services/store';
import { Challenge } from '../types';

interface ChallengesViewProps {
  onOpenRoadmaps: () => void;
  onOpenAIGuide: () => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  onOpenRoadmaps,
  onOpenAIGuide
}) => {
  const challenges = store.challenges;
  const attempts = store.challengeAttempts.filter((a) => a.userId === store.currentUser.id);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // Form State
  const [notes, setNotes] = useState('');
  const [enjoyment, setEnjoyment] = useState(4);
  const [difficulty, setDifficulty] = useState(3);
  const [retryWillingness, setRetryWillingness] = useState(4);
  const [learningTakeaway, setLearningTakeaway] = useState('');
  const [wantToExploreFurther, setWantToExploreFurther] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const isChallengeCompleted = (id: string) => {
    return attempts.some((a) => a.challengeId === id);
  };

  const handleOpenChallengeModal = (c: Challenge) => {
    setSelectedChallenge(c);
    const existing = attempts.find((a) => a.challengeId === c.id);
    if (existing) {
      setNotes(existing.submissionNotes);
      setEnjoyment(existing.reflection.enjoyment);
      setDifficulty(existing.reflection.difficulty);
      setRetryWillingness(existing.reflection.retryWillingness);
      setLearningTakeaway(existing.reflection.learningTakeaway);
      setWantToExploreFurther(existing.reflection.wantToExploreFurther);
    } else {
      setNotes('');
      setLearningTakeaway('');
    }
  };

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;

    store.submitChallengeAttempt(selectedChallenge.id, notes, {
      enjoyment,
      difficulty,
      retryWillingness,
      learningTakeaway,
      wantToExploreFurther
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setSelectedChallenge(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white bg-grid-pattern py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/70 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            Experiential Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight font-display">
            Interactive Challenges & Micro-Experiences
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            The best way to know if you enjoy sports strategy, writing, coding, or game design is to actually do it for 30 minutes. Log your honest reflections to refine your path.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          {challenges.map((c) => {
            const completed = isChallengeCompleted(c.id);
            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all card-hover-lift relative overflow-hidden ${
                  completed
                    ? 'border-zinc-200/90 shadow-2xs'
                    : 'border-zinc-200/90 shadow-2xs hover:shadow-lg hover:border-zinc-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 rounded-md text-[11px]">
                      {c.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-200/70">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {c.estimatedDuration}
                      </span>
                      {completed && (
                        <span className="text-[11px] text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3 text-rose-600" />
                          Done
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">{c.title}</h3>
                    <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">{c.objective}</p>
                  </div>

                  {/* Materials */}
                  <div className="p-3 rounded-xl bg-zinc-50 text-[11px] text-zinc-600 border border-zinc-200/70">
                    <span className="font-semibold text-zinc-900">Materials: </span>
                    {c.materials.join(', ')}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Difficulty: <span className="font-semibold text-zinc-700">{c.difficulty}</span>
                  </span>
                  <button
                    onClick={() => handleOpenChallengeModal(c)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                      completed
                        ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                        : 'bg-zinc-950 text-white hover:bg-zinc-850 shadow-md shadow-zinc-950/10 hover:shadow-rose-950/20 hover:-translate-y-0.5'
                    }`}
                  >
                    <Play className="w-3 h-3 text-rose-400" />
                    <span>{completed ? 'Review Reflection' : 'Start Challenge'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Challenge Interactive Modal */}
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200/90 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
                <div className="text-xs">
                  <span className="font-semibold text-rose-700 uppercase tracking-wider text-[11px]">
                    {selectedChallenge.category} · {selectedChallenge.estimatedDuration}
                  </span>
                  <h3 className="text-base font-bold text-zinc-950 mt-0.5 font-display">
                    {selectedChallenge.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-rose-600 mx-auto" />
                  <h4 className="text-base font-bold text-zinc-950 font-display">
                    Challenge Reflection Recorded!
                  </h4>
                  <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                    Your reflection has been added to your profile memory. Your recommendations will adapt to reflect what you genuinely enjoyed.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitAttempt}
                  className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs"
                >
                  {/* Step by step instructions */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-zinc-400 text-xs uppercase tracking-wider">
                      Step-by-Step Instructions
                    </h4>
                    <div className="space-y-2">
                      {selectedChallenge.instructions.map((ins, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/70 text-zinc-700"
                        >
                          <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{ins}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                      Notes or Link to Artifact (Private to you)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Completed tactical momentum notes on yesterday's cricket match; found that over 16 had 4 dot balls..."
                      className="w-full text-xs p-3.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                    />
                  </div>

                  {/* 5-Metric Reflection Calibration */}
                  <div className="p-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 space-y-4">
                    <h4 className="font-bold text-zinc-950 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                      5-Dimension Experience Reflection
                    </h4>

                    {/* Enjoyment */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-medium text-zinc-700">Genuine Enjoyment</span>
                        <span className="font-bold font-mono text-rose-700">{enjoyment} / 5</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={enjoyment}
                        onChange={(e) => setEnjoyment(Number(e.target.value))}
                        className="w-full accent-zinc-950"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Felt tedious</span>
                        <span>Enjoyed the flow</span>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-medium text-zinc-700">Perceived Difficulty</span>
                        <span className="font-bold font-mono text-zinc-800">{difficulty} / 5</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className="w-full accent-zinc-950"
                      />
                    </div>

                    {/* Retry Willingness */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-medium text-zinc-700">Willingness to Try Again</span>
                        <span className="font-bold font-mono text-rose-700">
                          {retryWillingness} / 5
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={retryWillingness}
                        onChange={(e) => setRetryWillingness(Number(e.target.value))}
                        className="w-full accent-zinc-950"
                      />
                    </div>

                    {/* What I learned */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                        What was your core takeaway?
                      </label>
                      <input
                        type="text"
                        required
                        value={learningTakeaway}
                        onChange={(e) => setLearningTakeaway(e.target.value)}
                        placeholder="e.g. Visualizing the numbers made the game far more exciting than just watching."
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                      />
                    </div>

                    {/* Want to explore further toggle */}
                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={wantToExploreFurther}
                        onChange={(e) => setWantToExploreFurther(e.target.checked)}
                        className="w-4 h-4 rounded text-zinc-950 focus:ring-rose-500/20 cursor-pointer accent-zinc-950"
                      />
                      <span className="text-xs font-medium text-zinc-800">
                        I want to explore more challenges in this category
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedChallenge(null)}
                      className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-xs transition-colors hover:shadow-rose-950/20"
                    >
                      Complete & Log Reflection
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
