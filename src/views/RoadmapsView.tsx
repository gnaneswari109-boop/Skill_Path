import React, { useState, useEffect } from 'react';
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
  Target,
  Clock,
  BookOpen,
  Award,
  Video,
  ExternalLink,
  HelpCircle,
  Code2,
  Check,
  RotateCcw,
  AlertCircle,
  Flame,
  ChevronRight,
  CheckCircle,
  FileText,
  User,
  Globe
} from 'lucide-react';
import { store } from '../services/store';
import { Roadmap, RoadmapMilestone } from '../types';
import {
  DAILY_ROADMAP_TRACKS,
  DailyLearningDay,
  MemberRoadmapTrack
} from '../data/dailyLearningData';
import { THREE_MEMBER_PROFILES } from '../data/memberProfiles';

interface RoadmapsViewProps {
  onOpenAIGuide: () => void;
  onExploreMore: () => void;
}

interface MemberDailyProgress {
  memberId: string;
  completedDays: number[]; // e.g. [1]
  watchedVideos: number[]; // day numbers
  completedQuizzes: Record<number, { score: number; total: number; selectedAnswers: Record<string, number> }>;
  completedAssignments: number[];
  dayReflections: Record<number, string>;
  lastActiveDay: number;
  totalXp: number;
  streakDays: number;
  missedDayNoticeDismissed?: boolean;
}

