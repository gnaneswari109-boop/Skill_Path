import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Navbar } from './components/Navbar';
import { SupabaseModal } from './components/SupabaseModal';
import { MemoryModal } from './components/MemoryModal';
import { AIGuideDrawer } from './components/AIGuideDrawer';
import { AdaptiveRejectionModal } from './components/AdaptiveRejectionModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { DiscoveryFlowView } from './views/DiscoveryFlowView';
import { ExploreInterestsView } from './views/ExploreInterestsView';
import { RoadmapsView } from './views/RoadmapsView';
import { ChallengesView } from './views/ChallengesView';
import { MentorsView } from './views/MentorsView';
import { MessagesView } from './views/MessagesView';
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        onOpenAIGuide={() => setAiGuideOpen(true)}
        onOpenMemoryModal={() => setMemoryModalOpen(true)}
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
          <MentorsView onOpenMessages={() => setCurrentTab('messages')} />
        )}

        {currentTab === 'messages' && <MessagesView />}

        {currentTab === 'communities' && <CommunitiesView />}

        {currentTab === 'expert_studio' && (
          <ExpertDashboardView onOpenMessages={() => setCurrentTab('messages')} />
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
  );
}
