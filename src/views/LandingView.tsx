import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  BookOpen,
  Target,
  ShieldCheck,
  Activity,
  Layers,
  Flame,
  ArrowUpRight,
  Check,
  Clock,
  Terminal,
  HeartHandshake
} from 'lucide-react';
import heroImg from '../assets/images/hero_discovery_path_1792737391343.jpg';
import communityImg from '../assets/images/community_collaborative_1792737392468.jpg';
import mentorImg from '../assets/images/mentor_connection_1792737392319.jpg';
import { SkillPathLogo } from '../components/SkillPathLogo';

interface LandingViewProps {
  onStartDiscovery: () => void;
  onExplore: () => void;
  onBrowseMentors: () => void;
  onBrowseCommunities: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartDiscovery,
  onExplore,
  onBrowseMentors,
  onBrowseCommunities,
  onOpenPrivacy,
  onOpenTerms
}) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] text-zinc-950 dark:text-white flex flex-col selection:bg-[#FF6B00]/20 selection:text-[#FF6B00] transition-colors">
      {/* Hero Section with Ambient Orange Radial Glow & Grid */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-zinc-200/80 dark:border-[#292D32]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[#FF6B00]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Eyebrow Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-[#292D32] bg-white/90 dark:bg-[#15181B]/90 backdrop-blur-md text-xs font-semibold text-zinc-800 dark:text-[#B8BEC7] shadow-2xs hover:border-[#FF6B00]/50 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              <span>AI-Powered Interest Discovery & Mentorship</span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-[#FF6B00] font-bold flex items-center gap-0.5">
                Explore Paths <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Main Display Headline */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-zinc-950 dark:text-white leading-[1.08]">
              Discover what moves you. <br />
              <span className="bg-gradient-to-r from-[#FF6B00] via-[#FF8126] to-amber-500 bg-clip-text text-transparent">
                Find your path.
              </span> <br />
              Grow with purpose.
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-[#B8BEC7] max-w-2xl mx-auto leading-relaxed">
              Traditional guidance forces you to pick a career before you understand yourself. Skill Path reverses that: discover your genuine curiosity through low-stakes micro-experiments, 4-week flexible roadmaps, and verified mentors.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={onStartDiscovery}
                className="group flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Guided Discovery</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={onExplore}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-white bg-white dark:bg-[#15181B] hover:bg-zinc-50 dark:hover:bg-[#1B1F23] rounded-xl border border-zinc-200/90 dark:border-[#292D32] shadow-2xs hover:border-[#FF6B00]/40 transition-all cursor-pointer"
              >
                Browse Interest Library
              </button>
            </div>

            {/* Proof Points */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 dark:text-[#858D98] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Zero premature career pressure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Adaptive rejection model</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Verified human practitioner reviews</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Showcase Frame (SaaS Preview Mockup) */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-zinc-200/90 dark:border-[#292D32] bg-white dark:bg-[#15181B] shadow-xl overflow-hidden card-hover-lift">
              {/* Window Header */}
              <div className="px-4 py-3 bg-zinc-50/80 dark:bg-[#111315]/80 border-b border-zinc-200/80 dark:border-[#292D32] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="ml-2 text-[11px] font-mono text-zinc-400 dark:text-[#858D98]">skillpath.app/discovery/report</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-[#FF6B00] bg-[#FFF4ED] dark:bg-[#FF6B00]/10 px-2.5 py-0.5 rounded-full border border-[#FF6B00]/20">
                  <Sparkles className="w-3 h-3" />
                  <span>Real-Time Discovery Matrix</span>
                </div>
              </div>

              {/* Showcase Body */}
              <div className="p-6 sm:p-8 grid lg:grid-cols-12 gap-8 items-center bg-white dark:bg-[#15181B]">
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] font-mono">
                      SYNTHESIZED PROFILE · MAYA LIN
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                      Tactical Sports Modeling & Creative Data Storytelling
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                      "Your responses demonstrate strong pattern recognition during competitive matches and a preference for visual, hands-on modeling over repetitive clerical administration."
                    </p>
                  </div>

                  {/* Sample Experiments Grid */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-[#292D32] bg-zinc-50/60 dark:bg-[#101214] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-zinc-900 dark:text-white">45-Min Match Breakdown</span>
                        <span className="text-[#FF6B00] font-mono font-bold">Week 1</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-[#858D98]">
                        Chart run rate variance and dot-ball pressure in 1 match.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-[#292D32] bg-zinc-50/60 dark:bg-[#101214] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-zinc-900 dark:text-white">1-Page Rulebook Variant</span>
                        <span className="text-zinc-400 dark:text-zinc-600 font-mono">Week 2</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-[#858D98]">
                        Test game mechanic loops by altering standard card rules.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={onStartDiscovery}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Take Your Assessment
                    </button>
                    <span className="text-xs text-zinc-400 dark:text-[#858D98]">Takes 4 minutes</span>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="rounded-xl overflow-hidden border border-zinc-200/90 dark:border-[#292D32] shadow-sm aspect-4/3 relative">
                    <img
                      src={heroImg}
                      alt="Discovery horizon walkway"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white text-xs space-y-0.5">
                        <div className="font-bold">Verified Mentor Match</div>
                        <div className="text-[11px] text-zinc-300">Dr. Aris Thorne · Senior Sports Data Scientist</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-[#111315] border-b border-zinc-200/80 dark:border-[#292D32] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] font-mono">
              ARCHITECTURE OF CLARITY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Built to replace guesswork with real feedback.
            </h2>
            <p className="text-sm text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
              Every feature exists to help you understand what genuinely energizes you, test it safely, and choose your next action.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Bento Card 1: Understand (Col Span 2) */}
            <div className="md:col-span-2 rounded-2xl border border-zinc-200/80 dark:border-[#292D32] p-8 bg-zinc-50/50 dark:bg-[#15181B] shadow-2xs hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-3 max-w-lg">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1B1F23] border border-zinc-200 dark:border-[#292D32] shadow-2xs flex items-center justify-center text-[#FF6B00] font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
                  01. Understand the Person, Not the Job Title
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                  We look at the fundamental verbs that drive you—solving, building, organizing, performing, or analyzing—and isolate the specific tasks that leave you drained versus energized.
                </p>
              </div>

              {/* Visual preview strip */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#101214] border border-zinc-200/90 dark:border-[#292D32] shadow-2xs grid sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 dark:text-[#858D98] uppercase">Input Signal</div>
                  <div className="font-bold text-zinc-900 dark:text-white mt-0.5">Free-Time Flow</div>
                  <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">Unstructured curiosity</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 dark:text-[#858D98] uppercase">Negative Filter</div>
                  <div className="font-bold text-zinc-900 dark:text-white mt-0.5">Energy Drains</div>
                  <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">Repetitive bureaucracy</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 dark:text-[#858D98] uppercase">Output</div>
                  <div className="font-bold text-[#FF6B00] mt-0.5">3 Starter Trials</div>
                  <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">Zero career pressure</div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Adaptive Rejection (Col Span 1) */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-[#292D32] p-8 bg-white dark:bg-[#15181B] shadow-2xs hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] dark:bg-[#FF6B00]/10 border border-[#FF6B00]/20 shadow-2xs flex items-center justify-center text-[#FF6B00] font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
                  02. Adaptive Rejection
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                  When you say "Not for me", we don't just rename the idea. We identify whether the friction was difficulty, rhythm, or social setting—and offer a genuinely different alternative.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#101214] border border-zinc-200/80 dark:border-[#292D32] text-xs space-y-1">
                <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                  <span>No Punishment for Changing Your Mind</span>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-[#858D98]">
                  Every rejection is valuable evidence narrowing your real path.
                </div>
              </div>
            </div>

            {/* Bento Card 3: 4-Week Action Roadmaps (Col Span 1) */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-[#292D32] p-8 bg-white dark:bg-[#15181B] shadow-2xs hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-[#1B1F23] border border-zinc-200 dark:border-[#292D32] shadow-2xs flex items-center justify-center text-zinc-900 dark:text-white font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
                  03. 4-Week Action Sprints
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                  Turn interests into weekly milestones: try a beginner activity, learn one foundational technique, build a mini-artifact, and reflect on genuine enjoyment.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-500 dark:text-[#858D98]">
                  <span>Flexible Milestones</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">4 Weeks</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-[#1B1F23] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF6B00] h-full w-1/2" />
                </div>
              </div>
            </div>

            {/* Bento Card 4: Human Practitioner Mentorship (Col Span 2) */}
            <div className="md:col-span-2 rounded-2xl border border-zinc-200/80 dark:border-[#292D32] p-8 bg-zinc-50/50 dark:bg-[#15181B] shadow-2xs hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-3 max-w-lg">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1B1F23] border border-zinc-200 dark:border-[#292D32] shadow-2xs flex items-center justify-center text-[#FF6B00] font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
                  04. Real Human Mentors & Peer Guilds
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                  Connect 1-on-1 with verified practitioners who review your match charts, essays, and code prototypes. Share progress in safe, supportive interest communities without unsolicited sales pitches.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onBrowseMentors}
                  className="px-4 py-2 text-xs font-bold text-zinc-900 dark:text-white bg-white dark:bg-[#1B1F23] hover:bg-zinc-100 dark:hover:bg-[#292D32] border border-zinc-200/90 dark:border-[#292D32] rounded-xl shadow-2xs cursor-pointer transition-colors"
                >
                  Browse Verified Mentors
                </button>
                <button
                  onClick={onBrowseCommunities}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-[#B8BEC7] hover:text-[#FF6B00] dark:hover:text-[#FF6B00] cursor-pointer transition-colors"
                >
                  Explore Interest Communities →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcases (Mentors & Guilds) */}
      <section className="py-20 lg:py-28 bg-zinc-50/60 dark:bg-[#0B0B0C] border-b border-zinc-200/80 dark:border-[#292D32] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Spotlight 1 */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B00]">
                PRACTITIONER REVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                Get Direct Feedback on Your Artifacts
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                Whether you're breaking down tactical cricket analytics with Dr. Aris Thorne or deconstructing narrative game loops with Marcus Vance, our mentors are real practitioners who review your work and provide grounded perspectives.
              </p>
              <div className="pt-2">
                <button
                  onClick={onBrowseMentors}
                  className="inline-flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors cursor-pointer"
                >
                  <span>Connect with Practitioners</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00]" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-zinc-200/90 dark:border-[#292D32] shadow-md aspect-4/3 bg-white dark:bg-[#15181B] card-hover-lift">
                <img
                  src={mentorImg}
                  alt="Mentorship dialogue in library cafe"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Spotlight 2 */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B00]">
                SHARED CURIOSITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                Study Partners & Topic Guilds
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#B8BEC7] leading-relaxed">
                Join focused guilds across 15 domains. Share early sketches, discuss match tactical analyses, compare micro-essays, and receive friendly, constructive peer responses.
              </p>
              <div className="pt-2">
                <button
                  onClick={onBrowseCommunities}
                  className="inline-flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors cursor-pointer"
                >
                  <span>Explore Guilds & Discussions</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00]" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-zinc-200/90 dark:border-[#292D32] shadow-md aspect-4/3 bg-white dark:bg-[#15181B] card-hover-lift">
                <img
                  src={communityImg}
                  alt="Collaborative studio workshop with diverse members"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Dark CTA Section */}
      <section className="py-20 lg:py-24 bg-[#111315] dark:bg-[#15181B] text-white relative overflow-hidden border-t border-zinc-200/80 dark:border-[#292D32]">
        {/* Subtle Ambient Orange Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 dark:border-[#292D32] bg-zinc-900/80 text-xs font-mono text-[#FF8126]">
            <span>START YOUR NEXT STEP</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white">
            Ready to find what genuinely interests you?
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 dark:text-[#B8BEC7] max-w-xl mx-auto leading-relaxed">
            Take the guided 6-step discovery conversation. No rigid personality pigeonholes—just thoughtful questions to uncover your next meaningful step.
          </p>

          <div className="pt-2">
            <button
              onClick={onStartDiscovery}
              className="px-7 py-4 text-xs sm:text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#FF8126] rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              Begin Your Discovery Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
