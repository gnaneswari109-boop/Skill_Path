import React from 'react';
import { SkillPathLogo } from './SkillPathLogo';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenSupabaseModal: () => void;
  onOpenMemoryModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenSupabaseModal,
  onOpenMemoryModal
}) => {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-[#292D32]/80 bg-white dark:bg-[#111315] py-10 px-4 sm:px-6 lg:px-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand Column: ONLY the Skill Path abstract icon without text label */}
        <div className="space-y-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center group cursor-pointer p-1 -ml-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors focus:outline-hidden"
            title="Skill Path Home"
            aria-label="Skill Path Home"
          >
            <SkillPathLogo size="md" showWordmark={false} showTagline={false} />
          </button>
          <p className="text-xs text-zinc-500 dark:text-[#858D98] max-w-sm leading-relaxed">
            Discover what moves you without premature pressure. Structured micro-experiments, 4-week roadmaps, and verified practitioner mentorship.
          </p>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div className="space-y-2">
            <div className="font-semibold text-zinc-950 dark:text-white uppercase tracking-wider text-[11px]">
              Explore
            </div>
            <ul className="space-y-1.5 text-zinc-600 dark:text-[#B8BEC7]">
              <li>
                <button
                  onClick={() => onSelectTab('discovery')}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  Discovery Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('explore')}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  Interest Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('challenges')}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  Micro-Challenges
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-zinc-950 dark:text-white uppercase tracking-wider text-[11px]">
              Growth
            </div>
            <ul className="space-y-1.5 text-zinc-600 dark:text-[#B8BEC7]">
              <li>
                <button
                  onClick={() => onSelectTab('roadmaps')}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  4-Week Roadmaps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mentors')}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  Verified Mentors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('communities')}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  Guild Communities
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-zinc-950 dark:text-white uppercase tracking-wider text-[11px]">
              Platform
            </div>
            <ul className="space-y-1.5 text-zinc-600 dark:text-[#B8BEC7]">
              <li>
                <button
                  onClick={onOpenSupabaseModal}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  PostgreSQL (28 Tables)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMemoryModal}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  AI Memory Inspector
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('privacy')}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('terms')}
                  className="hover:text-[#FF6B00] transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-zinc-100 dark:border-[#292D32] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400 dark:text-[#858D98]">
        <div>
          © 2026 Skill Path Inc. Discover. Learn. Grow. All rights reserved.
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00] inline-block animate-pulse" />
          <span className="text-zinc-600 dark:text-[#B8BEC7] font-mono">
            Row Level Security Active · 28 Entities Synced
          </span>
        </div>
      </div>
    </footer>
  );
};