export const RoadmapsView: React.FC<RoadmapsViewProps> = ({ onOpenAIGuide, onExploreMore }) => {
  // Current user from store
  const user = store.currentUser;

  // Active view tab: 'daily' (AI-Powered Daily Video Roadmap) vs 'sprints' (4-Week Milestones)
  const [activeTabMode, setActiveTabMode] = useState<'daily' | 'sprints'>('daily');

  // Track selection: fallback to Ananya if user id not found in tracks
  const [selectedMemberId, setSelectedMemberId] = useState<string>(() => {
    if (DAILY_ROADMAP_TRACKS[user.id]) return user.id;
    return 'user_member_ananya';
  });

  // Keep member in sync if store user changes
  useEffect(() => {
    if (DAILY_ROADMAP_TRACKS[user.id]) {
      setSelectedMemberId(user.id);
    }
  }, [user.id]);

  // Selected Day number for daily view
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  // Preferred language
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  // Member Daily Progress State (Persisted per member in localStorage)
  const [memberProgress, setMemberProgress] = useState<Record<string, MemberDailyProgress>>(() => {
    const initial: Record<string, MemberDailyProgress> = {};
    const memberIds = ['user_member_ananya', 'user_member_rahul', 'user_member_priya'];

    memberIds.forEach((mId) => {
      try {
        const saved = localStorage.getItem(`skillpath_daily_progress_${mId}`);
        if (saved) {
          initial[mId] = JSON.parse(saved);
          return;
        }
      } catch {
        // fallback
      }
      // Demo defaults: Ananya has day 1 completed, Rahul has day 1 completed, Priya has day 1 in progress
      initial[mId] = {
        memberId: mId,
        completedDays: mId === 'user_member_ananya' ? [1] : [],
        watchedVideos: mId === 'user_member_ananya' ? [1] : [1],
        completedQuizzes: mId === 'user_member_ananya' ? { 1: { score: 3, total: 3, selectedAnswers: { an_q1_1: 1, an_q2_1: 1, an_q3_1: 1 } } } : {},
        completedAssignments: mId === 'user_member_ananya' ? [1] : [],
        dayReflections: mId === 'user_member_ananya' ? { 1: 'NumPy vectorization transformed how I write loss gradients!' } : {},
        lastActiveDay: 1,
        totalXp: mId === 'user_member_ananya' ? 150 : 50,
        streakDays: mId === 'user_member_ananya' ? 4 : 2
      };
    });

    return initial;
  });

  const currentProgress = memberProgress[selectedMemberId] || {
    memberId: selectedMemberId,
    completedDays: [],
    watchedVideos: [],
    completedQuizzes: {},
    completedAssignments: [],
    dayReflections: {},
    lastActiveDay: 1,
    totalXp: 50,
    streakDays: 1
  };

  // Save progress helper
  const updateCurrentProgress = (updater: (prev: MemberDailyProgress) => MemberDailyProgress) => {
    setMemberProgress((prev) => {
      const current = prev[selectedMemberId] || {
        memberId: selectedMemberId,
        completedDays: [],
        watchedVideos: [],
        completedQuizzes: {},
        completedAssignments: [],
        dayReflections: {},
        lastActiveDay: 1,
        totalXp: 50,
        streakDays: 1
      };
      const updated = updater(current);
      try {
        localStorage.setItem(`skillpath_daily_progress_${selectedMemberId}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { ...prev, [selectedMemberId]: updated };
    });
  };

  // Active track data
  const currentTrack: MemberRoadmapTrack =
    DAILY_ROADMAP_TRACKS[selectedMemberId] || DAILY_ROADMAP_TRACKS['user_member_ananya'];

  const activeDayData: DailyLearningDay =
    currentTrack.days.find((d) => d.dayNumber === selectedDayNumber) || currentTrack.days[0];

  // Active interactive states for the current day
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [userCodeSubmission, setUserCodeSubmission] = useState<string>('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState<boolean>(false);
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [todayCompletedNotice, setTodayCompletedNotice] = useState<boolean>(false);

  // Sync day interactive states when day changes or member changes
  useEffect(() => {
    const savedQuiz = currentProgress.completedQuizzes[selectedDayNumber];
    if (savedQuiz) {
      setSelectedQuizAnswers(savedQuiz.selectedAnswers || {});
      setQuizSubmitted(true);
    } else {
      setSelectedQuizAnswers({});
      setQuizSubmitted(false);
    }

    setAssignmentSubmitted(currentProgress.completedAssignments.includes(selectedDayNumber));
    setUserCodeSubmission(activeDayData.assignment.starterCode || '');
    setReflectionInput(currentProgress.dayReflections[selectedDayNumber] || '');
  }, [selectedDayNumber, selectedMemberId]);

  // Video watch toggle
  const isVideoWatched = currentProgress.watchedVideos.includes(selectedDayNumber);
  const handleToggleVideoWatched = () => {
    updateCurrentProgress((prev) => {
      const watched = prev.watchedVideos.includes(selectedDayNumber)
        ? prev.watchedVideos.filter((d) => d !== selectedDayNumber)
        : [...prev.watchedVideos, selectedDayNumber];
      return { ...prev, watchedVideos: watched };
    });
  };

  // Submit Quiz
  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleGradeQuiz = () => {
    let score = 0;
    activeDayData.quiz.forEach((q) => {
      if (selectedQuizAnswers[q.id] === q.correctOptionIndex) {
        score++;
      }
    });

    setQuizSubmitted(true);
    updateCurrentProgress((prev) => ({
      ...prev,
      completedQuizzes: {
        ...prev.completedQuizzes,
        [selectedDayNumber]: {
          score,
          total: activeDayData.quiz.length,
          selectedAnswers: selectedQuizAnswers
        }
      }
    }));
  };

  // Submit Practical Assignment
  const handleVerifyAssignment = () => {
    setAssignmentSubmitted(true);
    updateCurrentProgress((prev) => {
      const assignments = prev.completedAssignments.includes(selectedDayNumber)
        ? prev.completedAssignments
        : [...prev.completedAssignments, selectedDayNumber];
      return { ...prev, completedAssignments: assignments };
    });
  };

  // Save Reflection
  const handleSaveReflection = () => {
    if (!reflectionInput.trim()) return;
    updateCurrentProgress((prev) => ({
      ...prev,
      dayReflections: {
        ...prev.dayReflections,
        [selectedDayNumber]: reflectionInput
      }
    }));
  };

  // Complete Today's Learning Action
  const isDayEligibleForCompletion =
    isVideoWatched &&
    quizSubmitted &&
    assignmentSubmitted;

  const isDayFullyCompleted = currentProgress.completedDays.includes(selectedDayNumber);

  const handleCompleteToday = () => {
    if (!isDayEligibleForCompletion) return;
    updateCurrentProgress((prev) => {
      const completed = prev.completedDays.includes(selectedDayNumber)
        ? prev.completedDays
        : [...prev.completedDays, selectedDayNumber];
      return {
        ...prev,
        completedDays: completed,
        totalXp: prev.totalXp + 50,
        streakDays: prev.streakDays + 1
      };
    });
    setTodayCompletedNotice(true);
    setTimeout(() => setTodayCompletedNotice(false), 3500);
  };

  // Continue where you left off logic
  const handleContinueWhereLeftOff = () => {
    // Find earliest uncompleted day in current track
    const nextUncompletedDay = currentTrack.days.find(
      (d) => !currentProgress.completedDays.includes(d.dayNumber)
    );
    if (nextUncompletedDay) {
      setSelectedDayNumber(nextUncompletedDay.dayNumber);
    }
  };

  // 4-Week Milestone Roadmaps (Existing store functionality)
  const roadmaps = store.roadmaps.filter((r) => r.userId === user.id);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(
    roadmaps.length > 0 ? roadmaps[0].id : ''
  );
  const [reflectionModalMilestone, setReflectionModalMilestone] = useState<{
    roadmapId: string;
    milestone: RoadmapMilestone;
  } | null>(null);
  const [milestoneReflectionText, setMilestoneReflectionText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newInterest, setNewInterest] = useState('AI & Machine Learning Engineering');

  const currentRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0];

  const handleSaveMilestoneReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionModalMilestone) return;

    store.saveMilestoneReflection(
      reflectionModalMilestone.roadmapId,
      reflectionModalMilestone.milestone.id,
      milestoneReflectionText
    );
    setReflectionModalMilestone(null);
    setMilestoneReflectionText('');
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

  const activeMemberInfo = THREE_MEMBER_PROFILES.find((m) => m.id === selectedMemberId) || THREE_MEMBER_PROFILES[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-[#292D32]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>AI-Powered Learning Roadmaps</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-display">
              Daily Video Roadmap & Action Plans
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#858D98] max-w-3xl leading-relaxed">
              Structured 45-minute daily video sessions tailored to each member's target discipline. Complete verified lessons, test comprehension with interactive quizzes, and build practical assignments in one place.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleContinueWhereLeftOff}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-[#FF6B00] hover:bg-[#FF8126] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continue Where You Left Off</span>
            </button>
            <button
              onClick={onOpenAIGuide}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-800 dark:text-white bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] hover:border-[#FF6B00]/40 rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>AI Roadmap Advisor</span>
            </button>
          </div>
        </div>

        {/* Member Persona Switcher (Equal Members) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={activeMemberInfo.avatar}
              alt={activeMemberInfo.name}
              className="w-11 h-11 rounded-xl object-cover border-2 border-[#FF6B00]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-950 dark:text-white">
                  {activeMemberInfo.name}
                </span>
                <span className="text-[11px] font-semibold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded-full">
                  {activeMemberInfo.roleLabel}
                </span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-[#858D98] mt-0.5">
                Current Track: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{currentTrack.trackName}</span>
              </div>
            </div>
          </div>

          {/* Member selector tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-zinc-400 font-medium shrink-0">Switch Member Track:</span>
            {THREE_MEMBER_PROFILES.map((member) => (
              <button
                key={member.id}
                onClick={() => {
                  setSelectedMemberId(member.id);
                  setSelectedDayNumber(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedMemberId === member.id
                    ? 'bg-[#FF6B00] text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-[#1F2428] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#292D32]'
                }`}
              >
                {member.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Switcher: Daily Learning Plan vs 4-Week Milestone Roadmaps */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-[#292D32] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTabMode('daily')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTabMode === 'daily'
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Video className="w-4 h-4 text-[#FF6B00]" />
              <span>45-Min Daily Video Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTabMode('sprints')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTabMode === 'sprints'
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-[#FF6B00]" />
              <span>4-Week Milestone Roadmaps ({roadmaps.length})</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
              <Flame className="w-4 h-4 fill-current" />
              <span>{currentProgress.streakDays} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <Award className="w-4 h-4" />
              <span>{currentProgress.totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* TAB 1: DAILY LEARNING PLAN */}
        {activeTabMode === 'daily' && (
          <div className="space-y-6 animate-fade-in">
            {/* Missed-Day Flexibility Reassurance Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-amber-900 dark:text-amber-200">
                    Flexible Missed-Day Management Active
                  </div>
                  <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                    Missed a day? No worries. Unfinished tasks carry forward automatically to your next session without XP penalties or progress resets. Learn at your natural pace.
                  </p>
                </div>
              </div>
              <button
                onClick={handleContinueWhereLeftOff}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors shrink-0 cursor-pointer"
              >
                Jump to Active Day
              </button>
            </div>

            {/* Daily Roadmap Timeline Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {currentTrack.days.map((day) => {
                const isSelected = day.dayNumber === selectedDayNumber;
                const isCompleted = currentProgress.completedDays.includes(day.dayNumber);

                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDayNumber(day.dayNumber)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#15181B] border-[#FF6B00] shadow-sm ring-2 ring-[#FF6B00]/20'
                        : isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-white dark:bg-[#111315] border-zinc-200 dark:border-[#292D32] text-zinc-700 dark:text-zinc-300 hover:border-[#FF6B00]/40'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isSelected
                          ? 'bg-[#FF6B00] text-white'
                          : 'bg-zinc-200 dark:bg-[#292D32] text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {isCompleted ? '✓' : day.dayNumber}
                    </span>
                    <div className="text-left">
                      <div className="font-bold text-zinc-900 dark:text-white">Day {day.dayNumber}</div>
                      <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">{day.topic}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Notification when Day Completed */}
            {todayCompletedNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Day {selectedDayNumber} Learning Complete! +50 XP Earned</span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  Streak: {currentProgress.streakDays} Days
                </span>
              </div>
            )}

            {/* 45-Minute Daily Schedule Breakdown Header */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-[#292D32]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B00] uppercase tracking-wider">
                    <span>Day {activeDayData.dayNumber} Learning Plan</span>
                    <span>•</span>
                    <span>{activeDayData.topic}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white mt-1 font-display">
                    {activeDayData.title}
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-[#858D98] mt-1 max-w-3xl leading-relaxed">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200">Objective: </span>
                    {activeDayData.learningObjective}
                  </p>
                </div>

                {/* Preferred Language & Pacing badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-[#1F2428] border border-zinc-200 dark:border-[#292D32] text-xs">
                    <Globe className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-hidden cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>45-Min Planned</span>
                  </div>
                </div>
              </div>

              {/* 5-Phase Schedule Pills (15m + 5m + 5m + 15m + 5m = 45m) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className={`p-2.5 rounded-xl border text-center transition-all ${
                  isVideoWatched
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'bg-zinc-50 dark:bg-[#111315] border-zinc-200 dark:border-[#292D32] text-zinc-700 dark:text-zinc-300'
                }`}>
                  <div className="font-bold">1. Video Lesson</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">15 mins {isVideoWatched && '✓'}</div>
                </div>

                <div className="p-2.5 rounded-xl border bg-zinc-50 dark:bg-[#111315] border-zinc-200 dark:border-[#292D32] text-zinc-700 dark:text-zinc-300 text-center">
                  <div className="font-bold">2. Key Notes</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">5 mins</div>
                </div>

                <div className={`p-2.5 rounded-xl border text-center transition-all ${
                  quizSubmitted
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'bg-zinc-50 dark:bg-[#111315] border-zinc-200 dark:border-[#292D32] text-zinc-700 dark:text-zinc-300'
                }`}>
                  <div className="font-bold">3. Short Quiz</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">5 mins {quizSubmitted && '✓'}</div>
                </div>

                <div className={`p-2.5 rounded-xl border text-center transition-all ${
                  assignmentSubmitted
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'bg-zinc-50 dark:bg-[#111315] border-zinc-200 dark:border-[#292D32] text-zinc-700 dark:text-zinc-300'
                }`}>
                  <div className="font-bold">4. Practical Lab</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">15 mins {assignmentSubmitted && '✓'}</div>
                </div>

                <div className="p-2.5 rounded-xl border bg-zinc-50 dark:bg-[#111315] border-zinc-200 dark:border-[#292D32] text-zinc-700 dark:text-zinc-300 text-center">
                  <div className="font-bold">5. Review & Notes</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">5 mins</div>
                </div>
              </div>
            </div>

            {/* PART 1: EMBEDDED VERIFIED VIDEO LESSON (15 MINS) */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Step 1: Video Lesson — {activeDayData.video.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleVideoWatched}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isVideoWatched
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-zinc-100 dark:bg-[#1F2428] text-zinc-700 dark:text-zinc-300 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00]'
                    }`}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${isVideoWatched ? 'text-emerald-500' : ''}`} />
                    <span>{isVideoWatched ? 'Watched (Completed)' : 'Mark as Watched'}</span>
                  </button>

                  <a
                    href={activeDayData.video.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#292D32] hover:bg-zinc-50 dark:hover:bg-[#1F2428] transition-colors"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>
              </div>

              {/* YouTube Responsive Embed Container with fallback */}
              <div className="relative w-full rounded-2xl overflow-hidden aspect-video bg-zinc-950 shadow-md border border-zinc-800">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeDayData.video.id}?rel=0&modestbranding=1`}
                  title={activeDayData.video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 dark:text-[#858D98] pt-1">
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{activeDayData.video.channelName}</span>
                  <span> • Duration: {activeDayData.video.duration}</span>
                </div>
                <p className="text-[11px] text-zinc-400 italic">
                  Verified educational resource for {currentTrack.trackName}
                </p>
              </div>
            </div>

            {/* PART 2: STRUCTURED KEY NOTES & EXAMPLES (5 MINS) */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                <FileText className="w-4 h-4 text-[#FF6B00]" />
                <span>Step 2: Key Notes & Syntax Examples (5 Minutes)</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/80 dark:border-[#292D32] space-y-3 text-xs">
                <h4 className="font-bold text-zinc-900 dark:text-white">
                  {activeDayData.notes.heading}
                </h4>
                <ul className="space-y-1.5 text-zinc-600 dark:text-[#B8BEC7]">
                  {activeDayData.notes.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#FF6B00] font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {activeDayData.notes.codeSnippet && (
                  <div className="mt-3">
                    <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1">
                      Code Pattern Example:
                    </div>
                    <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-x-auto border border-zinc-800">
                      <code>{activeDayData.notes.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* PART 3: 3-5 QUESTION INTERACTIVE QUIZ (5 MINS) */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Step 3: Comprehension Quiz ({activeDayData.quiz.length} Questions)
                  </h3>
                </div>

                {quizSubmitted && currentProgress.completedQuizzes[selectedDayNumber] && (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Score: {currentProgress.completedQuizzes[selectedDayNumber].score} / {activeDayData.quiz.length}
                    </span>
                    <button
                      onClick={() => setQuizSubmitted(false)}
                      className="text-xs text-[#FF6B00] hover:underline cursor-pointer"
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {activeDayData.quiz.map((q, qIdx) => {
                  const selectedOpt = selectedQuizAnswers[q.id];
                  const hasAnswered = selectedOpt !== undefined;

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/80 dark:border-[#292D32] space-y-3 text-xs"
                    >
                      <div className="font-semibold text-zinc-900 dark:text-white flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <span>{q.question}</span>
                      </div>

                      <div className="space-y-2 pl-7">
                        {q.options.map((opt, optIdx) => {
                          let optStyle =
                            'bg-white dark:bg-[#15181B] border-zinc-200 dark:border-[#292D32] hover:border-[#FF6B00]/50';

                          if (quizSubmitted) {
                            if (optIdx === q.correctOptionIndex) {
                              optStyle =
                                'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                            } else if (selectedOpt === optIdx && optIdx !== q.correctOptionIndex) {
                              optStyle =
                                'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200';
                            }
                          } else if (selectedOpt === optIdx) {
                            optStyle =
                              'bg-[#FF6B00]/10 border-[#FF6B00] text-zinc-950 dark:text-white font-semibold ring-1 ring-[#FF6B00]';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleSelectQuizOption(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === q.correctOptionIndex && (
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="pl-7 pt-1 text-[11px] text-zinc-600 dark:text-[#858D98] bg-zinc-100/60 dark:bg-[#1F2428]/60 p-3 rounded-lg border border-zinc-200/60 dark:border-[#292D32]">
                          <span className="font-semibold text-zinc-900 dark:text-white">Explanation: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleGradeQuiz}
                    disabled={Object.keys(selectedQuizAnswers).length < activeDayData.quiz.length}
                    className="px-5 py-2.5 text-xs font-semibold bg-[#FF6B00] disabled:opacity-50 text-white rounded-xl hover:bg-[#FF8126] transition-colors cursor-pointer"
                  >
                    Submit Answers & Calculate Score
                  </button>
                </div>
              )}
            </div>

            {/* PART 4: PRACTICAL ASSIGNMENT (15 MINS) */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Step 4: Practical Coding Assignment (15 Minutes)
                  </h3>
                </div>

                {assignmentSubmitted && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Verified Solution ✓
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/80 dark:border-[#292D32] space-y-2 text-xs">
                <div className="font-bold text-zinc-950 dark:text-white">
                  {activeDayData.assignment.title}
                </div>
                <p className="text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                  {activeDayData.assignment.instructions}
                </p>
                <div className="text-[11px] text-zinc-400 font-mono">
                  Expected Output: {activeDayData.assignment.expectedOutput}
                </div>
              </div>

              {/* Code editor area */}
              <div className="space-y-2">
                <textarea
                  rows={7}
                  value={userCodeSubmission}
                  onChange={(e) => setUserCodeSubmission(e.target.value)}
                  placeholder="Draft your solution or paste code snippet here..."
                  className="w-full text-xs font-mono p-4 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-900 text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/40"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <span className="text-[11px] text-zinc-400 italic">
                    Hint: {activeDayData.assignment.hint}
                  </span>
                  <button
                    onClick={handleVerifyAssignment}
                    className="px-5 py-2 text-xs font-semibold bg-[#FF6B00] hover:bg-[#FF8126] text-white rounded-xl transition-colors cursor-pointer"
                  >
                    {assignmentSubmitted ? 'Re-Verify Solution' : 'Run & Verify Assignment'}
                  </button>
                </div>
              </div>
            </div>

            {/* PART 5: REVIEW & REFLECTION (5 MINS) */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                <MessageSquare className="w-4 h-4 text-[#FF6B00]" />
                <span>Step 5: Review & Honest Reflection (5 Minutes)</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/80 dark:border-[#292D32] space-y-2 text-xs">
                <div className="font-semibold text-zinc-900 dark:text-white">
                  {activeDayData.reflectionPrompt}
                </div>
                <textarea
                  rows={3}
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="What clicked today? Did any concept feel confusing or unintuitive?"
                  className="w-full text-xs p-3.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-white dark:bg-[#15181B] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30"
                />

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveReflection}
                    className="px-4 py-2 text-xs font-semibold text-zinc-800 dark:text-white bg-zinc-100 dark:bg-[#1F2428] hover:bg-zinc-200 dark:hover:bg-[#252B30] rounded-xl transition-colors cursor-pointer"
                  >
                    Save Reflection Note
                  </button>
                </div>
              </div>
            </div>

            {/* BIG ACTION: COMPLETE TODAY'S LEARNING */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">
                  Ready to wrap up Day {selectedDayNumber}?
                </h4>
                <p className="text-xs text-zinc-500 dark:text-[#858D98]">
                  Requires: Video watched ({isVideoWatched ? '✓' : 'Pending'}), Quiz submitted ({quizSubmitted ? '✓' : 'Pending'}), Assignment verified ({assignmentSubmitted ? '✓' : 'Pending'}).
                </p>
              </div>

              <button
                onClick={handleCompleteToday}
                disabled={!isDayEligibleForCompletion}
                className={`px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                  isDayEligibleForCompletion
                    ? 'bg-[#FF6B00] hover:bg-[#FF8126] text-white hover:scale-102'
                    : 'bg-zinc-200 dark:bg-[#252B30] text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isDayFullyCompleted ? 'Today Completed (Update XP)' : "Complete Today's Learning"}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 4-WEEK MILESTONE ROADMAPS (PRESERVED) */}
        {activeTabMode === 'sprints' && (
          <div className="space-y-6 animate-fade-in">
            {/* Roadmap Selector Tabs */}
            {roadmaps.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {roadmaps.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRoadmapId(r.id)}
                    className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      activeRoadmapId === r.id
                        ? 'bg-[#FF6B00] text-white font-semibold shadow-xs'
                        : 'bg-white dark:bg-[#15181B] hover:bg-zinc-100 dark:hover:bg-[#1F2428] text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-[#292D32]'
                    }`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            )}

            {currentRoadmap ? (
              <div className="space-y-6">
                {/* Meta Card */}
                <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#FF6B00] font-semibold uppercase tracking-wider">
                        Track: {currentRoadmap.interestName} · {currentRoadmap.category}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white mt-1 font-display tracking-tight">
                        {currentRoadmap.title}
                      </h2>
                      <p className="text-xs text-zinc-600 dark:text-[#858D98] mt-1.5 max-w-2xl leading-relaxed">
                        Goal: {currentRoadmap.goal}
                      </p>
                    </div>

                    <div className="text-right bg-zinc-50 dark:bg-[#111315] border border-zinc-200 dark:border-[#292D32] px-4 py-2 rounded-xl shrink-0">
                      <div className="text-xs font-semibold text-zinc-950 dark:text-white font-mono">
                        {currentRoadmap.milestones.filter((m) => m.completed).length} /{' '}
                        {currentRoadmap.milestones.length} Milestones
                      </div>
                      <div className="text-[11px] text-zinc-500">Flexible pacing</div>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-[#111315] border border-zinc-200 dark:border-[#292D32] rounded-xl text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-950 dark:text-white">Why this path: </span>
                    {currentRoadmap.rationale}
                  </div>
                </div>

                {/* Milestones Sequence */}
                <div className="space-y-4">
                  {currentRoadmap.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 sm:p-7 relative shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/25 uppercase">
                              WEEK {m.weekNumber}
                            </span>
                            <span className="text-zinc-300 dark:text-zinc-600">·</span>
                            <span className="text-zinc-500 font-medium">{m.focusArea}</span>
                          </div>
                          <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{m.title}</h3>
                          <p className="text-xs text-zinc-600 dark:text-[#858D98] leading-relaxed max-w-3xl">{m.description}</p>
                        </div>

                        <button
                          onClick={() => {
                            setReflectionModalMilestone({
                              roadmapId: currentRoadmap.id,
                              milestone: m
                            });
                            setMilestoneReflectionText(m.userReflection || '');
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-[#111315] hover:bg-zinc-100 dark:hover:bg-[#1F2428] border border-zinc-200 dark:border-[#292D32] rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#FF6B00]" />
                          <span>{m.userReflection ? 'Edit Reflection' : 'Add Reflection'}</span>
                        </button>
                      </div>

                      {/* Tasks List */}
                      <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-[#292D32] space-y-2">
                        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Tasks & Practice Activities
                        </div>
                        {m.tasks.map((task) => (
                          <label
                            key={task.id}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50/80 dark:hover:bg-[#111315]/80 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-[#292D32]"
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() =>
                                store.toggleRoadmapTask(currentRoadmap.id, m.id, task.id)
                              }
                              className="w-4 h-4 rounded text-[#FF6B00] focus:ring-[#FF6B00]/20 cursor-pointer accent-[#FF6B00]"
                            />
                            <span
                              className={`text-xs ${
                                task.completed
                                  ? 'line-through text-zinc-400 dark:text-zinc-500 font-normal'
                                  : 'text-zinc-800 dark:text-zinc-200 font-medium'
                              }`}
                            >
                              {task.title}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* User Reflection Note if Present */}
                      {m.userReflection && (
                        <div className="mt-4 p-4 bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-xl text-xs space-y-1">
                          <div className="font-semibold text-[#FF6B00] text-[11px]">
                            Saved Milestone Reflection:
                          </div>
                          <p className="text-zinc-700 dark:text-zinc-300 italic">"{m.userReflection}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] space-y-3">
                <Compass className="w-10 h-10 text-zinc-400 mx-auto" />
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">No 4-Week Roadmaps Yet</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Transform an interest into a 4-week structured testing sprint or explore the 45-minute daily video learning section above.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Create Custom Roadmap
                </button>
              </div>
            )}
          </div>
        )}

        {/* Milestone Reflection Modal */}
        {reflectionModalMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#15181B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-[#292D32] w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]">
                <div className="text-xs">
                  <span className="font-semibold text-[#FF6B00] uppercase tracking-wider text-[11px]">
                    Milestone {reflectionModalMilestone.milestone.weekNumber} Reflection
                  </span>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white mt-0.5 font-display">
                    {reflectionModalMilestone.milestone.title}
                  </h3>
                </div>
                <button
                  onClick={() => setReflectionModalMilestone(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMilestoneReflection} className="p-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200 dark:border-[#292D32] text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                  {reflectionModalMilestone.milestone.reflectionQuestion}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                    Your Honest Notes:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={milestoneReflectionText}
                    onChange={(e) => setMilestoneReflectionText(e.target.value)}
                    placeholder="Did you feel in flow, or did it feel like a chore? What surprised you?"
                    className="w-full text-xs p-3.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#111315] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30 transition-all text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReflectionModalMilestone(null)}
                    className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#1F2428] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Custom Roadmap Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#15181B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-[#292D32] w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]">
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-display">
                    Build a New Growth Roadmap
                  </h3>
                  <p className="text-xs text-zinc-500">Create a 4-week testing sprint</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRoadmapSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                    Roadmap Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Machine Learning Foundation, Full-Stack REST API"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50 dark:bg-[#111315] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                    Primary 4-Week Goal
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build an end-to-end predictive prototype and share with a mentor"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50 dark:bg-[#111315] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#1F2428] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-colors cursor-pointer"
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
