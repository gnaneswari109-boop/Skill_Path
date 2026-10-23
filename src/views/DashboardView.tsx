import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Users,
  Target,
  Clock,
  ThumbsDown,
  Bookmark,
  Plus
} from 'lucide-react';
import { store } from '../services/store';
import { Recommendation } from '../types';

interface DashboardViewProps {
  onStartDiscovery: () => void;
  onOpenRoadmaps: () => void;
  onOpenChallenges: () => void;
  onOpenMentors: () => void;
  onOpenCommunities: () => void;
  onOpenAIGuide: () => void;
  onRejectRecommendation: (rec: Recommendation) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartDiscovery,
  onOpenRoadmaps,
  onOpenChallenges,
  onOpenMentors,
  onOpenCommunities,
  onOpenAIGuide,
  onRejectRecommendation
}) => {
  const user = store.currentUser;
  const report = store.discoveryReport;
  const activeRoadmaps = store.roadmaps.filter((r) => r.userId === user.id && r.status === 'active');
  const activeRecs = store.recommendations.filter((r) => r.status === 'active');
  const savedRecs = store.recommendations.filter((r) => r.status === 'saved');
  const pendingConnections = store.connectionRequests.filter(
    (c) => c.recipientId === user.id && c.status === 'pending'
  );
  const completedChallenges = store.challengeAttempts.filter((c) => c.userId === user.id);

  // Recommended Next Action (prominent element)
  const currentRoadmap = activeRoadmaps[0];
  const nextMilestone = currentRoadmap
    ? currentRoadmap.milestones.find((m) => !m.completed) || currentRoadmap.milestones[0]
    : null;
  const nextTask = nextMilestone ? nextMilestone.tasks.find((t) => !t.completed) : null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span>Member Workspace</span>
              <span className="text-slate-300">·</span>
              <span className="capitalize">{user.lifeStage.replace('_', ' ')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {report?.clarityCheckpoint === 'direction' && 'You have an active learning direction. Focus on completing your next milestone.'}
              {report?.clarityCheckpoint === 'possibilities' && 'You are comparing viable possibilities. Try a 30-minute challenge to validate.'}
              {(!report || report.clarityCheckpoint === 'unsure') && 'Exploring interests with low-stakes starter experiments.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAIGuide}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask Skill Path Guide</span>
            </button>
            <button
              onClick={onStartDiscovery}
              className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Retake Discovery
            </button>
          </div>
        </div>

        {/* PROMINENT RECOMMENDED NEXT ACTION (Mandatory per section 14) */}
        <div className="rounded-2xl border-2 border-slate-900 bg-slate-900 text-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <Target className="w-3.5 h-3.5" />
                <span>Your Recommended Next Action</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {nextTask ? nextTask.title : 'Take Your 45-Minute Match Momentum Challenge'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentRoadmap && nextMilestone
                  ? `Active Roadmap: ${currentRoadmap.title} · Week ${nextMilestone.weekNumber}: ${nextMilestone.title}. Completing this test validates whether your curiosity holds up in practice.`
                  : 'Start with a zero-stakes hands-on challenge to see whether the actual activity feels engaging or tedious.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={currentRoadmap ? onOpenRoadmaps : onOpenChallenges}
                className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
              >
                <span>{currentRoadmap ? 'Open Current Milestone' : 'Start Challenge'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Real Progress Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Active Roadmaps</span>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {activeRoadmaps.length}
            </div>
            <span className="text-[11px] text-slate-400">1 in progress</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Challenges Completed</span>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {completedChallenges.length}
            </div>
            <span className="text-[11px] text-slate-400">Validated with reflection</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Stored Memories</span>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {store.userMemories.filter((m) => m.userId === user.id).length}
            </div>
            <span className="text-[11px] text-slate-400">Context source of truth</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Pending Connections</span>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {pendingConnections.length}
            </div>
            <span className="text-[11px] text-slate-400">Peer & mentor requests</span>
          </div>
        </div>

        {/* 2-Column Section: Active Roadmaps & Recommendations */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Active Roadmaps & Milestones (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Active Growth Roadmaps</h3>
              <button
                onClick={onOpenRoadmaps}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>View Full Path</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {activeRoadmaps.length === 0 ? (
              <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-3">
                <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-800">No active roadmap yet</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Build a 4-week learning roadmap from an interest recommendation to begin structured experiments.
                </p>
                <button
                  onClick={onOpenRoadmaps}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Create Roadmap
                </button>
              </div>
            ) : (
              activeRoadmaps.map((road) => (
                <div
                  key={road.id}
                  className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">{road.category}</div>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{road.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{road.goal}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {road.status}
                    </span>
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-3 pt-2">
                    {road.milestones.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-lg border text-xs transition-colors ${
                          m.completed
                            ? 'bg-emerald-50/30 border-emerald-200/70'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-slate-900">
                            Week {m.weekNumber}: {m.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {m.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mb-2">{m.description}</p>
                        <div className="space-y-1">
                          {m.tasks.map((task) => (
                            <label
                              key={task.id}
                              className="flex items-center gap-2 cursor-pointer hover:text-slate-900"
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => store.toggleRoadmapTask(road.id, m.id, task.id)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                              />
                              <span
                                className={`text-[11px] ${
                                  task.completed ? 'line-through text-slate-400' : 'text-slate-700'
                                }`}
                              >
                                {task.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Personalized Recommendations & Rejection Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Personalized Recommendations</h3>
              <span className="text-xs text-slate-500 font-mono">
                {activeRecs.length} available
              </span>
            </div>

            <div className="space-y-4">
              {activeRecs.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="capitalize font-medium">{rec.category}</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      Confidence {rec.confidenceScore}%
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rec.description}</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-md text-xs text-slate-700 border border-slate-100 space-y-1">
                    <div className="font-semibold text-slate-800 text-[11px]">
                      Starter Experiment ({rec.timeCommitment}):
                    </div>
                    <div className="text-[11px] text-slate-600">{rec.beginnerExperiment}</div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      onClick={() => onRejectRecommendation(rec)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-600 font-medium transition-colors"
                      title="Reject this idea to calibrate and get an alternative"
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>Not for me</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => store.saveRecommendation(rec.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                        title="Save for later"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          store.createRoadmap(
                            rec.title,
                            rec.description,
                            rec.title,
                            rec.category,
                            rec.whyItFits
                          );
                          onOpenRoadmaps();
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add to Path</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
