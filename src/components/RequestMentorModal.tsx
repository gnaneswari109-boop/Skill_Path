import React, { useState } from 'react';
import { X, UserCheck, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { store } from '../services/store';
import { ExpertProfile } from '../types';

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
  const [note, setNote] = useState('');
  const [requestType, setRequestType] = useState<'mentorship' | 'peer'>('mentorship');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !expert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.sendConnectionRequest(expert.userId, note, requestType);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setNote('');
      onClose();
      if (onSuccess) onSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#15181B] rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-[#292D32] w-full max-w-md overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-950 dark:text-white font-display">
                Request Mentorship Connection
              </h3>
              <p className="text-xs text-zinc-500 dark:text-[#858D98]">Connect directly with {expert.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#FF6B00] mx-auto" />
            <h4 className="font-semibold text-zinc-950 dark:text-white text-sm font-display">
              Request Sent Successfully!
            </h4>
            <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] leading-relaxed max-w-xs mx-auto">
              Your request is now in {expert.name}’s queue. You will receive an in-app notification when accepted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 bg-zinc-50 dark:bg-[#101214] rounded-xl border border-zinc-200/70 dark:border-[#292D32]">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-11 h-11 rounded-full object-cover border border-zinc-200 dark:border-[#292D32]"
              />
              <div className="text-xs">
                <div className="font-semibold text-zinc-950 dark:text-white flex items-center gap-1.5">
                  {expert.name}
                  {expert.verified && (
                    <span className="text-[10px] text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-1.5 py-0.2 rounded-full font-medium">
                      · Verified
                    </span>
                  )}
                </div>
                <div className="text-zinc-500 dark:text-[#858D98] line-clamp-1 mt-0.5">{expert.headline}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                Connection Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRequestType('mentorship')}
                  className={`p-3 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                    requestType === 'mentorship'
                      ? 'border-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 text-[#FF6B00] shadow-xs font-semibold'
                      : 'border-zinc-200 dark:border-[#292D32] text-zinc-600 dark:text-[#B8BEC7] hover:bg-zinc-50 dark:hover:bg-[#1B1F23]'
                  }`}
                >
                  Expert Mentorship
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('peer')}
                  className={`p-3 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                    requestType === 'peer'
                      ? 'border-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 text-[#FF6B00] shadow-xs font-semibold'
                      : 'border-zinc-200 dark:border-[#292D32] text-zinc-600 dark:text-[#B8BEC7] hover:bg-zinc-50 dark:hover:bg-[#1B1F23]'
                  }`}
                >
                  Collaborative Peer
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                Personalized Message / Current Challenge
              </label>
              <textarea
                rows={3}
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Briefly explain what you're working on and what guidance you're seeking..."
                className="w-full text-xs p-3 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#101214] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all text-zinc-900 dark:text-white"
              />
              <p className="text-[11px] text-zinc-400 dark:text-[#858D98] mt-1.5">
                Keep your note clear and respectful. Direct messaging unlocks once accepted.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-[#858D98] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs cursor-pointer transition-colors"
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
