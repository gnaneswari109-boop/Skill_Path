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
  X
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Experiential Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Interactive Challenges & Micro-Experiences
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The best way to know if you enjoy sports strategy, writing, coding, or game design is to actually do it for 30 minutes. Log your honest reflections to refine your path.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid sm:grid-cols-2 gap-5 pt-2">
          {challenges.map((c) => {
            const completed = isChallengeCompleted(c.id);
            return (
              <div
                key={c.id}
                className={`bg-white rounded-xl border p-6 flex flex-col justify-between transition-all ${
                  completed
                    ? 'border-emerald-200/90 shadow-2xs'
                    : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-emerald-800">{c.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {c.estimatedDuration}
                      </span>
                      {completed && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Done
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.objective}</p>
                  </div>

                  {/* Materials */}
                  <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-800">Materials: </span>
                    {c.materials.join(', ')}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Difficulty: {c.difficulty}
                  </span>
                  <button
                    onClick={() => handleOpenChallengeModal(c)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      completed
                        ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>{completed ? 'Review Reflection' : 'Start Challenge'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Challenge Interactive Modal */}
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="text-xs">
                  <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                    {selectedChallenge.category} · {selectedChallenge.estimatedDuration}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedChallenge.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">
                    Challenge Reflection Recorded!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
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
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                      Step-by-Step Instructions
                    </h4>
                    <div className="space-y-2">
                      {selectedChallenge.instructions.map((ins, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700"
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{ins}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Notes or Link to Artifact (Private to you)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Completed tactical momentum notes on yesterday's cricket match; found that over 16 had 4 dot balls..."
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* 5-Metric Reflection Calibration (Section 12) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-900 text-xs">
                      5-Dimension Experience Reflection
                    </h4>

                    {/* Enjoyment */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-medium text-slate-700">Genuine Enjoyment</span>
                        <span className="font-bold font-mono text-emerald-800">{enjoyment} / 5</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={enjoyment}
                        onChange={(e) => setEnjoyment(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Felt tedious</span>
                        <span>Enjoyed the flow</span>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-medium text-slate-700">Perceived Difficulty</span>
                        <span className="font-bold font-mono text-slate-800">{difficulty} / 5</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className="w-full accent-slate-600"
                      />
                    </div>

                    {/* Retry Willingness */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-medium text-slate-700">Willingness to Try Again</span>
                        <span className="font-bold font-mono text-emerald-800">
                          {retryWillingness} / 5
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={retryWillingness}
                        onChange={(e) => setRetryWillingness(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    {/* What I learned */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        What was your core takeaway?
                      </label>
                      <input
                        type="text"
                        required
                        value={learningTakeaway}
                        onChange={(e) => setLearningTakeaway(e.target.value)}
                        placeholder="e.g. Visualizing the numbers made the game far more exciting than just watching."
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Want to explore further toggle */}
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={wantToExploreFurther}
                        onChange={(e) => setWantToExploreFurther(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-medium text-slate-800">
                        I want to explore more challenges in this category
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedChallenge(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
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
