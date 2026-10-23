import React, { useState } from 'react';
import {
  Search,
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  Plus,
  Layers,
  X,
  Tag,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { store } from '../services/store';
import { Interest, InterestCategory } from '../types';

interface ExploreInterestsViewProps {
  onStartRoadmapFromInterest: (interest: Interest) => void;
  onOpenChallenge: (challengeTitle: string) => void;
}

export const ExploreInterestsView: React.FC<ExploreInterestsViewProps> = ({
  onStartRoadmapFromInterest,
  onOpenChallenge
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeInterestModal, setActiveInterestModal] = useState<Interest | null>(null);

  const categories: string[] = [
    'All',
    'Sports & Fitness',
    'Gaming & Esports',
    'Technology & Programming',
    'Writing & Storytelling',
    'Music & Performance',
    'Science & Experimentation',
    'Social Impact & Volunteering'
  ];

  const filteredInterests = store.interests.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Exploration Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Interest Exploration Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Explore diverse human pursuits without premature career commitments. Inspect beginner activities, required materials, and practical starter experiments.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interests by keyword, sport, game, tool, or tag..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Interests */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredInterests.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-emerald-800">{item.category}</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {item.popularityCount} curious
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{item.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Beginner Activities Preview */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-semibold text-slate-800">Sample Beginner Step:</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">
                    • {item.beginnerActivities[0]}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] text-slate-500 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveInterestModal(item)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  View Full Details
                </button>

                <button
                  onClick={() => onStartRoadmapFromInterest(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Roadmap</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredInterests.length === 0 && (
          <div className="p-12 text-center rounded-xl bg-white border border-slate-200 space-y-2">
            <Compass className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-900">No matching interests found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or filter by "All" to browse the complete library.
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {activeInterestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="text-xs">
                  <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                    {activeInterestModal.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {activeInterestModal.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveInterestModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Overview</h4>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {activeInterestModal.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Skills Commonly Developed</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {activeInterestModal.skillsDeveloped.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-slate-600" />
                      <span>Materials Needed to Start</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {activeInterestModal.materialsNeeded.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Beginner Experiments (Zero-Pressure)</h4>
                  <div className="space-y-1.5">
                    {activeInterestModal.beginnerActivities.map((act, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg border border-slate-200 text-slate-700 bg-white"
                      >
                        {act}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70 space-y-1">
                  <div className="font-semibold text-emerald-950">
                    Possible Career Connections (When Relevant)
                  </div>
                  <p className="text-slate-600">
                    {activeInterestModal.careerConnections.join(' · ')}
                  </p>
                  <p className="text-[11px] text-slate-400 italic mt-1">
                    Remember: An interest can remain a deeply rewarding lifelong hobby without needing to be monetized.
                  </p>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setActiveInterestModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onStartRoadmapFromInterest(activeInterestModal);
                    setActiveInterestModal(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  <span>Build 4-Week Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
