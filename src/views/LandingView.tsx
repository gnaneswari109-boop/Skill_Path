import React from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  BookOpen,
  Target,
  ShieldCheck
} from 'lucide-react';
import heroImg from '../assets/images/hero_discovery_path_1792737391343.jpg';
import communityImg from '../assets/images/community_collaborative_1792737392468.jpg';
import mentorImg from '../assets/images/mentor_connection_1792737392319.jpg';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200/80">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI-Powered Interest Discovery & Mentorship</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                Discover what moves you. <br />
                <span className="text-emerald-700">Find your path.</span> <br />
                Grow with purpose.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Traditional career guidance asks you to choose a career before you even understand yourself.
                Skill Path reverses that: understand who you are, test your genuine curiosity through low-stakes experiments, and build flexible growth plans.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onStartDiscovery}
                  className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
                >
                  <span>Start Guided Discovery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExplore}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  Explore Interest Library
                </button>
              </div>

              {/* Quiet Proof Points */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No premature career pressure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Adaptive rejection learning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified 1-on-1 human mentors</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 aspect-16/10">
                <img
                  src={heroImg}
                  alt="Minimalist modern walkway toward dawn horizon"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-6">
                  <p className="text-white text-xs font-medium leading-relaxed drop-shadow-xs">
                    "You don't need to have everything figured out. Start with one small experiment."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Reverse Model */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              A Human-Centered Model for Discovery
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Why picking a job title too early leads to burnout—and how deliberate micro-experiments create authentic clarity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-900">Understand the Person</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Map what naturally captures your attention when no one is watching, what activities drain you, and how you prefer to learn.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-900">Validate with Experiments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Try 30-minute low-stakes challenges before deciding whether you want to pursue a topic as a hobby, a side project, or a profession.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-900">Build Action Roadmaps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turn curiosity into flexible 4-week milestones with tangible tasks and weekly reflection prompts to calibrate enjoyment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h3 className="text-base font-semibold text-slate-900">Human Connections</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Collaborate with like-minded peers in topic guilds and request direct feedback from verified, background-checked mentors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Spotlights with Real Imagery */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Spotlight 1: Mentors */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Verified Guidance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Connect with Real Practitioners, Not Automated Bots
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you're breaking down cricket analytics with Dr. Aris Thorne or exploring interactive game loops with Marcus Vance, our mentors are real professionals who review your artifacts and offer genuine feedback.
              </p>
              <div className="pt-2">
                <button
                  onClick={onBrowseMentors}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span>Browse Available Mentors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-4/3 bg-slate-100">
                <img
                  src={mentorImg}
                  alt="One-on-one mentorship session in modern library cafe"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Spotlight 2: Communities */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Shared Exploration
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Interest Guilds & Collaborative Study Groups
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Join dedicated interest communities across 15 domains. Share early sketches, discuss match tactical analyses, compare micro-essays, and receive friendly, constructive peer responses.
              </p>
              <div className="pt-2">
                <button
                  onClick={onBrowseCommunities}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span>Explore Guilds & Discussions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-6 lg:order-1">
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-4/3 bg-slate-100">
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

      {/* Final Call to Action */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to find what genuinely interests you?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Take the guided 6-step discovery conversation. No tests, no rigid personality boxes—just thoughtful questions to uncover your next meaningful step.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartDiscovery}
              className="px-6 py-3.5 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-sm"
            >
              Begin Your Discovery Journey
            </button>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>Skill Path</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">© 2026 Skill Path Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </button>
            <button onClick={onOpenTerms} className="hover:text-slate-900 transition-colors">
              Terms of Service
            </button>
            <button onClick={onExplore} className="hover:text-slate-900 transition-colors">
              Interests Catalog
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
