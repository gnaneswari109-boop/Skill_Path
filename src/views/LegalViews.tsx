import React from 'react';
import { Shield, Lock, Download, Trash2, ArrowLeft } from 'lucide-react';
import { store } from '../services/store';

interface LegalViewProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
  onOpenMemoryModal: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({
  type,
  onBack,
  onOpenMemoryModal
}) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Application</span>
        </button>

        {type === 'privacy' ? (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                Governance & Trust
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Skill Path Privacy Policy
              </h1>
              <p className="text-slate-400">Effective Date: October 2026</p>
            </div>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">1. Core Privacy Philosophy</h2>
              <p>
                At Skill Path, we believe that discovering personal curiosity requires psychological safety. We do not sell your personal data, nor do we train public AI models on your private discovery answers or 1-on-1 direct messages.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">2. Structured AI Memory Architecture</h2>
              <p>
                The Skill Path Guide uses an explicit application-level memory architecture. The AI only stores:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                <li>Your self-selected interests and stated energy preferences</li>
                <li>Feedback on rejected recommendations to prevent repetitive suggestions</li>
                <li>Reflections on completed challenges and roadmap milestones</li>
              </ul>
              <p className="pt-1">
                You can inspect, edit, or wipe your stored AI memories at any time via the{' '}
                <button
                  onClick={onOpenMemoryModal}
                  className="text-emerald-700 font-semibold underline"
                >
                  Memory Inspector
                </button>
                .
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">3. Row Level Security & Database Isolation</h2>
              <p>
                All data stored in PostgreSQL is protected by Row Level Security (RLS) policies. Experts and mentors cannot access unrelated members' private assessments, reflections, or AI conversations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">4. Minor & Youth Protection</h2>
              <p>
                For users under 18, profile visibility defaults to private and direct mentorship connections require explicit multi-step mutual authorization. Inappropriate behavior is subject to immediate moderation and suspension.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">5. Data Portability & Deletion</h2>
              <p>
                You retain complete ownership of your reflections. You may export all stored data in machine-readable JSON format or delete your account with complete cascading record removal.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                Terms of Use
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Skill Path Terms of Service
              </h1>
              <p className="text-slate-400">Effective Date: October 2026</p>
            </div>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">1. Informational & Growth Guidance</h2>
              <p>
                Skill Path provides exploratory interest discovery, personal roadmaps, and peer community discussions. We do not guarantee employment, academic admissions, professional contracts, or financial compensation from completing any roadmap.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">2. Community Standards & Respect</h2>
              <p>
                All members and mentors agree to maintain a constructive, civil, and welcoming environment. We strictly prohibit commercial solicitation, spam, harassment, hate speech, and unverified credential fraud.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">3. Expert Mentorship Conduct</h2>
              <p>
                Practitioners listing verified or declared expertise must provide truthful qualifications. Mentorship exchanges are designed for guidance and portfolio review; commercial transactions outside platform safety guidelines are prohibited.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
