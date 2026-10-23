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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Account & Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Profile Settings
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Configure your personal learning rhythm, profile visibility, and data ownership.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-5 text-xs"
        >
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border border-slate-300"
            />
            <div>
              <div className="font-bold text-sm text-slate-900">{user.name}</div>
              <div className="text-slate-500">{user.email}</div>
              <div className="text-[11px] text-emerald-700 font-semibold uppercase mt-0.5">
                Role: {user.role}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Life Stage</label>
              <select
                value={lifeStage}
                onChange={(e) => setLifeStage(e.target.value as LifeStage)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white capitalize"
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
            <label className="block font-semibold text-slate-700 mb-1">Bio & Interests</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Available Hours for Exploration ({availableHours} hrs/wk)
              </label>
              <input
                type="range"
                min={2}
                max={20}
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full accent-emerald-600 mt-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Profile Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="public">Public (Discoverable to peers & mentors)</option>
                <option value="connections_only">Connections Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Profile updated successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Data Ownership & Privacy Control Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Data Ownership & AI Memory Controls</span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            You hold complete control over what Skill Path remembers about your preferences, challenge answers, and roadmap reflections.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={onOpenMemoryModal}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Inspect Stored Memories
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All My Data (JSON)</span>
            </button>
            <button
              onClick={() => store.resetToDefaults()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
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
