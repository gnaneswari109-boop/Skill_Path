import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Plus,
  Play,
  Pause,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Calendar,
  Compass,
  X,
  Target
} from 'lucide-react';
import { store } from '../services/store';
import { Roadmap, RoadmapMilestone } from '../types';

interface RoadmapsViewProps {
  onOpenAIGuide: () => void;
  onExploreMore: () => void;
}

export const RoadmapsView: React.FC<RoadmapsViewProps> = ({ onOpenAIGuide, onExploreMore }) => {
  const user = store.currentUser;
  const roadmaps = store.roadmaps.filter((r) => r.userId === user.id);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(
    roadmaps.length > 0 ? roadmaps[0].id : ''
  );
  const [reflectionModalMilestone, setReflectionModalMilestone] = useState<{
    roadmapId: string;
    milestone: RoadmapMilestone;
  } | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Roadmap Form
  const [newTitle, setNewTitle] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newInterest, setNewInterest] = useState('Sports Analytics & Tactical Modeling');

  const currentRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0];

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionModalMilestone) return;

    store.saveMilestoneReflection(
      reflectionModalMilestone.roadmapId,
      reflectionModalMilestone.milestone.id,
      reflectionText
    );
    setReflectionModalMilestone(null);
    setReflectionText('');
  };

  const handleCreateRoadmapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = store.createRoadmap(
      newTitle,
      newGoal,
      newInterest,
      'Custom Track',
      'Created directly from Roadmaps Studio'
    );
    setActiveRoadmapId(created.id);
    setShowCreateModal(false);
    setNewTitle('');
    setNewGoal('');
  };

  return (
    <div className="min-h-screen bg-white bg-grid-pattern py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/70 shadow-2xs">
              <Target className="w-3.5 h-3.5 text-rose-600" />
              Action Plan Builder
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight font-display">
              Growth & Discovery Roadmaps
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              4-week low-pressure structured sprints designed to test genuine intrinsic enjoyment and produce tangible mini-artifacts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-md shadow-zinc-950/10 hover:shadow-rose-950/20 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              <span>New Roadmap</span>
            </button>
            <button
              onClick={onOpenAIGuide}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-rose-800 bg-rose-50/80 border border-rose-200/80 rounded-xl hover:bg-rose-100/80 transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Guide Advice</span>
            </button>
          </div>
        </div>

        {/* Roadmap Selector Tabs */}
        {roadmaps.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {roadmaps.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRoadmapId(r.id)}
                className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                  activeRoadmapId === r.id
                    ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200/80'
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>
        )}

        {/* Active Roadmap View */}
        {currentRoadmap ? (
          <div className="space-y-6">
            {/* Meta Card */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative">
                <div>
                  <div className="text-xs text-rose-700 font-semibold uppercase tracking-wider">
                    Interest Track: {currentRoadmap.interestName} · {currentRoadmap.category}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1 font-display tracking-tight">
                    {currentRoadmap.title}
                  </h2>
                  <p className="text-xs text-zinc-600 mt-1.5 max-w-2xl leading-relaxed">
                    Goal: {currentRoadmap.goal}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right bg-zinc-50 border border-zinc-200/80 px-4 py-2 rounded-xl">
                    <div className="text-xs font-semibold text-zinc-950 font-mono">
                      {currentRoadmap.milestones.filter((m) => m.completed).length} /{' '}
                      {currentRoadmap.milestones.length} Milestones
                    </div>
                    <div className="text-[11px] text-zinc-500">Flexible pacing</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs text-zinc-700 leading-relaxed relative">
                <span className="font-semibold text-zinc-950">Why this path: </span>
                {currentRoadmap.rationale}
              </div>
            </div>

            {/* Milestones Accordion / Sequence */}
            <div className="space-y-4">
              {currentRoadmap.milestones.map((m) => (
                <div
                  key={m.id}
                  className={`bg-white rounded-2xl border transition-all p-6 sm:p-7 relative ${
                    m.completed
                      ? 'border-zinc-200/90 shadow-2xs'
                      : 'border-zinc-200/90 shadow-2xs hover:shadow-md hover:border-zinc-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60 uppercase">
                          WEEK {m.weekNumber}
                        </span>
                        <span className="text-zinc-300">·</span>
                        <span className="text-zinc-500 font-medium">{m.focusArea}</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-950">{m.title}</h3>
                      <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">{m.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        setReflectionModalMilestone({
                          roadmapId: currentRoadmap.id,
                          milestone: m
                        });
                        setReflectionText(m.userReflection || '');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-xl transition-colors shrink-0 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                      <span>{m.userReflection ? 'Edit Reflection' : 'Add Reflection'}</span>
                    </button>
                  </div>

                  {/* Tasks List */}
                  <div className="mt-5 pt-5 border-t border-zinc-100 space-y-2">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Tasks & Practice Activities
                    </div>
                    {m.tasks.map((task) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50/80 transition-colors cursor-pointer border border-transparent hover:border-zinc-200/60"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() =>
                            store.toggleRoadmapTask(currentRoadmap.id, m.id, task.id)
                          }
                          className="w-4 h-4 rounded-md text-zinc-950 focus:ring-rose-500/20 cursor-pointer accent-zinc-950"
                        />
                        <span
                          className={`text-xs ${
                            task.completed
                              ? 'line-through text-zinc-400 font-normal'
                              : 'text-zinc-800 font-medium'
                          }`}
                        >
                          {task.title}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* User Reflection Note if Present */}
                  {m.userReflection && (
                    <div className="mt-4 p-4 bg-rose-50/40 border border-rose-200/60 rounded-xl text-xs space-y-1">
                      <div className="font-semibold text-rose-950 text-[11px]">
                        Saved Milestone Reflection:
                      </div>
                      <p className="text-zinc-700 italic">"{m.userReflection}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-3">
            <Compass className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold text-zinc-950">No Roadmaps Yet</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Transform an interest into a practical 4-week testing sprint or create a custom plan.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-xs transition-colors"
            >
              Create First Roadmap
            </button>
          </div>
        )}

        {/* Reflection Modal */}
        {reflectionModalMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200/90 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
                <div className="text-xs">
                  <span className="font-semibold text-rose-700 uppercase tracking-wider text-[11px]">
                    Milestone {reflectionModalMilestone.milestone.weekNumber} Reflection
                  </span>
                  <h3 className="text-sm font-bold text-zinc-950 mt-0.5 font-display">
                    {reflectionModalMilestone.milestone.title}
                  </h3>
                </div>
                <button
                  onClick={() => setReflectionModalMilestone(null)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReflection} className="p-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 font-medium">
                  {reflectionModalMilestone.milestone.reflectionQuestion}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Your Honest Notes:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Did you feel in flow, or did it feel like a chore? What surprised you?"
                    className="w-full text-xs p-3.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1.5">
                    This note will be automatically saved to your AI Personalization Memory so future recommendations adapt to what you truly enjoy.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReflectionModalMilestone(null)}
                    className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-xs transition-colors"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Roadmap Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200/90 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 font-display">Build a New Growth Roadmap</h3>
                  <p className="text-xs text-zinc-500">Create a 4-week testing sprint</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRoadmapSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Roadmap Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sports Analytics Foundation, Indie Narrative Game Loop"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Primary 4-Week Goal
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build a 1-page match tactical breakdown and share with a mentor"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Target Interest
                  </label>
                  <select
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                  >
                    {store.interests.map((it) => (
                      <option key={it.id} value={it.name}>
                        {it.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-xs transition-colors"
                  >
                    Generate Roadmap
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
