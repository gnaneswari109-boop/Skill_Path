import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Map,
  Users,
  UserCheck,
  Flame,
  Bot,
  MessageSquare,
  TrendingUp,
  User,
  Shield,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SkillPathLogo } from './SkillPathLogo';
import { store } from '../services/store';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAIGuide: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  onOpenAIGuide,
  mobileOpen,
  onCloseMobile
}) => {
  const currentUser = store.currentUser;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      description: 'Your growth overview'
    },
    {
      id: 'discovery',
      label: 'Discover',
      icon: Compass,
      description: 'Interactive interest discovery'
    },
    {
      id: 'roadmaps',
      label: 'Career Roadmaps',
      icon: Map,
      description: '4-week practical sprints'
    },
    {
      id: 'communities',
      label: 'Communities',
      icon: Users,
      description: 'Interest-based peer guilds'
    },
    {
      id: 'mentors',
      label: 'Mentorship',
      icon: UserCheck,
      description: 'Verified practitioners'
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: Flame,
      description: '30-min micro-experiences'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      badge: '3',
      description: 'AI & Practitioner messages'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      description: 'Milestones & reflections'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Account & rhythms'
    }
  ];

  // Role-specific sections
  if (currentUser.role === 'expert') {
    navItems.push({
      id: 'expert_studio',
      label: 'Expert Studio',
      icon: Briefcase,
      description: 'Mentee queue & calendar'
    });
  } else if (currentUser.role === 'admin') {
    navItems.push({
      id: 'admin_console',
      label: 'Admin Console',
      icon: Shield,
      description: 'Platform governance'
    });
  }

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r
          bg-white dark:bg-[#111315] border-zinc-200 dark:border-[#292D32]
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200/80 dark:border-[#292D32]/80 shrink-0">
          <div
            onClick={() => handleNavClick(currentUser.onboardingCompleted ? 'dashboard' : 'landing')}
            className="cursor-pointer overflow-hidden"
          >
            {collapsed ? (
              <SkillPathLogo size="sm" showWordmark={false} />
            ) : (
              <SkillPathLogo size="md" showTagline={true} showWordmark={true} />
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className={`px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#858D98] ${collapsed ? 'hidden' : 'block'}`}>
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#FFF4ED] dark:bg-[#FF6B00]/10 text-[#FF6B00] border-r-2 border-[#FF6B00] font-bold shadow-2xs'
                    : 'text-zinc-600 dark:text-[#B8BEC7] hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#15181B]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive
                      ? 'text-[#FF6B00]'
                      : 'text-zinc-500 dark:text-[#858D98] group-hover:text-zinc-900 dark:group-hover:text-white group-hover:scale-105'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Guide Quick Access Item in Sidebar (With Compass icon, replacing database icon!) */}
          <div className="pt-3 mt-3 border-t border-zinc-200/80 dark:border-[#292D32]/80">
            <div className={`px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-[#858D98] ${collapsed ? 'hidden' : 'block'}`}>
              AI Companion
            </div>
            <button
              onClick={onOpenAIGuide}
              title={collapsed ? 'AI Guide' : undefined}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] bg-zinc-50 dark:bg-[#15181B] hover:bg-[#FFF4ED] dark:hover:bg-[#FF6B00]/10 border border-zinc-200/80 dark:border-[#292D32] transition-all group cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#FF6B00] group-hover:rotate-45 transition-transform duration-300 shrink-0" />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="leading-tight font-bold">Skill Path Guide</div>
                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">Continuous Memory</div>
                </div>
              )}
            </button>
          </div>
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-zinc-200/80 dark:border-[#292D32]/80 bg-zinc-50/50 dark:bg-[#15181B]/40 shrink-0">
          <div
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-lg object-cover border border-zinc-300 dark:border-[#292D32] shrink-0"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-[#858D98] capitalize flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                  <span>{currentUser.role}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
