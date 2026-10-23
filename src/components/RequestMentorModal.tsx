import React, { useState } from 'react';
import { ExpertProfile } from '../types';
import { store } from '../services/store';
import { CheckCircle2, UserCheck, X } from 'lucide-react';

interface RequestMentorModalProps {
  expert: ExpertProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RequestMentorModal: React.FC<RequestMentorModalProps> = ({
  expert,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [note, setNote] = useState(
    expert
      ? `Hello ${expert.name}, I'm exploring ${expert.areasOfExpertise[0] || 'your domain'} and would love your guidance on my current learning experiments.`
      : ''
  );
  const [requestType, setRequestType] = useState<'mentorship' | 'peer'>('mentorship');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !expert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.sendConnectionRequest(expert.userId, note, requestType);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">Request Mentorship Connection</h3>
              <p className="text-xs text-slate-500">Connect directly with {expert.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-semibold text-slate-900 text-sm">Request Sent Successfully!</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Your request is now in {expert.name}’s queue. You will receive an in-app notification when accepted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-200"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  {expert.name}
                  {expert.verified && (
                    <span className="text-[10px] text-emerald-700 font-medium">· Verified</span>
                  )}
                </div>
                <div className="text-slate-500 line-clamp-1">{expert.headline}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Connection Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRequestType('mentorship')}
                  className={`p-2.5 rounded-lg border text-center font-medium transition-colors ${
                    requestType === 'mentorship'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Expert Mentorship
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('peer')}
                  className={`p-2.5 rounded-lg border text-center font-medium transition-colors ${
                    requestType === 'peer'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Collaborative Peer
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personalized Message / Current Challenge
              </label>
              <textarea
                rows={3}
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Briefly explain what you're working on and what guidance you're seeking..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Keep your note clear and respectful. Direct messaging unlocks once accepted.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
