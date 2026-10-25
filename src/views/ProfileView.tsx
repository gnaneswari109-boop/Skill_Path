import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Clock,
  Download,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  Target,
  Award,
  Layers,
  Code2,
  CheckCircle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Edit3,
  X,
  Compass,
  Zap,
  ExternalLink,
  Filter,
  CheckSquare,
  Square,
  Info,
  FolderGit2
} from 'lucide-react';
import { store } from '../services/store';
import { LifeStage } from '../types';
import {
  THREE_MEMBER_PROFILES,
  MemberProfileData,
  MemberProject,
  TaskItem,
  SKILL_RESOURCES_MAP
} from '../data/memberProfiles';

interface ProfileViewProps {
  onOpenMemoryModal: () => void;
  onNavigateToRoadmap?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenMemoryModal, onNavigateToRoadmap }) => {
  // Local state for all 3 members to allow editing and real-time updates isolated per member
  const [members, setMembers] = useState<MemberProfileData[]>(() => {
    try {
      const saved = localStorage.getItem('skillpath_member_profiles_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3 && parsed[0].id === 'user_member_ananya') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return THREE_MEMBER_PROFILES;
  });

  // Selected member ID (default to Ananya Reddy)
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0].id);

  // Modals state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeProjectModal, setActiveProjectModal] = useState<MemberProject | null>(null);
  const [activeSkillModal, setActiveSkillModal] = useState<string | null>(null);
  const [projectFilterStatus, setProjectFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [showOnlyProjectsView, setShowOnlyProjectsView] = useState<boolean>(false);

  // Notification banners
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeSessionNotice, setActiveSessionNotice] = useState(false);

  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0];

  // Editable fields form state
  const [editName, setEditName] = useState(activeMember.name);
  const [editRoleLabel, setEditRoleLabel] = useState(activeMember.roleLabel);
  const [editBio, setEditBio] = useState(activeMember.intro);
  const [editCareerGoals, setEditCareerGoals] = useState(activeMember.careerGoals);
  const [editLifeStage, setEditLifeStage] = useState<LifeStage>(activeMember.lifeStage);
  const [editHours, setEditHours] = useState(activeMember.availableHoursPerWeek);
  const [editVisibility, setEditVisibility] = useState(activeMember.profileVisibility);

  // Sync edit form values when selected member changes
  useEffect(() => {
    setEditName(activeMember.name);
    setEditRoleLabel(activeMember.roleLabel);
    setEditBio(activeMember.intro);
    setEditCareerGoals(activeMember.careerGoals);
    setEditLifeStage(activeMember.lifeStage);
    setEditHours(activeMember.availableHoursPerWeek);
    setEditVisibility(activeMember.profileVisibility);
    setIsEditing(false);
  }, [selectedMemberId]);

  // Persist members array to localStorage
  const saveMembersState = (updatedList: MemberProfileData[]) => {
    setMembers(updatedList);
    try {
      localStorage.setItem('skillpath_member_profiles_v2', JSON.stringify(updatedList));
    } catch (err) {
      console.error('Storage error:', err);
    }
  };

  // Switch selected member
  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
  };

  // Toggle task completed state
  const handleToggleTask = (taskId: string) => {
    const updated = members.map((m) => {
      if (m.id === selectedMemberId) {
        const updatedTasks = m.tasks.map((t) => {
          if (t.id === taskId) {
            return { ...t, completed: !t.completed };
          }
          return t;
        });
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const total = updatedTasks.length;
        const progressPct = Math.round((completedCount / total) * 100);

        return {
          ...m,
          tasks: updatedTasks,
          tasksCompletedCount: completedCount,
          tasksTotal: total,
          progressPercentage: progressPct
        };
      }
      return m;
    });

    saveMembersState(updated);
  };

  // Save member edits
  const handleSaveMemberEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = members.map((m) => {
      if (m.id === selectedMemberId) {
        return {
          ...m,
          name: editName,
          roleLabel: editRoleLabel,
          intro: editBio,
          shortIntro: editBio.slice(0, 110) + '...',
          careerGoals: editCareerGoals,
          lifeStage: editLifeStage,
          availableHoursPerWeek: editHours,
          profileVisibility: editVisibility
        };
      }
      return m;
    });

    saveMembersState(updated);

    // Sync to store if current user matches
    if (store.currentUser.id === selectedMemberId) {
      store.updateCurrentUserProfile({
        name: editName,
        bio: editBio,
        lifeStage: editLifeStage,
        availableHoursPerWeek: editHours,
        profileVisibility: editVisibility
      });
    }

    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Set member as active session user
  const handleSetAsActiveSession = (member: MemberProfileData) => {
    const newUser = {
      ...store.currentUser,
      id: member.id,
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      bio: member.intro,
      role: 'member' as const,
      lifeStage: member.lifeStage,
      availableHoursPerWeek: member.availableHoursPerWeek,
      interestsPrimary: member.skills,
      interestsSecondary: member.interests
    };
    store.setCurrentUser(newUser);
    setActiveSessionNotice(true);
    setTimeout(() => setActiveSessionNotice(false), 2500);
  };

  // Filtered projects
  const filteredProjects = activeMember.projects.filter((p) => {
    if (projectFilterStatus === 'all') return true;
    return p.status === projectFilterStatus;
  });

  // Export data
  const handleExportData = () => {
    const dataToExport = {
      profileType: 'Equal Member Demo Profile',
      member: activeMember,
      allThreeMembers: members,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillfirst_${activeMember.name.toLowerCase().replace(/\s+/g, '_')}_profile.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Sample / Demo Disclaimer & Header Banner */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20">
              <User className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Equal Member Profiles</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-200/80 dark:bg-[#1F2428] text-zinc-700 dark:text-zinc-300 border border-zinc-300/80 dark:border-[#292D32]">
              <Info className="w-3 h-3 text-zinc-500" />
              <span>Sample Demo Profiles · Independent Learning Data</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-display">
                Member Profile Workspace
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#858D98] max-w-3xl mt-1 leading-relaxed">
                Skill First treats all members equally as peers without ranking tiers or beginner/advanced labels. Select any of the three members below to view, explore, and edit their live learning portfolio.
              </p>
            </div>

            {/* Notification Pills */}
            <div className="flex items-center gap-2">
              {savedNotice && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold animate-fade-in shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Profile updated and saved</span>
                </div>
              )}
              {activeSessionNotice && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30 text-xs font-semibold animate-fade-in shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Active user switched to {activeMember.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid: 3 Member Selectors (Left / Top) + Detailed Profile Panel (Right) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Member Selection Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-[#858D98]">
                Equal Members ({members.length})
              </h2>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Click to switch details
              </span>
            </div>

            {/* 3 Selectable Member Cards */}
            <div className="space-y-3">
              {members.map((member) => {
                const isSelected = member.id === selectedMemberId;
                const isCurrentSessionUser = store.currentUser.id === member.id;

                return (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(member.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-white dark:bg-[#15181B] border-[#FF6B00] shadow-md ring-2 ring-[#FF6B00]/20'
                        : 'bg-white dark:bg-[#111315] border-zinc-200/90 dark:border-[#292D32] hover:border-[#FF6B00]/50 hover:bg-zinc-50 dark:hover:bg-[#16191D]'
                    }`}
                  >
                    {/* Member Photo */}
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className={`w-12 h-12 rounded-xl object-cover border-2 transition-all ${
                          isSelected
                            ? 'border-[#FF6B00] shadow-xs'
                            : 'border-zinc-200 dark:border-[#292D32]'
                        }`}
                      />
                      {isSelected && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-sm text-zinc-950 dark:text-white truncate">
                          {member.name}
                        </h3>
                        {isCurrentSessionUser && (
                          <span className="text-[10px] font-semibold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded-full shrink-0">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-medium text-[#FF6B00] mt-0.5">
                        {member.roleLabel}
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-[#858D98] line-clamp-2 mt-1 leading-snug">
                        {member.shortIntro}
                      </p>

                      {/* Stat snippet */}
                      <div className="flex items-center gap-2.5 mt-2.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                        <span className="font-mono text-zinc-700 dark:text-zinc-300">
                          {member.tasksCompletedCount}/{member.tasksTotal} tasks
                        </span>
                        <span>•</span>
                        <span className="font-mono text-zinc-700 dark:text-zinc-300">
                          {member.projectsCompletedCount} completed proj
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Session & Role Switcher */}
            <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-[#15181B] border border-zinc-200/80 dark:border-[#292D32] text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
                <Shield className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Equal Member Architecture</span>
              </div>
              <p className="text-zinc-600 dark:text-[#858D98] text-[11px] leading-relaxed">
                All members share the same tools and community standing. Selecting a member allows exploring their projects, interactive tasks, and learning roadmaps independently.
              </p>
              <button
                onClick={() => handleSetAsActiveSession(activeMember)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#FF6B00] hover:bg-[#FF8126] text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Experience App as {activeMember.name}</span>
              </button>
            </div>
          </div>

          {/* Detailed Profile Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header / Identity Card */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-[#292D32]">
                <div className="flex items-start gap-4">
                  <img
                    src={activeMember.avatar}
                    alt={activeMember.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FF6B00]/40 shadow-sm shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white font-display">
                        {activeMember.name}
                      </h2>
                      <span className="text-xs font-semibold text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2.5 py-0.5 rounded-full">
                        {activeMember.roleLabel}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-[#858D98] flex flex-wrap items-center gap-3">
                      <span>{activeMember.email}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF6B00]" />
                        {activeMember.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#FF6B00]" />
                        Joined {activeMember.joinedDate}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#1F2428] text-zinc-700 dark:text-zinc-300 font-medium">
                        <Clock className="w-3 h-3 text-[#FF6B00]" />
                        {activeMember.availableHoursPerWeek} hrs / week
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#1F2428] text-zinc-700 dark:text-zinc-300 font-medium capitalize">
                        <BookOpen className="w-3 h-3 text-[#FF6B00]" />
                        {activeMember.lifeStage.replace('_', ' ')}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#1F2428] text-zinc-700 dark:text-zinc-300 font-medium">
                        <Zap className="w-3 h-3 text-[#FF6B00]" />
                        {activeMember.preferredLearningStyle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit & Action Buttons */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-[#292D32] bg-white dark:bg-[#111315] hover:bg-zinc-50 dark:hover:bg-[#1B1F23] hover:border-[#FF6B00]/40 transition-colors cursor-pointer"
                  >
                    {isEditing ? (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel Edit</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowOnlyProjectsView(!showOnlyProjectsView)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                      showOnlyProjectsView
                        ? 'bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 font-semibold'
                        : 'border-zinc-200 dark:border-[#292D32] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#1B1F23]'
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>{showOnlyProjectsView ? 'Show Full Profile' : 'View Projects'}</span>
                  </button>

                  <button
                    onClick={handleExportData}
                    title="Export member profile as JSON"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-[#858D98] hover:text-zinc-900 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Edit Profile Form */}
              {isEditing && (
                <form onSubmit={handleSaveMemberEdits} className="space-y-4 pt-2 animate-fade-in text-xs border-b border-zinc-100 dark:border-[#292D32] pb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-[#FF6B00]" />
                      <span>Edit Information for {activeMember.name}</span>
                    </h3>
                    <span className="text-[11px] text-zinc-400">Edits save isolated to this member</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                        Member Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50 dark:bg-[#111315] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                        Role / Focus
                      </label>
                      <input
                        type="text"
                        required
                        value={editRoleLabel}
                        onChange={(e) => setEditRoleLabel(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50 dark:bg-[#111315] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                      Personal Introduction & Bio
                    </label>
                    <textarea
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full text-xs p-3.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50 dark:bg-[#111315] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                      Career Goals & Ambitions
                    </label>
                    <textarea
                      rows={2}
                      value={editCareerGoals}
                      onChange={(e) => setEditCareerGoals(e.target.value)}
                      className="w-full text-xs p-3.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50 dark:bg-[#111315] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                        Available Hours per Week ({editHours} hrs)
                      </label>
                      <input
                        type="range"
                        min={2}
                        max={25}
                        value={editHours}
                        onChange={(e) => setEditHours(Number(e.target.value))}
                        className="w-full accent-[#FF6B00] mt-2 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                        Profile Visibility
                      </label>
                      <select
                        value={editVisibility}
                        onChange={(e) => setEditVisibility(e.target.value as any)}
                        className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50 dark:bg-[#111315] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                      >
                        <option value="public">Public (Visible to peers & mentors)</option>
                        <option value="connections_only">Connections Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#1B1F23]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Section 1: Personal Introduction and Career Goals */}
              <div className="grid md:grid-cols-2 gap-6 pt-1">
                <div className="space-y-2 p-4 rounded-xl bg-zinc-50/80 dark:bg-[#111315]/80 border border-zinc-200/70 dark:border-[#292D32]">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
                    <User className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Personal Introduction</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                    {activeMember.intro}
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-xl bg-zinc-50/80 dark:bg-[#111315]/80 border border-zinc-200/70 dark:border-[#292D32]">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
                    <Target className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Career Goal</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                    {activeMember.careerGoals}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Skills and Areas of Interest (Interactive click to view resources) */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                  <Code2 className="w-4 h-4 text-[#FF6B00]" />
                  <span>Skills & Areas of Interest</span>
                </div>
                <span className="text-[11px] text-[#FF6B00] font-medium">
                  Click any skill badge to view resources & related projects
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {/* Core Skills (Interactive) */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#858D98]">
                    Core Skills (Clickable)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeMember.skills.map((skill, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSkillModal(skill)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/25 hover:bg-[#FF6B00]/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 group"
                      >
                        <span>{skill}</span>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Areas of Interest */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#858D98]">
                    Areas of Interest
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMember.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium bg-zinc-100 dark:bg-[#1F2428] text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-[#292D32]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools & Tech Stack */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#858D98]">
                    Tools & Technologies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMember.toolsAndTech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg font-mono text-zinc-600 dark:text-[#B8BEC7] bg-zinc-50 dark:bg-[#111315] border border-zinc-200/70 dark:border-[#292D32]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Task Completion Indicator (Accurate 18/20, 12/20, 8/15 with interactive checkboxes) */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Task Completion Indicator ({activeMember.tasksCompletedCount} out of {activeMember.tasksTotal} completed)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                    {Math.round((activeMember.tasksCompletedCount / activeMember.tasksTotal) * 100)}% Complete
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Click checkboxes to test status
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-zinc-100 dark:bg-[#292D32] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#FF6B00] rounded-full transition-all duration-300"
                    style={{
                      width: `${(activeMember.tasksCompletedCount / activeMember.tasksTotal) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>Completed: {activeMember.tasksCompletedCount}</span>
                  <span>Pending: {activeMember.tasksTotal - activeMember.tasksCompletedCount}</span>
                </div>
              </div>

              {/* Task list with checkboxes */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {activeMember.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                      task.completed
                        ? 'bg-zinc-50/70 dark:bg-[#111315]/80 border-zinc-200/60 dark:border-[#292D32]'
                        : 'bg-white dark:bg-[#15181B] border-amber-300/40 dark:border-amber-900/40 shadow-xs'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-zinc-500 hover:text-[#FF6B00] shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-semibold ${
                          task.completed
                            ? 'line-through text-zinc-400 dark:text-zinc-500 font-normal'
                            : 'text-zinc-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-[#858D98] mt-1 font-mono">
                        <span className="capitalize">{task.category}</span>
                        <span>{task.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Ongoing Activities */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                  <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
                  <span>Ongoing Activities ({activeMember.ongoingActivities.length})</span>
                </div>
                <span className="text-[11px] text-[#FF6B00] font-semibold bg-[#FF6B00]/10 px-2.5 py-0.5 rounded-full">
                  Current Project: {activeMember.currentProjectName}
                </span>
              </div>

              <div className="space-y-3">
                {activeMember.ongoingActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/60 dark:border-[#292D32] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-zinc-900 dark:text-white">
                        {act.title}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                        {act.sprintWeek}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-[#858D98]">
                      {act.details}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Sprint Progress</span>
                        <span>{act.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200 dark:bg-[#292D32] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6B00] rounded-full transition-all duration-300"
                          style={{ width: `${act.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Projects & Accomplishments (Clickable to open details modal) */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                  <Briefcase className="w-4 h-4 text-[#FF6B00]" />
                  <span>
                    Projects ({activeMember.projectsCompletedCount} completed · Current: {activeMember.currentProjectName})
                  </span>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 text-xs">
                  <Filter className="w-3.5 h-3.5 text-zinc-400" />
                  {(['all', 'active', 'completed'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setProjectFilterStatus(filter)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                        projectFilterStatus === filter
                          ? 'bg-[#FF6B00] text-white font-semibold'
                          : 'bg-zinc-100 dark:bg-[#1F2428] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#252B30]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Grid (Clickable Cards) */}
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setActiveProjectModal(proj)}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/70 dark:border-[#292D32] hover:border-[#FF6B00] hover:shadow-md transition-all cursor-pointer space-y-3 text-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-[#FF6B00] transition-colors">
                        {proj.name}
                      </div>
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md ${
                          proj.status === 'active'
                            ? 'bg-[#FF6B00]/10 text-[#FF6B00] font-semibold border border-[#FF6B00]/30'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-zinc-600 dark:text-[#B8BEC7] leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>

                    {proj.metrics && (
                      <div className="text-[11px] font-mono text-[#FF6B00] font-medium bg-[#FF6B00]/5 p-2 rounded-lg border border-[#FF6B00]/15">
                        {proj.metrics}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.slice(0, 3).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] text-zinc-600 dark:text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {proj.techStack.length > 3 && (
                          <span className="text-[10px] font-mono text-zinc-400">
                            +{proj.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-[#FF6B00] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Practical Experience */}
              <div className="space-y-3 pt-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#858D98]">
                  Experience & Accomplishments
                </div>
                <div className="space-y-3">
                  {activeMember.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-zinc-200/60 dark:border-[#292D32] bg-white dark:bg-[#111315] flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="font-bold text-zinc-900 dark:text-white">
                          {exp.role} <span className="text-[#FF6B00]">@ {exp.organization}</span>
                        </div>
                        <p className="text-zinc-500 dark:text-[#858D98]">
                          {exp.summary}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                        {exp.period}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 6: Learning Progress and Future Goals */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                <Target className="w-4 h-4 text-[#FF6B00]" />
                <span>Learning Progress & Future Goals</span>
              </div>

              {/* Progress Bar & Current Milestone */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/70 dark:border-[#292D32] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white">Current Milestone Focus: </span>
                    <span className="text-[#FF6B00] font-semibold">{activeMember.currentMilestone}</span>
                  </div>
                  <span className="font-mono text-zinc-500 font-semibold">{activeMember.progressPercentage}% Completed</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-200 dark:bg-[#292D32] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B00] to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${activeMember.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Target Future Goals */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Targeted Future Goals:
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {activeMember.futureGoals.map((goal, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/70 dark:border-[#292D32] flex items-start gap-2 text-xs"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                      <span className="text-zinc-600 dark:text-[#B8BEC7]">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 7: Certifications & Verified Achievements */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                  <Award className="w-4 h-4 text-[#FF6B00]" />
                  <span>Certifications & Verified Achievements</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {activeMember.certifications.join(', ')}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {activeMember.achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-[#292D32] bg-zinc-50/50 dark:bg-[#111315] flex flex-col justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[#FF6B00] font-bold">
                        <Award className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-wider">{ach.issuer}</span>
                      </div>
                      <div className="font-bold text-zinc-900 dark:text-white text-xs">
                        {ach.title}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                      <span>{ach.credentialId || 'Verified'}</span>
                      <span>{ach.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preserved Feature: Data Ownership & AI Memory Controls */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 dark:text-white font-display text-sm">
                <Shield className="w-4 h-4 text-[#FF6B00]" />
                <span>Data Ownership & AI Memory Controls</span>
              </div>

              <p className="text-zinc-600 dark:text-[#858D98] leading-relaxed">
                You hold complete control over what Skill Path remembers about member preferences, task answers, and daily learning notes.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={onOpenMemoryModal}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-white bg-zinc-100 dark:bg-[#1F2428] hover:bg-zinc-200 dark:hover:bg-[#252B30] rounded-xl transition-colors cursor-pointer"
                >
                  Inspect Stored Memories
                </button>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-zinc-700 dark:text-[#B8BEC7] hover:text-zinc-950 dark:hover:text-white border border-zinc-200/90 dark:border-[#292D32] rounded-xl hover:bg-zinc-50 dark:hover:bg-[#111315] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Export Member Data (JSON)</span>
                </button>
                <button
                  onClick={() => {
                    store.resetToDefaults();
                    localStorage.removeItem('skillpath_member_profiles_v2');
                    setMembers(THREE_MEMBER_PROFILES);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data to Initial</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#15181B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-[#292D32] w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-[#292D32] bg-zinc-50/80 dark:bg-[#111315]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
                  Project Dossier
                </span>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md ${
                    activeProjectModal.status === 'active'
                      ? 'bg-[#FF6B00]/10 text-[#FF6B00] font-semibold'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                  }`}
                >
                  {activeProjectModal.status}
                </span>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white font-display">
                  {activeProjectModal.name}
                </h3>
                <p className="text-zinc-500 dark:text-[#858D98] text-xs mt-1">
                  Built by {activeMember.name} · {activeMember.roleLabel}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/80 dark:border-[#292D32] space-y-2">
                <div className="font-semibold text-zinc-900 dark:text-white text-xs">
                  Summary & Impact:
                </div>
                <p className="text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                  {activeProjectModal.longDescription || activeProjectModal.description}
                </p>
              </div>

              {activeProjectModal.metrics && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-white">
                    Verified Performance Metrics:
                  </div>
                  <div className="p-3 rounded-xl bg-[#FF6B00]/5 border border-[#FF6B00]/20 text-[#FF6B00] font-mono font-medium">
                    {activeProjectModal.metrics}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="font-semibold text-zinc-900 dark:text-white">
                  Technology Stack:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeProjectModal.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-[#1F2428] border border-zinc-200/80 dark:border-[#292D32] font-mono text-zinc-700 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-[#292D32] flex items-center justify-between">
                <div className="text-[11px] text-zinc-400">
                  {activeProjectModal.completionDate ? `Completed in ${activeProjectModal.completionDate}` : 'Currently Active Milestone'}
                </div>
                <button
                  onClick={() => setActiveProjectModal(null)}
                  className="px-4 py-2 text-xs font-semibold bg-[#FF6B00] text-white rounded-xl hover:bg-[#FF8126] transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Resources Modal */}
      {activeSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#15181B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-[#292D32] w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-[#292D32] bg-zinc-50/80 dark:bg-[#111315]">
              <div>
                <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider">
                  Skill Explorer
                </span>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  {activeSkillModal}
                </h3>
              </div>
              <button
                onClick={() => setActiveSkillModal(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {SKILL_RESOURCES_MAP[activeSkillModal] ? (
                <>
                  <p className="text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                    {SKILL_RESOURCES_MAP[activeSkillModal].summary}
                  </p>

                  <div className="space-y-2">
                    <div className="font-semibold text-zinc-900 dark:text-white">
                      Recommended Learning Resources:
                    </div>
                    <div className="space-y-2">
                      {SKILL_RESOURCES_MAP[activeSkillModal].topResources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/80 dark:border-[#292D32] hover:border-[#FF6B00]/60 flex items-center justify-between gap-3 transition-colors group"
                        >
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-900 dark:text-white group-hover:text-[#FF6B00] transition-colors truncate">
                              {res.title}
                            </div>
                            <div className="text-[10px] text-zinc-400 uppercase font-mono mt-0.5">
                              {res.type} · {res.duration}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-[#FF6B00] shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="font-semibold text-zinc-900 dark:text-white">
                      Related Topics in Roadmap:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILL_RESOURCES_MAP[activeSkillModal].relatedTopics.map((top, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 text-[11px] rounded bg-zinc-100 dark:bg-[#1F2428] text-zinc-600 dark:text-zinc-300 font-medium"
                        >
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-zinc-500">
                  Detailed resources available in the Roadmaps and Discovery sections.
                </p>
              )}

              <div className="pt-3 border-t border-zinc-100 dark:border-[#292D32] flex justify-end">
                <button
                  onClick={() => setActiveSkillModal(null)}
                  className="px-4 py-2 text-xs font-semibold bg-[#FF6B00] text-white rounded-xl hover:bg-[#FF8126] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
