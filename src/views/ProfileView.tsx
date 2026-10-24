import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { store } from '../services/store';
import { LifeStage } from '../types';
import {
  THREE_MEMBER_PROFILES,
  MemberProfileData
} from '../data/memberProfiles';

interface ProfileViewProps {
  onOpenMemoryModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenMemoryModal }) => {
  // Local state for all 3 members to allow editing and real-time updates
  const [members, setMembers] = useState<MemberProfileData[]>(() => {
    try {
      const saved = localStorage.getItem('skillpath_member_profiles_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to initial
    }
    return THREE_MEMBER_PROFILES;
  });

  // Currently selected member ID (default to first member)
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0].id);

  // Edit mode toggle
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Active editable fields
  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0];

  const [editName, setEditName] = useState(activeMember.name);
  const [editBio, setEditBio] = useState(activeMember.intro);
  const [editCareerGoals, setEditCareerGoals] = useState(activeMember.careerGoals);
  const [editLifeStage, setEditLifeStage] = useState<LifeStage>(activeMember.lifeStage);
  const [editHours, setEditHours] = useState(activeMember.availableHoursPerWeek);
  const [editVisibility, setEditVisibility] = useState(activeMember.profileVisibility);
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeSessionNotice, setActiveSessionNotice] = useState(false);

  // Switch selected member
  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsEditing(false);
    const target = members.find((m) => m.id === memberId);
    if (target) {
      setEditName(target.name);
      setEditBio(target.intro);
      setEditCareerGoals(target.careerGoals);
      setEditLifeStage(target.lifeStage);
      setEditHours(target.availableHoursPerWeek);
      setEditVisibility(target.profileVisibility);
    }
  };

  // Save edits to state and local storage
  const handleSaveMemberEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = members.map((m) => {
      if (m.id === selectedMemberId) {
        return {
          ...m,
          name: editName,
          intro: editBio,
          careerGoals: editCareerGoals,
          lifeStage: editLifeStage,
          availableHoursPerWeek: editHours,
          profileVisibility: editVisibility
        };
      }
      return m;
    });

    setMembers(updated);
    try {
      localStorage.setItem('skillpath_member_profiles_v1', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Also sync to store if current user matches
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
    const existing = store.users.find((u) => u.id === member.id);
    if (existing) {
      store.setCurrentUser(existing);
    } else {
      // Create or update user profile representation in store
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
        interestsPrimary: member.interests.slice(0, 3),
        interestsSecondary: member.interests.slice(3)
      };
      store.setCurrentUser(newUser);
    }
    setActiveSessionNotice(true);
    setTimeout(() => setActiveSessionNotice(false), 2500);
  };

  // Export data
  const handleExportData = () => {
    const dataToExport = {
      member: activeMember,
      exportedAt: new Date().toISOString(),
      storeSnapshot: store.exportUserData()
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillpath_profile_${activeMember.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20">
            <User className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Equal Member Profiles</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Member Profile Workspace
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#858D98] max-w-2xl mt-1 leading-relaxed">
                Explore three distinct member journeys with individual career goals, active experiments, completed tasks, and accomplishments—all treated equally without tier categories or ranks.
              </p>
            </div>

            {/* Notification Pills */}
            <div className="flex items-center gap-2">
              {savedNotice && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Profile updated</span>
                </div>
              )}
              {activeSessionNotice && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30 text-xs font-semibold animate-fade-in">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Active user session switched</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid: Member Selectors (Left / Top) + Detailed Profile Panel (Right) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Member Selection Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-[#858D98]">
                Select Member Profile ({members.length})
              </h2>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Equal status
              </span>
            </div>

            {/* Selector Cards */}
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
                    {/* Member Avatar */}
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
                            Current
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-[#858D98] line-clamp-2 mt-1 leading-snug">
                        {member.shortIntro}
                      </p>

                      <div className="flex items-center gap-2 mt-2.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#FF6B00] shrink-0" />
                          {member.location}
                        </span>
                        <span>•</span>
                        <span>{member.availableHoursPerWeek}h/wk</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Box */}
            <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-[#15181B] border border-zinc-200/80 dark:border-[#292D32] text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
                <Shield className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Equal Representation</span>
              </div>
              <p className="text-zinc-600 dark:text-[#858D98] text-[11px] leading-relaxed">
                Skill First treats every member as an equal learner. You can inspect any member's detailed roadmap progress, completed tasks, projects, or switch your active view with one click.
              </p>
              <button
                onClick={() => handleSetAsActiveSession(activeMember)}
                className="w-full mt-1 py-2 px-3 rounded-xl text-xs font-semibold bg-[#FF6B00] hover:bg-[#FF8126] text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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
                      <span className="text-[11px] font-semibold text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2.5 py-0.5 rounded-full">
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
                        <span>Edit Details</span>
                      </>
                    )}
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

              {/* Inline Edit Form when editing is active */}
              {isEditing ? (
                <form onSubmit={handleSaveMemberEdits} className="space-y-4 pt-2 animate-fade-in text-xs">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                        Member Display Name
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
                        Current Life Stage
                      </label>
                      <select
                        value={editLifeStage}
                        onChange={(e) => setEditLifeStage(e.target.value as LifeStage)}
                        className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50 dark:bg-[#111315] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] capitalize"
                      >
                        <option value="school">High School</option>
                        <option value="college">University / College</option>
                        <option value="employed">Currently Employed</option>
                        <option value="career_transition">In Career Transition</option>
                        <option value="exploring">Open Exploration</option>
                      </select>
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
                        max={20}
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
                        <option value="public">Public (Discoverable to peers & mentors)</option>
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
                      <span>Save Member Profile</span>
                    </button>
                  </div>
                </form>
              ) : null}

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
                    <span>Career Goals & Direction</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                    {activeMember.careerGoals}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Skills and Areas of Interest */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                <Code2 className="w-4 h-4 text-[#FF6B00]" />
                <span>Skills & Areas of Interest</span>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {/* Core Skills */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#858D98]">
                    Core Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMember.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20"
                      >
                        {skill}
                      </span>
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

            {/* Section 3: Completed Tasks & Ongoing Activities */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Completed Tasks */}
              <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Completed Tasks ({activeMember.completedTasks.length})</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeMember.completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/60 dark:border-[#292D32] flex items-start gap-2.5 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          {task.title}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-[#858D98] mt-1">
                          <span>{task.category}</span>
                          <span>{task.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ongoing Activities */}
              <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                    <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
                    <span>Ongoing Activities ({activeMember.ongoingActivities.length})</span>
                  </div>
                  <span className="text-[11px] text-[#FF6B00] font-semibold bg-[#FF6B00]/10 px-2 py-0.5 rounded-full">
                    In Progress
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeMember.ongoingActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/60 dark:border-[#292D32] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-zinc-900 dark:text-white truncate">
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
                          <span>Progress</span>
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
            </div>

            {/* Section 4: Projects, Accomplishments, and Experience */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                <Briefcase className="w-4 h-4 text-[#FF6B00]" />
                <span>Projects, Accomplishments & Experience</span>
              </div>

              {/* Projects Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {activeMember.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/70 dark:border-[#292D32] space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-zinc-900 dark:text-white text-sm">
                        {proj.name}
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-[#292D32] text-zinc-700 dark:text-zinc-300">
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#15181B] border border-zinc-200 dark:border-[#292D32] text-zinc-600 dark:text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience Timeline */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#858D98]">
                  Background & Practical Experience
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

            {/* Section 5: Learning Progress and Future Goals */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                <Target className="w-4 h-4 text-[#FF6B00]" />
                <span>Learning Progress & Future Goals</span>
              </div>

              {/* Progress Bar & Current Milestone */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#111315] border border-zinc-200/70 dark:border-[#292D32] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white">Current Focus Milestone: </span>
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
                  Targeted Objectives & Milestones:
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

            {/* Section 6: Achievements, Certifications & Credentials */}
            <div className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
                <Award className="w-4 h-4 text-[#FF6B00]" />
                <span>Achievements & Verified Credentials</span>
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
                      <span>Verified</span>
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
                You hold complete control over what Skill Path remembers about member preferences, challenge answers, and roadmap reflections.
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
                  <span>Export All Data (JSON)</span>
                </button>
                <button
                  onClick={() => {
                    store.resetToDefaults();
                    localStorage.removeItem('skillpath_member_profiles_v1');
                    setMembers(THREE_MEMBER_PROFILES);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Store to Seed State</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
