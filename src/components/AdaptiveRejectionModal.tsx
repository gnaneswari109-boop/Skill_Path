import React, { useState } from 'react';
import { Recommendation } from '../types';
import { store } from '../services/store';
import { AlertCircle, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface AdaptiveRejectionModalProps {
  recommendation: Recommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onAlternativeGenerated?: (alt: Recommendation) => void;
}

export const AdaptiveRejectionModal: React.FC<AdaptiveRejectionModalProps> = ({
  recommendation,
  isOpen,
  onClose,
  onAlternativeGenerated
}) => {
  const [selectedReason, setSelectedReason] = useState<
    'activity' | 'difficulty' | 'lifestyle' | 'social' | 'resources' | 'other'
  >('activity');
  const [userNotes, setUserNotes] = useState('');
  const [newAlternative, setNewAlternative] = useState<Recommendation | null>(null);

  if (!isOpen || !recommendation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const alt = store.rejectRecommendation(recommendation.id, selectedReason, userNotes);
    setNewAlternative(alt);
    if (onAlternativeGenerated) {
      onAlternativeGenerated(alt);
    }
  };

  const handleResetAndClose = () => {
    setNewAlternative(null);
    setUserNotes('');
    setSelectedReason('activity');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">Adaptive Rejection Calibration</h3>
              <p className="text-xs text-slate-500">Help us understand why this suggestion was not a fit</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Result */}
        {!newAlternative ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-slate-400 font-medium">Calibrating recommendation: </span>
              <span className="font-semibold text-slate-900">{recommendation.title}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
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
                    label: 'Lifestyle & Time Constraints',
                    desc: 'Requires too many hours or inflexible scheduling'
                  },
                  {
                    id: 'resources',
                    label: 'Resource Requirements',
                    desc: 'Requires software, equipment, or materials I don’t currently have'
                  },
                  {
                    id: 'social',
                    label: 'Social Setting',
                    desc: 'I prefer doing this independently / or conversely, with more people'
                  }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedReason === item.id
                        ? 'border-emerald-600 bg-emerald-50/40'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejection_reason"
                      value={item.id}
                      checked={selectedReason === item.id}
                      onChange={() => setSelectedReason(item.id as any)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional note: What would feel closer?
              </label>
              <textarea
                rows={2}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. I prefer writing stories or human angles rather than dealing with spreadsheets..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Calibrate & Get Alternative
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-900">Preference Model Calibrated! </span>
                We updated your profile to de-emphasize {selectedReason} mismatches. Here is a fresh, meaningfully different alternative:
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="capitalize">{newAlternative.category}</span>
                <span>Confidence: {newAlternative.confidenceScore}%</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{newAlternative.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{newAlternative.description}</p>
              <div className="p-2.5 bg-slate-50 rounded-md text-xs text-slate-700 mt-2 border border-slate-100">
                <span className="font-semibold text-slate-900">Why it fits differently: </span>
                {newAlternative.whyItFits}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleResetAndClose}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors"
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
