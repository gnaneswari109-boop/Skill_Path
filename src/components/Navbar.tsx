import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  ChevronDown,
  Shield,
  UserCheck,
  User,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { store } from '../services/store';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSupabaseModal: () => void;
  onOpenAIGuide: () => void;
  onOpenMemoryModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSupabaseModal,
  onOpenAIGuide
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentUser = store.currentUser;

  const handleSwitchUser = (userId: string) => {
    const target = store.users.find((u) => u.id === userId);
    if (target) {
      store.setCurrentUser(target);
      setProfileDropdownOpen(false);
    }
  };

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'discovery', label: 'Discover' },
    { id: 'explore', label: 'Explore' },
    { id: 'roadmaps', label: 'My Path' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'mentors', label: 'Mentors' },
    { id: 'communities', label: 'Communities' }
  ];

  // If expert, add Expert Studio; if admin, add Admin Console
  if (currentUser.role === 'expert') {
    navLinks.push({ id: 'expert_studio', label: 'Expert Studio' });
  } else if (currentUser.role === 'admin') {
    navLinks.push({ id: 'admin_console', label: 'Admin Console' });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab(currentUser.onboardingCompleted ? 'dashboard' : 'landing')}
          className="flex items-center gap-2 text-left group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-emerald-700 transition-colors">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Skill Path
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + User Profile Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Guide Shortcut Button */}
          <button
            onClick={onOpenAIGuide}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200/80 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guide</span>
          </button>

          {/* Database / Supabase Schema Button */}
          <button
            onClick={onOpenSupabaseModal}
            title="Database Schema & Supabase Configuration"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* User Account / Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-300"
              />
              <div className="hidden md:block text-xs">
                <div className="font-semibold text-slate-900 leading-tight flex items-center gap-1">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                  <div className="mt-1 text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                    Role: {currentUser.role}
                  </div>
                </div>

                <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Demo Account & Role
                </div>

                {store.users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSwitchUser(u.id)}
                    className={`w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                      u.id === currentUser.id ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{u.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{u.role}</span>
                      </div>
                    </div>
                  </button>
                ))}

                <div className="border-t border-slate-100 mt-2 pt-1">
                  {currentUser.role === 'expert' && (
                    <button
                      onClick={() => {
                        onSelectTab('expert_studio');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Expert Studio</span>
                    </button>
                  )}
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        onSelectTab('admin_console');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5 text-slate-500" />
                      <span>Admin Governance Console</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSelectTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Profile Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                currentTab === link.id
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                onOpenAIGuide();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200"
            >
              Skill Path Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
