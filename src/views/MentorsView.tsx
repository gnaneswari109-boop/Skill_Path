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
    <div className="min-h-screen bg-white bg-grid-pattern py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/70 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-rose-600" />
            Human Connections
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight font-display">
            Mentors & Like-Minded Peers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Discovery thrives with authentic feedback. Connect with verified practitioners who review your artifacts, or study alongside peers sharing similar learning goals.
          </p>
        </div>

        {/* Tab switch: Mentors vs Peers */}
        <div className="flex border-b border-zinc-200/80 gap-8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('experts')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'experts'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Verified Experts & Mentors ({experts.length})
          </button>
          <button
            onClick={() => setActiveTab('peers')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'peers'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Study Partners & Peers ({peers.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, expertise, or sport/creative domain..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-zinc-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 shadow-2xs transition-all text-zinc-900"
          />
        </div>

        {/* Experts List */}
        {activeTab === 'experts' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((exp) => (
              <div
                key={exp.userId}
                className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:shadow-lg hover:border-zinc-300 transition-all p-6 sm:p-7 flex flex-col justify-between space-y-4 card-hover-lift"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={exp.avatar}
                      alt={exp.name}
                      className="w-13 h-13 rounded-full object-cover border-2 border-zinc-100 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-zinc-950 text-sm truncate">{exp.name}</h3>
                        {exp.verified && (
                          <span
                            title="Credentials verified by Skill Path governance"
                            className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200/60 px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-0.5 shrink-0"
                          >
                            <ShieldCheck className="w-3 h-3 text-rose-600" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{exp.headline}</div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-400">
                        <span className="capitalize text-zinc-700 font-medium">
                          {exp.availability}
                        </span>
                        <span>·</span>
                        <span>{exp.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">{exp.bio}</p>

                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Verified Expertise
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {exp.areasOfExpertise.map((area, i) => (
                        <span key={i} className="text-zinc-800 font-medium bg-zinc-50 border border-zinc-200/60 px-2 py-0.5 rounded-md text-[10px]">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 text-[11px] text-zinc-600 border border-zinc-200/70">
                    <span className="font-semibold text-zinc-900">Qualifications: </span>
                    {exp.qualifications}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {exp.menteesCount} active mentees
                  </span>
                  <button
                    onClick={() => setSelectedExpertForRequest(exp)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-xs hover:shadow-rose-950/20 transition-all hover:-translate-y-0.5"
                  >
                    <span>Request Mentorship</span>
                    <ArrowRight className="w-3 h-3 text-rose-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Peers List */}
        {activeTab === 'peers' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:shadow-lg hover:border-zinc-300 transition-all p-6 flex flex-col justify-between space-y-4 card-hover-lift"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-11 h-11 rounded-full object-cover border border-zinc-200"
                    />
                    <div>
                      <h3 className="font-bold text-zinc-950 text-xs">{peer.name}</h3>
                      <div className="text-[10px] text-zinc-500 capitalize">
                        {peer.lifeStage.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">{peer.bio}</p>

                  <div className="text-[11px] text-zinc-500">
                    <span className="font-semibold text-zinc-800">Interests: </span>
                    {peer.interestsPrimary.join(' · ')}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-mono">
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
                    className="px-3.5 py-1.5 text-xs font-semibold text-zinc-800 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
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
