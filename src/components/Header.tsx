import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Database,
  Brain,
  Shield,
  User,
  Compass,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { store } from '../services/store';

interface HeaderProps {
  currentTab: string;
  onOpenMobileMenu: () => void;
  onOpenAIGuide: () => void;
  onOpenSupabaseModal: () => void;
  onOpenMemoryModal: () => void;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenAIGuide,
  onOpenSupabaseModal,
  onOpenMemoryModal,
  onSelectTab
}) => {
  const { theme, toggleTheme } = useTheme();
  const currentUser = store.currentUser;

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 'n_1',
      title: 'Roadmap Milestone Active',
      text: 'Week 1 starter activity is waiting for your 30-minute test.',
      time: '10m ago',
      unread: true
    },
    {
      id: 'n_2',
      title: 'New Guild Discussion',
      text: 'Dr. Thorne posted a match tactical breakdown in Sports Analytics.',
      time: '1h ago',
      unread: true
    },
    {
      id: 'n_3',
      title: 'AI Guide Memory Updated',
      text: 'Your rejection calibration was saved to your private memory profile.',
      time: '3h ago',
      unread: false
    }
  ];

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Personal Growth Dashboard', subtitle: 'Actionable exploration and daily rhythm' },
    discovery: { title: 'Discovery Matrix', subtitle: '6-step interactive interest assessment' },
    roadmaps: { title: 'Career & Growth Roadmaps', subtitle: '4-week practical testing sprints' },
    communities: { title: 'Interest Communities', subtitle: 'Peer guilds and collaborative learning' },
    mentors: { title: 'Verified Mentorship', subtitle: 'Connect with experienced practitioners' },
    challenges: { title: 'Interactive Challenges', subtitle: '30-minute low-stakes micro-experiences' },
    chat: { title: 'Messages & AI Assistant', subtitle: 'Real-time mentorship and continuous guidance' },
    progress: { title: 'Growth Progress', subtitle: 'Track your milestones and reflection data' },
    profile: { title: 'Account Settings', subtitle: 'Personal preferences and data ownership' },
    expert_studio: { title: 'Expert Practitioner Studio', subtitle: 'Mentorship queue and availability controls' },
    admin_console: { title: 'Admin Governance Console', subtitle: 'Credential verification and audit monitoring' },
    privacy: { title: 'Privacy Policy', subtitle: 'Application-level memory & RLS security' },
    terms: { title: 'Terms of Service', subtitle: 'Community guidelines and expectations' }
  };

  const currentInfo = pageTitles[currentTab] || { title: 'Overview', subtitle: 'Discover. Learn. Grow.' };

  const handleSwitchUser = (userId: string) => {
    const target = store.users.find((u) => u.id === userId);
    if (target) {
      store.setCurrentUser(target);
      setProfileDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#111315]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-[#292D32]/80 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Mobile toggle + Breadcrumb / Page Title (no SkillPath logo beside menu) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] lg:hidden cursor-pointer"
            title="Open navigation menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb / Title */}
          <div>
            <h1 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
              {currentInfo.title}
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-[#858D98] hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Guide quick trigger with Compass icon */}
          <button
            onClick={onOpenAIGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-[#15181B] dark:hover:bg-[#1B1F23] border border-zinc-200 dark:border-[#292D32] transition-all hover:border-[#FF6B00]/40 group cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#FF6B00] group-hover:rotate-45 transition-transform duration-300" />
            <span className="hidden sm:inline">AI Guide</span>
          </button>

          {/* Database / Supabase Architecture trigger */}
          <button
            onClick={onOpenSupabaseModal}
            title="Database Architecture & Supabase Schema"
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-[#858D98] dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Functional Light / Dark Mode Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-[#858D98] dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FF8126]" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Notifications with Flyout */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-[#858D98] dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1B1F23] relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B00]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#15181B] rounded-2xl shadow-xl border border-zinc-200 dark:border-[#292D32] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-[#292D32]">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">Notifications</div>
                  <span className="text-[10px] text-[#FF6B00] font-semibold">2 new</span>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-[#292D32] mt-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-semibold ${n.unread ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-[#858D98]'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-zinc-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#1B1F23] border border-zinc-200 dark:border-[#292D32] bg-white dark:bg-[#15181B] shadow-2xs transition-all cursor-pointer text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-zinc-200 dark:border-[#292D32]"
              />
              <div className="hidden sm:block text-xs pr-1">
                <div className="font-bold text-zinc-900 dark:text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-[#858D98] capitalize flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                  <span>{currentUser.role}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#15181B] rounded-2xl shadow-xl border border-zinc-200 dark:border-[#292D32] py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                {/* Active user header */}
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-[#292D32]">
                  <div className="font-bold text-zinc-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">{currentUser.email}</div>
                  <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md bg-[#FFF4ED] dark:bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-bold uppercase tracking-wider border border-[#FF6B00]/20">
                    Role: {currentUser.role}
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="px-3.5 py-2 text-[10px] font-bold text-zinc-400 dark:text-[#858D98] uppercase tracking-wider">
                  Switch Active Role & Account
                </div>

                {store.users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSwitchUser(u.id)}
                    className={`w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-zinc-50 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer ${
                      u.id === currentUser.id
                        ? 'bg-[#FFF4ED]/50 dark:bg-[#FF6B00]/10 font-bold text-[#FF6B00]'
                        : 'text-zinc-700 dark:text-[#B8BEC7]'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-md object-cover border border-zinc-200 dark:border-[#292D32]" />
                    <div className="flex-1 truncate">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-zinc-400 dark:text-[#858D98] capitalize">{u.role}</div>
                    </div>
                    {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-[#FF6B00]" />}
                  </button>
                ))}

                <div className="my-1 border-t border-zinc-100 dark:border-[#292D32]" />

                {/* Utility shortcuts */}
                <button
                  onClick={() => {
                    onOpenMemoryModal();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 text-zinc-700 dark:text-[#B8BEC7] hover:bg-zinc-50 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>AI Memory Inspector</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 text-zinc-700 dark:text-[#B8BEC7] hover:bg-zinc-50 dark:hover:bg-[#1B1F23] transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={() => store.resetToDefaults()}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo State</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
