import React, { useState } from 'react';
import { X, AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { store } from '../services/store';
import { Recommendation } from '../types';

interface AdaptiveRejectionModalProps {
  recommendation: Recommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onAlternativeGenerated: (newRec: Recommendation) => void;
}

export const AdaptiveRejectionModal: React.FC<AdaptiveRejectionModalProps> = ({
  recommendation,
  isOpen,
  onClose,
  onAlternativeGenerated
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('activity');
  const [userNotes, setUserNotes] = useState('');
  const [newAlternative, setNewAlternative] = useState<Recommendation | null>(null);

  if (!isOpen || !recommendation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const alternative = store.rejectRecommendation(
      recommendation.id,
      selectedReason as any,
      userNotes || `Expressed preference away from ${recommendation.title}`
    );
    if (alternative) {
      setNewAlternative(alternative);
      onAlternativeGenerated(alternative);
    } else {
      onClose();
    }
  };

  const handleResetAndClose = () => {
    setNewAlternative(null);
    setUserNotes('');
    setSelectedReason('activity');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#15181B] rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-[#292D32] w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-950 dark:text-white font-display">
                Adaptive Rejection Calibration
              </h3>
              <p className="text-xs text-zinc-500 dark:text-[#858D98]">Help us understand why this suggestion was not a fit</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Result */}
        {!newAlternative ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 bg-zinc-50 dark:bg-[#101214] border border-zinc-200/80 dark:border-[#292D32] rounded-xl text-xs">
              <span className="text-zinc-400 dark:text-[#858D98] font-medium">Calibrating recommendation: </span>
              <span className="font-semibold text-zinc-950 dark:text-white">{recommendation.title}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                What was the primary mismatch?
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'activity',
                    label: 'Activity Nature',
                    desc: 'The specific type of task doesn’t excite me or feels boring'
                  },
                  {
                    id: 'difficulty',
                    label: 'Difficulty & Complexity',
                    desc: 'Feels too technical, steep learning curve, or too simplistic'
                  },
                  {
                    id: 'lifestyle',
                    label: 'Time or Rhythm Commitment',
                    desc: 'Doesn’t fit my current energy, life stage, or weekly hours'
                  },
                  {
                    id: 'culture',
                    label: 'Community or Work Style',
                    desc: 'Prefer solitary creative work vs. client/collaborative settings'
                  }
                ].map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedReason === reason.id
                        ? 'border-[#FF6B00] bg-[#FFF4ED]/60 dark:bg-[#FF6B00]/10 text-zinc-950 dark:text-white'
                        : 'border-zinc-200 dark:border-[#292D32] hover:bg-zinc-50 dark:hover:bg-[#1B1F23] text-zinc-700 dark:text-[#B8BEC7]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejection_reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={() => setSelectedReason(reason.id)}
                      className="mt-0.5 text-[#FF6B00] focus:ring-[#FF6B00] accent-[#FF6B00] cursor-pointer"
                    />
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">{reason.label}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-[#858D98] mt-0.5">{reason.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                Optional note: What would feel closer?
              </label>
              <textarea
                rows={2}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. I prefer writing stories or human angles rather than dealing with spreadsheets..."
                className="w-full text-xs p-3 border border-zinc-200 dark:border-[#292D32] rounded-xl bg-zinc-50/50 dark:bg-[#101214] focus:bg-white dark:focus:bg-[#15181B] focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all text-zinc-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-[#858D98] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                Calibrate & Get Alternative
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-xs text-zinc-900 dark:text-zinc-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-950 dark:text-white">Preference Model Calibrated! </span>
                We updated your profile to de-emphasize {selectedReason} mismatches. Here is a fresh, meaningfully different alternative:
              </div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200/90 dark:border-[#292D32] bg-white dark:bg-[#101214] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-[#858D98]">
                <span className="capitalize font-semibold text-[#FF6B00]">{newAlternative.category}</span>
                <span className="font-mono text-[11px]">Match Score: {newAlternative.confidenceScore}%</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{newAlternative.title}</h4>
              <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">{newAlternative.description}</p>
              <div className="p-3 bg-zinc-50 dark:bg-[#15181B] rounded-lg text-xs text-zinc-700 dark:text-[#B8BEC7] mt-2 border border-zinc-200 dark:border-[#292D32]">
                <span className="font-semibold text-zinc-900 dark:text-white">Why it fits differently: </span>
                {newAlternative.whyItFits}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleResetAndClose}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                <span>Accept & View Recommendations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
