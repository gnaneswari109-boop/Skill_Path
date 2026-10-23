import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  Filter,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { store } from '../services/store';
import { ExpertProfile } from '../types';
import { RequestMentorModal } from '../components/RequestMentorModal';

interface MentorsViewProps {
  onOpenMessages: (connectionId?: string) => void;
}

export const MentorsView: React.FC<MentorsViewProps> = ({ onOpenMessages }) => {
  const experts = store.experts;
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedExpertForRequest, setSelectedExpertForRequest] = useState<ExpertProfile | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'experts' | 'peers'>('experts');

  const filteredExperts = experts.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.headline.toLowerCase().includes(search.toLowerCase()) ||
      e.areasOfExpertise.some((a) => a.toLowerCase().includes(search.toLowerCase()));

    const matchesDomain =
      selectedDomain === 'All' ||
      e.areasOfExpertise.some((a) => a.toLowerCase().includes(selectedDomain.toLowerCase()));

    return matchesSearch && matchesDomain;
  });

  // Discoverable peers
  const peers = store.users.filter((u) => u.id !== store.currentUser.id && u.role === 'member');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Human Connections
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Mentors & Like-Minded Peers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Discovery thrives with authentic feedback. Connect with verified practitioners who review your artifacts, or study alongside peers sharing similar learning goals.
          </p>
        </div>

        {/* Tab switch: Mentors vs Peers */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('experts')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'experts'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Verified Experts & Mentors ({experts.length})
          </button>
          <button
            onClick={() => setActiveTab('peers')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'peers'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Study Partners & Peers ({peers.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, expertise, or sport/creative domain..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>

        {/* Experts List */}
        {activeTab === 'experts' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExperts.map((exp) => (
              <div
                key={exp.userId}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={exp.avatar}
                      alt={exp.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{exp.name}</h3>
                        {exp.verified && (
                          <span
                            title="Credentials verified by Skill Path governance"
                            className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 shrink-0"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{exp.headline}</div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="capitalize text-emerald-800 font-medium">
                          Availability: {exp.availability}
                        </span>
                        <span>·</span>
                        <span>{exp.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{exp.bio}</p>

                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Verified Expertise
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {exp.areasOfExpertise.map((area, i) => (
                        <span key={i} className="text-slate-700 font-medium">
                          {area}
                          {i < exp.areasOfExpertise.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-800">Qualifications: </span>
                    {exp.qualifications}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {exp.menteesCount} active mentees
                  </span>
                  <button
                    onClick={() => setSelectedExpertForRequest(exp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                  >
                    <span>Request Mentorship</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Peers List */}
        {activeTab === 'peers' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">{peer.name}</h3>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {peer.lifeStage.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{peer.bio}</p>

                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Interests: </span>
                    {peer.interestsPrimary.join(' · ')}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {peer.availableHoursPerWeek} hrs/wk
                  </span>
                  <button
                    onClick={() =>
                      store.sendConnectionRequest(
                        peer.id,
                        `Hi ${peer.name}, I noticed we share interests in ${peer.interestsPrimary[0]}. Would love to connect as study peers!`,
                        'peer'
                      )
                    }
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Connect as Peer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request Mentorship Modal */}
        <RequestMentorModal
          expert={selectedExpertForRequest}
          isOpen={!!selectedExpertForRequest}
          onClose={() => setSelectedExpertForRequest(null)}
          onSuccess={() => onOpenMessages()}
        />
      </div>
    </div>
  );
};
