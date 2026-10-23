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

  // Recommended Next Action
  const currentRoadmap = activeRoadmaps[0];
  const nextMilestone = currentRoadmap
    ? currentRoadmap.milestones.find((m) => !m.completed) || currentRoadmap.milestones[0]
    : null;
  const nextTask = nextMilestone ? nextMilestone.tasks.find((t) => !t.completed) : null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-[#292D32]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B00]">
              <span>MEMBER WORKSPACE</span>
              <span className="text-zinc-300 dark:text-zinc-600">·</span>
              <span className="text-zinc-500 dark:text-[#858D98] font-sans capitalize">{user.lifeStage.replace('_', ' ')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-[#858D98]">
              {report?.clarityCheckpoint === 'direction' && 'You have an active learning direction. Focus on completing your next milestone.'}
              {report?.clarityCheckpoint === 'possibilities' && 'You are comparing viable possibilities. Try a 30-minute challenge to validate.'}
              {(!report || report.clarityCheckpoint === 'unsure') && 'Exploring interests with low-stakes starter experiments.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAIGuide}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] rounded-xl hover:border-[#FF6B00]/40 hover:bg-zinc-50 dark:hover:bg-[#1B1F23] shadow-2xs transition-all cursor-pointer group"
            >
              <Compass className="w-3.5 h-3.5 text-[#FF6B00] group-hover:rotate-45 transition-transform duration-300" />
              <span>Skill Path Guide</span>
            </button>
            <button
              onClick={onStartDiscovery}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-[#1B1F23] hover:bg-zinc-200/80 dark:hover:bg-[#292D32] rounded-xl transition-all cursor-pointer"
            >
              Retake Discovery
            </button>
          </div>
        </div>

        {/* PROMINENT RECOMMENDED NEXT ACTION - Obsidian Dark Hero Card with Orange Accent */}
        <div className="relative rounded-2xl bg-[#111315] dark:bg-[#15181B] text-white p-7 sm:p-9 shadow-lg overflow-hidden border border-zinc-800 dark:border-[#292D32]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/12 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF8126]">
                <Target className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>RECOMMENDED NEXT ACTION</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {nextTask ? nextTask.title : 'Take Your 45-Minute Match Momentum Challenge'}
              </h2>
              <p className="text-xs text-zinc-300 dark:text-[#B8BEC7] leading-relaxed">
                {currentRoadmap && nextMilestone
                  ? `Active Roadmap: ${currentRoadmap.title} · Week ${nextMilestone.weekNumber}: ${nextMilestone.title}. Completing this test validates whether your curiosity holds up in practice.`
                  : 'Start with a zero-stakes hands-on challenge to see whether the actual activity feels engaging or tedious.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={currentRoadmap ? onOpenRoadmaps : onOpenChallenges}
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold text-zinc-950 bg-white hover:bg-zinc-100 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{currentRoadmap ? 'Open Current Milestone' : 'Start Challenge'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00]" />
              </button>
            </div>
          </div>
        </div>

        {/* Real Progress Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/80 dark:border-[#292D32] shadow-2xs space-y-1.5 transition-colors">
            <span className="text-xs text-zinc-500 dark:text-[#858D98] font-medium">Active Roadmaps</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-950 dark:text-white tabular-nums tracking-tight">
              {activeRoadmaps.length}
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">1 in progress</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/80 dark:border-[#292D32] shadow-2xs space-y-1.5 transition-colors">
            <span className="text-xs text-zinc-500 dark:text-[#858D98] font-medium">Challenges Completed</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-950 dark:text-white tabular-nums tracking-tight">
              {completedChallenges.length}
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Validated with reflection</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/80 dark:border-[#292D32] shadow-2xs space-y-1.5 transition-colors">
            <span className="text-xs text-zinc-500 dark:text-[#858D98] font-medium">Stored Memories</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-950 dark:text-white tabular-nums tracking-tight">
              {store.userMemories.filter((m) => m.userId === user.id).length}
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Context source of truth</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/80 dark:border-[#292D32] shadow-2xs space-y-1.5 transition-colors">
            <span className="text-xs text-zinc-500 dark:text-[#858D98] font-medium">Pending Connections</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-950 dark:text-white tabular-nums tracking-tight">
              {pendingConnections.length}
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Peer & mentor requests</span>
          </div>
        </div>

        {/* 2-Column Section: Active Roadmaps & Recommendations */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Active Roadmaps & Milestones (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">Active Growth Roadmaps</h3>
              <button
                onClick={onOpenRoadmaps}
                className="text-xs font-semibold text-[#FF6B00] hover:text-[#FF8126] flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Path</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {activeRoadmaps.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/80 dark:border-[#292D32] text-center space-y-3 shadow-2xs">
                <Layers className="w-8 h-8 text-zinc-400 mx-auto" />
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">No active roadmap yet</div>
                <p className="text-xs text-zinc-500 dark:text-[#858D98] max-w-sm mx-auto">
                  Build a 4-week learning roadmap from an interest recommendation to begin structured experiments.
                </p>
                <button
                  onClick={onOpenRoadmaps}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl cursor-pointer transition-colors"
                >
                  Create Roadmap
                </button>
              </div>
            ) : (
              activeRoadmaps.map((road) => (
                <div
                  key={road.id}
                  className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs space-y-5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-[#FF6B00] font-mono font-bold uppercase">{road.category}</div>
                      <h4 className="text-base font-bold text-zinc-950 dark:text-white mt-0.5">{road.title}</h4>
                      <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] mt-1 leading-relaxed">{road.goal}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-[#1B1F23] px-2.5 py-1 rounded-md border border-zinc-200 dark:border-[#292D32]">
                      {road.status}
                    </span>
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-3 pt-2">
                    {road.milestones.map((m) => (
                      <div
                        key={m.id}
                        className={`p-4 rounded-xl border text-xs transition-colors ${
                          m.completed
                            ? 'bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border-[#FF6B00]/30'
                            : 'bg-zinc-50/80 dark:bg-[#101214] border-zinc-200/80 dark:border-[#292D32]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-zinc-900 dark:text-white">
                            Week {m.weekNumber}: {m.title}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 dark:text-[#858D98] font-medium">
                            {m.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <p className="text-zinc-600 dark:text-[#B8BEC7] text-[11px] mb-2.5 leading-relaxed">{m.description}</p>
                        <div className="space-y-1.5">
                          {m.tasks.map((task) => (
                            <label
                              key={task.id}
                              className="flex items-center gap-2.5 cursor-pointer hover:text-zinc-950 dark:hover:text-white group"
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => store.toggleRoadmapTask(road.id, m.id, task.id)}
                                className="rounded text-[#FF6B00] focus:ring-[#FF6B00] w-3.5 h-3.5 cursor-pointer accent-[#FF6B00]"
                              />
                              <span
                                className={`text-[11px] ${
                                  task.completed ? 'line-through text-zinc-400 dark:text-zinc-600' : 'text-zinc-700 dark:text-[#B8BEC7] group-hover:text-zinc-950 dark:group-hover:text-white'
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
              <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">Personalized Recommendations</h3>
              <span className="text-xs text-zinc-400 dark:text-[#858D98] font-mono">
                {activeRecs.length} available
              </span>
            </div>

            <div className="space-y-4">
              {activeRecs.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs space-y-3 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-[#858D98]">
                    <span className="capitalize font-mono font-medium text-zinc-600 dark:text-zinc-400">{rec.category}</span>
                    <span className="font-mono text-[#FF6B00] font-bold text-[11px]">
                      Confidence {rec.confidenceScore}%
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{rec.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] mt-1 leading-relaxed">{rec.description}</p>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-[#101214] rounded-xl text-xs text-zinc-700 dark:text-[#B8BEC7] border border-zinc-200/70 dark:border-[#292D32] space-y-1">
                    <div className="font-bold text-zinc-900 dark:text-white text-[11px]">
                      Starter Trial ({rec.timeCommitment}):
                    </div>
                    <div className="text-[11px] text-zinc-600 dark:text-[#858D98] leading-relaxed">{rec.beginnerExperiment}</div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-[#292D32]">
                    <button
                      onClick={() => onRejectRecommendation(rec)}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-500 font-medium transition-colors cursor-pointer"
                      title="Reject this idea to calibrate and get an alternative"
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>Not for me</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => store.saveRecommendation(rec.id)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] rounded-lg transition-colors cursor-pointer"
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
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl transition-colors cursor-pointer"
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
