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
  X
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Action Plan Builder
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Career & Personal Growth Roadmaps
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              4-week structured learning roadmaps designed around testing enjoyment and producing tangible mini-artifacts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Roadmap</span>
            </button>
            <button
              onClick={onOpenAIGuide}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
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
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeRoadmapId === r.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
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
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Interest Track: {currentRoadmap.interestName} · {currentRoadmap.category}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {currentRoadmap.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    Goal: {currentRoadmap.goal}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-900 font-mono">
                      {currentRoadmap.milestones.filter((m) => m.completed).length} /{' '}
                      {currentRoadmap.milestones.length} Milestones
                    </div>
                    <div className="text-[11px] text-slate-400">Flexible pacing</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Why this path: </span>
                {currentRoadmap.rationale}
              </div>
            </div>

            {/* Milestones Accordion / Sequence */}
            <div className="space-y-4">
              {currentRoadmap.milestones.map((m) => (
                <div
                  key={m.id}
                  className={`bg-white rounded-xl border transition-all p-6 ${
                    m.completed
                      ? 'border-emerald-200/90 shadow-2xs'
                      : 'border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-emerald-800 font-mono">
                          WEEK {m.weekNumber}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 font-medium">{m.focusArea}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        setReflectionModalMilestone({
                          roadmapId: currentRoadmap.id,
                          milestone: m
                        });
                        setReflectionText(m.userReflection || '');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{m.userReflection ? 'Edit Reflection' : 'Add Reflection'}</span>
                    </button>
                  </div>

                  {/* Tasks List */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Tasks & Practice Activities
                    </div>
                    {m.tasks.map((task) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() =>
                            store.toggleRoadmapTask(currentRoadmap.id, m.id, task.id)
                          }
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span
                          className={`text-xs ${
                            task.completed
                              ? 'line-through text-slate-400 font-normal'
                              : 'text-slate-800 font-medium'
                          }`}
                        >
                          {task.title}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* User Reflection Note if Present */}
                  {m.userReflection && (
                    <div className="mt-3 p-3 bg-emerald-50/40 border border-emerald-200/60 rounded-lg text-xs space-y-1">
                      <div className="font-semibold text-emerald-950 text-[11px]">
                        Saved Reflection:
                      </div>
                      <p className="text-slate-700 italic">"{m.userReflection}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3">
            <Compass className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Roadmaps Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Transform an interest into a practical 4-week testing sprint or create a custom plan.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
            >
              Create First Roadmap
            </button>
          </div>
        )}

        {/* Reflection Modal */}
        {reflectionModalMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="text-xs">
                  <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                    Milestone {reflectionModalMilestone.milestone.weekNumber} Reflection
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {reflectionModalMilestone.milestone.title}
                  </h3>
                </div>
                <button
                  onClick={() => setReflectionModalMilestone(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReflection} className="p-6 space-y-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                  {reflectionModalMilestone.milestone.reflectionQuestion}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Honest Notes:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Did you feel in flow, or did it feel like a chore? What surprised you?"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    This note will be automatically saved to your AI Personalization Memory so future recommendations adapt to what you truly enjoy.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReflectionModalMilestone(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Build a New Growth Roadmap</h3>
                  <p className="text-xs text-slate-500">Create a 4-week testing sprint</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRoadmapSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Roadmap Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sports Analytics Foundation, Indie Narrative Game Loop"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary 4-Week Goal
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build a 1-page match tactical breakdown and share with a mentor"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Interest
                  </label>
                  <select
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
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
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
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
