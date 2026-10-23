import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  Map,
  Compass,
  ArrowRight,
  Brain,
  Calendar,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { store } from '../services/store';

interface ProgressViewProps {
  onOpenRoadmaps: () => void;
  onOpenChallenges: () => void;
  onOpenMemoryModal: () => void;
  onStartDiscovery: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  onOpenRoadmaps,
  onOpenChallenges,
  onOpenMemoryModal,
  onStartDiscovery
}) => {
  const user = store.currentUser;
  const roadmaps = store.roadmaps.filter((r) => r.userId === user.id);
  const challengeAttempts = store.challengeAttempts.filter((c) => c.userId === user.id);
  const memories = store.userMemories.filter((m) => m.userId === user.id);
  const report = store.discoveryReport;

  // Calculate statistics
  const totalMilestones = roadmaps.reduce((acc, r) => acc + r.milestones.length, 0);
  const completedMilestones = roadmaps.reduce(
    (acc, r) => acc + r.milestones.filter((m) => m.completed).length,
    0
  );

  const totalTasks = roadmaps.reduce(
    (acc, r) => acc + r.milestones.reduce((mAcc, m) => mAcc + m.tasks.length, 0),
    0
  );
  const completedTasks = roadmaps.reduce(
    (acc, r) =>
      acc + r.milestones.reduce((mAcc, m) => mAcc + m.tasks.filter((t) => t.completed).length, 0),
    0
  );

  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0B0B0C] text-zinc-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Growth Progress & Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-zinc-900 dark:text-white">
            Your Personal Exploration Rhythm
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-[#858D98] max-w-2xl leading-relaxed">
            Real progress in Skill Path is measured by gained clarity, low-stakes experiments completed, and reflections recorded—not rigid career metrics.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-2 shadow-2xs card-hover-lift">
            <div className="flex items-center justify-between text-zinc-500 dark:text-[#858D98]">
              <span className="text-xs font-semibold">Active Roadmaps</span>
              <Map className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {roadmaps.length}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">
              {completedMilestones} of {totalMilestones} milestones finished
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-2 shadow-2xs card-hover-lift">
            <div className="flex items-center justify-between text-zinc-500 dark:text-[#858D98]">
              <span className="text-xs font-semibold">Challenges Tested</span>
              <Flame className="w-4 h-4 text-[#FF8126]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {challengeAttempts.length}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">
              30-min hands-on experiments
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-2 shadow-2xs card-hover-lift">
            <div className="flex items-center justify-between text-zinc-500 dark:text-[#858D98]">
              <span className="text-xs font-semibold">Weekly Rhythm</span>
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {user.availableHoursPerWeek} <span className="text-sm font-normal text-zinc-400">hrs/wk</span>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">
              Target exploration commitment
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-2 shadow-2xs card-hover-lift">
            <div className="flex items-center justify-between text-zinc-500 dark:text-[#858D98]">
              <span className="text-xs font-semibold">Memory Records</span>
              <Brain className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {memories.length}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">
              Personalized insights stored
            </div>
          </div>
        </div>

        {/* Active Roadmap Progress Bar Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white font-display">
                Current Roadmap Completion
              </h3>
              <p className="text-xs text-zinc-500 dark:text-[#858D98] mt-0.5">
                {roadmaps[0]?.title || 'No active roadmap selected'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-[#FF6B00]">
                {progressPercentage}%
              </span>
              <span className="text-xs text-zinc-400">({completedTasks}/{totalTasks} tasks)</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-[#101214] overflow-hidden p-0.5 border border-zinc-200/80 dark:border-[#292D32]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8126] transition-all duration-500"
              style={{ width: `${Math.max(progressPercentage, 5)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-zinc-500 dark:text-[#858D98]">
              {completedMilestones} milestones unlocked
            </span>
            <button
              onClick={onOpenRoadmaps}
              className="text-xs font-semibold text-[#FF6B00] hover:text-[#FF8126] flex items-center gap-1 cursor-pointer"
            >
              <span>View Roadmap Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Section: Challenges Reflection Log & Memory Insights */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Challenges History */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF6B00]" />
                <span>Micro-Challenge Reflection Log</span>
              </h3>
              <button
                onClick={onOpenChallenges}
                className="text-xs font-semibold text-[#FF6B00] hover:underline cursor-pointer"
              >
                Browse All
              </button>
            </div>

            {challengeAttempts.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 dark:text-[#858D98] space-y-2">
                <p>No challenges completed yet.</p>
                <button
                  onClick={onOpenChallenges}
                  className="px-4 py-2 rounded-xl bg-[#FF6B00] text-white font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Start First 30-Min Challenge
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {challengeAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-[#101214] border border-zinc-200/80 dark:border-[#292D32] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        Challenge ID: {att.challengeId}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {att.completedAt ? new Date(att.completedAt).toLocaleDateString() : 'In Progress'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-zinc-500 dark:text-[#858D98]">
                      <span>Enjoyment: <strong className="text-[#FF6B00]">{att.reflection.enjoyment}/5</strong></span>
                      <span>Difficulty: <strong className="text-zinc-700 dark:text-zinc-300">{att.reflection.difficulty}/5</strong></span>
                      <span>Retry: <strong className="text-[#FF6B00]">{att.reflection.retryWillingness}/5</strong></span>
                    </div>

                    <p className="text-zinc-600 dark:text-[#B8BEC7] italic text-[11px] border-l-2 border-[#FF6B00] pl-2">
                      "{att.reflection.learningTakeaway}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Memory Records */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#FF6B00]" />
                <span>Continuous Memory Transparency</span>
              </h3>
              <button
                onClick={onOpenMemoryModal}
                className="text-xs font-semibold text-[#FF6B00] hover:underline cursor-pointer"
              >
                Manage Records
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-[#858D98] leading-relaxed">
              These verified signals guide AI recommendations and prevent repetitive suggestions across your sessions.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#101214] border border-zinc-200/80 dark:border-[#292D32] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-white">{mem.label}</span>
                    <span className="text-[10px] uppercase font-bold text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 px-1.5 py-0.2 rounded-md">
                      {mem.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-[#B8BEC7] line-clamp-2">
                    {mem.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
