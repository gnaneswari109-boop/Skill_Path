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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#FF6B00]" />
            Exploration Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight font-display">
            Interest Exploration Library
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
            Explore diverse human pursuits without premature career commitments. Inspect beginner activities, required materials, and practical starter experiments tailored for curiosity.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interests by keyword, sport, game, tool, or tag..."
              className="w-full text-xs pl-10 pr-4 py-3 bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-2xs transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-[#858D98]"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs rounded-xl whitespace-nowrap transition-all font-medium cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF6B00] text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-[#15181B] hover:bg-zinc-100 dark:hover:bg-[#1B1F23] text-zinc-600 dark:text-[#B8BEC7] hover:text-zinc-950 dark:hover:text-white border border-zinc-200/80 dark:border-[#292D32]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Interests */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
          {filteredInterests.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#15181B] rounded-2xl border border-zinc-200/90 dark:border-[#292D32] shadow-2xs hover:shadow-lg hover:border-[#FF6B00]/40 transition-all p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3.5 relative">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded-md text-[11px]">
                    {item.category}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400 dark:text-[#858D98]">
                    {item.popularityCount} curious
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white leading-snug group-hover:text-[#FF6B00] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] mt-1.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Beginner Activities Preview */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                    Sample Beginner Step:
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-[#B8BEC7] line-clamp-2 bg-zinc-50 dark:bg-[#101214] p-2 rounded-lg border border-zinc-100 dark:border-[#292D32]">
                    {item.beginnerActivities[0]}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono text-zinc-500 dark:text-[#858D98] bg-zinc-100/70 dark:bg-[#101214] px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-[#292D32]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-5 border-t border-zinc-100 dark:border-[#292D32] flex items-center justify-between relative">
                <button
                  onClick={() => setActiveInterestModal(item)}
                  className="text-xs font-semibold text-zinc-600 dark:text-[#B8BEC7] hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors cursor-pointer"
                >
                  View Full Details
                </button>

                <button
                  onClick={() => onStartRoadmapFromInterest(item)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Roadmap</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredInterests.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#15181B] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs space-y-3">
            <Compass className="w-8 h-8 text-zinc-400 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">No matching interests found</h4>
            <p className="text-xs text-zinc-500 dark:text-[#858D98] max-w-sm mx-auto">
              Try adjusting your search terms or filter by "All" to browse the complete library.
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {activeInterestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#15181B] rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-[#292D32] w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 transition-colors">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-[#292D32] bg-zinc-50/70 dark:bg-[#111315]/80">
                <div className="text-xs">
                  <span className="font-semibold text-[#FF6B00] uppercase tracking-wider text-[11px]">
                    {activeInterestModal.category}
                  </span>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white mt-0.5 font-display">
                    {activeInterestModal.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveInterestModal(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs">
                <div>
                  <h4 className="font-bold text-zinc-950 dark:text-white text-sm mb-1">Overview</h4>
                  <p className="text-zinc-600 dark:text-[#B8BEC7] leading-relaxed text-xs">
                    {activeInterestModal.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-[#101214] border border-zinc-200/80 dark:border-[#292D32] space-y-2">
                    <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>Skills Commonly Developed</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-[#B8BEC7]">
                      {activeInterestModal.skillsDeveloped.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-[#101214] border border-zinc-200/80 dark:border-[#292D32] space-y-2">
                    <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>Materials Needed to Start</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-[#B8BEC7]">
                      {activeInterestModal.materialsNeeded.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-zinc-950 dark:text-white">Beginner Experiments (Zero-Pressure)</h4>
                  <div className="space-y-2">
                    {activeInterestModal.beginnerActivities.map((act, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-zinc-200/80 dark:border-[#292D32] text-zinc-700 dark:text-[#B8BEC7] bg-white dark:bg-[#101214] shadow-2xs"
                      >
                        {act}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 space-y-1.5">
                  <div className="font-semibold text-zinc-950 dark:text-white">
                    Possible Career Connections (When Relevant)
                  </div>
                  <p className="text-zinc-700 dark:text-[#B8BEC7]">
                    {activeInterestModal.careerConnections.join(' · ')}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-[#858D98] italic mt-1">
                    Remember: An interest can remain a deeply rewarding lifelong hobby without needing to be monetized.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-zinc-200 dark:border-[#292D32] bg-zinc-50/60 dark:bg-[#111315]/80 flex items-center justify-between">
                <button
                  onClick={() => setActiveInterestModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-[#858D98] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onStartRoadmapFromInterest(activeInterestModal);
                    setActiveInterestModal(null);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-all cursor-pointer"
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
