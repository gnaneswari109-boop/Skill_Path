import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  Save,
  Users,
  X,
  Award
} from 'lucide-react';
import { store } from '../services/store';
import { ExpertProfile, ConnectionRequest } from '../types';

interface ExpertDashboardViewProps {
  onOpenMessages: (connectionId?: string) => void;
}

export const ExpertDashboardView: React.FC<ExpertDashboardViewProps> = ({
  onOpenMessages
}) => {
  const user = store.currentUser;
  const expertProfile =
    store.experts.find((e) => e.userId === user.id) || store.experts[0];

  const incomingRequests = store.connectionRequests.filter(
    (c) => c.recipientId === expertProfile.userId && c.status === 'pending'
  );
  const acceptedConnections = store.connectionRequests.filter(
    (c) =>
      (c.recipientId === expertProfile.userId || c.senderId === expertProfile.userId) &&
      c.status === 'accepted'
  );

  // Form State
  const [headline, setHeadline] = useState(expertProfile.headline);
  const [bio, setBio] = useState(expertProfile.bio);
  const [availability, setAvailability] = useState(expertProfile.availability);
  const [expertise, setExpertise] = useState(expertProfile.areasOfExpertise.join(', '));
  const [qualifications, setQualifications] = useState(expertProfile.qualifications);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    expertProfile.headline = headline;
    expertProfile.bio = bio;
    expertProfile.availability = availability;
    expertProfile.areasOfExpertise = expertise.split(',').map((s) => s.trim());
    expertProfile.qualifications = qualifications;

    store.recordAuditLog(
      'UPDATE_EXPERT_PROFILE',
      user.name,
      'Updated expert availability, bio, and areas of expertise.'
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleRespondRequest = (requestId: string, status: 'accepted' | 'declined') => {
    store.respondToConnectionRequest(requestId, status);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-[#292D32]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Expert Practitioner Studio</span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-zinc-500 dark:text-[#858D98] lowercase">
                {expertProfile.verified ? 'verified' : 'in review'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight font-display">
              Welcome, {expertProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] max-w-2xl leading-relaxed">
              Manage mentee requests, calibrate your availability, and review learning artifacts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border shadow-2xs ${
                expertProfile.verified
                  ? 'bg-[#FFF4ED] dark:bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 flex items-center gap-1.5'
                  : 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/40 flex items-center gap-1.5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>{expertProfile.verified ? 'Verified Practitioner' : 'Pending Verification'}</span>
            </span>
          </div>
        </div>

        {/* Incoming Mentorship Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              Incoming Mentorship Requests ({incomingRequests.length})
            </h2>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] text-center text-xs text-zinc-500 dark:text-[#858D98] shadow-2xs">
              No pending mentorship requests in your queue.
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-950 dark:text-white">{req.senderName}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-[#858D98]">· {req.type}</span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-[#B8BEC7] leading-relaxed italic">
                      "{req.note}"
                    </p>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Bio: {req.senderBio}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRespondRequest(req.id, 'declined')}
                      className="px-3.5 py-2 text-xs font-medium text-zinc-600 dark:text-[#858D98] hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] rounded-xl transition-colors border border-zinc-200/80 dark:border-[#292D32] cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleRespondRequest(req.id, 'accepted')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Accept Mentee
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accepted Mentees / Direct Messaging Links */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-zinc-950 dark:text-white">
            Active Mentees & Channels ({acceptedConnections.length})
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {acceptedConnections.map((conn) => {
              const otherName =
                conn.senderId === user.id ? conn.recipientName : conn.senderName;
              return (
                <div
                  key={conn.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-zinc-950 dark:text-white">{otherName}</div>
                    <div className="text-[11px] text-zinc-500 dark:text-[#858D98] capitalize">{conn.type} Mentee</div>
                  </div>
                  <button
                    onClick={() => onOpenMessages(conn.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 hover:bg-[#FFE8D6] dark:hover:bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Open Chat</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Settings Form */}
        <form
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] p-6 sm:p-8 shadow-sm space-y-6 text-xs relative overflow-hidden"
        >
          <div className="border-b border-zinc-100 dark:border-[#292D32] pb-4">
            <h3 className="font-bold text-base text-zinc-950 dark:text-white font-display">Expert Practitioner Settings</h3>
            <p className="text-zinc-500 dark:text-[#858D98] mt-1">
              Accurately declare your expertise and availability so interested members receive relevant guidance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">Professional Headline</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#101214] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">Availability Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#101214] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all text-zinc-900 dark:text-white"
              >
                <option value="open">Open (Accepting new mentees)</option>
                <option value="limited">Limited (1-2 inquiries)</option>
                <option value="busy">Busy / Paused</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
              Areas of Expertise (Comma-separated)
            </label>
            <input
              type="text"
              required
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#101214] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all text-zinc-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
              Qualifications & Credentials (Subject to Admin Verification)
            </label>
            <input
              type="text"
              required
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#101214] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">Practice Bio</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3.5 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#101214] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all text-zinc-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-[#FF6B00] font-semibold flex items-center gap-1.5 bg-[#FFF4ED] dark:bg-[#FF6B00]/10 px-3 py-1 rounded-lg border border-[#FF6B00]/20">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                Expert profile updated successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Expert Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
