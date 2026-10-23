import React, { useState } from 'react';
import {
  User,
  Shield,
  Clock,
  Download,
  Trash2,
  CheckCircle2,
  Save,
  RotateCcw
} from 'lucide-react';
import { store } from '../services/store';
import { LifeStage } from '../types';

interface ProfileViewProps {
  onOpenMemoryModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenMemoryModal }) => {
  const user = store.currentUser;

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [lifeStage, setLifeStage] = useState<LifeStage>(user.lifeStage);
  const [availableHours, setAvailableHours] = useState(user.availableHoursPerWeek);
  const [learningStyle, setLearningStyle] = useState(user.preferredLearningStyle);
  const [visibility, setVisibility] = useState(user.profileVisibility);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCurrentUserProfile({
      name,
      bio,
      lifeStage,
      availableHoursPerWeek: availableHours,
      preferredLearningStyle: learningStyle,
      profileVisibility: visibility
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = () => {
    const jsonStr = store.exportUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillpath_profile_${user.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-white bg-grid-pattern py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-8 relative">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/70 shadow-2xs">
            <User className="w-3.5 h-3.5 text-rose-600" />
            Account & Preferences
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight font-display">
            Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
            Configure your personal learning rhythm, profile visibility, and data ownership.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-sm space-y-6 text-xs"
        >
          <div className="flex items-center gap-4 pb-5 border-b border-zinc-100">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200 shadow-xs"
            />
            <div>
              <div className="font-bold text-base text-zinc-950 font-display">{user.name}</div>
              <div className="text-zinc-500">{user.email}</div>
              <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200/60 font-semibold uppercase px-2 py-0.5 rounded-full inline-block mt-1">
                Role: {user.role}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-800 mb-1.5">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-800 mb-1.5">Current Life Stage</label>
              <select
                value={lifeStage}
                onChange={(e) => setLifeStage(e.target.value as LifeStage)}
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900 capitalize"
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
            <label className="block font-semibold text-zinc-800 mb-1.5">Bio & Interests</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-800 mb-1.5">
                Available Hours for Exploration ({availableHours} hrs/wk)
              </label>
              <input
                type="range"
                min={2}
                max={20}
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full accent-zinc-950 mt-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-800 mb-1.5">Profile Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
              >
                <option value="public">Public (Discoverable to peers & mentors)</option>
                <option value="connections_only">Connections Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-600" />
                Profile updated successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-rose-400" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Data Ownership & Privacy Control Box */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-7 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-zinc-950 font-display">
            <Shield className="w-4 h-4 text-rose-600" />
            <span>Data Ownership & AI Memory Controls</span>
          </div>

          <p className="text-zinc-600 leading-relaxed">
            You hold complete control over what Skill Path remembers about your preferences, challenge answers, and roadmap reflections.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenMemoryModal}
              className="px-4 py-2.5 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer"
            >
              Inspect Stored Memories
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 border border-zinc-200/90 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All My Data (JSON)</span>
            </button>
            <button
              onClick={() => store.resetToDefaults()}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Local Store to Seed State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
