import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SupabaseModal } from './components/SupabaseModal';
import { MemoryModal } from './components/MemoryModal';
import { AIGuideDrawer } from './components/AIGuideDrawer';
import { AdaptiveRejectionModal } from './components/AdaptiveRejectionModal';
import { SkillPathLogo } from './components/SkillPathLogo';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { DiscoveryFlowView } from './views/DiscoveryFlowView';
import { ExploreInterestsView } from './views/ExploreInterestsView';
import { RoadmapsView } from './views/RoadmapsView';
import { ChallengesView } from './views/ChallengesView';
import { MentorsView } from './views/MentorsView';
import { ChatView } from './views/ChatView';
import { ProgressView } from './views/ProgressView';
import { CommunitiesView } from './views/CommunitiesView';
import { ExpertDashboardView } from './views/ExpertDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ProfileView } from './views/ProfileView';
import { LegalView } from './views/LegalViews';
import { Interest, Recommendation } from './types';

export default function App() {
  const [, setTick] = useState(0);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [aiGuideOpen, setAiGuideOpen] = useState(false);

  // Rejection modal
  const [rejectionTargetRec, setRejectionTargetRec] = useState<Recommendation | null>(null);

  const handleStartRoadmapFromInterest = (interest: Interest) => {
    store.createRoadmap(
      interest.name,
      `Master beginner skills in ${interest.name} through 4 weekly experiments`,
      interest.name,
      interest.category,
      interest.description
    );
    setCurrentTab('roadmaps');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] text-zinc-900 dark:text-white flex font-sans selection:bg-[#FF6B00]/20 selection:text-[#FF6B00] transition-colors duration-200">
        {/* Left Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenAIGuide={() => setAiGuideOpen(true)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Top Bar Navigation */}
          <Header
            currentTab={currentTab}
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            onOpenAIGuide={() => setAiGuideOpen(true)}
            onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
            onOpenMemoryModal={() => setMemoryModalOpen(true)}
            onSelectTab={(tab) => setCurrentTab(tab)}
          />

          {/* Main View Router */}
          <main className="flex-1">
            {currentTab === 'landing' && (
              <LandingView
                onStartDiscovery={() => setCurrentTab('discovery')}
                onExplore={() => setCurrentTab('explore')}
                onBrowseMentors={() => setCurrentTab('mentors')}
                onBrowseCommunities={() => setCurrentTab('communities')}
                onOpenPrivacy={() => setCurrentTab('privacy')}
                onOpenTerms={() => setCurrentTab('terms')}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardView
                onStartDiscovery={() => setCurrentTab('discovery')}
                onOpenRoadmaps={() => setCurrentTab('roadmaps')}
                onOpenChallenges={() => setCurrentTab('challenges')}
                onOpenMentors={() => setCurrentTab('mentors')}
                onOpenCommunities={() => setCurrentTab('communities')}
                onOpenAIGuide={() => setAiGuideOpen(true)}
                onRejectRecommendation={(rec) => setRejectionTargetRec(rec)}
              />
            )}

            {currentTab === 'discovery' && (
              <DiscoveryFlowView
                onCompleteToDashboard={() => setCurrentTab('dashboard')}
                onExploreLibrary={() => setCurrentTab('explore')}
                onOpenRoadmaps={() => setCurrentTab('roadmaps')}
              />
            )}

            {currentTab === 'explore' && (
              <ExploreInterestsView
                onStartRoadmapFromInterest={handleStartRoadmapFromInterest}
                onOpenChallenge={() => setCurrentTab('challenges')}
              />
            )}

            {currentTab === 'roadmaps' && (
              <RoadmapsView
                onOpenAIGuide={() => setAiGuideOpen(true)}
                onExploreMore={() => setCurrentTab('explore')}
              />
            )}

            {currentTab === 'challenges' && (
              <ChallengesView
                onOpenRoadmaps={() => setCurrentTab('roadmaps')}
                onOpenAIGuide={() => setAiGuideOpen(true)}
              />
            )}

            {currentTab === 'mentors' && (
              <MentorsView onOpenMessages={() => setCurrentTab('chat')} />
            )}

            {(currentTab === 'chat' || currentTab === 'messages') && (
              <ChatView
                onOpenMemoryModal={() => setMemoryModalOpen(true)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressView
                onOpenRoadmaps={() => setCurrentTab('roadmaps')}
                onOpenChallenges={() => setCurrentTab('challenges')}
                onOpenMemoryModal={() => setMemoryModalOpen(true)}
                onStartDiscovery={() => setCurrentTab('discovery')}
              />
            )}

            {currentTab === 'communities' && <CommunitiesView />}

            {currentTab === 'expert_studio' && (
              <ExpertDashboardView onOpenMessages={() => setCurrentTab('chat')} />
            )}

            {currentTab === 'admin_console' && <AdminDashboardView />}

            {currentTab === 'profile' && (
              <ProfileView onOpenMemoryModal={() => setMemoryModalOpen(true)} />
            )}

            {currentTab === 'privacy' && (
              <LegalView
                type="privacy"
                onBack={() => setCurrentTab('dashboard')}
                onOpenMemoryModal={() => setMemoryModalOpen(true)}
              />
            )}

            {currentTab === 'terms' && (
              <LegalView
                type="terms"
                onBack={() => setCurrentTab('dashboard')}
                onOpenMemoryModal={() => setMemoryModalOpen(true)}
              />
            )}
          </main>

          {/* Skill Path Redesigned Global Footer */}
          <footer className="border-t border-zinc-200/80 dark:border-[#292D32]/80 bg-white dark:bg-[#111315] py-10 px-4 sm:px-6 lg:px-8 mt-auto transition-colors">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-2">
                <SkillPathLogo size="sm" showTagline={true} />
                <p className="text-xs text-zinc-500 dark:text-[#858D98] max-w-sm leading-relaxed">
                  Discover what moves you without premature pressure. Structured micro-experiments, 4-week roadmaps, and verified practitioner mentorship.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
                <div className="space-y-2">
                  <div className="font-semibold text-zinc-950 dark:text-white uppercase tracking-wider text-[11px]">Explore</div>
                  <ul className="space-y-1.5 text-zinc-600 dark:text-[#B8BEC7]">
                    <li>
                      <button onClick={() => setCurrentTab('discovery')} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        Discovery Matrix
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setCurrentTab('explore')} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        Interest Catalog
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setCurrentTab('challenges')} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        Micro-Challenges
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-zinc-950 dark:text-white uppercase tracking-wider text-[11px]">Growth</div>
                  <ul className="space-y-1.5 text-zinc-600 dark:text-[#B8BEC7]">
                    <li>
                      <button onClick={() => setCurrentTab('roadmaps')} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        4-Week Roadmaps
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setCurrentTab('mentors')} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        Verified Mentors
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setCurrentTab('communities')} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        Guild Communities
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-zinc-950 dark:text-white uppercase tracking-wider text-[11px]">Platform</div>
                  <ul className="space-y-1.5 text-zinc-600 dark:text-[#B8BEC7]">
                    <li>
                      <button onClick={() => setSupabaseModalOpen(true)} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        PostgreSQL (28 Tables)
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setMemoryModalOpen(true)} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        AI Memory Inspector
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setCurrentTab('privacy')} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                        Privacy Policy
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
                <span className="text-zinc-600 dark:text-[#B8BEC7] font-mono">Row Level Security Active · 28 Entities Synced</span>
              </div>
            </div>
          </footer>

          {/* Global Modals & Drawers */}
          <SupabaseModal
            isOpen={supabaseModalOpen}
            onClose={() => setSupabaseModalOpen(false)}
          />

          <MemoryModal
            isOpen={memoryModalOpen}
            onClose={() => setMemoryModalOpen(false)}
          />

          <AIGuideDrawer
            isOpen={aiGuideOpen}
            onClose={() => setAiGuideOpen(false)}
            onOpenMemoryModal={() => {
              setAiGuideOpen(false);
              setMemoryModalOpen(true);
            }}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />

          <AdaptiveRejectionModal
            recommendation={rejectionTargetRec}
            isOpen={!!rejectionTargetRec}
            onClose={() => setRejectionTargetRec(null)}
            onAlternativeGenerated={() => {
              // Alternative is pre-pended in store
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
