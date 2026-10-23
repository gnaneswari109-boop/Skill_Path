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
  X
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <span>Expert Practitioner Studio</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">
                {expertProfile.verified ? 'Verified Practitioner' : 'Verification In Review'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Welcome, {expertProfile.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage mentee requests, calibrate your availability, and review learning artifacts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                expertProfile.verified
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1.5'
                  : 'bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1.5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{expertProfile.verified ? 'Verified by Admin' : 'Pending Verification'}</span>
            </span>
          </div>
        </div>

        {/* Incoming Mentorship Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Incoming Mentorship Requests ({incomingRequests.length})
            </h2>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="p-8 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              No pending mentorship requests in your queue.
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{req.senderName}</span>
                      <span className="text-[10px] text-slate-400">· {req.type}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{req.note}"
                    </p>
                    <div className="text-[10px] text-slate-400">
                      Bio: {req.senderBio}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRespondRequest(req.id, 'declined')}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleRespondRequest(req.id, 'accepted')}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
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
          <h2 className="text-base font-bold text-slate-900">
            Active Mentees & Channels ({acceptedConnections.length})
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {acceptedConnections.map((conn) => {
              const otherName =
                conn.senderId === user.id ? conn.recipientName : conn.senderName;
              return (
                <div
                  key={conn.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{otherName}</div>
                    <div className="text-[11px] text-slate-500 capitalize">{conn.type} Mentee</div>
                  </div>
                  <button
                    onClick={() => onOpenMessages(conn.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
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
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-5 text-xs"
        >
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Expert Practitioner Settings</h3>
            <p className="text-slate-500">
              Accurately declare your expertise and availability so interested members receive relevant guidance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Professional Headline</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Availability Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="open">Open (Accepting new mentees)</option>
                <option value="limited">Limited (1-2 inquiries)</option>
                <option value="busy">Busy / Paused</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Areas of Expertise (Comma-separated)
            </label>
            <input
              type="text"
              required
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Qualifications & Credentials (Subject to Admin Verification)
            </label>
            <input
              type="text"
              required
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Practice Bio</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Expert profile updated successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
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
